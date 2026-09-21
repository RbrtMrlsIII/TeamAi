import test from 'node:test';
import assert from 'node:assert/strict';

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
