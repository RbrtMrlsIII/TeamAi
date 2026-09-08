/**
 * TEAM-EXPERIENCE-029 / Issue #89 — reduced-motion lighting contract
 * Presentation only. No 029-released claim.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mapHeroThemeLighting, HERO_THEME_LIGHTING_FIXTURES } from '../frontend/spatial/hero-theme-lighting-adapter.js';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(root, p), 'utf8');

const contract = read('docs/TEAMAI_3D_HERO_REDUCED_MOTION_LIGHTING_CONTRACT.md');
const flex = read('public/hero-flex.js');
const aura = read('public/hero-aura.js');
const materials = read('public/hero-authored-materials.js');

test('contract document exists and lists RM-L1–L6', () => {
  assert.match(contract, /RM-L1/);
  assert.match(contract, /RM-L6/);
  assert.match(contract, /reducedMotionChoreography/);
  assert.match(contract, /no 029-released claim/i);
});

test('adapter: reducedMotion true forces reducedMotionChoreography false', () => {
  const out = mapHeroThemeLighting({ themeMode: 'light', reducedMotion: true });
  assert.equal(out.reducedMotionChoreography, false);
  const full = mapHeroThemeLighting({ themeMode: 'light', reducedMotion: false });
  assert.equal(full.reducedMotionChoreography, true);
});

test('adapter fixtures include reduced case', () => {
  const red = HERO_THEME_LIGHTING_FIXTURES.find((f) => f.reducedMotion === true);
  assert.ok(red, 'expected a reducedMotion fixture');
  const mapped = mapHeroThemeLighting(red);
  assert.equal(mapped.reducedMotionChoreography, false);
});

test('hero-flex gates time-based pulse with !reducedMotion', () => {
  assert.match(flex, /if\s*\(\s*!reducedMotion/);
  assert.match(flex, /Math\.sin/);
  assert.ok(flex.includes('!reducedMotion') && flex.includes('Math.sin'), 'sin pulse must be behind reduced gate');
});

test('hero-flex reads data-motion from documentElement only', () => {
  assert.match(flex, /document\.documentElement\.getAttribute\('data-motion'\)/);
  assert.doesNotMatch(flex, /document\.body\.getAttribute\(['\"]data-motion/);
});

test('aura sets --hero-light-motion from reducedMotionChoreography', () => {
  assert.match(aura, /--hero-light-motion/);
  assert.match(aura, /reducedMotionChoreography/);
});

test('Isolation preserved on materials / theme path', () => {
  assert.match(flex, /Isolation preserved/);
  assert.doesNotMatch(materials, /document\.body/);
});

test('NEXT_SLICES records G / #89', () => {
  const next = read('docs/TEAMAI_3D_HERO_NEXT_SLICES.md');
  assert.match(next, /#89|reduced-motion lighting/i);
});
