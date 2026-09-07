/**
 * Contract tests for phase-6 durable connection probe response + client mapping.
 * Does not call Firestore; mirrors Edge response shape.
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

function runConnectionProbe({ baselineHealth, forceHealth }) {
  if (forceHealth) {
    return {
      connectionHealth: normalizeHealth(forceHealth),
      probe: 'stub-edge-runtime',
      probeDetail: `forced:${normalizeHealth(forceHealth)}`,
    };
  }
  return {
    connectionHealth: normalizeHealth(baselineHealth),
    probe: 'stub-edge-runtime',
    probeDetail: 'stub:Provider:Model',
  };
}

test('stub probe preserves baseline health', () => {
  const r = runConnectionProbe({ baselineHealth: 'degraded' });
  assert.equal(r.connectionHealth, 'degraded');
  assert.equal(r.probe, 'stub-edge-runtime');
});

test('forceHealth overrides baseline for test harness', () => {
  const r = runConnectionProbe({ baselineHealth: 'healthy', forceHealth: 'offline' });
  assert.equal(r.connectionHealth, 'offline');
});

test('durable response maps to domain projection', () => {
  const body = {
    ok: true,
    seatId: 'alpha',
    name: 'Alpha',
    connectionHealth: 'healthy',
    teamEntitlement: 'allowed',
    providerEntitlement: 'allowed',
    durableWritten: true,
    source: 'domain-durable',
    probe: 'stub-edge-runtime',
    probeId: 'probe-abc',
  };
  const p = mapServerSeatPayload(body, 'alpha');
  assert.equal(p.source, 'domain');
  assert.equal(p.connectionHealth, 'healthy');
  assert.equal(p.activationAllowedPresentation, true);
  assert.equal(p.durable, false); // presentation model is never durable authority in browser
});

test('durable write requires workplace + project (contract rule)', () => {
  const canPersist = (workplaceId, projectId, persist = true) =>
    Boolean(persist && workplaceId && projectId);
  assert.equal(canPersist(null, null), false);
  assert.equal(canPersist('w1', null), false);
  assert.equal(canPersist('w1', 'p1', false), false);
  assert.equal(canPersist('w1', 'p1', true), true);
});
