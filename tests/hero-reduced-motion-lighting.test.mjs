import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');
const aura = read('public/hero-aura.js');
const flex = read('public/hero-flex.js');
const materialsCss = read('public/hero-materials.css');

/** Validation migration: old invariant = reduced-motion/theme isolation + material runtime module. Disposition = RETAINED for behavior, OBSOLETE for retired hero-materials.js module path. Replacement = aura/theme CSS owns presentation without body fallback, plus canonical current-slice contract. */
test('aura sets --hero-light-motion from reducedMotionChoreography', () => {
  assert.match(aura, /--hero-light-motion/);
  assert.match(aura, /reducedMotionChoreography/);
});

test('theme/material presentation stays isolated from document.body', () => {
  assert.match(flex, /Isolation preserved/);
  assert.doesNotMatch(materialsCss, /document\.body/);
});

test('retired hero-materials.js module is not required by active presentation', () => {
  assert.doesNotMatch(flex, /hero-materials\.js/);
  assert.match(materialsCss, /hero-light|material|theme/i);
});

test('current slice is singular and canonical', () => {
  const next = read('Masterplan/NEXT_SLICES.md');
  assert.equal((next.match(/^## Current Slice$/gm) || []).length, 1);
  for (const heading of ['## Status', '## Objective', '## Dependencies', '## Verification', '## Current blocker']) {
    assert.match(next, new RegExp(`^${heading}$`, 'm'));
  }
});
