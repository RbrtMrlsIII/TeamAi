import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const rendererScript = readFileSync(new URL('../scripts/apply-031-seat1-adjacent-wiring-render.mjs', import.meta.url), 'utf8');

test('Seat-1 renderer remains a fixture over the reusable semantic transition primitive', () => {
  assert.match(rendererScript, /function drawSeat1AdjacentDivisionWiring\(/);
  assert.match(rendererScript, /buildAdjacentDivisionTransition\(/);
  assert.match(rendererScript, /buildAdjacentDivisionGeometry\(/);
  assert.match(rendererScript, /sourceDivisionId/);
  assert.match(rendererScript, /targetDivisionId/);
  assert.match(rendererScript, /seatIndex/);
});

test('Seat-1 renderer preserves fail-closed and presentation-only state', () => {
  assert.match(rendererScript, /if \(!sourceGeometry \|\| !targetGeometry/);
  assert.match(rendererScript, /hierarchyRuntime\.seat1AdjacentWiring = null/);
  assert.match(rendererScript, /presentationOnly: true/);
});
