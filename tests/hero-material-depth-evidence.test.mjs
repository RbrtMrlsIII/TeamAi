/**
 * TEAM-EXPERIENCE-029 Slice J / Issue #88
 * Material depth evidence package completeness.
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('evidence and HandOver documents exist', () => {
  for (const path of [
    'docs/EVIDENCE_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md',
    'docs/HANDOVER_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md',
    'docs/CHECKPOINT_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md',
  ]) {
    assert.ok(existsSync(join(root, path)), path);
  }
});

test('evidence package denies 029-released claim', () => {
  const evidence = read('docs/EVIDENCE_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md');
  assert.match(evidence, /no 029-released claim/i);
  assert.match(evidence, /Issue #88/);
  assert.match(evidence, /LAW 101/);
});

test('authored materials module and unit tests exist', () => {
  assert.ok(existsSync(join(root, 'public/hero-authored-materials.js')));
  assert.ok(existsSync(join(root, 'tests/hero-authored-materials.test.mjs')));
  const materials = read('public/hero-authored-materials.js');
  assert.match(materials, /authoredRingMaterial/);
  assert.match(materials, /authoredSeatShellMaterial/);
  assert.match(materials, /authoredSeatInsetMaterial/);
});

test('material visual e2e exists for HERO_WIDE / SEAT_CLOSE path', () => {
  const path = 'tests/e2e/hero-material-visual-88.spec.ts';
  assert.ok(existsSync(join(root, path)), path);
  const spec = read(path);
  assert.match(spec, /HERO_WIDE|Wide/i);
  assert.match(spec, /SEAT_CLOSE|Seat/i);
});

test('hero-flex keeps Isolation preserved and material helpers', () => {
  const flex = read('public/hero-flex.js');
  assert.match(flex, /Isolation preserved/);
  assert.match(flex, /authoredRingMaterial|hero-authored-materials/);
});

test('HandOver leaves endorsement open and forbids silent rewrite', () => {
  const ho = read('docs/HANDOVER_TEAM-EXPERIENCE-029_MATERIAL_DEPTH_88_2026-09-08.md');
  assert.match(ho, /endorsement/i);
  assert.match(ho, /Do not rewrite materials/i);
  assert.match(ho, /Do not claim 029 released/i);
});
