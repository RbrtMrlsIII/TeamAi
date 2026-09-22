import assert from 'node:assert/strict';
import test from 'node:test';
import {
  HIERARCHY_PART,
  SEAT_DIVISION_CONFIG_COMMANDS,
  resolveSeatDivisionConfigCommand,
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
  getSeatDivisionBranchAmounts,
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
  assert.equal(state.toolkitBranchAmount, 0.15);
  assert.equal(state.toolkitBranchStartMs, 250);
  assert.equal(state.focusedChildId, HIERARCHY_PART.SEAT_TOOLKIT);
});


test('Seat division command contract maps each key to exactly one semantic child', () => {
  assert.equal(SEAT_DIVISION_CONFIG_COMMANDS.length, 7);
  assert.equal(new Set(SEAT_DIVISION_CONFIG_COMMANDS.map((entry) => entry.key)).size, 7);
  for (const entry of SEAT_DIVISION_CONFIG_COMMANDS) {
    assert.equal(resolveSeatDivisionConfigCommand(entry.key), entry);
    assert.equal(typeof entry.request, 'function');
    assert.ok(entry.targetSection);
    assert.ok(entry.childId);
  }
});

test('aggregate branch amounts use canonical branch amount keys', () => {
  const state = createHierarchyRuntime({
    openParentId: 'SEAT_SHELL#0',
    focusedChildId: HIERARCHY_PART.SEAT_CONNECTION,
    phase: HIERARCHY_PHASE.OPEN,
    openAmount: 1,
    connectionBranchAmount: 1,
    behaviorBranchAmount: 0.4,
  });
  const amounts = getSeatDivisionBranchAmounts(state);
  assert.equal(amounts.connectionBranchAmount, 1);
  assert.equal(amounts.behaviorBranchAmount, 0.4);
  assert.equal(amounts.SEAT_CONNECTION, undefined);
  assert.equal(amounts.SEAT_BEHAVIOR, undefined);
});
