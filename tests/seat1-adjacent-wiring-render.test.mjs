import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const renderer = readFileSync(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
const syncScript = readFileSync(new URL('../scripts/apply-031-seat1-adjacent-wiring-render.mjs', import.meta.url), 'utf8');

test('Seat-1 adjacent wiring is owned by the canonical machine-world renderer', () => {
  assert.match(renderer, /function renderAdjacentDivisionWiring\(/);
  assert.match(renderer, /buildAdjacentDivisionWiring\(/);
  assert.match(renderer, /adjacentDivisionWiringPoint\(/);
  assert.match(renderer, /SEAT_DIVISION_ORDER/);
  assert.match(renderer, /resolveSeatDivisionPayload/);
  assert.match(renderer, /deriveFocusedSeatDivisionGeometry/);
});

test('Seat-1 adjacent wiring follows sequential expansion phases', () => {
  assert.match(renderer, /const activeAmount = Math.max\(sourceAmount, targetAmount\)/);
  assert.match(renderer, /phase: targetAmount > sourceAmount \? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE'/);
  assert.match(renderer, /lastSeat1AdjacentWiring = null/);
});

test('legacy adjacent-wiring command is now source synchronization only', () => {
  assert.match(syncScript, /verifyHeroFlexFeature|sync-machine-spatial-runtime/);
  assert.doesNotMatch(syncScript, /writeFileSync\(heroPath/);
  assert.match(syncScript, /machine-world-renderer\.js/);
});


test('generic adjacent wiring is not Seat-1-specific', () => {
  assert.match(renderer, /EDGE:ADJACENT-DIVISION:/);
  assert.match(renderer, /focusedChildId/);
  assert.match(renderer, /neighborIndex/);
});


test('adjacent wiring remains anchored to semantic division ports', () => {
  const source = {
    id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
    port: { x: 1, y: 0.5, z: 2 },
    corridor: { start: { x: 1, y: 0.5, z: 2 }, end: { x: 0, y: 0.5, z: 0 } },
  };
  const target = {
    id: 'TREE-HERO-SEAT#0:SEAT_TOOLKIT:GEOMETRY',
    port: { x: 2, y: 0.6, z: 3 },
  };
  const result = buildAdjacentDivisionWiring({
    sourceGeometry: source,
    targetGeometry: target,
    amount: 0.25,
  });
  assert.deepEqual(result.from.projected, source.port);
  assert.deepEqual(result.to.port, target.port);
  assert.equal(result.activationAmount, 0.25);
});
