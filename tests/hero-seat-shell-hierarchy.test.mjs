import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
  tickHierarchyPose,
  seatShellParentId,
  seatAltitudeY,
  childStackOffset,
  childLocalPosition,
  focusChild,
  HIERARCHY_PHASE,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_REST_Y,
  SEAT_OPEN_LIFT,
  CHILD_STEP_Y,
  CHILD_STEP_R,
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  HIERARCHY_REDUCED_SNAP,
} from '../public/hero-hierarchy-runtime.js';

const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const hierarchy = await readFile(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const combined = runtime + '\n' + hierarchy;

test('§9 named numbers include child stack steps', () => {
  assert.equal(SEAT_REST_Y, 0.62);
  assert.equal(SEAT_OPEN_LIFT, 0.28);
  assert.equal(CHILD_STEP_Y, 0.22);
  assert.equal(CHILD_STEP_R, -0.14);
  assert.equal(OPEN_DURATION_MS, 520);
  assert.equal(CLOSE_DURATION_MS, 420);
  assert.equal(HIERARCHY_REDUCED_SNAP, true);
  assert.match(baseline, /CHILD_STEP_Y/);
});

test('childStackOffset stacks by index and scales with openAmount', () => {
  const z = childStackOffset(0, 1);
  assert.equal(z.dy, 0);
  assert.ok(Object.is(z.dr, 0) || z.dr === 0);
  const mid = childStackOffset(2, 1);
  assert.equal(mid.dy, CHILD_STEP_Y * 2);
  assert.equal(mid.dr, CHILD_STEP_R * 2);
  const half = childStackOffset(2, 0.5);
  assert.ok(Math.abs(half.dy - CHILD_STEP_Y) < 1e-9);
});

test('childLocalPosition returns v1 child ids in order', () => {
  for (let i = 0; i < SEAT_SHELL_V1_CHILDREN.length; i++) {
    const loc = childLocalPosition(0, 1, i, 1);
    assert.equal(loc.childId, SEAT_SHELL_V1_CHILDREN[i]);
  }
  assert.equal(SEAT_SHELL_V1_CHILDREN[0], HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(SEAT_SHELL_V1_CHILDREN.some((id) => /TOOLKIT|ZIPSKILLS/.test(id)), false);
});

test('focusChild only while parent open', () => {
  const state = createHierarchyRuntime();
  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.equal(state.focusedChildId, null);
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
});

test('open/close pose still holds', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: false, nowMs: 0 });
  assert.equal(state.phase, HIERARCHY_PHASE.OPENING);
  tickHierarchyPose(state, OPEN_DURATION_MS, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  closeHierarchyParent(state, { snap: false, nowMs: 2000 });
  tickHierarchyPose(state, 2000 + CLOSE_DURATION_MS, false);
  assert.equal(state.phase, HIERARCHY_PHASE.REST);
});

test('hero-flex draws hierarchy children and cycles focus', () => {
  assert.match(runtime, /function drawHierarchyChildren/);
  assert.match(runtime, /drawHierarchyChildren\(seat/);
  assert.match(runtime, /CHILD_STEP_Y|childLocalPosition|childStackOffset/);
  assert.match(runtime, /ArrowRight|focusHierarchyChild|focusChild/);
  assert.match(runtime, /SEAT_CONNECTION/);
});

test('presentation-only boundary held', () => {
  assert.match(combined, /presentation only|Presentation only/i);
  assert.doesNotMatch(combined, /firestore|paypal|scheduler eligibility/i);
});

test('seatAltitudeY and parent id format', () => {
  assert.equal(seatAltitudeY(1), SEAT_REST_Y + SEAT_OPEN_LIFT);
  assert.equal(seatShellParentId(2), 'SEAT_SHELL#2');
});
