import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-prototype.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');

test('3D Hero static shell is wired', () => {
  assert.match(html, /hero-prototype\.js/);
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
    assert.match(runtime, new RegExp(`['"]${state}['"]`));
  }
});

test('light-theme shell styling is present', () => {
  assert.match(css, /#f5f2ec/);
  assert.match(css, /backdrop-filter/);
  assert.match(css, /prefers-reduced-motion/);
});
