import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const renderer = readFileSync(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
const syncScript = readFileSync(new URL('../scripts/apply-031-seat1-adjacent-wiring-render.mjs', import.meta.url), 'utf8');

test('Seat-1 adjacent wiring is owned by the canonical machine-world renderer', () => {
  assert.match(renderer, /function renderSeat1AdjacentWiring\(/);
  assert.match(renderer, /buildAdjacentDivisionWiring\(/);
  assert.match(renderer, /adjacentDivisionWiringPoint\(/);
  assert.match(renderer, /connectionBranchAmount/);
  assert.match(renderer, /behaviorBranchAmount/);
  assert.match(renderer, /buildSeatDivisionGeometry/);
});

test('Seat-1 adjacent wiring follows sequential expansion phases', () => {
  assert.match(renderer, /const activeAmount = targetAmount > 0 \? targetAmount : sourceAmount/);
  assert.match(renderer, /phase: targetAmount > 0 \? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE'/);
  assert.match(renderer, /lastSeat1AdjacentWiring = null/);
});

test('legacy adjacent-wiring command is now source synchronization only', () => {
  assert.match(syncScript, /no Hero mutation|no mutation performed/i);
  assert.doesNotMatch(syncScript, /writeFileSync\(heroPath/);
  assert.match(syncScript, /machine-world-renderer\.js/);
});
