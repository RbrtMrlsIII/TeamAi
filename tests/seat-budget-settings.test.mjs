import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  createSeatBudgetControlIntent,
  createSeatBudgetSaveIntent,
  normalizeSeatBudgetReadModel,
  seatBudgetEnergySegments,
} from '../frontend/spatial/seat-budget-settings.js';

test('Seat Budget read model keeps authorization/configurability separate', () => {
  const locked = normalizeSeatBudgetReadModel({
    available: true,
    authorized: false,
    configurable: false,
    state: 'LOCKED',
    configured: { turnBudgetTokens: 12000 },
  });
  assert.equal(locked.available, true);
  assert.equal(locked.authorized, false);
  assert.equal(locked.configurable, false);
  assert.equal(locked.state, 'LOCKED');
});

test('Seat Budget settings can be configured without inventing live-turn usage', () => {
  const model = normalizeSeatBudgetReadModel({
    available: true,
    authorized: true,
    configurable: true,
    configured: { turnBudgetTokens: 12000, outputBudgetTokens: 4000, reasoningBudgetTokens: 5000, handoffReserveTokens: 1000, hardStopPolicy: 'handoff-before-exhaustion', responsibilityProfile: 'coder' },
    usage: null,
    state: 'READY',
  });
  assert.equal(model.usageReported, false);
  assert.equal(model.effectiveTurnBudgetTokens, 12000);
  assert.equal(model.reservedTokens, 0);
  assert.equal(model.hardStopPolicy, 'handoff-before-exhaustion');
  assert.deepEqual(seatBudgetEnergySegments(model), { consumedFraction: 0, handoffReserveFraction: 0, remainingFraction: 0 });
});

test('Seat Budget energy segments preserve protected handoff reserve', () => {
  const model = normalizeSeatBudgetReadModel({
    available: true,
    authorized: true,
    configured: {
      turnBudgetTokens: 10000,
      handoffReserveTokens: 1000,
    },
    usage: {
      consumedTotalTokens: 6000,
      remainingGenerationTokens: 4000,
      usableGenerationTokens: 3000,
    },
    state: 'READY',
  });
  const segments = seatBudgetEnergySegments(model);
  assert.equal(segments.consumedFraction, 0.6);
  assert.equal(segments.handoffReserveFraction, 0.1);
  assert.equal(segments.remainingFraction, 0.3);
});

test('Seat Budget save is an intent until an authenticated backend persists it', () => {
  const intent = createSeatBudgetSaveIntent({
    seatId: 'seat-2',
    patch: { turnBudgetTokens: 12000 },
  });
  assert.equal(intent.intent, 'save-seat-turn-budget');
  assert.equal(intent.seatId, 'seat-2');
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.authoritative, false);
});

test('Seat Budget control intents remain presentation-only and require an authoritative Seat identity', () => {
  const intent = createSeatBudgetControlIntent({ seatId: 'runtime-seat-7', action: 'CONTINUE' });
  assert.equal(intent.intent, 'seat-budget-control');
  assert.equal(intent.action, 'CONTINUE');
  assert.equal(intent.seatId, 'runtime-seat-7');
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.authoritative, false);
  assert.throws(() => createSeatBudgetControlIntent({ seatId: 'runtime-seat-7', action: 'EQUIP' }));
});

test('Seat Budget facility uses the live Hero selection only to seed a backend read request', () => {
  const facility = readFileSync('frontend/spatial/seat-budget-settings-facility.js', 'utf8');
  assert.match(facility, /createSpatialConstructionContext/);
  assert.match(facility, /slice: 'S16'/);
  assert.match(facility, /SEAT_BUDGET_FACILITY_SPATIAL_CONTEXT/);
  assert.match(facility, /readModel\.seatId/);
  assert.match(facility, /TeamAiHero\?\.getSelectedSeat/);
  assert.match(facility, /seat-\$\{index \+ 1\}/);
});

test('Seat Budget facility remains free of direct backend/storage calls', () => {
  const facility = readFileSync('frontend/spatial/seat-budget-settings-facility.js', 'utf8');
  assert.doesNotMatch(facility, /fetch\s*\(/i);
  assert.doesNotMatch(facility, /Firestore/i);
  assert.doesNotMatch(facility, /Supabase/i);
});


test('Seat Budget source and browser mirror remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/seat-budget-settings.js', 'utf8'),
    readFileSync('public/seat-budget-settings.js', 'utf8'),
  );
  assert.equal(
    readFileSync('frontend/spatial/seat-budget-settings-facility.js', 'utf8'),
    readFileSync('public/seat-budget-settings-facility.js', 'utf8'),
  );
});
