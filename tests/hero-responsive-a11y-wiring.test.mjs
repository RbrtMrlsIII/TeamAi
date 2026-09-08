/**
 * TEAM-EXPERIENCE-029 Slice I.3 / Issue #95
 * Responsive + accessibility wiring + reduced-motion regression.
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { mapHeroThemeLighting } from '../frontend/spatial/hero-theme-lighting-adapter.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

test('I.3 wiring document exists', () => {
  const path = 'docs/TEAMAI_3D_HERO_RESPONSIVE_A11Y_WIRING.md';
  assert.ok(existsSync(join(root, path)));
  const doc = read(path);
  assert.match(doc, /Issue #95/);
  assert.match(doc, /no 029-released claim/i);
  assert.match(doc, /RM-L1/);
});

test('responsive and accessibility skill files keep shape', () => {
  for (const path of [
    'skills/frontend/spatial/responsive/SKILL.md',
    'skills/frontend/spatial/accessibility/SKILL.md',
  ]) {
    assert.ok(existsSync(join(root, path)), path);
    const body = read(path);
    for (const section of ['WHEN TO USE', 'AUTHORITY', 'ACTION', 'DO NOT', 'PASS']) {
      assert.match(body, new RegExp(section));
    }
  }
});

test('responsive skill forbids mobile-only theme and width-as-permission', () => {
  const responsive = read('skills/frontend/spatial/responsive/SKILL.md');
  assert.match(responsive, /Do not ship a separate .mobile theme/i);
  assert.match(responsive, /Do not use viewport width as a permission/i);
});

test('accessibility skill requires keyboard, reduced motion, non-color status', () => {
  const a11y = read('skills/frontend/spatial/accessibility/SKILL.md');
  assert.match(a11y, /keyboard/i);
  assert.match(a11y, /Reduced motion is mandatory/i);
  assert.match(a11y, /color is never the only status/i);
  assert.match(a11y, /Do not create an .a11y mode/i);
});

test('§9 holds FOV_BOOST_NARROW for R7', () => {
  const baseline = read('docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md');
  assert.match(baseline, /`FOV_BOOST_NARROW`\s*\|\s*`\+4`/);
});

test('hero-flex reads data-motion from documentElement only', () => {
  const flex = read('public/hero-flex.js');
  assert.match(flex, /document\.documentElement\.getAttribute\('data-motion'\)/);
  assert.doesNotMatch(flex, /document\.body\.getAttribute\(['"]data-motion/);
  assert.match(flex, /Isolation preserved/);
});

test('G reduced-motion choreography still false under reduced', () => {
  const out = mapHeroThemeLighting({ themeMode: 'light', reducedMotion: true });
  assert.equal(out.reducedMotionChoreography, false);
  const full = mapHeroThemeLighting({ themeMode: 'light', reducedMotion: false });
  assert.equal(full.reducedMotionChoreography, true);
});

test('G lighting contract document still lists RM-L1–L6', () => {
  const contract = read('docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md');
  assert.match(contract, /RM-L1/);
  assert.match(contract, /RM-L6/);
  assert.match(contract, /#89|reduced-motion lighting/i);
});

test('cross-root matrix still lists responsive and accessibility', () => {
  const matrix = read('docs/TEAMAI_3D_HERO_CROSS_ROOT_SKILL_WIRING_MATRIX.md');
  assert.match(matrix, /skills\/frontend\/spatial\/responsive\/SKILL\.md/);
  assert.match(matrix, /skills\/frontend\/spatial\/accessibility\/SKILL\.md/);
});

test('hero-flex gates pulse behind !reducedMotion', () => {
  const flex = read('public/hero-flex.js');
  assert.match(flex, /if\s*\(\s*!reducedMotion/);
});
