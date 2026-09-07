/**
 * Contract: HTTP probe credential preference order.
 * Does not call live providers.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

function pickApiKey(seatApiKey, platformKey) {
  const seat = seatApiKey && String(seatApiKey).trim();
  if (seat) return { key: seat, source: 'seat' };
  if (platformKey) return { key: platformKey, source: 'platform' };
  return { key: null, source: 'none' };
}

test('seat key wins over platform key', () => {
  const r = pickApiKey('sk-seat', 'sk-platform');
  assert.equal(r.source, 'seat');
  assert.equal(r.key, 'sk-seat');
});

test('platform used when seat missing', () => {
  const r = pickApiKey('', 'sk-platform');
  assert.equal(r.source, 'platform');
});

test('none when both missing', () => {
  const r = pickApiKey(null, null);
  assert.equal(r.source, 'none');
});
