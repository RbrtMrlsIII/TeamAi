import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const parts = await readFile(new URL('../public/hero-parts.js', import.meta.url), 'utf8');
const auth = await readFile(new URL('../public/hero-auth-handoff.js', import.meta.url), 'utf8');
const semantic = await readFile(new URL('../public/hero-semantic-camera.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');
const materials = await readFile(new URL('../public/hero-materials.css', import.meta.url), 'utf8');
const partsCss = await readFile(new URL('../public/hero-parts.css', import.meta.url), 'utf8');
const depthDoc = await readFile(new URL('../docs/TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md', import.meta.url), 'utf8');

test('3D Hero static shell is wired', () => {
  assert.match(html, /hero-flex\.js/);
  assert.match(html, /hero-aura\.js/);
  assert.match(html, /hero-parts\.js/);
  assert.match(html, /hero-semantic-camera\.js/);
  assert.match(html, /hero-auth-handoff\.js/);
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
    assert.ok(runtime.includes(marker), marker);
  }
  assert.match(runtime, /clamp\(count,1,8\)/);
});

test('signature geometry primitives are present', () => {
  for (const primitive of ['function torus', 'function sph', 'TORUS', 'RING', 'SPH']) {
    assert.match(runtime, new RegExp(primitive.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')));
  }
});

test('spatial depth layer is wired', () => {
  for (const marker of [
    'data-part="surface"',
    'data-part="focus"',
    'data-part="history"',
    'teamai:web-ai-spatial-part',
    'TeamAiHeroSpatial',
  ]) assert.ok(html.includes(marker) || parts.includes(marker), marker);
  for (const marker of ['--rest-x', '--rest-z', '--rest-d', '--drift-x', '--drift-z', 'requestAnimationFrame(animateParts)']) {
    assert.ok(parts.includes(marker), marker);
  }
});

test('authentication handoff is presentation-only and uses normal form semantics', () => {
  for (const marker of [
    'data-hero-engine-open',
    'hero-auth-panel',
    'data-auth-mode="login"',
    'data-auth-mode="signup"',
    'autocomplete="email"',
    'autocomplete="current-password"',
    'autocomplete="new-password"',
    'teamai:web-ai-hero-engine-open',
    'teamai:web-ai-auth-intent',
    'presentationOnly: true',
    'Firebase Authentication connection is not enabled in this build yet.',
  ]) assert.ok(html.includes(marker) || auth.includes(marker), marker);
  assert.match(semantic, /MECHANISM_AUTHENTICATION/);
});

test('normal UI handoff and inspection vocabulary are documented', () => {
  for (const marker of [
    'MECHANISM_RESPONSIBILITY',
    'MECHANISM_CAPABILITY',
    'MECHANISM_AUTHORIZATION',
    'MECHANISM_WORKSPACE',
    'MECHANISM_TASK',
    'MECHANISM_EVIDENCE',
    'APP_UI_HANDOFF',
    'normal application UI',
    'reduced motion',
  ]) assert.ok(depthDoc.toLowerCase().includes(marker.toLowerCase()), marker);
});

test('light-theme shell styling is present', () => {
  assert.match(css, /#f5f2ec/);
  assert.match(css, /backdrop-filter/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(materials, /hero-shell::after/);
  assert.match(partsCss, /rotateX/);
  assert.match(partsCss, /prefers-reduced-motion/);
});
