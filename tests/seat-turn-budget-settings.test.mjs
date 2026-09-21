import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SeatTurnBudgetSettingsService,
} from '../dist/src/backend/seat-turn-budget-settings.js';

const baseConfig = {
  turnBudgetTokens: 12000,
  outputBudgetTokens: 4000,
  reasoningBudgetTokens: 5000,
  handoffReserveTokens: 1000,
  warningThresholdPercent: 0.8,
  hardStopPolicy: 'handoff-before-exhaustion',
  responsibilityProfile: 'coder',
  contextInputPolicy: { retention: 'minimal-durable-context' },
};

function authorizer(allowed = true) {
  return {
    async assertCanConfigureSeat() {
      if (!allowed) throw new Error('seat configuration authorization required');
    },
  };
}

test('Seat budget settings require explicit authorization before load or save', async () => {
  const calls = [];
  const store = {
    async getSeatBudget() { calls.push('get'); return baseConfig; },
    async saveSeatBudget() { calls.push('save'); },
  };
  const service = new SeatTurnBudgetSettingsService(store, authorizer(false));

  await assert.rejects(
    service.load({ uid: 'uid-1', projectId: 'project-1', seatId: 'seat-1', actorId: 'actor-1' }),
    /authorization required/,
  );
  await assert.rejects(
    service.save(
      { uid: 'uid-1', projectId: 'project-1', seatId: 'seat-1', actorId: 'actor-1' },
      { turnBudgetTokens: 10000 },
    ),
    /authorization required/,
  );
  assert.deepEqual(calls, []);
});

test('explicit save normalizes the patch and preserves existing settings', async () => {
  let saved = null;
  const store = {
    async getSeatBudget() { return baseConfig; },
    async saveSeatBudget(uid, projectId, seatId, config) {
      saved = { uid, projectId, seatId, config };
    },
  };
  const service = new SeatTurnBudgetSettingsService(store, authorizer());

  const next = await service.save(
    { uid: 'uid-1', projectId: 'project-1', seatId: 'seat-1', actorId: 'actor-1' },
    { warningThresholdPercent: 0.9 },
  );

  assert.equal(next.turnBudgetTokens, 12000);
  assert.equal(next.warningThresholdPercent, 0.9);
  assert.equal(saved.uid, 'uid-1');
  assert.equal(saved.config.responsibilityProfile, 'coder');
});

test('new Seat budget requires a total turn budget', async () => {
  const store = {
    async getSeatBudget() { return null; },
    async saveSeatBudget() {},
  };
  const service = new SeatTurnBudgetSettingsService(store, authorizer());

  await assert.rejects(
    service.save(
      { uid: 'uid-1', projectId: 'project-1', seatId: 'seat-1', actorId: 'actor-1' },
      { responsibilityProfile: 'reviewer' },
    ),
    /turnBudgetTokens is required/,
  );
});
