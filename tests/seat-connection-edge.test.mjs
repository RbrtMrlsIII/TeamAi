import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';

test('Seat-1 connection edge contract is present', async () => {
  const source = await readFile(new URL('../frontend/spatial/seat-connection-edge.js', import.meta.url), 'utf8');
  assert.match(source, /SEAT1_CONNECTION_EDGE_ID/);
});

test('Seat-1 legacy injector yields to canonical semantic Hero ownership', async () => {
  const injector = await readFile(new URL('../scripts/apply-seat1-connection-edge-flex.mjs', import.meta.url), 'utf8');
  assert.match(injector, /canonical semantic Hero renderer/);
  assert.match(injector, /machine-world-renderer\.js/);
  assert.match(injector, /no longer mutates hero-flex\.js/);
  assert.doesNotMatch(injector, /function drawSemanticSeat1Connection/);
});
