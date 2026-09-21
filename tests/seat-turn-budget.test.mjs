import test from 'node:test';
import assert from 'node:assert/strict';

import {
  accountTurnBudget,
  createSeatTurnBudgetConfig,
  responsibilityDefaults,
  resolveEffectiveTurnBudget,
} from '../src/backend/seat-turn-budget.js';

const usage = (inputTokens, outputTokens) => ({
  inputTokens,
  outputTokens,
  totalTokens: inputTokens + outputTokens,
});

test('responsibility defaults remain suggestions, not provider parameters', () => {
  const defaults = responsibilityDefaults('coder');
  assert.equal(defaults.outputBudgetTokens, 5000);
  assert.equal(defaults.reasoningBudgetTokens, 6000);
  assert.equal(defaults.handoffReserveTokens, 1500);

  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 20000,
    responsibilityProfile: 'coder',
    outputBudgetTokens: 3000,
    reasoningBudgetTokens: 2000,
    handoffReserveTokens: 1000,
  });
  assert.equal(config.outputBudgetTokens, 3000);
  assert.equal(config.reasoningBudgetTokens, 2000);
  assert.equal(config.handoffReserveTokens, 1000);
});

test('budget allocation cannot exceed the configured turn envelope', () => {
  assert.throws(
    () => createSeatTurnBudgetConfig({
      turnBudgetTokens: 5000,
      responsibilityProfile: 'reviewer',
      outputBudgetTokens: 2500,
      reasoningBudgetTokens: 2500,
      handoffReserveTokens: 1,
    }),
    /budget allocations exceed turnBudgetTokens/,
  );
});

test('context policy is validated separately from generation budget', () => {
  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 10000,
    responsibilityProfile: 'planner',
    outputBudgetTokens: 3000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    contextInputPolicy: { maxInputTokens: 64000, retention: 'minimal-durable-context' },
  });
  assert.equal(config.contextInputPolicy.maxInputTokens, 64000);
  assert.equal(resolveEffectiveTurnBudget(config, 7000), 7000);
});

test('healthy and low states are computed from backend usage, not UI counters', () => {
  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 10000,
    responsibilityProfile: 'reviewer',
    outputBudgetTokens: 3000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    warningThresholdPercent: 0.8,
  });

  const healthy = accountTurnBudget({
    config,
    usage: usage(2000, 4000),
    estimatedCompletionNeedTokens: 1000,
  });
  assert.equal(healthy.state, 'HEALTHY');
  assert.equal(healthy.usage.remainingGenerationTokens, 6000);
  assert.equal(healthy.providerOutputCeilingTokens, 3000);

  const low = accountTurnBudget({
    config,
    usage: usage(2000, 8000),
  });
  assert.equal(low.state, 'LOW');
  assert.equal(low.warningThresholdReached, true);
  assert.equal(low.usage.remainingGenerationTokens, 2000);
});

test('handoff prediction protects the reserve before hard exhaustion', () => {
  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 10000,
    responsibilityProfile: 'coder',
    outputBudgetTokens: 3000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
  });

  const handoff = accountTurnBudget({
    config,
    usage: usage(1500, 7000),
    estimatedCompletionNeedTokens: 1200,
  });
  assert.equal(handoff.state, 'HANDOFF');
  assert.equal(handoff.completionState, 'HANDOFF_REQUIRED');
  assert.equal(handoff.usage.remainingGenerationTokens, 2000);
  assert.equal(handoff.providerOutputCeilingTokens, 0);
});

test('exhaustion becomes waiting-for-continuation rather than completion', () => {
  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 10000,
    responsibilityProfile: 'tester-verifier',
  });

  const exhausted = accountTurnBudget({
    config,
    usage: usage(1000, 10000),
  });
  assert.equal(exhausted.state, 'EXHAUSTED');
  assert.equal(exhausted.completionState, 'WAITING_FOR_CONTINUATION');
});

test('explicit terminal outcome overrides budget display state without erasing usage', () => {
  const config = createSeatTurnBudgetConfig({
    turnBudgetTokens: 10000,
    responsibilityProfile: 'reviewer',
  });

  const completed = accountTurnBudget({
    config,
    usage: usage(1200, 2500),
    completionState: 'WORK_COMPLETE',
  });
  assert.equal(completed.state, 'COMPLETED');
  assert.equal(completed.completionState, 'WORK_COMPLETE');
  assert.equal(completed.usage.consumedOutputTokens, 2500);
});
