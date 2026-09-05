import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { ProviderRuntime } from '../dist/src/backend/provider-runtime.js';
import { TaskExecutionService } from '../dist/src/backend/task-execution.js';
import { FirestoreTaskExecutionResultStore } from '../dist/src/backend/firestore-result-store.js';

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
    if (String(url).includes('oauth2.googleapis.com/token')) return new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 });
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
    if (String(url).includes('oauth2.googleapis.com/token')) return new Response(JSON.stringify({ access_token: 'token-2' }), { status: 200 });
    return new Response(JSON.stringify(document), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskExecutionResultStore('uid-1', 'workplace-1');
    const result = await store.getResult({ taskId: 'task-9', projectId: 'project-1', eventId: 'exec-9:complete:event' });
    assert.equal(result?.taskId, 'task-9');
    assert.equal(result?.projectId, 'project-1');
    assert.equal(result?.result?.text, 'done-after-restart');
    const read = calls.find((call) => call.method === 'GET' && !call.url.includes('oauth2.googleapis.com'));
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
