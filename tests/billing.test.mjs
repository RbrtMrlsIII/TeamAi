import test from 'node:test';
import assert from 'node:assert/strict';
import { PLAN_LIMITS, assertParticipantLimit, assertTurnLimit } from '../dist/src/billing/tiers.js';

test('free tier allows one AI and blocks a second', () => {
  assert.equal(PLAN_LIMITS.free.maxAiParticipants, 1);
  assert.doesNotThrow(() => assertParticipantLimit('free', 1));
  assert.throws(() => assertParticipantLimit('free', 2), /at most 1/);
});

test('starter is the first two-AI tier', () => {
  assert.equal(PLAN_LIMITS.starter.maxAiParticipants, 2);
  assert.doesNotThrow(() => assertParticipantLimit('starter', 2));
  assert.throws(() => assertParticipantLimit('starter', 3), /at most 2/);
});

test('turn caps follow the plan', () => {
  assert.doesNotThrow(() => assertTurnLimit('free', 10));
  assert.throws(() => assertTurnLimit('free', 11), /at most 10/);
});
