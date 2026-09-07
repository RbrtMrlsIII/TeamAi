/**
 * Contract tests for teamai-seat-connection-test response shape
 * (mirrors Edge Function JSON; no Deno runtime required).
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { mapServerSeatPayload } from '../frontend/spatial/seat-connection-client.js';

function normalizeHealth(raw) {
  const v = String(raw ?? '').trim().toLowerCase();
  if (['healthy', 'ok', 'ready', 'pass', 'passed'].includes(v)) return 'healthy';
  if (['degraded', 'warn', 'warning', 'partial'].includes(v)) return 'degraded';
  if (['offline', 'down', 'fail', 'failed', 'error'].includes(v)) return 'offline';
  return 'unknown';
}

/** Mirror of edge stub catalog for alpha/gamma. */
function stubEdgeResponse(seatId = 'alpha') {
  const catalog = {
    alpha: {
      name: 'Alpha',
      role: 'planning',
      provider: 'Provider One',
      model: 'Model A',
      connectionHealth: 'healthy',
      teamEntitlement: 'allowed',
      providerEntitlement: 'allowed',
    },
    gamma: {
      name: 'Gamma',
      role: 'reviewer',
      provider: 'Provider Three',
      model: 'Model C',
      connectionHealth: 'degraded',
      teamEntitlement: 'allowed',
      providerEntitlement: 'review',
    },
  };
  const stub = catalog[seatId] || {
    name: seatId,
    connectionHealth: 'unknown',
    teamEntitlement: 'unknown',
    providerEntitlement: 'unknown',
  };
  return {
    ok: true,
    phase: 'seat_connection_test',
    uid: 'test-uid',
    seatId,
    ...stub,
    connectionHealth: normalizeHealth(stub.connectionHealth),
    source: 'domain-stub',
    probe: 'stub-edge-runtime',
  };
}

test('edge stub alpha maps to domain projection with activation allowed', () => {
  const body = stubEdgeResponse('alpha');
  const p = mapServerSeatPayload(body, 'alpha');
  assert.equal(p.source, 'domain');
  assert.equal(p.connectionHealth, 'healthy');
  assert.equal(p.activationAllowedPresentation, true);
  assert.equal(p.presentationOnly, true);
  assert.equal(p.durable, false);
});

test('edge stub gamma blocks activation presentation', () => {
  const body = stubEdgeResponse('gamma');
  const p = mapServerSeatPayload(body, 'gamma');
  assert.equal(p.connectionHealth, 'degraded');
  assert.equal(p.activationAllowedPresentation, false);
});

test('edge response required keys for client', () => {
  const body = stubEdgeResponse('alpha');
  for (const key of ['seatId', 'connectionHealth', 'teamEntitlement', 'providerEntitlement']) {
    assert.ok(key in body, `missing ${key}`);
  }
});
