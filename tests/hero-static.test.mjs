import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');
const materials = await readFile(new URL('../public/hero-materials.css', import.meta.url), 'utf8');

test('3D Hero static shell is wired', () => {
  assert.match(html, /hero-flex\.js/);
  assert.match(html, /hero-aura\.js/);
  assert.match(html, /hero-canvas/);
  assert.match(html, /Living Web AI Workspace/);
});

test('semantic POV catalog exists', () => {
  for (const cameraId of [
    'HERO_WIDE',
    'HERO_LOW_ORBIT',
    'TEAM_ORBIT',
    'SEAT_CLOSE',
    'WORKSPACE_CLOSE',
    'TURN_FOLLOW',
    'OVERHEAD_MAP',
    'DETAIL_ANCHOR',
  ]) assert.match(runtime, new RegExp(cameraId));
});

test('turn lifecycle exists', () => {
  for (const state of ['IDLE', 'FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB', 'REFLECT', 'HANDOFF']) {
    assert.match(runtime, new RegExp(`['\\\"]${state}['\\\"]`));
  }
});

test('flexible seat model is present', () => {
  for (const marker of ['profile(', 'buildSeats(', 'setSeatCount', 'setTeamSize', 'teamai:web-ai-seat-unlocked', 'seatCount']) {
    assert.match(runtime, new RegExp(marker.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  }
  assert.match(runtime, /clamp\(count,1,8\)/);
});

test('signature geometry primitives are present', () => {
  for (const primitive of ['function torus', 'function sph', 'TORUS', 'RING', 'SPH']) {
    assert.match(runtime, new RegExp(primitive.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  }
});

test('light-theme shell styling is present', () => {
  assert.match(css, /#f5f2ec/);
  assert.match(css, /backdrop-filter/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(materials, /hero-shell::after/);
});
