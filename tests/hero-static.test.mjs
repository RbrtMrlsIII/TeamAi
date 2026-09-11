import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const parts = await readFile(new URL('../public/hero-parts.js', import.meta.url), 'utf8');
const auth = await readFile(new URL('../public/hero-auth-handoff.js', import.meta.url), 'utf8');
const semantic = await readFile(new URL('../public/hero-semantic-camera.js', import.meta.url), 'utf8');
const spine = await readFile(new URL('../public/hero-inspection-spine.js', import.meta.url), 'utf8');
const css = await readFile(new URL('../public/hero.css', import.meta.url), 'utf8');
const materials = await readFile(new URL('../public/hero-materials.css', import.meta.url), 'utf8');
const partsCss = await readFile(new URL('../public/hero-parts.css', import.meta.url), 'utf8');
const depthDoc = await readFile(new URL('../docs/TEAMAI_3D_HERO_SPATIAL_DEPTH_MODEL.md', import.meta.url), 'utf8');

test('3D Hero static shell is wired', () => {
  assert.match(html, /hero-flex\.js/);
  assert.match(html, /hero-aura\.js/);
  assert.match(html, /hero-parts\.js/);
  assert.match(html, /hero-semantic-camera\.js/);
  assert.match(html, /hero-inspection-spine\.js/);
  assert.match(html, /hero-auth-handoff\.js/);
  assert.match(html, /hero-canvas/);
  assert.match(html, /Living Web AI Workspace/);
});

test('semantic POV catalog exists', () => {
  // CAM-R-RETIRE (#258): HERO_LOW_ORBIT + TURN_FOLLOW removed from existence
  for (const cameraId of [
    'HERO_WIDE',
    'TEAM_ORBIT',
    'SEAT_CLOSE',
    'WORKSPACE_CLOSE',
    'OVERHEAD_MAP',
    'DETAIL_ANCHOR',
  ]) assert.match(runtime, new RegExp(cameraId));
  assert.doesNotMatch(runtime, /HERO_LOW_ORBIT\s*:/);
  assert.doesNotMatch(runtime, /TURN_FOLLOW\s*:/);
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
  for (const primitive of ['cube()', 'cyl(', 'torus(', 'sphere(']) {
    assert.match(runtime, new RegExp(primitive.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
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

test('semantic inspection spine is deterministic and presentation-only', () => {
  for (const marker of [
    'inspection-spine',
    'data-semantic-intent',
    'teamai:web-ai-semantic-camera',
    'TeamAiHeroInspection',
  ]) assert.ok(html.includes(marker) || spine.includes(marker) || semantic.includes(marker), marker);
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
  assert.match(runtime, /data-motion/);
  assert.match(runtime, /syncReducedMotionFromDocument/);
  assert.match(runtime, /setReducedMotion/);
  assert.match(runtime, /readDocumentMotionReduced/);
  assert.match(runtime, /reducedMotionChoreography/);
  assert.match(runtime, /setAttribute\('data-motion'/);
  assert.match(runtime, /getReducedMotion/);
});

test('Issue #89 responsive framing helpers exist without second theme root', () => {
  assert.match(runtime, /responsiveFovBoost/);
  assert.doesNotMatch(runtime, /from ['\"].*frontend\/spatial/);
  assert.doesNotMatch(runtime, /mapHeroThemeLighting\s*\(/);
});
