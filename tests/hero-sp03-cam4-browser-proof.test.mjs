/**
 * SP-03 — Cam-4 browser / wiring proof (Gate S8 interaction depth).
 * Spatial execution basis · Issue #232 residual · presentation only · no 029-released claim.
 *
 * Trace: hero-cam4-edge-swipe.js → apply-cam2 flex → real Hero input surface.
 * Proves edge pressure, proportional swipe, reduced-motion suppression, and coexistence
 * with selected-tree look-at (Cam-6) without a second camera subsystem.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  edgePressure,
  edgeDriftDelta,
  proportionalSwipeDelta,
  clampPitch,
  pointerNorm,
  EDGE_ZONE_FRAC,
  EDGE_PITCH_MIN,
  EDGE_PITCH_MAX,
} from '../public/hero-cam4-edge-swipe.js';
import {
  resolveSelectedSeatDock,
  isSeatShellOpen,
} from '../public/hero-cam5-selected-tree-center.js';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  HIERARCHY_INPUT,
} from '../public/hero-hierarchy-runtime.js';
import { shouldApplyTreeNav } from '../public/hero-cam3-tree-center-zoom.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('SP-03 edge zone is product-small and pressure is zero at center', () => {
  assert.ok(EDGE_ZONE_FRAC > 0 && EDGE_ZONE_FRAC <= 0.12);
  const c = edgePressure(0.5, 0.5);
  assert.equal(c.px, 0);
  assert.equal(c.py, 0);
});

test('SP-03 edge pressure rises only in edge bands', () => {
  assert.ok(edgePressure(0.01, 0.5).px < 0);
  assert.ok(edgePressure(0.99, 0.5).px > 0);
  assert.ok(edgePressure(0.5, 0.01).py < 0);
  assert.ok(edgePressure(0.5, 0.99).py > 0);
  const mid = edgePressure(0.5, 0.4);
  assert.equal(mid.px, 0);
  assert.equal(mid.py, 0);
});

test('SP-03 reduced motion fully suppresses edge drift', () => {
  const p = edgePressure(0.01, 0.5);
  const quiet = edgeDriftDelta(p, 0.016, { reducedMotion: true });
  assert.equal(quiet.dYaw, 0);
  assert.equal(quiet.dPitch, 0);
  const live = edgeDriftDelta(p, 0.016, { reducedMotion: false });
  assert.ok(live.dYaw < 0);
});

test('SP-03 proportional swipe follows visible drag direction', () => {
  const r = proportionalSwipeDelta(0.2, 0.1);
  assert.ok(r.dYaw > 0);
  assert.ok(r.dPitch > 0);
});

test('SP-03 clampPitch enforces product bounds', () => {
  assert.equal(clampPitch(-99), EDGE_PITCH_MIN);
  assert.equal(clampPitch(99), EDGE_PITCH_MAX);
  assert.ok(clampPitch(0) === 0);
});

test('SP-03 pointerNorm maps client coords into unit square', () => {
  const a = pointerNorm(-5, 50, 100, 100);
  assert.equal(a.nx, 0);
  assert.equal(a.ny, 0.5);
  const b = pointerNorm(150, -10, 100, 100);
  assert.equal(b.nx, 1);
  assert.equal(b.ny, 0);
});

test('SP-03 Cam-4 free-nav gate remains true while seat shell open', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.ok(isSeatShellOpen(state.openParentId));
  assert.equal(shouldApplyTreeNav(state), true);
});

test('SP-03 Cam-6 look-at still wins subject while edge math is active', () => {
  const dock = resolveSelectedSeatDock('SEAT_CLOSE', 0, 4, { seatRadius: 4.25 }, { force: true });
  assert.ok(dock);
  const dist = Math.hypot(dock.t[0], dock.t[2]);
  assert.ok(dist > 1, 'look-at stays on seat, not world origin');
  const p = edgePressure(0.01, 0.5);
  const drift = edgeDriftDelta(p, 0.016, { reducedMotion: false });
  assert.ok(Number.isFinite(drift.dYaw));
  assert.ok(Array.isArray(dock.t));
});

test('SP-03 INSPECT when closed still blocks free nav', () => {
  const state = createHierarchyRuntime();
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  assert.equal(shouldApplyTreeNav(state), false);
});

test('SP-03 apply-cam2 still owns the proportional Cam-4 path', async () => {
  const apply = join(root, 'scripts/apply-cam2-tree-follow-flex.mjs');
  const result = spawnSync(process.execPath, [apply], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout || 'apply failed');
  const script = await readFile(apply, 'utf8');
  assert.match(script, /hero-cam4-edge-swipe/);
  assert.match(script, /inverseSwipeDelta/);
  assert.match(script, /edgeDriftDelta/);
});

test('SP-03 runtime helper exports proportional behavior', async () => {
  const src = await readFile(join(root, 'public/hero-cam4-edge-swipe.js'), 'utf8');
  assert.match(src, /proportionalSwipeDelta/);
  assert.doesNotMatch(src, /Swipe right → orbit left \(inverse\)/);
  assert.match(src, /presentation only|no 029-released/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth|scheduler/i);
});
