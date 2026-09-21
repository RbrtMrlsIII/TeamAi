import test from 'node:test';
import assert from 'node:assert/strict';

import { generateKeyPairSync } from 'node:crypto';
import { FirestoreRuntimeClient } from '../dist/src/backend/firestore-runtime.js';

function serviceAccount() {
  return {
    project_id: 'team-ai-official',
    client_email: 'runtime-test@example.iam.gserviceaccount.com',
    private_key: generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }),
  };
}

test('Firestore Seat resolver ignores legacy project-level Seat documents and returns canonical team-nested Seat', async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  const canonicalPath = 'accounts/uid-1/workplaces/workplace-1/projects/project-1/teams/team-1/seats/seat-coder';
  try {
    globalThis.fetch = async (url, init = {}) => {
      calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
      if (calls.length === 1) {
        return new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 });
      }
      const legacy = {
        name: 'projects/team-ai-official/databases/(default)/documents/accounts/uid-1/workplaces/workplace-1/projects/project-1/seats/seat-coder',
        fields: {
          uid: { stringValue: 'uid-1' },
          workplaceId: { stringValue: 'workplace-1' },
          projectId: { stringValue: 'project-1' },
          seatId: { stringValue: 'seat-coder' },
        },
      };
      const canonical = {
        name: 'projects/team-ai-official/databases/(default)/documents/' + canonicalPath,
        fields: {
          uid: { stringValue: 'uid-1' },
          workplaceId: { stringValue: 'workplace-1' },
          projectId: { stringValue: 'project-1' },
          teamId: { stringValue: 'team-1' },
          seatId: { stringValue: 'seat-coder' },
          provider: { stringValue: 'openai' },
        },
      };
      return new Response(JSON.stringify({ document: legacy }) + '\n' + JSON.stringify({ document: canonical }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    const client = new FirestoreRuntimeClient('team-ai-official', serviceAccount());
    const seat = await client.getSeat('uid-1', 'project-1', 'seat-coder');
    assert.equal(seat?.teamId, 'team-1');
    assert.equal(seat?.provider, 'openai');
    assert.equal(calls.length, 2);
    const query = JSON.parse(calls[1].body);
    assert.equal(query.structuredQuery.from[0].collectionId, 'seats');
    assert.equal(query.structuredQuery.from[0].allDescendants, true);
    assert.equal(query.structuredQuery.where.fieldFilter.field.fieldPath, 'seatId');
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test('Firestore Seat resolver fails closed when two canonical teams expose the same Seat id', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, init = {}) => {
      if (!String(url).endsWith('/token')) {
        // no-op: resolver test only needs the query response after the token exchange
      }
      const body = String(init.body ?? '');
      if (body.includes('grant_type=')) {
        return new Response(JSON.stringify({ access_token: 'token-2' }), { status: 200 });
      }
      const mk = (team) => ({
        document: {
          name: 'projects/team-ai-official/databases/(default)/documents/accounts/uid-1/workplaces/workplace-1/projects/project-1/teams/' + team + '/seats/seat-coder',
          fields: {
            uid: { stringValue: 'uid-1' },
            workplaceId: { stringValue: 'workplace-1' },
            projectId: { stringValue: 'project-1' },
            teamId: { stringValue: team },
            seatId: { stringValue: 'seat-coder' },
          },
        },
      });
      return new Response(JSON.stringify(mk('team-1')) + '\n' + JSON.stringify(mk('team-2')), { status: 200 });
    };
    const client = new FirestoreRuntimeClient('team-ai-official', serviceAccount());
    await assert.rejects(client.getSeat('uid-1', 'project-1', 'seat-coder'), /seat_ambiguous/);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

import { FirestoreRuntimeTaskStore } from '../dist/src/backend/firestore-runtime.js';

const stringValue = (value) => ({ stringValue: value });
const mapValue = (fields) => ({ mapValue: { fields } });

test('Firestore executable task inherits Turn Budget from the durable Seat state', async () => {
  const config = {
    turnBudgetTokens: 12000,
    outputBudgetTokens: 4000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    warningThresholdPercent: 0.8,
    hardStopPolicy: 'handoff-before-exhaustion',
    responsibilityProfile: 'coder',
    contextInputPolicy: { retention: 'minimal-durable-context' },
  };

  const taskFields = {
    status: stringValue('waiting_approval'),
    approved: { booleanValue: true },
    provider: stringValue('openai'),
    model: stringValue('gpt-test'),
    authorizationStatus: stringValue('authorized'),
    connection: mapValue({
      id: stringValue('connection-1'),
      projectId: stringValue('project-1'),
      providerCode: stringValue('openai'),
      environment: stringValue('development'),
      capabilities: { arrayValue: { values: [stringValue('execute')] } },
      status: stringValue('active'),
    }),
    request: mapValue({
      messages: { arrayValue: { values: [] } },
    }),
  };

  const seatFields = {
    provider: stringValue('openai'),
    authorization: mapValue({
      status: stringValue('authorized'),
    }),
    turnBudget: mapValue({
      turnBudgetTokens: { integerValue: String(config.turnBudgetTokens) },
      outputBudgetTokens: { integerValue: String(config.outputBudgetTokens) },
      reasoningBudgetTokens: { integerValue: String(config.reasoningBudgetTokens) },
      handoffReserveTokens: { integerValue: String(config.handoffReserveTokens) },
      warningThresholdPercent: { doubleValue: config.warningThresholdPercent },
      hardStopPolicy: stringValue(config.hardStopPolicy),
      responsibilityProfile: stringValue(config.responsibilityProfile),
      contextInputPolicy: mapValue({
        retention: stringValue(config.contextInputPolicy.retention),
      }),
    }),
  };

  const client = {
    async get(path) {
      if (path.includes('/task-index/')) {
        return { fields: { projectId: stringValue('project-1') } };
      }
      if (path.endsWith('/tasks/task-budget')) return { fields: taskFields };
      return null;
    },
    async findCanonicalSeatDocument() {
      return {
        path: 'accounts/uid-1/workplaces/workplace-1/projects/project-1/teams/team-1/seats/seat-coder',
        teamId: 'team-1',
        document: { fields: seatFields },
      };
    },
  };

  const store = new FirestoreRuntimeTaskStore(client, 'uid-1', 'workplace-1');
  const task = await store.getExecutableTask('task-budget', 'seat-coder');

  assert.equal(task?.turnBudget?.turnBudgetTokens, 12000);
  assert.equal(task?.turnBudget?.responsibilityProfile, 'coder');
  assert.equal(task?.provider, 'openai');
  assert.equal(task?.seatId, 'seat-coder');
});

test('Firestore executable task fails closed when its durable Seat does not exist', async () => {
  const client = {
    async get(path) {
      if (path.includes('/task-index/')) return { fields: { projectId: stringValue('project-1') } };
      if (path.endsWith('/tasks/task-missing-seat')) {
        return {
          fields: {
            status: stringValue('waiting_approval'),
            approved: { booleanValue: true },
            provider: stringValue('openai'),
            model: stringValue('gpt-test'),
            authorizationStatus: stringValue('authorized'),
            connection: mapValue({
              id: stringValue('connection-1'),
              projectId: stringValue('project-1'),
              providerCode: stringValue('openai'),
              environment: stringValue('development'),
              capabilities: { arrayValue: { values: [stringValue('execute')] } },
              status: stringValue('active'),
            }),
            request: mapValue({ messages: { arrayValue: { values: [] } } }),
          },
        };
      }
      return null;
    },
    async findCanonicalSeatDocument() {
      return null;
    },
  };

  const store = new FirestoreRuntimeTaskStore(client, 'uid-1', 'workplace-1');
  await assert.rejects(
    store.getExecutableTask('task-missing-seat', 'seat-missing'),
    /seat not found: seat-missing/,
  );
});
