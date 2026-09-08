import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BACKEND_DISPLAY_V1, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';

const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const map = await readFile(new URL('../docs/TEAMAI_3D_HERO_CONCENTRIC_RING_MAP.md', import.meta.url), 'utf8');

test('R1 part IDs exist and are not seat children', () => {
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_DISPLAY, 'WORKSPACE_BACKEND_DISPLAY');
  assert.equal(HIERARCHY_PART.WORKSPACE_BACKEND_THREAD, 'WORKSPACE_BACKEND_THREAD');
  assert.ok(BACKEND_DISPLAY_V1.length >= 3);
  assert.ok(BACKEND_DISPLAY_V1.every((p) => p.id.startsWith('WORKSPACE_BACKEND_DISPLAY')));
});

test('hero-flex draws backend display ring and threads', () => {
  assert.match(hero, /drawBackendDisplayRing/);
  assert.match(hero, /BACKEND_DISPLAY_V1/);
  assert.match(hero, /workspace \* 1\.18|workspace\*1\.18/);
});

test('ring map places backend display on R1', () => {
  assert.match(map, /R1/);
  assert.match(map, /BACKEND DISPLAY|Backend display/i);
  assert.match(map, /animated threads/i);
});

test('presentation-only: no OAuth or credential bind in R1 draw path', () => {
  const fn = hero.slice(hero.indexOf('function drawBackendDisplayRing'), hero.indexOf('function drawSeat'));
  assert.doesNotMatch(fn, /oauth|client_secret|apiKey|firestore\.collection/i);
  assert.match(fn, /presentation only|Presentation only|rough:/i);
});
