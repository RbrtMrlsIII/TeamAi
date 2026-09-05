import test from 'node:test';
import assert from 'node:assert/strict';

import {
  executionFactLabel,
  validateBackendExecutionFact,
} from '../dist/src/frontend/backend-validator-contract.js';

const validFact = {
  source: 'backend',
  taskId: 'task-1',
  taskStatus: 'running',
  approved: true,
  connection: 'ready',
  provider: 'provider-a',
  seatId: 'seat-a',
};

test('accepts a structurally valid backend execution fact', () => {
  assert.deepEqual(validateBackendExecutionFact(validFact), { valid: true });
});

test('rejects running facts that report a non-ready connection', () => {
  const result = validateBackendExecutionFact({
    ...validFact,
    connection: 'degraded',
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.reasons, [
    'running task must report a ready connection',
  ]);
});

test('rejects incomplete identity fields and missing completion event', () => {
  const result = validateBackendExecutionFact({
    ...validFact,
    taskId: ' ',
    seatId: '',
    provider: '',
    taskStatus: 'completed',
  });

  assert.equal(result.valid, false);
  assert.deepEqual(result.reasons, [
    'taskId is required',
    'seatId is required',
    'provider is required',
    'completed task should expose its terminal event type',
  ]);
});

test('formats backend-owned state for presentation', () => {
  assert.equal(
    executionFactLabel({ ...validFact, connection: 'ready' }),
    'running · ready · seat-a',
  );
});
