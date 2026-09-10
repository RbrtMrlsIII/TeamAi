/**
 * V1.1 — Back/Next seat branch walk (Vision).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  resolveSeatBranchStep,
  cycleSeatShellBranchFocus,
  SEAT_BRANCH_WALK_ORDER,
} from '../public/hero-seat-branch-walk.js';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  HIERARCHY_PART,
} from '../public/hero-hierarchy-runtime.js';

test('V1.1 order matches seat shell children', () => {
  assert.equal(SEAT_BRANCH_WALK_ORDER[0], HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(SEAT_BRANCH_WALK_ORDER.at(-1), HIERARCHY_PART.SEAT_TASK_EVIDENCE);
  assert.equal(SEAT_BRANCH_WALK_ORDER.length, 7);
});

test('V1.1 Next from CONNECTION is BEHAVIOR', () => {
  assert.equal(
    resolveSeatBranchStep(HIERARCHY_PART.SEAT_CONNECTION, 1),
    HIERARCHY_PART.SEAT_BEHAVIOR,
  );
});

test('V1.1 Back from CONNECTION wraps to TASK_EVIDENCE', () => {
  assert.equal(
    resolveSeatBranchStep(HIERARCHY_PART.SEAT_CONNECTION, -1),
    HIERARCHY_PART.SEAT_TASK_EVIDENCE,
  );
});

test('V1.1 cycle applies focusChild on open shell', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  cycleSeatShellBranchFocus(state, 1, { snap: true, nowMs: 1 });
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  cycleSeatShellBranchFocus(state, -1, { snap: true, nowMs: 2 });
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
});

test('V1.1 cycle is no-op when hierarchy closed', () => {
  const state = createHierarchyRuntime();
  cycleSeatShellBranchFocus(state, 1);
  assert.equal(state.focusedChildId, null);
});
