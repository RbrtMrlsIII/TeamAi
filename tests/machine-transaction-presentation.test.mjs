import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getSeatTransactionPresentation,
  setSeatTransactionPresentation,
  clearSeatTransactionPresentation,
} from '../frontend/spatial/machine-transaction-presentation.js';

test('S21 transaction presentation normalizes governed operation kinds and state', () => {
  const model = setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-1',
    kind: 'handoff-continuation',
    state: 'WAITING_FOR_CONTINUATION',
    progress: 1.4,
    authoritative: true,
  });
  assert.equal(model.kind, 'handoff-continuation');
  assert.equal(model.state, 'WAITING_FOR_CONTINUATION');
  assert.equal(model.progress, 1);
  assert.equal(model.authoritative, true);
  assert.equal(model.presentationOnly, true);
  assert.deepEqual(getSeatTransactionPresentation(), model);
  clearSeatTransactionPresentation();
  assert.equal(getSeatTransactionPresentation(), null);
});

test('S21 transaction presentation rejects unknown operation kinds', () => {
  assert.equal(setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-2',
    kind: 'invented-operation',
    state: 'LOADING',
  }), null);
  assert.equal(getSeatTransactionPresentation(), null);
});
test('S21 never presents completion without authoritative runtime state', () => {
  assert.equal(setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-complete-untrusted',
    kind: 'ai-execution',
    state: 'COMPLETED',
    authoritative: false,
  }), null);
  assert.equal(getSeatTransactionPresentation(), null);

  const model = setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-complete-trusted',
    kind: 'ai-execution',
    state: 'COMPLETED',
    authoritative: true,
  });
  assert.equal(model?.state, 'COMPLETED');
  assert.equal(model?.authoritative, true);
  clearSeatTransactionPresentation();
});
test('S21 transaction recovery actions are only exposed for authoritative transactions', () => {
  const untrusted = setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-untrusted-recovery',
    kind: 'recovery',
    state: 'UNAVAILABLE',
    retryable: true,
    cancelable: true,
    authoritative: false,
  });
  assert.equal(untrusted?.retryable, false);
  assert.equal(untrusted?.cancelable, false);
  clearSeatTransactionPresentation();

  const trusted = setSeatTransactionPresentation({
    seatId: 'seat-1',
    transactionId: 'tx-trusted-recovery',
    kind: 'recovery',
    state: 'UNAVAILABLE',
    retryable: true,
    cancelable: false,
    authoritative: true,
  });
  assert.equal(trusted?.retryable, true);
  assert.equal(trusted?.cancelable, false);
  clearSeatTransactionPresentation();
});
