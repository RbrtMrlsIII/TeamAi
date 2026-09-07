import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeConnectionHealth,
  projectSeat,
  projectSeatMap,
  SEAT_CONNECTION_HEALTH,
} from '../frontend/spatial/seat-read-model.js';

test('canonical health enum is frozen and ordered', () => {
  assert.deepEqual([...SEAT_CONNECTION_HEALTH], ['unknown', 'offline', 'degraded', 'healthy']);
});

test('normalizeConnectionHealth maps fixture synonyms', () => {
  assert.equal(normalizeConnectionHealth('ok'), 'healthy');
  assert.equal(normalizeConnectionHealth('ready'), 'healthy');
  assert.equal(normalizeConnectionHealth('degraded'), 'degraded');
  assert.equal(normalizeConnectionHealth('offline'), 'offline');
  assert.equal(normalizeConnectionHealth(''), 'unknown');
  assert.equal(normalizeConnectionHealth('mystery'), 'unknown');
});

test('projectSeat is presentation-only and non-durable', () => {
  const p = projectSeat(
    {
      name: 'Alpha',
      role: 'planning',
      provider: 'Provider One',
      model: 'Model A',
      connection: 'ready',
      health: 'ok',
      teamEntitlement: 'allowed',
      providerEntitlement: 'allowed',
      eligible: true,
    },
    { seatId: 'alpha', source: 'fixture' },
  );
  assert.equal(p.connectionHealth, 'healthy');
  assert.equal(p.source, 'fixture');
  assert.equal(p.presentationOnly, true);
  assert.equal(p.durable, false);
  assert.equal(p.activationAllowedPresentation, true);
});

test('activationAllowedPresentation requires healthy + both entitlements allowed', () => {
  const degraded = projectSeat(
    {
      name: 'Gamma',
      connection: 'degraded',
      health: 'degraded',
      teamEntitlement: 'allowed',
      providerEntitlement: 'review',
    },
    { seatId: 'gamma' },
  );
  assert.equal(degraded.connectionHealth, 'degraded');
  assert.equal(degraded.activationAllowedPresentation, false);
});

test('projectSeatMap freezes fixture seats', () => {
  const map = projectSeatMap({
    alpha: { name: 'Alpha', health: 'ok', teamEntitlement: 'allowed', providerEntitlement: 'allowed' },
  });
  assert.equal(map.alpha.seatId, 'alpha');
  assert.equal(map.alpha.connectionHealth, 'healthy');
});
