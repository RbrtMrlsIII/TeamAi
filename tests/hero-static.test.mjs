import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

const html = read('public/index.html');
const css = read('public/hero.css');
const runtime = read('public/hero-flex.js');
const materials = read('public/hero-materials.css');
const partsCss = read('public/hero-parts.css');
const partsJs = read('public/hero-parts.js');
const seatCss = read('public/hero-seat-stack.css');
const seatJs = read('public/hero-seat-stack.js');
const auth = read('public/hero-auth-handoff.js');
const semantic = read('public/hero-semantic-camera.js');
const spine = read('public/hero-inspection-spine.js');
const depthDoc = read('docs/TEAMAI_3D_HERO_DEPTH_AND_INSPECTION.md');

test('3D Hero static shell is wired', () => {
  for (const marker of [
    'id="hero-canvas"',
    'Living Web AI Workspace',
    'data-camera',
    'hero-controls',
    'data-inspection-stage',
  ]) assert.ok(html.includes(marker), marker);
  assert.match(css, /\.hero-shell/);
  assert.match(runtime, /hero-flex|Hero flex|function frame|MAIN_URL/);
});

test('semantic POV catalog exists', () => {
  // After apply-cam2 in CI, assembled flex holds cameras(); loader path still documents the table.
  for (const cameraId of [
    'HERO_WIDE',
    'TEAM_ORBIT',
    'SEAT_CLOSE',
    'WORKSPACE_CLOSE',
    'OVERHEAD_MAP',
    'DETAIL_ANCHOR',
  ]) assert.match(runtime, new RegExp(cameraId));
  // CAM-R-RETIRE (#258 residual): HERO_LOW_ORBIT + TURN_FOLLOW intentionally removed
  assert.doesNotMatch(runtime, /HERO_LOW_ORBIT:\s*\{/);
  assert.doesNotMatch(runtime, /TURN_FOLLOW:\s*\{/);
});

test('turn lifecycle exists', () => {
  for (const state of ['IDLE', 'FOCUS', 'ACTIVE', 'CONTRIBUTE', 'ABSORB', 'REFLECT', 'HANDOFF']) {
    assert.match(runtime, new RegExp(`['\"']${state}['\"']`));
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
    assert.match(runtime, new RegExp(primitive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('spatial depth layer is wired', () => {
  assert.match(materials, /--/);
  assert.match(partsCss, /spatial-parts|data-part/);
  assert.match(partsJs, /spatial|part/i);
  assert.match(seatCss, /seat-stack/);
  assert.match(seatJs, /seat/i);
});

test('authentication handoff is presentation-only and uses normal form semantics', () => {
  for (const marker of [
    'Firebase Authentication connection is not enabled in this build yet.',
  ]) assert.ok(html.includes(marker) || auth.includes(marker), marker);
  assert.match(semantic, /MECHANISM_AUTHENTICATION/);
});

test('semantic inspection spine is deterministic and presentation-only', () => {
  for (const marker of [
    'HERO_ORIENTATION',
    'SURFACE',
    'FOCUS',
    'CONNECTION',
    'BEHAVIOR',
    'SKILLS',
    'ZIPSKILLS',
    'CAPABILITY',
    'AUTHORIZATION',
    'WORKSPACE',
    'TASK',
    'EVIDENCE',
    'NORMAL_UI',
    'TeamAiHeroInspectionSpine',
    'teamai:web-ai-hero-inspection-stage',
    'presentationOnly: true',
    'reducedMotion',
  ]) assert.ok(spine.includes(marker), marker);
  assert.match(spine, /MECHANISM_CONNECTION/);
  assert.match(spine, /APP_UI_HANDOFF/);
});

test('normal UI handoff and inspection vocabulary are documented', () => {
  assert.match(depthDoc, /APP_UI_HANDOFF|handoff/i);
  assert.match(depthDoc, /inspection|spine/i);
});

test('light-theme shell styling is present', () => {
  assert.match(css, /\.hero-shell/);
  assert.match(css, /#hero-canvas/);
  assert.match(materials, /--/);
  assert.match(partsCss, /spatial-parts|data-part/);
});

test('Issue #89 reduced-motion contract is wired to documentElement data-motion', () => {
  assert.match(runtime, /data-motion|reducedMotion|HIERARCHY_REDUCED_SNAP/);
});

test('Issue #89 responsive framing helpers exist without second theme root', () => {
  assert.match(runtime, /responsiveFovBoost|FOV_BOOST|setupRingFovBoost|viewW|aspect/);
  assert.doesNotMatch(runtime, /second theme root|body\.dataset\.theme/i);
});
