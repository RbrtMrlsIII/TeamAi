import assert from 'node:assert/strict';
import test from 'node:test';
import {
  projectedSeatFromRaw,
  presentationActivationAllowed,
} from '../frontend/spatial/seats-plate-bind.js';

test('projectedSeatFromRaw normalizes fixture health', () => {
  const p = projectedSeatFromRaw({
    name: 'Alpha',
    health: 'ok',
    connection: 'ready',
    teamEntitlement: 'allowed',
    providerEntitlement: 'allowed',
  }, 'alpha');
  assert.equal(p.connectionHealth, 'healthy');
  assert.equal(p.source, 'fixture');
  assert.equal(p.presentationOnly, true);
});

test('presentationActivationAllowed blocks degraded provider entitlement', () => {
  assert.equal(
    presentationActivationAllowed({
      name: 'Gamma',
      health: 'degraded',
      teamEntitlement: 'allowed',
      providerEntitlement: 'review',
    }),
    false,
  );
});
