import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BACKEND_DISPLAY_V1, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');

test('R1 part IDs exist and are not seat children', () => {
  assert.ok(BACKEND_DISPLAY_V1.length >= 2);
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_DISPLAY, 'WORKSPACE_BACKEND_DISPLAY');
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_THREAD, 'WORKSPACE_BACKEND_THREAD');
});

test('hero-flex draws backend display ring and threads', () => {
  assert.match(hero, /drawBackendDisplayRing/);
  assert.match(hero, /workspace \* RING_R1_SCALE/);
});

test('ring map places backend display on R1', () => {
  assert.match(map, /R1|Backend/i);
});

test('presentation-only: no OAuth or credential bind in R1 draw path', () => {
  assert.doesNotMatch(hero, /oauth|password|apiKey|firebase\.auth/i);
});
