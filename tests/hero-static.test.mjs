import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const parts = await readFile(new URL('../public/hero-parts.js', import.meta.url), 'utf8');
const auth = await readFile(new URL('../public/hero-auth-handoff.js', import.meta.url), 'utf8');
const semantic = await readFile(new URL('../public/hero-semantic-camera.js', import.meta.url), 'utf8');
const spine = await readFile(new URL('../public/hero-inspection-spine.js', import.meta.url), 'utf8');
const settingsShell = await readFile(new URL('../public/hero-settings-shell.js', import.meta.url), 'utf8');
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
  assert.match(runtime, /clamp\(count,\s*1,\s*8\)/);
});

test('signature geometry primitives are present', () => {
  for (const primitive of ['function torus', 'function sph', 'TORUS', 'RING', 'SPH']) {
    assert.match(runtime, new RegExp(primitive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('spatial depth layer is wired', () => {
  for (const marker of [
    'spatial depth',
    'presentation',
    'inspection',
  ]) assert.ok(depthDoc.toLowerCase().includes(marker.toLowerCase()), marker);
  assert.match(materials, /--/);
  assert.match(partsCss, /spatial-parts|data-part/);
});

test('authentication handoff is presentation-only and uses normal form semantics', () => {
  for (const marker of [
    'Firebase Authentication connection is not enabled in this build yet.',
  ]) assert.ok(html.includes(marker) || auth.includes(marker), marker);
  assert.match(semantic, /MECHANISM_AUTHENTICATION/);
});

test('inspection spine is retired; Settings smoke owns operator camera preview', () => {
  assert.match(spine, /RETIRED/);
  assert.match(spine, /retired: do not auto-publish/);
  assert.doesNotMatch(spine, /publish\('initial'\)/);
  assert.doesNotMatch(html, /hero-inspection/);
  assert.doesNotMatch(html, /data-inspection-(?:stage|prev|next|reset)/);
  assert.match(settingsShell, /data-smoke-camera/);
  assert.match(settingsShell, /wireSmoke/);
  assert.match(settingsShell, /Look at id/);
});

test('normal UI handoff and inspection vocabulary are documented', () => {
  assert.match(depthDoc, /APP_UI_HANDOFF|handoff|inspection/i);
});

test('light-theme shell styling is present', () => {
  assert.match(css, /\.hero-shell/);
  assert.match(css, /#hero-canvas/);
});

test('Issue #89 reduced-motion contract is wired to documentElement data-motion', () => {
  assert.match(runtime, /data-motion|reducedMotion|HIERARCHY_REDUCED_SNAP/);
});

test('Issue #89 responsive framing helpers exist without second theme root', () => {
  assert.match(runtime, /responsiveFovBoost|FOV_BOOST|setupRingFovBoost|viewW|aspect/);
  assert.doesNotMatch(runtime, /second theme root|body\.dataset\.theme/i);
});
