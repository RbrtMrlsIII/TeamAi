import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { FirestoreAtomicTaskLeaseStore, FirestoreRuntimeClient, FirestoreRuntimeApprovalStore } from '../dist/src/backend/firestore-runtime.js';

const originalFetch = globalThis.fetch;

function rsaPrivateKeyPem() {
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  return privateKey.export({ type: 'pkcs8', format: 'pem' });
}

function setupFetch(sequence) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    const next = sequence.shift();
    if (!next) throw new Error(`unexpected fetch: ${url}`);
    return new Response(JSON.stringify(next.body ?? {}), { status: next.status ?? 200, headers: { 'content-type': 'application/json' } });
  };
  return calls;
}

function restoreFetch() {
  globalThis.fetch = originalFetch;
}

function client() {
  process.env.TEAMAI_FIREBASE_PROJECT_ID = 'team-ai-official';
  process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({
    project_id: 'team-ai-official',
    client_email: 'test@example.iam.gserviceaccount.com',
    private_key: rsaPrivateKeyPem(),
  });
  return new FirestoreRuntimeClient();
}

test('Firestore lease adapter uses a transaction and commits only from ready state', async () => {
  const calls = setupFetch([
    { body: { access_token: 'google-token' } },
    { body: { access_token: 'google-token' } },
    { body: { fields: { projectId: { stringValue: 'project-1' } } } },
    { body: { transaction: 'tx-1' } },
    { body: { name: 'task-doc', updateTime: '2026-09-05T00:00:00Z', fields: { status: { stringValue: 'ready' }, projectId: { stringValue: 'project-1' } } } },
    { body: { writeResults: [{}] } },
  ]);

  try {
    const store = new FirestoreAtomicTaskLeaseStore(client(), 'uid-1', 'workplace-1');
    const result = await store.leaseReadyTask({ taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-1', actorId: 'worker-a' });
    assert.deepEqual(result, { acquired: true, taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-1', status: 'leased' });
    assert.equal(calls.filter((call) => call.method === 'POST' && call.url.includes(':beginTransaction')).length, 1);
    const commit = calls.find((call) => call.method === 'POST' && call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.transaction, 'tx-1');
    assert.equal(body.writes.length, 2);
    assert.equal(body.writes[1].currentDocument.updateTime, '2026-09-05T00:00:00Z');
    assert.equal(body.writes[1].update.fields.status.stringValue, 'leased');
  } finally {
    restoreFetch();
  }
});

test('Firestore lease adapter maps transaction conflict to a non-acquired lease', async () => {
  const calls = setupFetch([
    { body: { access_token: 'google-token' } },
    { body: { access_token: 'google-token' } },
    { body: { fields: { projectId: { stringValue: 'project-1' } } } },
    { body: { transaction: 'tx-2' } },
    { body: { name: 'task-doc', updateTime: '2026-09-05T00:00:00Z', fields: { status: { stringValue: 'ready' }, projectId: { stringValue: 'project-1' } } } },
    { status: 409, body: { error: { message: 'already exists' } } },
  ]);

  try {
    const store = new FirestoreAtomicTaskLeaseStore(client(), 'uid-1', 'workplace-1');
    const result = await store.leaseReadyTask({ taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-2', actorId: 'worker-b' });
    assert.deepEqual(result, { acquired: false, taskId: 'task-1', reason: 'ALREADY_LEASED' });
    assert.equal(calls.filter((call) => call.method === 'POST' && call.url.includes(':commit')).length, 1);
  } finally {
    restoreFetch();
  }
});

test('Firestore approval adapter requires the leased seat and lease id before transition', async () => {
  const calls = setupFetch([
    { body: { access_token: 'google-token' } },
    { body: { access_token: 'google-token' } },
    { body: { transaction: 'tx-approval' } },
    { body: { name: 'task-doc', updateTime: '2026-09-05T00:00:00Z', fields: {
      status: { stringValue: 'leased' }, leaseId: { stringValue: 'lease-7' }, seatId: { stringValue: 'seat-a' },
    } } },
    { body: { writeResults: [{}] } },
  ]);

  try {
    const store = new FirestoreRuntimeApprovalStore(client(), 'uid-1', 'workplace-1', 'project-1');
    const result = await store.approveLeasedTask({ taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-7', actorId: 'human-1' });
    assert.deepEqual(result, { approved: true });
    const commit = calls.find((call) => call.method === 'POST' && call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.writes[0].update.fields.status.stringValue, 'waiting_approval');
    assert.equal(body.writes[0].update.fields.approved.booleanValue, true);
  } finally {
    restoreFetch();
  }
});
