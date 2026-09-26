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
