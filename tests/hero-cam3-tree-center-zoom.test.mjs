/**
 * Cam-3 — free zoom about current tree center (presentation only).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
  HIERARCHY_INPUT,
} from '../public/hero-hierarchy-runtime.js';
import {
  navAllowedOnOpenTree,
  baseDockForTree,
  poseAboutTreeCenter,
  worldPullbackProgress,
  fitWorldOverviewDock,
  blendCameraPose,
  shouldApplyTreeNav,
} from '../public/hero-cam3-tree-center-zoom.js';

const TABLE = {
  HERO_WIDE: { p: [0, 10, 10], t: [0, 0.78, 0], f: 39 },
  SEAT_CLOSE: { p: [3, 2.3, 3], t: [0, 0.95, 0], f: 36 },
  DETAIL_ANCHOR: { p: [2.45, 1.9, 3.05], t: [0, 0.82, 0], f: 31 },
};

test('nav is allowed while hierarchy parent is open (Cam-3 product rule)', () => {
  assert.equal(navAllowedOnOpenTree(), true);
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.equal(shouldApplyTreeNav(state), true);
});

test('closed tree still respects NAVIGATE gate when required', () => {
  const state = createHierarchyRuntime();
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  assert.equal(shouldApplyTreeNav(state), false);
  state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  assert.equal(shouldApplyTreeNav(state), true);
});

test('poseAboutTreeCenter keeps look-at locked to dock target', () => {
  const base = TABLE.SEAT_CLOSE;
  const a = poseAboutTreeCenter(base, { navZoom: 1, navOrbitYaw: 0, navOrbitPitch: 0 });
  assert.deepEqual(a.t, base.t);
  const b = poseAboutTreeCenter(base, { navZoom: 1.4, navOrbitYaw: 0.3, navOrbitPitch: 0.1 });
  assert.deepEqual(b.t, base.t);
  const distA = Math.hypot(a.p[0] - a.t[0], a.p[1] - a.t[1], a.p[2] - a.t[2]);
  const distB = Math.hypot(b.p[0] - b.t[0], b.p[1] - b.t[1], b.p[2] - b.t[2]);
  assert.ok(distB > distA * 1.2);
});

test('world overview dock expands from the machine envelope when required', () => {
  const base = { p: [0, 10, 10], t: [0, 0.78, 0], f: 39 };
  const fitted = fitWorldOverviewDock(base, 8, 1);
  const baseDistance = Math.hypot(...base.p.map((v, i) => v - base.t[i]));
  const fittedDistance = Math.hypot(...fitted.p.map((v, i) => v - fitted.t[i]));
  assert.ok(fittedDistance > baseDistance);
  assert.deepEqual(fitted.t, base.t);
  const narrow = fitWorldOverviewDock(base, 8, 0.6);
  const narrowDistance = Math.hypot(...narrow.p.map((v, i) => v - narrow.t[i]));
  assert.ok(narrowDistance >= fittedDistance);
});

test('world pullback is continuous across the full NAV_ZOOM range', () => {
  assert.equal(worldPullbackProgress(0.72, 2), 0);
  assert.equal(worldPullbackProgress(1, 2), 0);
  assert.equal(worldPullbackProgress(1.5, 2), 0.5);
  assert.equal(worldPullbackProgress(2, 2), 1);
  assert.equal(worldPullbackProgress(2.5, 2), 1);
});

test('camera blending is monotonic and reaches the semantic world dock without a threshold snap', () => {
  const seat = { p: [6, 2.3, 0], t: [5, 0.95, 0], f: 36 };
  const world = { p: [0, 10, 10], t: [0, 0.78, 0], f: 39 };
  const atStart = blendCameraPose(seat, world, 0);
  const atMid = blendCameraPose(seat, world, 0.5);
  const atEnd = blendCameraPose(seat, world, 1);
  assert.deepEqual(atStart, seat);
  assert.deepEqual(atEnd, world);
  assert.ok(Math.hypot(...atMid.p.map((v, i) => v - seat.p[i])) > 0);
  assert.ok(Math.hypot(...atEnd.p.map((v, i) => v - atMid.p[i])) > 0);
});

test('baseDockForTree uses cameraId from state', () => {
  assert.equal(baseDockForTree({ cameraId: 'DETAIL_ANCHOR' }, TABLE).f, 31);
  assert.equal(baseDockForTree({ cameraId: 'missing' }, TABLE).f, 39);
});

test('close returns to world nav behavior', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: true, nowMs: 0 });
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  assert.equal(shouldApplyTreeNav(state), true);
});

test('canonical renderer owns continuous world camera travel', async () => {
  const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  const renderer = await readFile(new URL('../public/machine-world-renderer.js', import.meta.url), 'utf8');
  const sync = await readFile(new URL('../scripts/apply-cam2-tree-follow-flex.mjs', import.meta.url), 'utf8');
  assert.match(hero, /machine-world-renderer\.js/);
  assert.match(hero, /machineWorldRenderer\.render/);
  assert.match(renderer, /worldPullbackProgress/);
  assert.match(renderer, /blendCameraPose/);
  assert.match(renderer, /NAV_ZOOM_MAX/);
  assert.match(sync, /byte-for-byte parity|parity/i);
  assert.doesNotMatch(sync, /apply-cam2-tree-follow-flex\.engine/);
});

test('module and contract stay presentation-only', async () => {
  const src = await readFile(new URL('../public/hero-cam3-tree-center-zoom.js', import.meta.url), 'utf8');
  assert.match(src, /Cam-3|tree center|presentation only/i);
  assert.doesNotMatch(src, /firestore|paypal|OAuth|scheduler/i);
  const contract = await readFile(
    new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md', import.meta.url),
    'utf8'
  );
  assert.match(contract, /Cam-3/);
  assert.match(contract, /center target/i);
});
