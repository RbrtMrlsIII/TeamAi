import test from 'node:test';
import assert from 'node:assert/strict';

import { transitionTask } from '../dist/src/backend/task-state.js';

test('running work can enter durable handoff-required state', () => {
  assert.equal(transitionTask('running', 'HANDOFF_REQUIRED'), 'handoff_required');
});

test('handoff-required work can enter waiting-for-continuation without pretending completion', () => {
  assert.equal(transitionTask('handoff_required', 'CONTINUE_WAIT'), 'waiting_for_continuation');
  assert.throws(() => transitionTask('waiting_for_continuation', 'COMPLETE'), /invalid task transition/);
});

test('waiting-for-continuation can be cancelled but not silently completed', () => {
  assert.equal(transitionTask('waiting_for_continuation', 'CANCEL'), 'cancelled');
  assert.throws(() => transitionTask('waiting_for_continuation', 'START'), /invalid task transition/);
});
