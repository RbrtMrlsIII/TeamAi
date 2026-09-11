/**
 * Cam-4 — edge-drag + proportional-swipe tests (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  EDGE_ZONE_FRAC,
  edgePressure,
  edgeDriftDelta,
  proportionalSwipeDelta,
  clampPitch,
  pointerNorm,
  EDGE_PITCH_MIN,
  EDGE_PITCH_MAX,
} from '../public/hero-cam4-edge-swipe.js';

test('edge zone fraction is positive and small', () => {
  assert.ok(EDGE_ZONE_FRAC > 0 && EDGE_ZONE_FRAC < 0.2);
});

test('edgePressure is zero in center, non-zero at edges', () => {
  const c = edgePressure(0.5, 0.5);
  assert.equal(c.px, 0);
  assert.equal(c.py, 0);
  assert.ok(edgePressure(0.01, 0.5).px < 0);
  assert.ok(edgePressure(0.99, 0.5).px > 0);
  assert.ok(edgePressure(0.5, 0.01).py < 0);
});

test('edgeDriftDelta is zero under reduced motion', () => {
  const p = edgePressure(0.01, 0.5);
  const d = edgeDriftDelta(p, 0.016, { reducedMotion: true });
  assert.equal(d.dYaw, 0);
  assert.equal(d.dPitch, 0);
  assert.ok(edgeDriftDelta(p, 0.016, { reducedMotion: false }).dYaw < 0);
});

test('proportionalSwipeDelta follows input direction', () => {
  assert.ok(proportionalSwipeDelta(0.1, 0).dYaw > 0);
  assert.ok(proportionalSwipeDelta(0, 0.1).dPitch > 0);
});

test('clampPitch respects product bounds', () => {
  assert.equal(clampPitch(-9), EDGE_PITCH_MIN);
  assert.equal(clampPitch(9), EDGE_PITCH_MAX);
});

test('pointerNorm clamps to unit square', () => {
  const a = pointerNorm(-10, 500, 100, 100);
  assert.equal(a.nx, 0);
  assert.equal(a.ny, 1);
});

test('module and contract stay presentation-only and proportional', async () => {
  const src = await readFile(new URL('../public/hero-cam4-edge-swipe.js', import.meta.url), 'utf8');
  assert.match(src, /Cam-4|edge|proportional|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth|scheduler/i);
  const contract = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md', import.meta.url),
    'utf8'
  );
  assert.match(contract, /Cam-4/);
  assert.match(contract, /edge/i);
});

test('hero-flex wires Cam-4 edge/proportional after apply', async () => {
  const { spawnSync } = await import('node:child_process');
  const { fileURLToPath } = await import('node:url');
  const { dirname, join } = await import('node:path');
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  spawnSync(process.execPath, [join(root, 'scripts/apply-cam2-tree-follow-flex.mjs')], { cwd: root, stdio: 'inherit' });
  const flex = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.match(flex, /hero-cam4-edge-swipe|proportionalSwipeDelta/);
  assert.match(flex, /edgeDriftDelta|edgePointerNorm/);
});
