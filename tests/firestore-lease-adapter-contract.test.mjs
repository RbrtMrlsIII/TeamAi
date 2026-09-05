import test from 'node:test';
import assert from 'node:assert/strict';
import { FirestoreAtomicTaskLeaseStore } from '../dist/src/backend/firestore-lease-transaction.js';

test('FirestoreAtomicTaskLeaseStore maps transactional conflict to the scheduler lease contract', async () => {
  const transaction = {
    async leaseReady(input) {
      assert.deepEqual(input, {
        uid: 'uid-1',
        workplaceId: 'workplace-1',
        projectId: 'project-1',
        taskId: 'task-1',
        seatId: 'seat-a',
        leaseId: 'lease-1',
        actorId: 'scheduler-1',
      });
      return { acquired: false, leaseId: input.leaseId, taskId: input.taskId, reason: 'CONFLICT' };
    },
  };
  const store = new FirestoreAtomicTaskLeaseStore(transaction, 'uid-1', 'workplace-1', 'project-1');
  const result = await store.leaseReadyTask({ taskId: 'task-1', seatId: 'seat-a', leaseId: 'lease-1', actorId: 'scheduler-1' });
  assert.deepEqual(result, { acquired: false, taskId: 'task-1', reason: 'ALREADY_LEASED' });
});

test('FirestoreAtomicTaskLeaseStore preserves successful lease identity and state', async () => {
  const transaction = {
    async leaseReady() {
      return { acquired: true, leaseId: 'lease-2', taskId: 'task-2', seatId: 'seat-b', status: 'leased' };
    },
  };
  const store = new FirestoreAtomicTaskLeaseStore(transaction, 'uid-2', 'workplace-2', 'project-2');
  const result = await store.leaseReadyTask({ taskId: 'task-2', seatId: 'seat-b', leaseId: 'lease-2', actorId: 'scheduler-2' });
  assert.deepEqual(result, { acquired: true, leaseId: 'lease-2', taskId: 'task-2', seatId: 'seat-b', status: 'leased' });
});
