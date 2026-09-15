import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const aura = read('public/hero-aura.js');
const flex = read('public/hero-flex.js');
const materials = read('public/hero-materials.js');

/** Validation migration: old invariant = reduced-motion/theme isolation plus singular current frontier. Disposition = RETAINED. Replacement = same runtime invariants plus the new canonical current-slice path. */
test('aura sets --hero-light-motion from reducedMotionChoreography', () => {
  assert.match(aura, /--hero-light-motion/);
  assert.match(aura, /reducedMotionChoreography/);
});

test('Isolation preserved on materials / theme path', () => {
  assert.match(flex, /Isolation preserved/);
  assert.doesNotMatch(materials, /document\.body/);
});

test('NEXT_SLICES exposes one active frontier', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  assert.match(next, /Governance Foundation|machine replacement/i);
});
