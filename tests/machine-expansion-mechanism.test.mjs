import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  MACHINE_EXPANSION_PHASE,
  createMachineExpansionMechanism,
  deriveMachineExpansionClearancePlan,
  deriveMachineSeatDivisionExpansionPlan,
  resolveMachineExpansionAmount,
  subjectAtExpansionAmount,
  resolveMachineFocusedExpansionPhase,
  toMachineDisplayState,
} from '../frontend/spatial/machine-expansion-mechanism.js';
test('S5 emits PREPARING before travel while preserving the existing display vocabulary', () => {
  const mechanism = createMachineExpansionMechanism({ duration: 1000 });
  mechanism.setTarget(true, 0);
  const preparing = mechanism.sample(0);
  assert.equal(preparing.phase, MACHINE_EXPANSION_PHASE.PREPARING);
  assert.equal(preparing.amount, 0);
  assert.equal(toMachineDisplayState(preparing.phase, preparing.amount), 'opening');
});


import { deriveMachineSeatDivisionAssembly } from '../frontend/spatial/machine-seat-division-assembly.js';
import { requiredStructuralRootsForSlice } from '../frontend/spatial/machine-spatial-root-contract.js';
import { deriveFocusedSeatDivisionGeometry } from '../frontend/spatial/machine-seat-division-presentation.js';

const parent = () => createBranchConnectionCore({ seatCount: 10 }).byBranch.get('BRANCH-SEAT-01');
const divisionGeometry = (amount) =>
  deriveFocusedSeatDivisionGeometry({
    parent: parent(),
    childId: 'SEAT_TOOLKIT',
    childIndex: 2,
    amount,
  });

test('S5 preserves the established machine HUD vocabulary while exposing richer internal phases', () => {
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.CLOSED, 0), 'collapsed');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.PREPARING, 0.01), 'opening');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.OPENING, 0.4), 'opening');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.ACTIVE, 1), 'expanded');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.CLOSING, 0.4), 'closing');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED, 0.7), 'opening');
  assert.equal(toMachineDisplayState(MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED, 1), 'expanded');
});

test('S5 focused expansion phase reflects hierarchy closing and clearance limiting without owning semantic state', () => {
  assert.equal(
    resolveMachineFocusedExpansionPhase({
      rawAmount: 0,
      resolvedAmount: 0,
      hierarchyPhase: 'rest',
    }),
    MACHINE_EXPANSION_PHASE.CLOSED,
  );
  assert.equal(
    resolveMachineFocusedExpansionPhase({
      rawAmount: 1,
      resolvedAmount: 0.75,
      hierarchyPhase: 'open',
    }),
    MACHINE_EXPANSION_PHASE.CLEARANCE_LIMITED,
  );
  assert.equal(
    resolveMachineFocusedExpansionPhase({
      rawAmount: 0.4,
      resolvedAmount: 0.4,
      hierarchyPhase: 'division_closing',
    }),
    MACHINE_EXPANSION_PHASE.CLOSING,
  );
  assert.equal(
    resolveMachineFocusedExpansionPhase({
      rawAmount: 1,
      resolvedAmount: 1,
      hierarchyPhase: 'open',
      reducedMotion: true,
    }),
    MACHINE_EXPANSION_PHASE.ACTIVE,
  );
});

test('S5 controller exposes one target authority and clears interruption evidence after observation', () => {
  const mechanism = createMachineExpansionMechanism({ duration: 1000 });
  mechanism.setTarget(true, 0);
  mechanism.sample(400);
  const interrupted = mechanism.setTarget(false, 400);
  assert.equal(interrupted.interrupted, true);
  const observed = mechanism.sample(500);
  assert.equal(observed.interrupted, true);
  assert.equal(mechanism.sample(600).interrupted, false);
});

test('S5 controller preserves interrupted opening and closing from current amount', () => {
  const mechanism = createMachineExpansionMechanism({ duration: 1000 });
  mechanism.setTarget(true, 0);
  const opening = mechanism.sample(400);
  assert.equal(opening.phase, MACHINE_EXPANSION_PHASE.OPENING);
  assert.ok(opening.amount > 0 && opening.amount < 1);
  mechanism.setTarget(false, 400);
  const closing = mechanism.sample(650);
  assert.equal(closing.phase, MACHINE_EXPANSION_PHASE.CLOSING);
  assert.ok(closing.amount < opening.amount);
  mechanism.setTarget(true, 650);
  const reopening = mechanism.sample(800);
  assert.equal(reopening.phase, MACHINE_EXPANSION_PHASE.OPENING);
  assert.ok(reopening.amount > 0);
});

test('S5 reduced motion preserves semantic target without continuous travel', () => {
  const mechanism = createMachineExpansionMechanism({ duration: 1000 });
  mechanism.setTarget(true, 0);
  const reduced = mechanism.sample(10, { reducedMotion: true });
  assert.equal(reduced.phase, MACHINE_EXPANSION_PHASE.ACTIVE);
  assert.equal(reduced.amount, 1);
});

test('S5 clearance planner returns a safe authored amount when an obstacle blocks full travel', () => {
  const start = { min: { x: 0, y: 0, z: 0 }, max: { x: 1, y: 1, z: 1 }, center: { x: 0.5, y: 0.5, z: 0.5 } };
  const end = { min: { x: 4, y: 0, z: 0 }, max: { x: 5, y: 1, z: 1 }, center: { x: 4.5, y: 0.5, z: 0.5 } };
  const obstacle = { min: { x: 2.4, y: -1, z: -1 }, max: { x: 3.2, y: 2, z: 2 } };
  const plan = deriveMachineExpansionClearancePlan({
    startSubject: start,
    endSubject: end,
    obstacles: [obstacle],
    clearance: 0.1,
  });
  assert.equal(plan.valid, true);
  assert.ok(plan.maxSafeAmount > 0 && plan.maxSafeAmount < 1);
  assert.equal(plan.collision, true);
  const resolved = resolveMachineExpansionAmount(1, { clearancePlan: plan });
  assert.equal(resolved, plan.maxSafeAmount);
});

test('S5 division plan derives travel from authored S4 geometry rather than a fixed distance', () => {
  const p = deriveMachineSeatDivisionExpansionPlan({
    parent: parent(),
    childId: 'SEAT_TOOLKIT',
    childIndex: 2,
    clearance: 0.16,
  });
  assert.ok(p);
  assert.ok(p.payloadDrivenTravel);
  assert.ok(p.clearancePlan.travelDistance > 0);
  assert.ok(p.corridorReserved);
  assert.equal(p.startAssembly.semanticId, 'SEAT_TOOLKIT');
  assert.equal(p.endAssembly.semanticId, 'SEAT_TOOLKIT');
});

test('S5 physical expansion plan inherits the complete predecessor root contract', () => {
  const p = deriveMachineSeatDivisionExpansionPlan({
    parent: parent(),
    childId: 'SEAT_TOOLKIT',
    childIndex: 2,
    clearance: 0.16,
  });
  assert.deepEqual(
    p.inheritedStructuralRoots,
    requiredStructuralRootsForSlice('S5'),
  );
  const subject = subjectAtExpansionAmount(p, 0.4);
  assert.deepEqual(
    subject.inheritedStructuralRoots,
    requiredStructuralRootsForSlice('S5'),
  );
});

test('S5 resolved amount feeds a recomputed semantic subject', () => {
  const p = deriveMachineSeatDivisionExpansionPlan({
    parent: parent(),
    childId: 'SEAT_CONNECTION',
    childIndex: 0,
    clearance: 0.16,
  });
  const amount = resolveMachineExpansionAmount(0.5, p);
  const subject = subjectAtExpansionAmount(p, amount);
  assert.ok(subject);
  assert.equal(subject.sourcePartIds.length, p.startAssembly.subject.sourcePartIds.length);
  assert.ok(subject.center.x !== undefined && subject.center.z !== undefined);
});

test('S5 full Seat-density expansion stays clear of all authored outer facilities', () => {
  const divisions = [
    'SEAT_CONNECTION',
    'SEAT_BEHAVIOR',
    'SEAT_TOOLKIT',
    'SEAT_CAPABILITIES',
    'SEAT_AUTHORIZATION',
    'SEAT_WORKSPACE_SCOPE',
    'SEAT_TASK_EVIDENCE',
  ];

  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount });
    const seats = core.parts.filter((part) => part.kind === 'inner-pod');
    const obstacles = core.parts.filter((part) => part.kind === 'outer-housing');

    for (const seat of seats) {
      for (const [childIndex, childId] of divisions.entries()) {
        const plan = deriveMachineSeatDivisionExpansionPlan({
          parent: seat,
          childId,
          childIndex,
          obstacles,
          clearance: 0.16,
        });

        assert.ok(
          plan?.clearancePlan?.clearanceSatisfiedAtClosed,
          `closed clearance rejected: seats=${seatCount}, ${seat.branchId}, ${childId}`,
        );
        assert.equal(
          plan?.clearancePlan?.collision,
          false,
          `full expansion collision: seats=${seatCount}, ${seat.branchId}, ${childId}`,
        );
        assert.equal(
          plan?.clearancePlan?.maxSafeAmount,
          1,
          `full expansion was limited: seats=${seatCount}, ${seat.branchId}, ${childId}`,
        );
      }
    }
  }
});

test('S5 real Seat-01 envelope plans are bounded against the existing outer facility ring', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const seat = core.byBranch.get('BRANCH-SEAT-01');
  const outer = core.parts.filter((part) => part.kind === 'outer-housing');
  for (const childId of ['SEAT_CONNECTION','SEAT_BEHAVIOR','SEAT_TOOLKIT','SEAT_CAPABILITIES','SEAT_AUTHORIZATION','SEAT_WORKSPACE_SCOPE','SEAT_TASK_EVIDENCE']) {
    const childIndex = ['SEAT_CONNECTION','SEAT_BEHAVIOR','SEAT_TOOLKIT','SEAT_CAPABILITIES','SEAT_AUTHORIZATION','SEAT_WORKSPACE_SCOPE','SEAT_TASK_EVIDENCE'].indexOf(childId);
    const plan = deriveMachineSeatDivisionExpansionPlan({
      parent: seat,
      childId,
      childIndex,
      obstacles: outer,
      clearance: 0.16,
    });
    assert.ok(plan);
    assert.ok(plan.clearancePlan.maxSafeAmount <= 1);
    if (plan.clearancePlan.collision) assert.ok(plan.clearancePlan.maxSafeAmount < 1);
  }
});
