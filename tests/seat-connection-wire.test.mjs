import assert from 'node:assert/strict';
import test from 'node:test';
import {
  readSeatConnectionConfig,
  runSeatConnectionTest,
  formatConnectionTestMessage,
} from '../frontend/spatial/seat-connection-wire.js';
import { projectSeat } from '../frontend/spatial/seat-read-model.js';

const fixture = projectSeat(
  {
    name: 'Alpha',
    health: 'ok',
    teamEntitlement: 'allowed',
    providerEntitlement: 'allowed',
  },
  { seatId: 'alpha', source: 'fixture' },
);

test('readSeatConnectionConfig defaults empty without window flags', () => {
  const cfg = readSeatConnectionConfig();
  assert.equal(cfg.baseUrl, '');
  assert.equal(cfg.idToken, '');
});

test('runSeatConnectionTest uses fixture when baseUrl unset', async () => {
  const outcome = await runSeatConnectionTest({
    seatId: 'alpha',
    fixtureProjection: fixture,
  });
  assert.equal(outcome.configured, false);
  assert.equal(outcome.usedDomain, false);
  assert.equal(outcome.projection.source, 'fixture');
});

test('runSeatConnectionTest prefers domain when fetch succeeds', async () => {
  globalThis.TEAMAI_SEAT_CONNECTION_BASE_URL = 'https://example.test/functions/v1';
  globalThis.TEAMAI_FIREBASE_ID_TOKEN = 'fake-token';
  try {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        seatId: 'alpha',
        name: 'Alpha',
        connectionHealth: 'healthy',
        teamEntitlement: 'allowed',
        providerEntitlement: 'allowed',
      }),
    });
    const outcome = await runSeatConnectionTest({
      seatId: 'alpha',
      fixtureProjection: fixture,
      fetchImpl,
    });
    assert.equal(outcome.configured, true);
    assert.equal(outcome.usedDomain, true);
    assert.equal(outcome.projection.source, 'domain');
  } finally {
    delete globalThis.TEAMAI_SEAT_CONNECTION_BASE_URL;
    delete globalThis.TEAMAI_FIREBASE_ID_TOKEN;
  }
});

test('formatConnectionTestMessage distinguishes fixture vs domain', () => {
  const msg = formatConnectionTestMessage(fixture, { configured: false, usedDomain: false });
  assert.match(msg, /UI only/);
  const domain = projectSeat(
    { name: 'Alpha', connectionHealth: 'healthy', teamEntitlement: 'allowed', providerEntitlement: 'allowed' },
    { seatId: 'alpha', source: 'domain' },
  );
  const msg2 = formatConnectionTestMessage(domain, { configured: true, usedDomain: true });
  assert.match(msg2, /domain/);
});
