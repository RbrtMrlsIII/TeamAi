import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';

execFileSync(process.execPath, ['scripts/apply-seat-division-focus-compaction.mjs'], { stdio: 'inherit' });

const {
  createHierarchyRuntime,
  openSeatShellParent,
  focusChild,
  tickHierarchyPose,
  tickDivisionFocusTransition,
  getConnectionBranchAmount,
  getBehaviorBranchAmount,
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  DIVISION_FOCUS_CLOSE_MS,
} = await import('../public/hero-hierarchy-runtime.js');

test('changing division focus enters a closing transition instead of deleting the old expansion', () => {
  const state = createHierarchyRuntime();
  state.userConfig = { provider: 'paypal-sandbox', preserved: true };
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 0 });

  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR, { nowMs: 100, snap: false });

  assert.equal(state.phase, HIERARCHY_PHASE.DIVISION_CLOSING);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(state.divisionClosingChildId, HIERARCHY_PART.SEAT_CONNECTION);
  assert.equal(state.divisionPendingChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.deepEqual(state.userConfig, { provider: 'paypal-sandbox', preserved: true });
  assert.equal(getConnectionBranchAmount(state), 1);
});

test('old division compacts fully, then pending division becomes active', () => {
  const state = createHierarchyRuntime();
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR, { nowMs: 100, snap: false });

  tickDivisionFocusTransition(state, 100 + DIVISION_FOCUS_CLOSE_MS / 2, false);
  assert.equal(state.phase, HIERARCHY_PHASE.DIVISION_CLOSING);
  assert.ok(getConnectionBranchAmount(state) > 0 && getConnectionBranchAmount(state) < 1);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_CONNECTION);

  tickDivisionFocusTransition(state, 100 + DIVISION_FOCUS_CLOSE_MS, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.equal(getConnectionBranchAmount(state), 0);
  assert.equal(getBehaviorBranchAmount(state), 0);

  tickHierarchyPose(state, 100 + DIVISION_FOCUS_CLOSE_MS + 1, false);
  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
});

test('reduced motion compacts and switches division without touching user config', () => {
  const state = createHierarchyRuntime({ reducedMotion: true });
  state.userConfig = { provider: 'firebase-test-account', saved: true };
  openSeatShellParent(state, 0, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_CONNECTION, { snap: true, nowMs: 0 });
  focusChild(state, HIERARCHY_PART.SEAT_BEHAVIOR, { nowMs: 50, snap: false });

  tickDivisionFocusTransition(state, 50, true);

  assert.equal(state.phase, HIERARCHY_PHASE.OPEN);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_BEHAVIOR);
  assert.deepEqual(state.userConfig, { provider: 'firebase-test-account', saved: true });
});
