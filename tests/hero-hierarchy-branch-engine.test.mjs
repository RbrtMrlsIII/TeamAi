import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HIERARCHY_PART,
  HIERARCHY_PHASE,
  createHierarchyRuntime,
  focusChild,
  tickConnectionBranch,
  tickBehaviorBranch,
  tickToolkitBranch,
  tickCapabilitiesBranch,
  tickAuthorizationBranch,
  tickWorkspaceScopeBranch,
  tickTaskEvidenceBranch,
} from '../public/hero-hierarchy-runtime.js';

const branches = [
  ['connectionBranchAmount', tickConnectionBranch, HIERARCHY_PART.SEAT_CONNECTION],
  ['behaviorBranchAmount', tickBehaviorBranch, HIERARCHY_PART.SEAT_BEHAVIOR],
  ['toolkitBranchAmount', tickToolkitBranch, HIERARCHY_PART.SEAT_TOOLKIT],
  ['capabilitiesBranchAmount', tickCapabilitiesBranch, HIERARCHY_PART.SEAT_CAPABILITIES],
  ['authorizationBranchAmount', tickAuthorizationBranch, HIERARCHY_PART.SEAT_AUTHORIZATION],
  ['workspaceScopeBranchAmount', tickWorkspaceScopeBranch, HIERARCHY_PART.SEAT_WORKSPACE_SCOPE],
  ['taskEvidenceBranchAmount', tickTaskEvidenceBranch, HIERARCHY_PART.SEAT_TASK_EVIDENCE],
];

test('all seven Seat division branches share one deterministic timing engine', () => {
  for (const [amountKey, tick, childId] of branches) {
    const state = createHierarchyRuntime({
      openParentId: 'SEAT_SHELL#0',
      focusedChildId: childId,
      phase: HIERARCHY_PHASE.OPEN,
      openAmount: 1,
    });
    focusChild(state, childId, { nowMs: 100, snap: false, allowTransition: false });
    tick(state, 100 + 2500, false);
    assert.ok(state[amountKey] > 0 && state[amountKey] <= 1, childId);
    tick(state, 100 + 10000, false);
    assert.equal(state[amountKey], 1, childId);
  }
});

test('reduced motion snaps every Seat division branch to fully open', () => {
  for (const [, tick, childId] of branches) {
    const state = createHierarchyRuntime({
      openParentId: 'SEAT_SHELL#0',
      focusedChildId: childId,
      phase: HIERARCHY_PHASE.OPEN,
      openAmount: 1,
    });
    focusChild(state, childId, { nowMs: 100, snap: false, allowTransition: false });
    tick(state, 101, true);
    const amountKey = childId === HIERARCHY_PART.SEAT_CONNECTION ? 'connectionBranchAmount'
      : childId === HIERARCHY_PART.SEAT_BEHAVIOR ? 'behaviorBranchAmount'
      : childId === HIERARCHY_PART.SEAT_TOOLKIT ? 'toolkitBranchAmount'
      : childId === HIERARCHY_PART.SEAT_CAPABILITIES ? 'capabilitiesBranchAmount'
      : childId === HIERARCHY_PART.SEAT_AUTHORIZATION ? 'authorizationBranchAmount'
      : childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE ? 'workspaceScopeBranchAmount'
      : 'taskEvidenceBranchAmount';
    assert.equal(state[amountKey], 1, childId);
  }
});


test('focusChild clears every sibling branch deterministically', () => {
  const state = createHierarchyRuntime({
    openParentId: 'SEAT_SHELL#0',
    focusedChildId: HIERARCHY_PART.SEAT_CONNECTION,
    connectionBranchAmount: 0.9,
    behaviorBranchAmount: 0.7,
    toolkitBranchAmount: 0.6,
    phase: HIERARCHY_PHASE.OPEN,
    openAmount: 1,
  });
  focusChild(state, HIERARCHY_PART.SEAT_TOOLKIT, { nowMs: 250, snap: false, allowTransition: false });
  assert.equal(state.connectionBranchAmount, 0);
  assert.equal(state.behaviorBranchAmount, 0);
  assert.equal(state.toolkitBranchAmount, 0);
  assert.equal(state.toolkitBranchStartMs, 250);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_TOOLKIT);
});
