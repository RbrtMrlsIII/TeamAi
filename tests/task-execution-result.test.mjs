import test from 'node:test';
import assert from 'node:assert/strict';

function isGoogleTokenRequest(url) {
  try {
    const parsed = new URL(String(url));
    return parsed.hostname === 'oauth2.googleapis.com' && parsed.pathname === '/token';
  } catch {
    return false;
  }
}
import { generateKeyPairSync } from 'node:crypto';
import { ProviderRuntime } from '../dist/src/backend/provider-runtime.js';
import { TaskExecutionService } from '../dist/src/backend/task-execution.js';
import { FirestoreTaskExecutionResultStore, FirestoreTaskContinuationCheckpointStore } from '../dist/src/backend/firestore-result-store.js';

const originalFetch = globalThis.fetch;
function privateKey() { return generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' }); }
function setup() {
  process.env.TEAMAI_FIREBASE_PROJECT_ID = 'team-ai-official';
  process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({ project_id: 'team-ai-official', client_email: 'runtime-test@example.iam.gserviceaccount.com', private_key: privateKey() });
}
function restore() { globalThis.fetch = originalFetch; }

test('Firestore result store persists only inside the Firebase UID/workplace/project/task scope', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    if (isGoogleTokenRequest(url)) return new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 });
    return new Response(JSON.stringify({ commit: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskExecutionResultStore('uid-1', 'workplace-1');
    await store.persist({
      taskId: 'task-9', projectId: 'project-1', seatId: 'seat-a', eventId: 'exec-9:complete:event',
      idempotencyKey: 'exec-9:complete', status: 'completed', recordedAt: '2026-09-05T00:00:00Z',
      result: { provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } },
    });
    const commit = calls.find((call) => call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.writes.length, 1);
    assert.equal(body.writes[0].currentDocument.exists, false);
    assert.match(body.writes[0].update.name, /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-1\/tasks\/task-9\/execution-results\/exec-9%3Acomplete%3Aevent$/);
  } finally { restore(); }
});

test('Firestore result store retrieves the exact durable result by task/project/event identity', async () => {
  setup();
  const calls = [];
  const document = {
    fields: {
      taskId: { stringValue: 'task-9' },
      projectId: { stringValue: 'project-1' },
      seatId: { stringValue: 'seat-a' },
      eventId: { stringValue: 'exec-9:complete:event' },
      idempotencyKey: { stringValue: 'exec-9:complete' },
      status: { stringValue: 'completed' },
      recordedAt: { timestampValue: '2026-09-05T00:00:00Z' },
      result: { mapValue: { fields: { text: { stringValue: 'done-after-restart' } } } },
    },
  };
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET' });
    if (isGoogleTokenRequest(url)) return new Response(JSON.stringify({ access_token: 'token-2' }), { status: 200 });
    return new Response(JSON.stringify(document), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskExecutionResultStore('uid-1', 'workplace-1');
    const result = await store.getResult({ taskId: 'task-9', projectId: 'project-1', eventId: 'exec-9:complete:event' });
    assert.equal(result?.taskId, 'task-9');
    assert.equal(result?.projectId, 'project-1');
    assert.equal(result?.result?.text, 'done-after-restart');
    const read = calls.find((call) => call.method === 'GET' && !isGoogleTokenRequest(call.url));
    assert.ok(read);
    assert.match(read.url, /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-1\/tasks\/task-9\/execution-results\/exec-9%3Acomplete%3Aevent$/);
  } finally { restore(); }
});

test('TaskExecutionService does not perform a durable-result preflight read', async () => {
  const order = [];
  let resultReadCalled = false;
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', async generate() { return { provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } }; } }]]));
  const execution = new TaskExecutionService(runtime, {
    async hasIdempotencyKey() { return false; },
    async append(event) { order.push(`event:${event.type}`); },
  }, {
    async hasResult() { resultReadCalled = true; return false; },
    async getResult() { resultReadCalled = true; return null; },
    async persist(result) { order.push(`result:${result.status}`); assert.equal(result.eventId, 'exec-10:complete:event'); },
  });
  const result = await execution.execute({
    id: 'task-10', projectId: 'project-1', seatId: 'seat-a', provider: 'fixture', model: 'model-1', status: 'waiting_approval', approved: true, authorizationStatus: 'authorized',
    connection: { id: 'connection-1', projectId: 'project-1', providerCode: 'fixture', environment: 'development', capabilities: ['execute'], status: 'active' },
    request: { messages: [{ role: 'user', content: 'run task' }] },
  }, 'scheduler-1', 'exec-10');
  assert.equal(result.status, 'completed');
  assert.equal(resultReadCalled, false);
  assert.deepEqual(order, ['event:START', 'result:completed', 'event:COMPLETE']);
});

test('TaskExecutionService persists a durable continuation checkpoint before returning handoff_required', async () => {
  const order = [];
  const runtime = new ProviderRuntime(new Map([['fixture', {
    provider: 'fixture',
    async generate() {
      return {
        provider: 'fixture',
        model: 'model-1',
        requestId: 'request-11',
        text: 'partial implementation output',
        usage: { inputTokens: 25, outputTokens: 100, totalTokens: 125 },
        termination: { state: 'incomplete', reason: 'length', providerReason: 'max_tokens' },
      };
    },
  }]]));
  const execution = new TaskExecutionService(runtime, {
    async hasIdempotencyKey() { return false; },
    async append(event) { order.push('event:' + event.type); },
  }, {
    async hasResult() { return false; },
    async getResult() { return null; },
    async persist(result) { order.push('result:' + result.status); },
  }, {
    async getCheckpoint() { return null; },
    async persistCheckpoint(checkpoint) {
      order.push('checkpoint:' + checkpoint.status);
      assert.equal(checkpoint.checkpointId, 'exec-11:checkpoint');
      assert.equal(checkpoint.completionState, 'HANDOFF_REQUIRED');
      assert.equal(checkpoint.termination.reason, 'length');
      assert.equal(checkpoint.taskId, 'task-11');
    },
  });
  const task = {
    id: 'task-11',
    projectId: 'project-1',
    seatId: 'seat-coder',
    provider: 'fixture',
    model: 'model-1',
    status: 'waiting_approval',
    approved: true,
    authorizationStatus: 'authorized',
    connection: { id: 'connection-1', projectId: 'project-1', providerCode: 'fixture', environment: 'development', capabilities: ['execute'], status: 'active' },
    request: { messages: [{ role: 'user', content: 'run task' }] },
    turnBudget: {
      turnBudgetTokens: 1000,
      outputBudgetTokens: 400,
      reasoningBudgetTokens: 400,
      handoffReserveTokens: 200,
      warningThresholdPercent: 0.8,
      hardStopPolicy: 'handoff-before-exhaustion',
      responsibilityProfile: 'coder',
      contextInputPolicy: { retention: 'minimal-durable-context' },
    },
  };
  const result = await execution.execute(task, 'actor-1', 'exec-11');
  assert.equal(result.status, 'handoff_required');
  assert.equal(result.continuationCheckpointId, 'exec-11:checkpoint');
  assert.deepEqual(order, ['event:START', 'checkpoint:awaiting_continuation', 'result:handoff_required', 'event:HANDOFF_REQUIRED']);
  assert.equal(task.status, 'handoff_required');
});

test('Firestore continuation checkpoint store uses create-only scoped task paths', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    if (isGoogleTokenRequest(url)) {
      return new Response(JSON.stringify({ access_token: 'token-3' }), { status: 200 });
    }
    return new Response(JSON.stringify({ commit: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskContinuationCheckpointStore('uid-1', 'workplace-1');
    await store.persistCheckpoint({
      checkpointId: 'exec-12:checkpoint',
      taskId: 'task-12',
      projectId: 'project-9',
      seatId: 'seat-coder',
      actorId: 'actor-1',
      sourceExecutionId: 'exec-12',
      sourceEventId: 'exec-12:handoff:event',
      createdAt: '2026-09-22T00:00:00Z',
      status: 'awaiting_continuation',
      completionState: 'HANDOFF_REQUIRED',
      provider: 'fixture',
      model: 'model-1',
      termination: { state: 'incomplete', reason: 'length', providerReason: 'max_tokens' },
      providerOutput: 'partial',
      usage: { inputTokens: 1, outputTokens: 2, totalTokens: 3 },
      nextAction: 'authorized-continuation-turn',
    });
    const commit = calls.find((call) => call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.writes[0].currentDocument.exists, false);
    assert.match(body.writes[0].update.name, /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-9\/tasks\/task-12\/continuation-checkpoints\/exec-12%3Acheckpoint$/);
  } finally { restore(); }
});

test('Firestore continuation request store uses create-only scoped task paths', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    if (isGoogleTokenRequest(url)) {
      return new Response(JSON.stringify({ access_token: 'token-4' }), { status: 200 });
    }
    return new Response(JSON.stringify({ commit: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskContinuationCheckpointStore('uid-1', 'workplace-1');
    await store.persistRequest({
      continuationRequestId: 'cont-1',
      taskId: 'task-12',
      projectId: 'project-9',
      checkpointId: 'exec-12:checkpoint',
      sourceSeatId: 'seat-coder',
      targetSeatId: 'seat-coder-2',
      requestedBy: 'actor-1',
      requestedAt: '2026-09-22T00:02:00Z',
      instruction: 'continue from checkpoint',
      status: 'requested',
      continuationOfCheckpointId: 'exec-12:checkpoint',
      nextTurn: 'fresh-budgeted-turn',
    });
    const commit = calls.find((call) => call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.writes[0].currentDocument.exists, false);
    assert.match(
      body.writes[0].update.name,
      /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-9\/tasks\/task-12\/continuation-requests\/cont-1$/,
    );
  } finally { restore(); }
});

test('Firestore continuation request store retrieves an existing request by exact relation identity', async () => {
  setup();
  const requestDocument = {
    fields: {
      continuationRequestId: { stringValue: 'cont-2' },
      taskId: { stringValue: 'task-13' },
      projectId: { stringValue: 'project-9' },
      checkpointId: { stringValue: 'exec-13:checkpoint' },
      sourceSeatId: { stringValue: 'seat-coder' },
      targetSeatId: { stringValue: 'seat-coder-2' },
      requestedBy: { stringValue: 'actor-1' },
      requestedAt: { timestampValue: '2026-09-22T00:03:00Z' },
      instruction: { stringValue: 'continue' },
      status: { stringValue: 'requested' },
      continuationOfCheckpointId: { stringValue: 'exec-13:checkpoint' },
      nextTurn: { stringValue: 'fresh-budgeted-turn' },
    },
  };
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET' });
    if (isGoogleTokenRequest(url)) {
      return new Response(JSON.stringify({ access_token: 'token-5' }), { status: 200 });
    }
    return new Response(JSON.stringify(requestDocument), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskContinuationCheckpointStore('uid-1', 'workplace-1');
    const request = await store.getRequest('project-9', 'task-13', 'cont-2');
    assert.equal(request?.continuationRequestId, 'cont-2');
    assert.equal(request?.continuationOfCheckpointId, 'exec-13:checkpoint');
    assert.equal(request?.targetSeatId, 'seat-coder-2');
    const read = calls.find((call) => call.method === 'GET' && !isGoogleTokenRequest(call.url));
    assert.ok(read);
    assert.match(
      read.url,
      /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-9\/tasks\/task-13\/continuation-requests\/cont-2$/,
    );
  } finally { restore(); }
});


test('Firestore runtime task store atomically moves a handoff task into waiting_for_continuation', async () => {
  const calls = [];
  const client = {
    async beginTransaction() { calls.push('begin'); return 'tx-1'; },
    async get(path, transaction) {
      calls.push(['get', path, transaction]);
      if (path.includes('/events/')) return null;
      return {
        updateTime: '2026-09-22T00:10:00Z',
        fields: {
          status: { stringValue: 'handoff_required' },
          approved: { booleanValue: true },
          continuationCheckpointId: { stringValue: 'old-checkpoint' },
          leaseId: { stringValue: 'old-lease' },
        },
      };
    },
    async commit(transaction, writes) {
      calls.push(['commit', transaction, writes]);
    },
  };
  const { FirestoreRuntimeTaskStore } = await import('../dist/src/backend/firestore-runtime.js');
  const store = new FirestoreRuntimeTaskStore(client, 'uid-1', 'workplace-1');
  await store.ensureWaitingForContinuation({
    request: {
      continuationRequestId: 'cont-20',
      taskId: 'task-20',
      projectId: 'project-20',
      checkpointId: 'exec-20:checkpoint',
      sourceSeatId: 'seat-source',
      targetSeatId: 'seat-target',
      requestedBy: 'actor-20',
      requestedAt: '2026-09-22T00:10:00Z',
      instruction: 'continue from checkpoint',
      status: 'requested',
      continuationOfCheckpointId: 'exec-20:checkpoint',
      nextTurn: 'fresh-budgeted-turn',
    },
  });

  assert.equal(calls[0], 'begin');
  assert.deepEqual(calls[1], [
    'get',
    'accounts/uid-1/workplaces/workplace-1/projects/project-20/tasks/task-20',
    'tx-1',
  ]);
  assert.equal(calls[3][0], 'commit');
  const write = calls[3][2][0];
  assert.equal(write.currentDocument.updateTime, '2026-09-22T00:10:00Z');
  const fields = write.update.fields;
  assert.equal(fields.status.stringValue, 'waiting_for_continuation');
  assert.equal(fields.completionState.stringValue, 'WAITING_FOR_CONTINUATION');
  assert.equal(fields.approved.booleanValue, false);
  assert.equal(fields.continuationCheckpointId.stringValue, 'exec-20:checkpoint');
  assert.equal(fields.continuationRequestId.stringValue, 'cont-20');
  assert.equal(fields.continuationTargetSeatId.stringValue, 'seat-target');
  assert.equal(fields.continuationRequestedBy.stringValue, 'actor-20');
  assert.equal(fields.continuationInstruction.stringValue, 'continue from checkpoint');
  assert.equal(fields.leaseId.nullValue, null);
  assert.equal(calls[3][2].length, 2);
  const eventWrite = calls[3][2][1];
  assert.match(eventWrite.update.name, /\/events\/cont-20%3Acontinue-wait%3Aevent$/);
  assert.equal(eventWrite.currentDocument.exists, false);
  assert.equal(eventWrite.update.fields.type.stringValue, 'CONTINUE_WAIT');
  assert.equal(eventWrite.update.fields.idempotencyKey.stringValue, 'cont-20');
});

test('Firestore runtime task store rejects a second continuation request against a waiting task', async () => {
  const client = {
    async beginTransaction() { return 'tx-2'; },
    async get() {
      return {
        fields: {
          status: { stringValue: 'waiting_for_continuation' },
          continuationCheckpointId: { stringValue: 'exec-21:checkpoint' },
          continuationRequestId: { stringValue: 'cont-21-existing' },
        },
      };
    },
    async commit() { throw new Error('must not commit'); },
  };
  const { FirestoreRuntimeTaskStore } = await import('../dist/src/backend/firestore-runtime.js');
  const store = new FirestoreRuntimeTaskStore(client, 'uid-1', 'workplace-1');
  await assert.rejects(
    store.ensureWaitingForContinuation({
      request: {
        continuationRequestId: 'cont-21-new',
        taskId: 'task-21',
        projectId: 'project-21',
        checkpointId: 'exec-21:checkpoint',
        sourceSeatId: 'seat-source',
        targetSeatId: 'seat-target',
        requestedBy: 'actor-21',
        requestedAt: '2026-09-22T00:11:00Z',
        instruction: 'continue',
        status: 'requested',
        continuationOfCheckpointId: 'exec-21:checkpoint',
        nextTurn: 'fresh-budgeted-turn',
      },
    }),
    /continuation_request_state_conflict/,
  );
});
