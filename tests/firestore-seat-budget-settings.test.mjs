import test from 'node:test';
import assert from 'node:assert/strict';

import { FirestoreRuntimeTaskStore } from '../dist/src/backend/firestore-runtime.js';

test('Seat budget persistence updates only budget metadata under the authenticated Seat path', async () => {
  const calls = [];
  const client = {
    async beginTransaction() { calls.push({ op: 'begin' }); return 'tx-1'; },
    async findCanonicalSeatDocument(uid, projectId, seatId, transaction) {
      calls.push({ op: 'resolve', uid, projectId, seatId, transaction });
      return {
        path: 'accounts/' + uid + '/workplaces/' + 'workplace-2' + '/projects/' + projectId + '/teams/team-coder/seats/' + seatId,
        teamId: 'team-coder',
        document: { updateTime: '2026-09-21T11:00:00Z', fields: {} },
      };
    },
    async commit(transaction, writes) {
      calls.push({ op: 'commit', transaction, writes });
    },
  };

  const store = new FirestoreRuntimeTaskStore(client, 'uid-7', 'workplace-2');
  await store.saveSeatBudget('uid-7', 'project-4', 'seat-3', {
    turnBudgetTokens: 12000,
    outputBudgetTokens: 4000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    warningThresholdPercent: 0.8,
    hardStopPolicy: 'handoff-before-exhaustion',
    responsibilityProfile: 'coder',
    contextInputPolicy: { retention: 'minimal-durable-context' },
  });

  assert.equal(calls[0].op, 'begin');
  assert.equal(calls[1].op, 'resolve');
  assert.equal(calls[1].uid, 'uid-7');
  assert.equal(calls[1].projectId, 'project-4');
  assert.equal(calls[1].seatId, 'seat-3');
  assert.equal(calls[1].transaction, 'tx-1');
  assert.equal(calls[2].op, 'commit');
  assert.equal(calls[2].transaction, 'tx-1');

  const write = calls[2].writes[0];
  assert.deepEqual(write.updateMask.fieldPaths, ['turnBudget', 'updatedAt']);
  assert.equal(write.currentDocument.updateTime, '2026-09-21T11:00:00Z');
  assert.ok(write.update.fields.turnBudget);
  assert.ok(write.update.fields.updatedAt);
});

test('Seat budget persistence fails closed when the durable Seat does not exist', async () => {
  const client = {
    async beginTransaction() { return 'tx-2'; },
    async get() { return null; },
    async commit() { throw new Error('must not commit'); },
  };
  const store = new FirestoreRuntimeTaskStore(client, 'uid-7', 'workplace-2');

  await assert.rejects(
    store.saveSeatBudget('uid-7', 'project-4', 'seat-missing', {
      turnBudgetTokens: 10000,
      outputBudgetTokens: 3000,
      reasoningBudgetTokens: 4000,
      handoffReserveTokens: 1000,
      warningThresholdPercent: 0.8,
      hardStopPolicy: 'handoff-before-exhaustion',
      responsibilityProfile: 'reviewer',
      contextInputPolicy: { retention: 'minimal-durable-context' },
    }),
    /seat not found: seat-missing/,
  );
});
