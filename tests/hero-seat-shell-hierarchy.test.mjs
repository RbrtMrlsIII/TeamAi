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
  HIERARCHY_PHASE,
  HIERARCHY_PART,
  SEAT_SHELL_V1_CHILDREN,
  SEAT_REST_Y,
  SEAT_OPEN_LIFT,
  OPEN_DURATION_MS,
  CLOSE_DURATION_MS,
  HIERARCHY_REDUCED_SNAP,
} from '../public/hero-hierarchy-runtime.js';

const runtime = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
const hierarchy = await readFile(new URL('../public/hero-hierarchy-runtime.js', import.meta.url), 'utf8');
const baseline = await readFile(new URL('../docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md', import.meta.url), 'utf8');
const combined = runtime + '\n' + hierarchy;

test('§9 named numbers match baseline starting values', () => {
  assert.equal(SEAT_REST_Y, 0.62);
  assert.equal(SEAT_OPEN_LIFT, 0.28);
  assert.equal(OPEN_DURATION_MS, 520);
  assert.equal(CLOSE_DURATION_MS, 420);
  assert.equal(HIERARCHY_REDUCED_SNAP, true);
  assert.match(baseline, /SEAT_OPEN_LIFT/);
  assert.match(hierarchy, /SEAT_REST_Y/);
});

test('seatAltitudeY maps openAmount to rest + lift', () => {
  assert.equal(seatAltitudeY(0), SEAT_REST_Y);
  assert.equal(seatAltitudeY(1), SEAT_REST_Y + SEAT_OPEN_LIFT);
  assert.ok(Math.abs(seatAltitudeY(0.5) - (SEAT_REST_Y + SEAT_OPEN_LIFT * 0.5)) < 1e-9);
});

test('open animates OPENING → OPEN; reduced snap is immediate', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: false, nowMs: 0 });
  assert.equal(state.phase, HIERARCHY_PHASE.OPENING);
  assert.equal(state.openAmount, 0);
  tickHierarchyPose(state, OPEN_DURATION_MS / 2, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPENING);
  assert.ok(state.openAmount > 0 && state.openAmount < 1);
  tickHierarchyPose(state, OPEN_DURATION_MS, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  assert.equal(state.openAmount, 1);

  const snapped = createHierarchyRuntime();
  openSeatShellParent(snapped, 0, { snap: true, nowMs: 0 });
  assert.equal(snapped.phase, HIERARCHY_PHASE.OPEN);
  assert.equal(snapped.openAmount, 1);
});

test('close animates CLOSING → REST; one-open preserved', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 2, { snap: true, nowMs: 0 });
  closeHierarchyParent(state, { snap: false, nowMs: 1000 });
  assert.equal(state.phase, HIERARCHY_PHASE.CLOSING);
  assert.equal(state.openParentId, 'SEAT_SHELL#2');
  tickHierarchyPose(state, 1000 + CLOSE_DURATION_MS, false);
  assert.equal(state.phase, HIERARCHY_PHASE.REST);
  assert.equal(state.openParentId, null);
  assert.equal(state.openAmount, 0);
});

test('hero-flex consumes §9 names and ticks pose', () => {
  assert.match(runtime, /SEAT_REST_Y/);
  assert.match(runtime, /SEAT_OPEN_LIFT/);
  assert.match(runtime, /tickHierarchyPose/);
  assert.match(runtime, /hierLift|SEAT_OPEN_LIFT\s*\*\s*hierarchyRuntime\.openAmount/);
  assert.match(runtime, /HIERARCHY_REDUCED_SNAP/);
});

test('presentation-only boundary held', () => {
  assert.match(combined, /presentation only|Presentation only/i);
  assert.doesNotMatch(combined, /firestore|paypal|scheduler eligibility/i);
});

test('v1 children still exclude Toolkit/ZipSkills', () => {
  assert.equal(SEAT_SHELL_V1_CHILDREN.includes(HIERARCHY_PART.SEAT_CONNECTION), true);
  assert.equal(SEAT_SHELL_V1_CHILDREN.some((id) => /TOOLKIT|ZIPSKILLS/.test(id)), false);
});

test('seatShellParentId format', () => {
  assert.equal(seatShellParentId(0), 'SEAT_SHELL#0');
});
