/**
 * Slice P1 — SEAT_CONNECTION hierarchy branch (presentation only).
 * No 029-released claim.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createHierarchyRuntime,
  openSeatShellParent,
  focusChild,
  tickHierarchyPose,
  tickConnectionBranch,
  getConnectionBranchAmount,
  connectionFaceAccessibleName,
  requestConnectionConfigureHandoff,
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  CONNECTION_BRANCH_MS,
  HIERARCHY_INPUT,
} from '../public/hero-hierarchy-runtime.js';

test('CONNECTION_BRANCH_MS is named and positive', () => {
  assert.equal(typeof CONNECTION_BRANCH_MS, 'number');
  assert.ok(CONNECTION_BRANCH_MS > 0 && CONNECTION_BRANCH_MS < 2000);
});

test('open seat shell focuses CONNECTION and snaps branch under reduced', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(state.inputMode, HIERARCHY_INPUT.INSPECT);
  assert.equal(getConnectionBranchAmount(state), 1);
});

test('connection branch eases open after parent is mostly open', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 1, { snap: false, nowMs: 0 });
  tickHierarchyPose(state, 600, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  tickConnectionBranch(state, 600, false);
  const mid = getConnectionBranchAmount(state);
  assert.ok(mid >= 0 && mid <= 1);
  tickConnectionBranch(state, 600 + CONNECTION_BRANCH_MS, false);
  assert.ok(getConnectionBranchAmount(state) >= 0.99);
});

test('focusing away from CONNECTION clears branch amount', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR, { nowMs: 10, snap: true });
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.equal(getConnectionBranchAmount(state), 0);
});

test('accessible name and configure handoff are presentation-only', () => {
  const name = connectionFaceAccessibleName(1);
  assert.match(name, /Presentation only/i);
  assert.match(name, /configure|C/i);
  const intent = requestConnectionConfigureHandoff({ targetSection: 'connection' });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.normalUi, true);
  assert.equal(intent.targetSection, 'connection');
});
