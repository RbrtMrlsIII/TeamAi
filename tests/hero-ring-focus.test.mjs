import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createRingFocusState,
  focusRingItem,
  cycleRingFocus,
  clearRingFocus,
  ringFocusAccessibleName,
  BACKEND_DISPLAY_V1,
  SETUP_CONFIG_V1,
} from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const r2 = await readFile(new URL('../public/hero-r2-setup-ring.js', import.meta.url), 'utf8');

test('ring focus cycles R1 and R2 catalogs', () => {
  const rf = createRingFocusState();
  focusRingItem(rf, 'r1', 0);
  assert.equal(rf.ring, 'r1');
  assert.equal(rf.index, 0);
  cycleRingFocus(rf, 'r1', 1);
  assert.equal(rf.index, 1 % BACKEND_DISPLAY_V1.length);
  cycleRingFocus(rf, 'r2', 0);
  assert.equal(rf.ring, 'r2');
  assert.ok(SETUP_CONFIG_V1.length >= 2);
  cycleRingFocus(rf, 'r2', 1);
  assert.equal(rf.index, 1);
  clearRingFocus(rf);
  assert.equal(rf.ring, null);
});

test('accessible name is presentation only', () => {
  const rf = createRingFocusState();
  focusRingItem(rf, 'r1', 0);
  const name = ringFocusAccessibleName(rf);
  assert.match(name, /Backend display/i);
  assert.match(name, /Presentation only/i);
  assert.doesNotMatch(name, /authorized|entitled/i);
});

test('hero-flex wires ring focus keys and click zones', () => {
  assert.match(hero, /cycleRingFocus/);
  assert.match(hero, /ringFocusAccessibleName/);
  assert.match(hero, /event\.key==='\['/);
  assert.match(hero, /getRingFocus/);
});

test('draw paths react to focusedIndex / r1 focus', () => {
  assert.match(hero, /ringFocus\.ring === 'r1'/);
  assert.match(r2, /focusedIndex/);
  assert.match(r2, /focused \?/);
});
