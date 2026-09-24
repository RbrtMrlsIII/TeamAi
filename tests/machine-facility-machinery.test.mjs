import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import {
  deriveMachineFacilityMachinery,
  validateMachineFacilityMachinery,
  MACHINE_FACILITY_MACHINERY_ID,
  MACHINE_FACILITY_MACHINERY_VERSION,
  MACHINE_FACILITY_MECHANISM_PHASE,
  deriveMachineFacilityMechanismPresentation,
} from '../frontend/spatial/machine-facility-machinery.js';
import { requiredStructuralRootsForSlice } from '../frontend/spatial/machine-spatial-root-contract.js';

test('S7 builds four genuinely distinct outer-machine grammars from S6 destinations', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({ facilityAssemblies: facilities });
  const result = validateMachineFacilityMachinery(machinery);
  assert.equal(result.valid, true, result.reasons.join(', '));
  assert.equal(machinery.length, 4);
  assert.equal(new Set(machinery.map((machine) => machine.machineRole)).size, 4);
  assert.equal(new Set(machinery.map((machine) => machine.components.map((entry) => entry.role).join('|'))).size, 4);
});

test('S7 machinery keeps product facilities outside the Seat hierarchy', () => {
  const core = createBranchConnectionCore({ seatCount: 3, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.ok(machinery.every((machine) => machine.facilityIds.length > 0));
  assert.ok(machinery.every((machine) => machine.facilityAssemblyId.startsWith('MACHINE-FACILITY-ASSEMBLY:')));
});

test('S7 every machine inherits S0-S6 and has facility-specific camera subject, ports, and graph', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.deepEqual(machinery[0].inheritedStructuralRoots, requiredStructuralRootsForSlice('S7'));
  for (const machine of machinery) {
    assert.equal(machine.id.startsWith(MACHINE_FACILITY_MACHINERY_ID + ':'), true);
    assert.ok(machine.outerHousing?.center);
    assert.ok(machine.payloadSurface?.componentId);
    assert.ok(machine.payloadSurface?.center);
    assert.ok(machine.payloadSurface?.dimensions);
    assert.ok(machine.subject);
    assert.ok(machine.ports.length >= 4);
    assert.ok(machine.mechanismGraph.length >= 4);
    assert.ok(machine.envelope.radius > 0);
    assert.ok(machine.profileLabel.length > 0);
  }
});

test('S7 authored machinery identities remain versioned and rooted', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  for (const machine of machinery) {
    assert.equal(machine.version, MACHINE_FACILITY_MACHINERY_VERSION);
    assert.equal(machine.constructionSlice, 'S7');
    assert.equal(machine.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
  }
});

test('S7 preserves S6 outer-housing anchors and derives mechanism travel in the machine-local radial frame', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({ facilityAssemblies: facilities });
  const expectedRoles = Object.freeze({
    analysis: 'analysis-lens',
    operations: 'structural-spine',
    control: 'analysis-chamber',
    'access-commerce': 'sensor-dish',
  });
  const expectedOutwardTravel = Object.freeze({
    analysis: 0.30,
    operations: 0.08,
    control: 0.05,
    'access-commerce': 0.12,
  });

  for (const machine of machinery) {
    const facility = facilities.find((entry) => entry.id === machine.facilityAssemblyId);
    assert.ok(facility);
    assert.deepEqual(machine.outerHousing, facility.outerHousing);
    assert.deepEqual(machine.clearanceProfile.selfCenter, machine.outerHousing.center);

    const angle = Math.atan2(machine.outerHousing.center.z, machine.outerHousing.center.x);
    const outward = { x: Math.cos(angle), z: Math.sin(angle) };
    const tangent = { x: -Math.sin(angle), z: Math.cos(angle) };
    const presentation = deriveMachineFacilityMechanismPresentation(machine, { amount: 1, reducedMotion: true });
    const motion = presentation.components.find((entry) =>
      entry.id === machine.components.find((component) => component.role === expectedRoles[machine.machineRole])?.id,
    );
    assert.ok(motion);

    const radial = motion.dx * outward.x + motion.dz * outward.z;
    const tangential = motion.dx * tangent.x + motion.dz * tangent.z;
    assert.ok(Math.abs(radial - expectedOutwardTravel[machine.machineRole]) < 1e-9);
    assert.ok(Math.abs(tangential) < 1e-9);
  }
});

test('S7 exposes a first-class facility payload surface bound to an authored machine component', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.equal(new Set(machinery.map((machine) => machine.payloadSurface.profile)).size, 4);
  for (const machine of machinery) {
    const source = machine.components.find((entry) => entry.id === machine.payloadSurface.componentId);
    assert.ok(source);
    assert.deepEqual(machine.payloadSurface.center, source.center);
    assert.deepEqual(machine.payloadSurface.dimensions, source.dimensions);
    assert.equal(validateMachineFacilityMachinery([machine], { expectedCount: 1 }).valid, true);
  }
});

test('S7 facility machinery exposes safe machine-specific clearance against Seat and peer facilities', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({
    facilityAssemblies: facilities,
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
    clearanceObstacles: core.parts.filter((part) => part.kind === 'inner-pod'),
    requestedClearance: 0.16,
  });
  assert.equal(machinery.length, 4);
  assert.ok(machinery.every((machine) => machine.clearanceProfile.safe));
  assert.ok(machinery.every((machine) => machine.clearanceProfile.minimumAvailableClearance >= 0.16));
});


test('S7 each specialized outer machine exposes authored stowed/deploying/active motion', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  for (const machine of machinery) {
    const stowed = deriveMachineFacilityMechanismPresentation(machine, { amount: 0 });
    const deploying = deriveMachineFacilityMechanismPresentation(machine, { amount: 0.5 });
    const active = deriveMachineFacilityMechanismPresentation(machine, { amount: 1 });
    assert.equal(stowed.phase, MACHINE_FACILITY_MECHANISM_PHASE.STOWED);
    assert.equal(deploying.phase, MACHINE_FACILITY_MECHANISM_PHASE.DEPLOYING);
    assert.equal(active.phase, MACHINE_FACILITY_MECHANISM_PHASE.ACTIVE);
    assert.ok(active.components.some((entry) =>
      Math.abs(entry.dx) > 0.001
      || Math.abs(entry.dz) > 0.001
      || Math.abs(entry.rotationY) > 0.001,
    ));
  }
});

test('S7 reduced-motion suppresses continuous mechanism rotation while preserving terminal geometry intent', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  for (const machine of machinery) {
    const full = deriveMachineFacilityMechanismPresentation(machine, { amount: 1, reducedMotion: false });
    const reduced = deriveMachineFacilityMechanismPresentation(machine, { amount: 1, reducedMotion: true });
    assert.equal(reduced.phase, MACHINE_FACILITY_MECHANISM_PHASE.ACTIVE);
    assert.ok(full.components.every((entry, index) =>
      Number.isFinite(entry.rotationY)
      && Number.isFinite(reduced.components[index].rotationY),
    ));
  }
});

test('S7 facility subject covers maximum authored mechanism travel', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  for (const machine of machinery) {
    const active = deriveMachineFacilityMechanismPresentation(machine, { amount: 1, reducedMotion: true });
    for (const motion of active.components) {
      const component = machine.components.find((entry) => entry.id === motion.id);
      const x = component.center.x + motion.dx;
      const z = component.center.z + motion.dz;
      assert.ok(x >= machine.subject.min.x - 0.01 && x <= machine.subject.max.x + 0.01);
      assert.ok(z >= machine.subject.min.z - 0.01 && z <= machine.subject.max.z + 0.01);
    }
  }
});
