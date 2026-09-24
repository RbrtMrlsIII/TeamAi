import assert from 'node:assert/strict';
import test from 'node:test';
import {
  MACHINE_SIGNAL_STATE,
  machineSignalVisualProfile,
  resolveMachineSignalState,
} from '../frontend/spatial/machine-signal-state.js';

const edge = {
  semanticEdgeId: 'EDGE:TEST',
  kind: 'inner-spoke',
  sourceBranchId: 'HUB-CORE',
  targetBranchId: 'BRANCH-SEAT-01',
  route: [
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 0, z: 0 },
  ],
};

test('S9 refuses to manufacture signal state without a semantic edge', () => {
  assert.equal(resolveMachineSignalState({ edge: null, state: {} }), null);
});

test('S9 selected Seat edge becomes ACTIVE_SEAT', () => {
  const signal = resolveMachineSignalState({
    edge,
    state: { heroState: 'IDLE' },
    selectedBranchId: 'BRANCH-SEAT-01',
    reducedMotion: true,
  });
  assert.equal(signal.state, MACHINE_SIGNAL_STATE.ACTIVE_SEAT);
  assert.equal(signal.amount, 0.72);
  assert.equal(signal.pulse, 0.72);
});

test('S9 contribution transfer overrides ordinary branch activity', () => {
  const signal = resolveMachineSignalState({
    edge: { ...edge, kind: 'pod-facility' },
    state: { contributionAmount: 0.65 },
    selectedBranchId: 'BRANCH-SEAT-01',
    reducedMotion: true,
  });
  assert.equal(signal.state, MACHINE_SIGNAL_STATE.CONTRIBUTION_TRANSFER);
  assert.equal(signal.direction, 'target');
});

test('S9 workspace reception and lifecycle states remain semantic', () => {
  const receiving = resolveMachineSignalState({
    edge: { ...edge, kind: 'workspace-contribution' },
    state: { workspaceReceptionAmount: 0.8 },
    reducedMotion: true,
  });
  const handoff = resolveMachineSignalState({
    edge,
    state: { heroState: 'HANDOFF' },
    reducedMotion: true,
  });
  assert.equal(receiving.state, MACHINE_SIGNAL_STATE.WORKSPACE_RECEIVING);
  assert.equal(handoff.state, MACHINE_SIGNAL_STATE.HANDOFF_READY);
});

test('S9 blocked and error states fail closed into explicit signal states', () => {
  const blocked = resolveMachineSignalState({ edge, state: { blocked: true }, reducedMotion: true });
  const error = resolveMachineSignalState({ edge, state: { heroState: 'ERROR' }, reducedMotion: true });
  assert.equal(blocked.state, MACHINE_SIGNAL_STATE.BLOCKED);
  assert.equal(error.state, MACHINE_SIGNAL_STATE.ERROR);
  assert.equal(machineSignalVisualProfile(blocked).speed, 0);
});

test('S9 reduced motion preserves state while removing continuous pulse movement', () => {
  const full = resolveMachineSignalState({
    edge,
    state: { heroState: 'ABSORB' },
    selectedBranchId: 'BRANCH-SEAT-01',
    reducedMotion: false,
    now: 1500,
  });
  const reduced = resolveMachineSignalState({
    edge,
    state: { heroState: 'ABSORB' },
    selectedBranchId: 'BRANCH-SEAT-01',
    reducedMotion: true,
    now: 1500,
  });
  assert.equal(full.state, reduced.state);
  assert.equal(reduced.pulse, reduced.amount);
});
