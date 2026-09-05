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
    return new Response(JSON.stringify({ commit: true }), { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskExecutionResultStore('uid-1', 'workplace-1');
    await store.persist({
      taskId: 'task-9', projectId: 'project-1', seatId: 'seat-a', eventId: 'exec-9:complete:event',
      idempotencyKey: 'exec-9:complete', status: 'completed', recordedAt: '2026-09-05T00:00:00Z',
      result: { provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } },
    });
    const commit = calls[0];
    assert.equal(commit.method, 'POST');
    const body = JSON.parse(commit.body);
    assert.equal(body.writes.length, 1);
    assert.equal(body.writes[0].currentDocument.exists, false);
    assert.match(body.writes[0].update.name, /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-1\/tasks\/task-9\/execution-results\/exec-9%3Acomplete%3Aevent$/);
  } finally { restore(); }
});

test('Firestore result store can detect an already durable result by task/project/event identity', async () => {
  setup();
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET' });
    return new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } });
  };
  try {
    const store = new FirestoreTaskExecutionResultStore('uid-1', 'workplace-1');
    const found = await store.hasResult({ taskId: 'task-9', projectId: 'project-1', eventId: 'exec-9:complete:event' });
    assert.equal(found, true);
    assert.match(calls[0].url, /accounts\/uid-1\/workplaces\/workplace-1\/projects\/project-1\/tasks\/task-9\/execution-results\/exec-9%3Acomplete%3Aevent$/);
  } finally { restore(); }
});

test('TaskExecutionService persists the terminal result before the terminal event', async () => {
  const order = [];
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', async generate() { return { provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } }; } }]]));
  const execution = new TaskExecutionService(runtime, {
    async hasIdempotencyKey() { return false; },
    async append(event) { order.push(`event:${event.type}`); },
  }, {
    async hasResult() { return false; },
    async persist(result) { order.push(`result:${result.status}`); assert.equal(result.eventId, 'exec-10:complete:event'); },
  });
  const result = await execution.execute({
    id: 'task-10', projectId: 'project-1', seatId: 'seat-a', provider: 'fixture', model: 'model-1', status: 'waiting_approval', approved: true, authorizationStatus: 'authorized',
    connection: { id: 'connection-1', projectId: 'project-1', providerCode: 'fixture', environment: 'development', capabilities: ['execute'], status: 'active' },
    request: { messages: [{ role: 'user', content: 'run task' }] },
  }, 'scheduler-1', 'exec-10');
  assert.equal(result.status, 'completed');
  assert.deepEqual(order, ['event:START', 'result:completed', 'event:COMPLETE']);
});
