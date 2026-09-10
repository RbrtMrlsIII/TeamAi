/**
 * SP-02 — Camera precedence verification (Gate S3).
 * Spatial execution basis · Issue #232 residual · presentation only · no 029-released claim.
 *
 * Makes competing camera authorities explicit as a deterministic matrix.
 * No feature expansion — encode Gate S3 rows against existing Cam-2/3/5/6 owners.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  createHierarchyRuntime,
  openSeatShellParent,
  closeHierarchyParent,
  HIERARCHY_INPUT,
  HIERARCHY_PART,
} from '../public/hero-hierarchy-runtime.js';
import {
  resolveTreeCamera,
  shouldFollowTree,
  WORLD_BASELINE_DOCK_ID,
  TREE_CAMERA,
} from '../public/hero-cam2-tree-follow.js';
import {
  shouldApplyTreeNav,
  navAllowedOnOpenTree,
  V04_FREE_NAV_ON_OPEN_TREE,
} from '../public/hero-cam3-tree-center-zoom.js';
import {
  resolveSelectedSeatDock,
  isSeatShellOpen,
  shouldCenterOnSelectedSeat,
} from '../public/hero-cam5-selected-tree-center.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// ─── Gate S3 ordered precedence (must match spatial execution basis) ─────────
const PRECEDENCE_ORDER = Object.freeze([
  'reduced-motion',
  'semantic-inspection-dock',
  'subject-lookat-tree-center',
  'free-navigate-orbit-zoom',
  'responsive-readability',
  'presentation-dom-request',
]);

/**
 * Gate S3 state matrix — authoritative rows for SP-02.
 * Winning authority must be nameable; free orbit only after dock where required.
 */
const STATE_MATRIX = Object.freeze([
  {
    state: 'Closed',
    subject: 'whole machine/workspace',
    winning: 'HERO_WIDE / world baseline',
    freeOrbit: true,
  },
  {
    state: 'Seat open',
    subject: 'seat shell',
    winning: 'selected-tree dock + look-at',
    freeOrbit: 'after dock, about seat center',
  },
  {
    state: 'Child focused',
    subject: 'child branch',
    winning: 'child/detail dock + look-at',
    freeOrbit: 'after dock, about child center',
  },
  {
    state: 'Leaf/detail',
    subject: 'readable face',
    winning: 'detail dock / camera-fill',
    freeOrbit: 'constrained for readability',
  },
  {
    state: 'Setup fill',
    subject: 'setup/auth content',
    winning: 'setup fill dock',
    freeOrbit: false,
  },
  {
    state: 'Reduced motion',
    subject: 'current subject',
    winning: 'snap to semantic dock',
    freeOrbit: false,
  },
  {
    state: 'Back/close',
    subject: 'parent / world',
    winning: 'semantic return path',
    freeOrbit: 'reset to current subject',
  },
]);

test('SP-02 Gate S3 precedence order is documented and stable', () => {
  assert.equal(PRECEDENCE_ORDER.length, 6);
  assert.equal(PRECEDENCE_ORDER[0], 'reduced-motion');
  assert.equal(PRECEDENCE_ORDER[1], 'semantic-inspection-dock');
  assert.equal(PRECEDENCE_ORDER[2], 'subject-lookat-tree-center');
  assert.equal(PRECEDENCE_ORDER[3], 'free-navigate-orbit-zoom');
});

test('SP-02 state matrix has all required Gate S3 rows', () => {
  const names = STATE_MATRIX.map((r) => r.state);
  for (const required of [
    'Closed',
    'Seat open',
    'Child focused',
    'Leaf/detail',
    'Setup fill',
    'Reduced motion',
    'Back/close',
  ]) {
    assert.ok(names.includes(required), `missing row: ${required}`);
  }
});

// ─── Closed → world baseline ─────────────────────────────────────────────────

test('SP-02 Closed: resolveTreeCamera → HERO_WIDE / world', () => {
  const state = createHierarchyRuntime();
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.WORLD);
  assert.equal(r.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(r.treeCenter, 'world');
  assert.equal(r.inputHint, HIERARCHY_INPUT.NAVIGATE);
  assert.equal(shouldFollowTree(state), false);
});

test('SP-02 Closed: free nav allowed only in NAVIGATE (not INSPECT)', () => {
  const state = createHierarchyRuntime();
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  assert.equal(shouldApplyTreeNav(state), false);
  state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  assert.equal(shouldApplyTreeNav(state), true);
});

// ─── Seat open → selected-tree dock + look-at ────────────────────────────────

test('SP-02 Seat open: resolveTreeCamera → SEAT_CLOSE + follow', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.ok(state.openParentId);
  assert.ok(isSeatShellOpen(state.openParentId));

  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.SEAT_SHELL);
  assert.equal(r.inputHint, HIERARCHY_INPUT.INSPECT);
  assert.equal(shouldFollowTree(state), true);
});

test('SP-02 Seat open: free nav about subject still allowed (Cam-3 / V0.4)', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.equal(navAllowedOnOpenTree(), true);
  assert.equal(V04_FREE_NAV_ON_OPEN_TREE, true);
  assert.equal(shouldApplyTreeNav(state), true);
});

test('SP-02 Seat open: Cam-6 force look-at resolves seat dock (not null)', () => {
  const dock = resolveSelectedSeatDock('HERO_WIDE', 0, 4, { seatRadius: 4.25 }, { force: true });
  assert.ok(dock, 'forced open must center on seat even for HERO_WIDE id');
  assert.ok(Array.isArray(dock.t));
  assert.ok(Array.isArray(dock.p));
  // Look-at must not be world origin while seat is selected
  const distFromOrigin = Math.hypot(dock.t[0], dock.t[2]);
  assert.ok(distFromOrigin > 1, 'seat look-at must leave world origin');
});

test('SP-02 Seat open: non-force HERO_WIDE does not steal seat dock', () => {
  const dock = resolveSelectedSeatDock('HERO_WIDE', 0, 4, { seatRadius: 4.25 }, {});
  assert.equal(dock, null);
  assert.equal(shouldCenterOnSelectedSeat('HERO_WIDE'), false);
  assert.equal(shouldCenterOnSelectedSeat('SEAT_CLOSE'), true);
});

// ─── Child focused / Leaf detail ─────────────────────────────────────────────

test('SP-02 Child focused: near dock when focusedChildId set', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  state.focusedChildId = HIERARCHY_PART.SEAT_CONNECTION;
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.SEAT_CHILD_NEAR);
  assert.equal(r.treeCenter, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(r.inputHint, HIERARCHY_INPUT.INSPECT);
});

test('SP-02 Leaf/detail: DETAIL_ANCHOR for detail children', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  state.focusedChildId = HIERARCHY_PART.SEAT_CAPABILITIES;
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, TREE_CAMERA.SEAT_CHILD_DETAIL);
  assert.equal(r.inputHint, HIERARCHY_INPUT.INSPECT);
});

// ─── Setup fill ──────────────────────────────────────────────────────────────

test('SP-02 Setup fill: setupFill context wins over open parent', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  const r = resolveTreeCamera(state, { setupFill: 0.5 });
  assert.equal(r.cameraId, TREE_CAMERA.SETUP_FILL);
  assert.equal(r.treeCenter, 'setup-ring');
  assert.equal(r.inputHint, HIERARCHY_INPUT.INSPECT);
});

// ─── Back/close → world baseline (V0.2) ───────────────────────────────────────

test('SP-02 Back/close: returns to HERO_WIDE world baseline', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: true, nowMs: 0 });
  closeHierarchyParent(state, { snap: true, nowMs: 1 });
  const r = resolveTreeCamera(state);
  assert.equal(r.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(shouldFollowTree(state), false);
  state.inputMode = HIERARCHY_INPUT.NAVIGATE;
  assert.equal(shouldApplyTreeNav(state), true);
});

// ─── Contract presence (reduced-motion + Gate S3) ────────────────────────────

test('SP-02 spatial basis documents Gate S3 matrix and precedence', async () => {
  const doc = await readFile(join(root, 'docs/TEAMAI_3D_HERO_SPATIAL_EXECUTION_BASIS.md'), 'utf8');
  assert.match(doc, /Gate S3/);
  assert.match(doc, /reduced-motion/);
  assert.match(doc, /semantic inspection dock/i);
  assert.match(doc, /HERO_WIDE/);
  assert.match(doc, /SP-02/);
  assert.match(doc, /selected-tree dock/);
});

test('SP-02 modules remain presentation-only', async () => {
  for (const rel of [
    'public/hero-cam2-tree-follow.js',
    'public/hero-cam3-tree-center-zoom.js',
    'public/hero-cam5-selected-tree-center.js',
  ]) {
    const src = await readFile(join(root, rel), 'utf8');
    assert.doesNotMatch(src, /firestore|paypal|OAuth|scheduler/i);
    assert.match(src, /presentation only|no 029-released/i);
  }
});
