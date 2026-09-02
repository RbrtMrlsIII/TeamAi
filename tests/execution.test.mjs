import test from 'node:test';
import assert from 'node:assert/strict';
import { canStartExecution, canTransition } from '../dist/src/execution-state.js';
import { estimateProviderCost } from '../dist/src/billing/service.js';

test('execution requires an approved pending plan', () => {
  assert.equal(canStartExecution('pending', true), true);
  assert.equal(canStartExecution('pending', false), false);
});

test('execution state rejects illegal transition', () => {
  assert.equal(canTransition('completed', 'running'), false);
  assert.equal(canTransition('running', 'paused'), true);
});

test('provider cost estimator uses normalized token units', () => {
  assert.equal(estimateProviderCost({ inputTokens: 1_000_000, outputTokens: 100_000 }, { inputUsdPerMtok: 2, outputUsdPerMtok: 10 }), 3);
});
