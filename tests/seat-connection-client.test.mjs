import assert from 'node:assert/strict';
import test from 'node:test';
import {
  fetchSeatConnectionProjection,
  mapServerSeatPayload,
  preferDomainProjection,
} from '../frontend/spatial/seat-connection-client.js';
import { projectSeat } from '../frontend/spatial/seat-read-model.js';

test('mapServerSeatPayload forces source domain and normalizes health', () => {
  const p = mapServerSeatPayload(
    {
      seatId: 'alpha',
      name: 'Alpha',
      health: 'ok',
      teamEntitlement: 'allowed',
      providerEntitlement: 'allowed',
    },
    'alpha',
  );
  assert.equal(p.source, 'domain');
  assert.equal(p.connectionHealth, 'healthy');
  assert.equal(p.presentationOnly, true);
  assert.equal(p.durable, false);
  assert.equal(p.activationAllowedPresentation, true);
});

test('fetchSeatConnectionProjection returns null without baseUrl', async () => {
  const result = await fetchSeatConnectionProjection({ seatId: 'alpha' });
  assert.equal(result, null);
});

test('fetchSeatConnectionProjection maps successful server response', async () => {
  const fetchImpl = async () => ({
    ok: true,
    status: 200,
    json: async () => ({
      seatId: 'beta',
      name: 'Beta',
      connectionHealth: 'degraded',
      teamEntitlement: 'allowed',
      providerEntitlement: 'allowed',
    }),
  });
  const p = await fetchSeatConnectionProjection({
    baseUrl: 'https://example.test/functions/v1',
    seatId: 'beta',
    idToken: 'fake',
    fetchImpl,
  });
  assert.equal(p.source, 'domain');
  assert.equal(p.connectionHealth, 'degraded');
  assert.equal(p.activationAllowedPresentation, false);
});

test('preferDomainProjection keeps fixture when domain missing', () => {
  const fixture = projectSeat({ name: 'Alpha', health: 'ok', teamEntitlement: 'allowed', providerEntitlement: 'allowed' }, { seatId: 'alpha', source: 'fixture' });
  assert.equal(preferDomainProjection(null, fixture).source, 'fixture');
  const domain = mapServerSeatPayload({ seatId: 'alpha', health: 'healthy', teamEntitlement: 'allowed', providerEntitlement: 'allowed' });
  assert.equal(preferDomainProjection(domain, fixture).source, 'domain');
});
