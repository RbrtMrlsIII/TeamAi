import test from 'node:test';
import assert from 'node:assert/strict';
import { loadSeatBudgetSettings, saveSeatBudgetSettings } from '../frontend/spatial/seat-budget-settings-client.js';

function mockFetch(expectedBody, responseBody = { ok: true }) {
  return async (url, options) => {
    assert.equal(url, 'https://edge.example/functions/v1/teamai-seat-budget-settings');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.authorization, 'Bearer firebase-token');
    const body = JSON.parse(options.body);
    assert.deepEqual(body, expectedBody);
    return {
      ok: true,
      async json() { return responseBody; },
    };
  };
}

test('Seat Budget load client sends the authenticated operator context without Firestore access', async () => {
  globalThis.TEAMAI_SEAT_CONNECTION_BASE_URL = 'https://edge.example/functions/v1';
  globalThis.TEAMAI_FIREBASE_ID_TOKEN = 'firebase-token';
  globalThis.TEAMAI_WORKPLACE_ID = 'workplace-1';
  globalThis.TEAMAI_PROJECT_ID = 'project-2';

  const body = await loadSeatBudgetSettings(
    { seatId: 'seat-1' },
    mockFetch({
      action: 'get',
      workplaceId: 'workplace-1',
      projectId: 'project-2',
      seatId: 'seat-1',
    }),
  );
  assert.deepEqual(body, { ok: true });
});

test('Seat Budget save client forwards only the explicit configuration patch', async () => {
  globalThis.TEAMAI_SEAT_CONNECTION_BASE_URL = 'https://edge.example/functions/v1';
  globalThis.TEAMAI_FIREBASE_ID_TOKEN = 'firebase-token';
  globalThis.TEAMAI_WORKPLACE_ID = 'workplace-1';
  globalThis.TEAMAI_PROJECT_ID = 'project-2';

  const patch = {
    turnBudgetTokens: 12000,
    outputBudgetTokens: 4000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    warningThresholdPercent: 0.8,
    hardStopPolicy: 'handoff-before-exhaustion',
    responsibilityProfile: 'coder',
    contextInputPolicy: { retention: 'minimal-durable-context' },
  };
  const body = await saveSeatBudgetSettings(
    { seatId: 'seat-1', patch },
    mockFetch({
      action: 'save',
      workplaceId: 'workplace-1',
      projectId: 'project-2',
      seatId: 'seat-1',
      patch,
    }, { ok: true, action: 'save' }),
  );
  assert.equal(body.action, 'save');
});
