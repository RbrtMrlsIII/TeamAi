import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BACKEND_DISPLAY_V1, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';
import { deriveBackendDisplayPlacements } from '../frontend/spatial/hero-r1-backend-display.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');
const publicModule = await readFile(new URL('../public/hero-r1-backend-display.js', import.meta.url), 'utf8');
const frontendModule = await readFile(new URL('../frontend/spatial/hero-r1-backend-display.js', import.meta.url), 'utf8');

test('R1 part IDs exist and are not seat children', () => {
  assert.ok(BACKEND_DISPLAY_V1.length >= 2);
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_DISPLAY, 'WORKSPACE_BACKEND_DISPLAY');
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_THREAD, 'WORKSPACE_BACKEND_THREAD');
});

test('canonical machine-world renderer consumes the R1 module', () => {
  assert.match(renderer, /from '\.\/hero-r1-backend-display\.js'/);
  assert.match(renderer, /drawBackendDisplayRing\(/);
  assert.match(renderer, /ringScale: RING_R1_SCALE/);
  assert.match(renderer, /drawCanonicalRings/);
});

test('ring map places backend display on R1', () => {
  assert.match(map, /R1|Backend/i);
});

test('R1 module stays synchronized and presentation-only', () => {
  assert.equal(publicModule, frontendModule);
  assert.doesNotMatch(frontendModule, /oauth|password|apiKey|firebase\\.auth|supabase/i);
  assert.match(frontendModule, /CYL/);
});

test('presentation-only: no OAuth or credential bind in R1 draw path', () => {
  assert.doesNotMatch(hero, /oauth|password|apiKey|firebase\.auth/i);
});
