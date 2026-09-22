import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveMachineTransformationChoreography,
  MACHINE_CHOREOGRAPHY_PHASE,
} from '../frontend/spatial/machine-choreography.js';

test('machine choreography follows the connected hierarchy progression', () => {
  const stowed = deriveMachineTransformationChoreography();
  const shell = deriveMachineTransformationChoreography({
    shellAmount: 0.5,
    hierarchyOpen: true,
    divisionAmount: 0,
  });
  const division = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 0.4,
  });
  const linking = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 1,
    focusedChildId: 'SEAT_BEHAVIOR',
  });
  const electrical = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 1,
    connectionAmount: 0.82,
    focusedChildId: 'SEAT_CONNECTION',
  });
  const settled = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 1,
    connectionAmount: 1,
    focusedChildId: 'SEAT_CONNECTION',
  });

  assert.equal(stowed.phase, MACHINE_CHOREOGRAPHY_PHASE.STOWED);
  assert.equal(shell.phase, MACHINE_CHOREOGRAPHY_PHASE.SHELL_DEPLOYING);
  assert.equal(division.phase, MACHINE_CHOREOGRAPHY_PHASE.DIVISION_DEPLOYING);
  assert.equal(linking.phase, MACHINE_CHOREOGRAPHY_PHASE.TOPOLOGY_LINKING);
  assert.equal(electrical.phase, MACHINE_CHOREOGRAPHY_PHASE.ELECTRICAL_TRANSFER);
  assert.ok(settled.workspaceReception > 0);
  assert.equal(settled.phase, MACHINE_CHOREOGRAPHY_PHASE.SETTLED);
});

test('reduced motion preserves semantic amounts while collapsing only incidental animation', () => {
  const full = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 1,
    connectionAmount: 0.8,
    focusedChildId: 'SEAT_CONNECTION',
    reducedMotion: false,
  });
  const reduced = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: true,
    divisionAmount: 1,
    connectionAmount: 0.8,
    focusedChildId: 'SEAT_CONNECTION',
    reducedMotion: true,
  });
  assert.equal(full.electrical, reduced.electrical);
  assert.equal(full.workspaceReception, reduced.workspaceReception);
  assert.equal(reduced.reducedMotion, true);
});


test('Hero lifecycle contributes to R0 reception without changing hierarchy ownership', () => {
  const contributing = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: false,
    heroState: 'CONTRIBUTE',
    contributionAmount: 0.5,
  });
  const absorbing = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: false,
    heroState: 'ABSORB',
    contributionAmount: 1,
  });
  const reflected = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: false,
    heroState: 'REFLECT',
    contributionAmount: 1,
  });
  const handoff = deriveMachineTransformationChoreography({
    shellAmount: 1,
    hierarchyOpen: false,
    heroState: 'HANDOFF',
    contributionAmount: 1,
  });
  assert.equal(contributing.phase, MACHINE_CHOREOGRAPHY_PHASE.CONTRIBUTING);
  assert.equal(contributing.lifecycleReception, 0.5);
  assert.equal(absorbing.phase, MACHINE_CHOREOGRAPHY_PHASE.ABSORBING);
  assert.equal(absorbing.lifecycleReception, 1);
  assert.equal(reflected.phase, MACHINE_CHOREOGRAPHY_PHASE.REFLECTING);
  assert.equal(handoff.phase, MACHINE_CHOREOGRAPHY_PHASE.HANDOFF_READY);
});
