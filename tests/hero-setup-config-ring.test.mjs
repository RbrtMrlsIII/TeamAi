import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SETUP_CONFIG_V1, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';
import { deriveSetupConfigPlacements } from '../frontend/spatial/hero-r2-setup-ring.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
const r2mod = await readFile(new URL('../public/hero-r2-setup-ring.js', import.meta.url), 'utf8');
const r2source = await readFile(new URL('../frontend/spatial/hero-r2-setup-ring.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');

test('R2 part IDs and SETUP_CONFIG_V1 catalog', () => {
  assert.ok(SETUP_CONFIG_V1.length >= 3);
  assert.equal(HIERARCHY_PART.WORKSPACE_SETUP_ENGINE, 'WORKSPACE_SETUP_ENGINE');
  assert.equal(HIERARCHY_PART.WORKSPACE_AUTH_MECHANISM, 'WORKSPACE_AUTH_MECHANISM');
  assert.equal(HIERARCHY_PART.WORKSPACE_CONFIG_BRANCH, 'WORKSPACE_CONFIG_BRANCH');
});

test('R2 placement is geometry-derived and monotonic with the workspace envelope', () => {
  const placements = deriveSetupConfigPlacements({ workspaceRadius: 5, ringScale: 1.42, items: SETUP_CONFIG_V1 });
  assert.equal(placements.length, SETUP_CONFIG_V1.length);
  assert.equal(placements[0].radius, 7.1);
  for (const placement of placements) {
    assert.ok(Number.isFinite(placement.x));
    assert.ok(Number.isFinite(placement.y));
    assert.ok(Number.isFinite(placement.z));
    assert.ok(Math.abs(Math.hypot(placement.x, placement.z) - placement.radius) < 1e-9);
  }
});

test('canonical machine-world renderer consumes the dedicated R2 module', () => {
  assert.match(renderer, /from '\.\/hero-r2-setup-ring\.js'/);
  assert.match(renderer, /drawSetupConfigRing\(/);
  assert.match(renderer, /ringScale: RING_R2_SCALE/);
  assert.match(renderer, /drawCanonicalRings/);
  assert.match(r2mod, /deriveSetupConfigPlacements/);
  assert.equal(r2mod, r2source);
});

test('ring map places setup/config on R2', () => {
  assert.match(map, /R2|Setup|config/i);
});

test('presentation-only: no credential capture in R2 draw', () => {
  assert.doesNotMatch(r2mod, /password|oauth|credential|firebase|supabase/i);
  assert.doesNotMatch(hero, /password.*=.*input|oauth.*token/i);
});
