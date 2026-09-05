import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { FirestoreLeaseTransaction } from '../dist/src/backend/firestore-lease-transaction.js';

const originalFetch = globalThis.fetch;

function privateKey() {
  return generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
}

function mockFetch(responses) {
  const calls = [];
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method ?? 'GET', body: init.body });
    const next = responses.shift();
    if (!next) throw new Error(`unexpected fetch ${url}`);
    return new Response(JSON.stringify(next.body ?? {}), { status: next.status ?? 200, headers: { 'content-type': 'application/json' } });
  };
  return calls;
}

function restore() { globalThis.fetch = originalFetch; }

function setup() {
  process.env.TEAMAI_FIREBASE_PROJECT_ID = 'team-ai-official';
  process.env.TEAMAI_FIREBASE_SERVICE_ACCOUNT_JSON = JSON.stringify({
    project_id: 'team-ai-official',
    client_email: 'runtime-test@example.iam.gserviceaccount.com',
    private_key: privateKey(),
  });
}

test('Firestore lease transaction reads READY state and atomically commits lease + task transition', async () => {
  setup();
  const calls = mockFetch([
    { body: { access_token: 'token-1' } },
    { body: { transaction: 'tx-1' } },
    { body: { updateTime: '2026-09-05T00:00:00Z', fields: { status: { stringValue: 'ready' }, projectId: { stringValue: 'project-1' } } } },
    { body: { commitVersion: 'v1' } },
  ]);
  try {
    const result = await new FirestoreLeaseTransaction().leaseReady({ uid: 'uid-1', workplaceId: 'workplace-1', projectId: 'project-1', taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-1', actorId: 'scheduler-1' });
    assert.deepEqual(result, { acquired: true, leaseId: 'lease-1', taskId: 'task-1', seatId: 'seat-a', status: 'leased' });
    const transactionRead = calls.find((call) => call.method === 'GET' && call.url.includes('transaction=tx-1'));
    assert.ok(transactionRead);
    const commit = calls.find((call) => call.url.includes(':commit'));
    assert.ok(commit);
    const body = JSON.parse(commit.body);
    assert.equal(body.transaction, 'tx-1');
    assert.equal(body.writes.length, 2);
    assert.equal(body.writes[1].currentDocument.updateTime, '2026-09-05T00:00:00Z');
    assert.equal(body.writes[1].update.fields.status.stringValue, 'leased');
  } finally { restore(); }
});

test('Firestore lease transaction refuses non-ready work before a commit', async () => {
  setup();
  const calls = mockFetch([
    { body: { access_token: 'token-2' } },
    { body: { transaction: 'tx-2' } },
    { body: { updateTime: '2026-09-05T00:00:00Z', fields: { status: { stringValue: 'running' } } } },
  ]);
  try {
    const result = await new FirestoreLeaseTransaction().leaseReady({ uid: 'uid-1', workplaceId: 'workplace-1', projectId: 'project-1', taskId: 'task-2', seatId: 'seat-a', leaseId: 'lease-2', actorId: 'scheduler-1' });
    assert.deepEqual(result, { acquired: false, leaseId: 'lease-2', taskId: 'task-2', reason: 'NOT_READY' });
    assert.equal(calls.some((call) => call.url.includes(':commit')), false);
  } finally { restore(); }
});

test('Firestore lease transaction turns optimistic conflict into a non-acquired decision', async () => {
  setup();
  mockFetch([
    { body: { access_token: 'token-3' } },
    { body: { transaction: 'tx-3' } },
    { body: { updateTime: '2026-09-05T00:00:00Z', fields: { status: { stringValue: 'ready' } } } },
    { status: 409, body: { error: { status: 'ABORTED', message: 'transaction conflict' } } },
  ]);
  try {
    const result = await new FirestoreLeaseTransaction().leaseReady({ uid: 'uid-1', workplaceId: 'workplace-1', projectId: 'project-1', taskId: 'task-3', seatId: 'seat-a', leaseId: 'lease-3', actorId: 'scheduler-2' });
    assert.deepEqual(result, { acquired: false, leaseId: 'lease-3', taskId: 'task-3', reason: 'CONFLICT' });
  } finally { restore(); }
});
