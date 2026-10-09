import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineFacilityAssemblies } from '../frontend/spatial/machine-facility-assembly.js';
import { deriveMachineWorldFacilityShellDescriptors } from '../frontend/spatial/machine-world-facility-shell.js';
import {
  deriveMachineFacilityMachinery,
  validateMachineFacilityMachinery,
  MACHINE_FACILITY_MACHINERY_ID,
  MACHINE_FACILITY_MACHINERY_VERSION,
  MACHINE_FACILITY_MECHANISM_PHASE,
  deriveMachineFacilityMechanismPresentation,
  deriveMachineFacilityPhysicalInterfaces,
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

test('S7 analysis machine uses authored nested telescope barrel footprints and collars', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const analysis = machinery.find((machine) => machine.machineRole === 'analysis');
  assert.ok(analysis);

  const expectedSides = Object.freeze({
    'barrel-stage-1': 12,
    'barrel-stage-2': 10,
    'barrel-stage-3': 8,
  });

  for (const [role, expectedLength] of Object.entries(expectedSides)) {
    const part = analysis.components.find((entry) => entry.role === role);
    assert.ok(part, role);
    assert.equal(part.profile, 'analysis-telescope-' + role.replace(/^barrel-/, ''));
    assert.ok(Array.isArray(part.outline));
    assert.equal(part.outline.length, expectedLength);

    let area = 0;
    const turns = [];
    for (let index = 0; index < part.outline.length; index += 1) {
      const a = part.outline[index];
      const b = part.outline[(index + 1) % part.outline.length];
      const c = part.outline[(index + 2) % part.outline.length];
      area += a[0] * b[1] - b[0] * a[1];
      turns.push(
        (b[0] - a[0]) * (c[1] - b[1])
        - (b[1] - a[1]) * (c[0] - b[0]),
      );
      assert.ok(Math.hypot(a[0], a[1]) <= 1.000001);
    }
    assert.ok(area > 0);
    assert.ok(Math.min(...turns) > 0);
  }

  assert.equal(
    analysis.mechanicalDetails.filter((entry) => entry.role.startsWith('barrel-collar-')).length,
    2,
  );
  assert.equal(analysis.mechanicalDetails.length, 17);
  const control = machinery.find((machine) => machine.machineRole === 'control');
  const access = machinery.find((machine) => machine.machineRole === 'access-commerce');
  assert.ok(control && access);
  assert.equal(control.mechanicalDetails.length, 19);
  assert.equal(access.mechanicalDetails.length, 22);
});

test('S7 analysis telescope exposes fixed guide rails within the authored housing envelope', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const analysis = machinery.find((machine) => machine.machineRole === 'analysis');
  assert.ok(analysis);

  const center = analysis.outerHousing.center;
  const dims = analysis.outerHousing.dimensions;
  const angle = Math.atan2(center.z, center.x);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const rails = analysis.mechanicalDetails.filter((entry) => entry.role === 'barrel-guide-rail');

  assert.equal(rails.length, 2);
  for (const rail of rails) {
    assert.equal(rail.shape, 'BOX');
    assert.equal(rail.parentRole, 'barrel-stage-1');
    assert.equal(rail.materialRole, 'metal2');
    assert.equal(rail.constructionSlice, 'S7');
    assert.equal(rail.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');

    const halfHousingX = dims.x * 0.5;
    const halfHousingZ = dims.z * 0.5;
    const halfRailX = rail.dimensions.x * 0.5;
    const halfRailZ = rail.dimensions.z * 0.5;
    const localCorners = [
      [-halfRailX, -halfRailZ],
      [-halfRailX, halfRailZ],
      [halfRailX, -halfRailZ],
      [halfRailX, halfRailZ],
    ];

    for (const [localX, localZ] of localCorners) {
      const worldX = rail.center.x + cos * localX + sin * localZ;
      const worldZ = rail.center.z - sin * localX + cos * localZ;
      assert.ok(Math.abs(worldX - center.x) <= halfHousingX - 0.03 + 1e-9);
      assert.ok(Math.abs(worldZ - center.z) <= halfHousingZ - 0.03 + 1e-9);
    }
  }

  assert.equal(
    analysis.mechanicalDetails.filter((entry) => entry.role === 'barrel-guide-rail').length,
    2,
  );
  assert.equal(analysis.mechanicalDetails.length, 17);
});

test('S7 operations fins use bounded authored convex silhouettes', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const operations = machinery.find((machine) => machine.machineRole === 'operations');
  assert.ok(operations);

  const expected = {
    'deployment-fin': 'operations-fin-primary',
    'deployment-fin-secondary': 'operations-fin-secondary',
  };

  for (const [role, profile] of Object.entries(expected)) {
    const fin = operations.components.find((entry) => entry.role === role);
    assert.ok(fin);
    assert.equal(fin.profile, profile);
    assert.ok(Array.isArray(fin.outline));
    assert.equal(fin.outline.length, 9);

    const xs = fin.outline.map((point) => point[0]);
    const zs = fin.outline.map((point) => point[1]);
    assert.ok(Math.abs(Math.min(...xs) + 1) <= 1e-9);
    assert.ok(Math.abs(Math.max(...xs) - 1) <= 1e-9);
    assert.ok(Math.abs(Math.min(...zs) + 1) <= 1e-9);
    assert.ok(Math.abs(Math.max(...zs) - 1) <= 1e-9);

    let signedArea2 = 0;
    const turns = [];
    for (let index = 0; index < fin.outline.length; index += 1) {
      const a = fin.outline[index];
      const b = fin.outline[(index + 1) % fin.outline.length];
      const c = fin.outline[(index + 2) % fin.outline.length];
      signedArea2 += a[0] * b[1] - b[0] * a[1];
      turns.push(
        (b[0] - a[0]) * (c[1] - b[1])
        - (b[1] - a[1]) * (c[0] - b[0]),
      );
      assert.ok(Math.hypot(a[0], a[1]) <= Math.SQRT2 + 1e-9);
    }
    assert.ok(signedArea2 > 0);
    assert.ok(Math.min(...turns) > 0);
  }
});

test('S7 raw Hero and Three adapter expose the authored operations fin profile', () => {
  const renderer = readFileSync(
    'frontend/spatial/machine-world-renderer.js',
    'utf8',
  );
  const publicRenderer = readFileSync(
    'public/machine-world-renderer.js',
    'utf8',
  );
  const operations = readFileSync(
    'frontend/spatial/machine-facility-machinery.js',
    'utf8',
  );
  const adapter = readFileSync(
    'frontend/spatial/machine-three-scene-adapter.js',
    'utf8',
  );

  assert.match(operations, /operations-fin-primary/);
  assert.match(operations, /operations-fin-secondary/);
  assert.match(renderer, /FACILITY_FIN_PRIMARY/);
  assert.match(renderer, /FACILITY_FIN_SECONDARY/);
  assert.match(renderer, /FACILITY_SENSOR_DISH/);
  assert.match(operations, /access-sensor-dish/);
  assert.match(adapter, /buildExtrudedPolygonGeometry\(THREE, descriptor, descriptor\.outline\)/);
  assert.equal(publicRenderer, renderer);
});

test('S7 operations machine exposes paired fin actuator housings inside the fin assembly', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const operations = machinery.find((machine) => machine.machineRole === 'operations');
  assert.ok(operations);

  const expected = {
    'fin-actuator-primary': 'deployment-fin',
    'fin-actuator-secondary': 'deployment-fin-secondary',
  };

  const center = operations.outerHousing.center;
  const dimensions = operations.outerHousing.dimensions;
  const angle = Math.atan2(center.z, center.x);
  const housingBoundary = 1 / (
    Math.abs(Math.cos(angle)) / (Math.abs(dimensions.x) * 0.5)
    + Math.abs(Math.sin(angle)) / (Math.abs(dimensions.z) * 0.5)
  );

  for (const [role, parentRole] of Object.entries(expected)) {
    const actuator = operations.mechanicalDetails.find((entry) => entry.role === role);
    assert.ok(actuator);
    assert.equal(actuator.profile, 'operations-' + role);
    assert.equal(actuator.shape, 'BOX');
    assert.equal(actuator.parentRole, parentRole);
    assert.equal(actuator.constructionSlice, 'S7');
    assert.equal(actuator.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
    assert.ok(operations.subject.sourcePartIds.includes(actuator.id));

    const localX = actuator.center.x - center.x;
    const localZ = actuator.center.z - center.z;
    const radialReach = Math.hypot(actuator.dimensions.x, actuator.dimensions.z) * 0.5;
    assert.ok(
      Math.hypot(localX, localZ) + radialReach <= housingBoundary - 0.03 + 1e-9,
      role + ':housing-bound',
    );
  }

  assert.equal(
    operations.mechanicalDetails.filter((entry) => entry.role.startsWith('fin-actuator-')).length,
    2,
  );
});

test('S7 operations machine exposes layered fin caps and actuator rails inside fin envelopes', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const operations = machinery.find((machine) => machine.machineRole === 'operations');
  assert.ok(operations);

  const primary = operations.components.find((entry) => entry.role === 'deployment-fin');
  const secondary = operations.components.find((entry) => entry.role === 'deployment-fin-secondary');
  assert.equal(primary?.profile, 'operations-fin-primary');
  assert.equal(secondary?.profile, 'operations-fin-secondary');

  const parentByRole = Object.freeze({
    'deployment-fin-primary-cap': primary,
    'deployment-fin-primary-rail': primary,
    'deployment-fin-secondary-cap': secondary,
    'deployment-fin-secondary-rail': secondary,
  });

  const expectedRoles = Object.freeze(Object.keys(parentByRole));
  for (const role of expectedRoles) {
    const detail = operations.mechanicalDetails.find((entry) => entry.role === role);
    assert.ok(detail, role);
    const parent = parentByRole[role];
    assert.ok(parent);

    const detailReach = Math.hypot(detail.dimensions.x, detail.dimensions.z) * 0.5;
    const parentReach = Math.hypot(parent.dimensions.x, parent.dimensions.z) * 0.5;
    const centerDistance = Math.hypot(
      detail.center.x - parent.center.x,
      detail.center.z - parent.center.z,
    );
    assert.ok(centerDistance + detailReach <= parentReach + 1e-9);

    assert.equal(detail.constructionSlice, 'S7');
    assert.equal(detail.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
  }

  assert.equal(
    operations.mechanicalDetails.filter((entry) => entry.role.startsWith('deployment-fin-')).length,
    4,
  );
  assert.equal(operations.mechanicalDetails.length, 19);
});


test('S7 control machine exposes paired rotor-drive links across the 1-10 Seat housing matrix', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
    const machinery = deriveMachineFacilityMachinery({
      outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
    });
    const control = machinery.find((machine) => machine.machineRole === 'control');
    assert.ok(control);

    const center = control.outerHousing.center;
    const dimensions = control.outerHousing.dimensions;
    const angle = Math.atan2(center.z, center.x);
    const housingBoundary = 1 / (
      Math.abs(Math.cos(angle)) / (Math.abs(dimensions.x) * 0.5)
      + Math.abs(Math.sin(angle)) / (Math.abs(dimensions.z) * 0.5)
    );

    const links = control.mechanicalDetails.filter((entry) => entry.role === 'rotor-drive-link');
    assert.equal(links.length, 2);

    for (const link of links) {
      assert.equal(link.profile, 'control-rotor-drive-link');
      assert.equal(link.shape, 'BOX');
      assert.equal(link.parentRole, 'rotor-hub');
      assert.equal(link.constructionSlice, 'S7');
      assert.equal(link.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
      assert.ok(control.subject.sourcePartIds.includes(link.id));

      const radialDistance = Math.hypot(link.center.x - center.x, link.center.z - center.z);
      const radialReach = Math.hypot(link.dimensions.x, link.dimensions.z) * 0.5;
      assert.ok(
        radialDistance + radialReach <= housingBoundary - 0.03 + 1e-9,
        seatCount + '-seat:' + link.role + ':housing-bound',
      );
    }
  }
});

test('S7 control and access families expose nested retainers with independent housing bounds', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.equal(MACHINE_FACILITY_MACHINERY_VERSION, 'S7-V19');

  const expected = Object.freeze({
    control: Object.freeze({
      roles: Object.freeze({
        'rotor-bearing-block': 2,
        'rotor-drive-link': 2,
        'chamber-retainer': 1,
        'chamber-clamp-ring': 1,
      }),
    }),
    'access-commerce': Object.freeze({
      roles: Object.freeze({
        'mast-foot-collar': 1,
        'dish-yoke': 2,
        'antenna-base-plate': 1,
      }),
    }),
  });

  for (const [machineRole, contract] of Object.entries(expected)) {
    const machine = machinery.find((entry) => entry.machineRole === machineRole);
    assert.ok(machine, machineRole);
    const center = machine.outerHousing.center;
    const dimensions = machine.outerHousing.dimensions;
    const angle = Math.atan2(center.z, center.x);
    const housingBoundary = 1 / (
      Math.abs(Math.cos(angle)) / (Math.abs(dimensions.x) * 0.5)
      + Math.abs(Math.sin(angle)) / (Math.abs(dimensions.z) * 0.5)
    );

    for (const [role, expectedCount] of Object.entries(contract.roles)) {
      const details = machine.mechanicalDetails.filter((entry) => entry.role === role);
      assert.equal(details.length, expectedCount, machineRole + ':' + role);
      for (const detail of details) {
        const radialDistance = Math.hypot(
          detail.center.x - center.x,
          detail.center.z - center.z,
        );
        const radialReach = Math.hypot(detail.dimensions.x, detail.dimensions.z) * 0.5;
        assert.ok(
          radialDistance + radialReach <= housingBoundary - 0.03 + 1e-9,
          machineRole + ':' + role + ':housing-bound',
        );
        assert.equal(detail.constructionSlice, 'S7');
        assert.equal(detail.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
        assert.ok(machine.subject.sourcePartIds.includes(detail.id));
      }
    }
  }
});

test('S7 access-commerce sensor array exposes nested boom, panel-clamp, and antenna pivot construction', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount, expansionAmount: 0 });
    const machinery = deriveMachineFacilityMachinery({
      outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
    });
    const access = machinery.find((machine) => machine.machineRole === 'access-commerce');
    assert.ok(access);

    const dish = access.components.find((entry) => entry.role === 'sensor-dish');
    assert.ok(dish);
    assert.equal(dish.shape, 'FACILITY_SENSOR_DISH');
    assert.equal(dish.profile, 'access-sensor-dish');

    const expected = Object.freeze({
      'sensor-boom': 2,
      'sensor-panel-clamp': 2,
      'antenna-pivot-collar': 1,
    });
    const center = access.outerHousing.center;
    const dimensions = access.outerHousing.dimensions;
    const angle = Math.atan2(center.z, center.x);
    const housingBoundary = 1 / (
      Math.abs(Math.cos(angle)) / (Math.abs(dimensions.x) * 0.5)
      + Math.abs(Math.sin(angle)) / (Math.abs(dimensions.z) * 0.5)
    );

    for (const [role, expectedCount] of Object.entries(expected)) {
      const details = access.mechanicalDetails.filter((entry) => entry.role === role);
      assert.equal(details.length, expectedCount, seatCount + '-seat:' + role);

      for (const detail of details) {
        const radialDistance = Math.hypot(
          detail.center.x - center.x,
          detail.center.z - center.z,
        );
        const radialReach = Math.hypot(detail.dimensions.x, detail.dimensions.z) * 0.5;
        assert.ok(
          radialDistance + radialReach <= housingBoundary - 0.03 + 1e-9,
          seatCount + '-seat:' + role + ':housing-bound',
        );
        assert.equal(detail.constructionSlice, 'S7');
        assert.equal(detail.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
        assert.ok(access.subject.sourcePartIds.includes(detail.id));
      }
    }
  }
});

test('S7 facility chassis details are authored and included in each machine subject', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const machinery = deriveMachineFacilityMachinery({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });

  for (const machine of machinery) {
    const expectedDetailCount = machine.machineRole === 'operations' || machine.machineRole === 'control'
      ? 19
      : machine.machineRole === 'access-commerce'
        ? 22
        : 17;
    assert.equal(machine.mechanicalDetails.length, expectedDetailCount);
    assert.equal(machine.physicalInterfaces.length, machine.facilityIds.length + 2);
    assert.equal(machine.physicalInterfaces.filter((entry) => entry.role === 'machine-core-input').length, 1);
    assert.equal(machine.physicalInterfaces.filter((entry) => entry.role === 'machine-output').length, 1);
    assert.equal(machine.physicalInterfaces.filter((entry) => entry.role === 'facility-port-adapter').length, machine.facilityIds.length);
    const coreInterface = machine.physicalInterfaces.find((entry) => entry.role === 'machine-core-input');
    const outputInterface = machine.physicalInterfaces.find((entry) => entry.role === 'machine-output');
    assert.ok(coreInterface && outputInterface);
    const corePort = machine.ports.find((port) => port.role === 'machine-core-input');
    const outputPort = machine.ports.find((port) => port.role === 'machine-output');
    assert.ok(Math.hypot(coreInterface.center.x - corePort.point.x, coreInterface.center.z - corePort.point.z) <= 0.01);
    assert.ok(Math.hypot(outputInterface.center.x - outputPort.point.x, outputInterface.center.z - outputPort.point.z) <= 0.06);
    assert.equal(
      machine.mechanicalDetails.filter((item) => item.role === 'base-collar').length,
      1,
    );
    assert.equal(
      machine.mechanicalDetails.filter((item) => item.role === 'support-strut').length,
      2,
    );
    assert.equal(
      machine.mechanicalDetails.filter((item) => item.role === 'hinge-mount').length,
      2,
    );
    const subjectIds = new Set(machine.subject.sourcePartIds);
    assert.ok(machine.mechanicalDetails.every((item) => subjectIds.has(item.id)));
    assert.ok(machine.mechanicalDetails.every((item) => item.constructionSlice === 'S7'));
    assert.ok(machine.mechanicalDetails.every((item) => item.constructionOwner === 'frontend/spatial/machine-facility-machinery.js'));
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


test('S7 physical interfaces clear the housing and bridge every S6 facility port', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({ facilityAssemblies: facilities });

  for (const machine of machinery) {
    const input = machine.ports.find((port) => port.role === 'machine-core-input');
    const output = machine.ports.find((port) => port.role === 'machine-output');
    assert.ok(input && output);

    const center = machine.outerHousing.center;
    const dims = machine.outerHousing.dimensions;
    const angle = Math.atan2(center.z, center.x);
    const boundaryDistance = 1 / (
      Math.abs(Math.cos(angle)) / (Math.abs(dims.x) * 0.5)
      + Math.abs(Math.sin(angle)) / (Math.abs(dims.z) * 0.5)
    );
    const radial = Math.hypot(center.x, center.z);
    const inputRadial = Math.hypot(input.point.x, input.point.z);
    const outputRadial = Math.hypot(output.point.x, output.point.z);

    const maxPresentedMachineryBoundary = Math.max(
      ...deriveMachineFacilityMechanismPresentation(machine, { amount: 1, reducedMotion: true }).components.map((motion) => {
        const component = machine.components.find((entry) => entry.id === motion.id);
        return Math.hypot(
          component.center.x + motion.dx - center.x,
          component.center.z + motion.dz - center.z,
        ) + Math.hypot(component.dimensions.x, component.dimensions.z) * 0.5;
      }),
      boundaryDistance,
    );
    assert.ok(inputRadial >= radial + maxPresentedMachineryBoundary + 0.03);
    assert.ok(outputRadial >= radial + maxPresentedMachineryBoundary + 0.10);
    assert.ok((input.serviceBoundaryDistance || 0) >= maxPresentedMachineryBoundary);
    assert.ok(Math.abs(output.point.y - input.point.y) >= 0.20);

    const adapters = machine.physicalInterfaces.filter((entry) => entry.role === 'facility-port-adapter');
    assert.equal(adapters.length, machine.facilityIds.length);
    assert.ok(adapters.every((entry) => Number(entry.dimensions.x) >= 0.06));
    assert.ok(adapters.every((entry) => entry.adapterStart && entry.adapterEnd));
    const invalidAdapters = adapters.map((entry) => {
      const start = entry.adapterStart;
      const end = entry.adapterEnd;
      const startAngle = Math.atan2(start.z - center.z, start.x - center.x);
      const endAngle = Math.atan2(end.z - center.z, end.x - center.x);
      const angleDelta = Math.abs(((endAngle - startAngle + Math.PI) % (Math.PI * 2)) - Math.PI);
      const serviceBoundaryDistance = 1 / (
        Math.abs(Math.cos(startAngle)) / (Math.abs(dims.x) * 0.5)
        + Math.abs(Math.sin(startAngle)) / (Math.abs(dims.z) * 0.5)
      );
      const endLocalRadial = Math.hypot(end.x - center.x, end.z - center.z);
      const valid = Math.abs(end.y - start.y) <= 1e-9
        && angleDelta <= 1e-9
        && Math.abs(endLocalRadial - (serviceBoundaryDistance + 0.04)) <= 1e-9;
      return valid ? null : {
        id: entry.id,
        serviceBoundaryDistance,
        endLocalRadial,
        radialError: endLocalRadial - (serviceBoundaryDistance + 0.04),
        angleDelta,
        verticalDelta: end.y - start.y,
        travel,
      };
    }).filter(Boolean);
    assert.deepEqual(invalidAdapters, []);
  }
});

test('S7 physical interface projection is reproducible from the S6-owned assembly', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: core.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({ facilityAssemblies: facilities });
  for (const machine of machinery) {
    const assembly = facilities.find((entry) => entry.id === machine.facilityAssemblyId);
    assert.ok(assembly);
    assert.deepEqual(
      deriveMachineFacilityPhysicalInterfaces(assembly, machine.ports),
      machine.physicalInterfaces,
    );
  }
});

test('S7 V2 nested chassis trusses remain visible above the authored outer skin and bridge to primary cores', () => {
  const primaryRoles = Object.freeze({
    analysis: 'barrel-stage-1',
    operations: 'hinge-core',
    control: 'rotor-hub',
    'access-commerce': 'sensor-mast',
  });

  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const facilities = deriveMachineFacilityAssemblies({
        outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
      });
      const machines = deriveMachineFacilityMachinery({
        facilityAssemblies: facilities,
        clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
        requestedClearance: 0.16,
      });
      const validation = validateMachineFacilityMachinery(machines);
      assert.equal(validation.valid, true, validation.reasons.join(', '));

      const skins = deriveMachineWorldFacilityShellDescriptors(machines);
      for (const machine of machines) {
        const supports = machine.mechanicalDetails.filter((entry) => entry.role === 'support-strut');
        const ties = machine.mechanicalDetails.filter((entry) => entry.role === 'chassis-core-tie');
        const risers = machine.mechanicalDetails.filter((entry) => entry.role === 'chassis-tie-riser');
        const standoffs = machine.mechanicalDetails.filter((entry) => entry.role === 'chassis-core-standoff');
        const core = machine.components.find((entry) => entry.role === primaryRoles[machine.machineRole]);
        const skin = skins.find((entry) => entry.branchId === machine.branchId && entry.layer === 'main-shell');

        assert.ok(core, machine.machineRole + ': primary chassis core');
        assert.ok(skin, machine.machineRole + ': authored shell');
        assert.equal(supports.length, 2, machine.machineRole + ': supports');
        assert.equal(ties.length, 2, machine.machineRole + ': elevated tie rails');
        assert.equal(risers.length, 2, machine.machineRole + ': support risers');
        assert.equal(standoffs.length, 1, machine.machineRole + ': core standoff');

        const housingCenter = machine.outerHousing.center;
        const frameHeight = Math.max(0.50, Number(machine.outerHousing.dimensions.y) || 0.9);
        const railY = housingCenter.y + frameHeight * 0.84;
        const shellTop = skin.center.y + skin.dimensions.y * 0.5;
        assert.ok(railY > shellTop + 0.04, machine.machineRole + ': rail path must be outside the opaque chassis skin');

        const standoff = standoffs[0];
        assert.equal(standoff.attachmentSourceId, core.id);
        assert.deepEqual(standoff.attachmentTargetIds, ties.map((entry) => entry.id));
        assert.equal(standoff.parentRole, core.role);
        assert.equal(standoff.profile, 'chassis-core-standoff-v1');
        assert.ok(machine.subject.sourcePartIds.includes(standoff.id));
        assert.ok(standoff.dimensions.y >= railY - core.center.y + 0.14 - 1e-9);
        assert.ok(Math.abs(standoff.center.x - core.center.x) < 1e-9);
        assert.ok(Math.abs(standoff.center.z - core.center.z) < 1e-9);

        for (const riser of risers) {
          const support = supports.find((entry) => entry.id === riser.attachmentSourceId);
          assert.ok(support, riser.id + ': source support');
          const side = String(support.id).endsWith(':RIGHT') ? 'RIGHT' : 'LEFT';
          const tie = ties.find((entry) => entry.id.endsWith(':CHASSIS-CORE-TIE:' + side));
          assert.ok(tie, riser.id + ': matching elevated tie');
          assert.equal(riser.attachmentTargetId, tie.id);
          assert.equal(riser.parentRole, support.role);
          assert.equal(riser.constructionSlice, 'S7');
          assert.equal(riser.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
          assert.ok(machine.subject.sourcePartIds.includes(riser.id));
          assert.ok(Math.abs(riser.center.x - support.center.x) < 1e-9);
          assert.ok(Math.abs(riser.center.z - support.center.z) < 1e-9);
          assert.ok(Math.abs(riser.center.y - (support.center.y + railY) * 0.5) < 1e-9);
          assert.ok(riser.dimensions.y >= railY - support.center.y + 0.14 - 1e-9);
          const riserBottom = riser.center.y - riser.dimensions.y * 0.5;
          const riserTop = riser.center.y + riser.dimensions.y * 0.5;
          assert.ok(riserBottom < support.center.y + support.dimensions.y * 0.5, riser.id + ': overlaps support');
          assert.ok(riserTop > railY, riser.id + ': overlaps elevated tie');
        }

        for (const tie of ties) {
          const support = supports.find((entry) => entry.id === tie.attachmentSourceId);
          assert.ok(support, tie.id + ': source support');
          assert.equal(tie.attachmentTargetId, core.id);
          assert.equal(tie.attachmentSourceRole, 'support-strut');
          assert.equal(tie.attachmentTargetRole, core.role);
          assert.equal(tie.parentRole, core.role);
          assert.equal(tie.profile, 'chassis-core-tie-v2');
          assert.equal(tie.attachmentSourceRiserId, 'MACHINERY:' + machine.branchId + ':CHASSIS-TIE-RISER:' + (String(support.id).endsWith(':RIGHT') ? 'RIGHT' : 'LEFT'));
          assert.equal(tie.attachmentTargetStandoffId, standoff.id);
          assert.equal(tie.constructionSlice, 'S7');
          assert.equal(tie.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
          assert.ok(machine.subject.sourcePartIds.includes(tie.id));
          const dx = core.center.x - support.center.x;
          const dz = core.center.z - support.center.z;
          const horizontalLength = Math.hypot(dx, dz);
          assert.ok(horizontalLength > 0.12, tie.id + ': non-degenerate span');
          assert.ok(Math.abs(tie.attachmentSpan - horizontalLength) < 1e-9, tie.id + ': span metadata');
          assert.ok(tie.dimensions.z >= horizontalLength + 0.14 - 1e-9, tie.id + ': beam overlaps both vertical anchors');
          assert.ok(Math.abs(tie.center.x - (support.center.x + core.center.x) * 0.5) < 1e-9, tie.id + ': midpoint X');
          assert.ok(Math.abs(tie.center.z - (support.center.z + core.center.z) * 0.5) < 1e-9, tie.id + ': midpoint Z');
          assert.ok(Math.abs(tie.center.y - railY) < 1e-9, tie.id + ': rail elevation');
          assert.ok(Math.abs(tie.center.y - tie.attachmentRailY) < 1e-9, tie.id + ': recorded rail elevation');
          assert.ok(tie.dimensions.y >= 0.12, tie.id + ': visible upper cross-section');
          assert.ok(railY - tie.dimensions.y * 0.5 > shellTop + 0.02, tie.id + ': full beam section clears shell top');
          assert.ok(Math.abs(Math.sin(tie.rotationY) - dx / horizontalLength) < 1e-9, tie.id + ': local axis X');
          assert.ok(Math.abs(Math.cos(tie.rotationY) - dz / horizontalLength) < 1e-9, tie.id + ': local axis Z');
        }
      }
    }
  }
});


test('S7 V19 chassis junction collars physically join support risers and the nested core standoff', () => {
  const primaryCoreRole = Object.freeze({
    analysis: 'barrel-stage-1',
    operations: 'hinge-core',
    control: 'rotor-hub',
    'access-commerce': 'sensor-mast',
  });

  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    for (const expansionAmount of [0, 0.5, 1]) {
      const scene = createBranchConnectionCore({ seatCount, expansionAmount });
      const outerHousings = scene.parts.filter((part) => part.kind === 'outer-housing');
      const facilities = deriveMachineFacilityAssemblies({ outerHousings });
      const machinery = deriveMachineFacilityMachinery({
        facilityAssemblies: facilities,
        outerHousings,
        clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
        requestedClearance: 0.16,
      });
      const validation = validateMachineFacilityMachinery(machinery);
      assert.equal(validation.valid, true, validation.reasons.join(', '));

      for (const machine of machinery) {
        const detail = (role) => machine.mechanicalDetails.filter((entry) => entry.role === role);
        const supports = detail('support-strut');
        const ties = detail('chassis-core-tie');
        const risers = detail('chassis-tie-riser');
        const nodeCollars = detail('chassis-tie-node-collar');
        const standoffs = detail('chassis-core-standoff');
        const anchorPlates = detail('chassis-core-anchor-plate');
        const primaryCore = machine.components.find((entry) => entry.role === primaryCoreRole[machine.machineRole]);

        assert.equal(supports.length, 2, machine.machineRole);
        assert.equal(ties.length, 2, machine.machineRole);
        assert.equal(risers.length, 2, machine.machineRole);
        assert.equal(nodeCollars.length, 2, machine.machineRole);
        assert.equal(standoffs.length, 1, machine.machineRole);
        assert.equal(anchorPlates.length, 1, machine.machineRole);
        assert.ok(primaryCore, machine.machineRole + ': missing nested core');
        assert.ok(machine.clearanceProfile.safe, machine.machineRole + ': unsafe at Seats=' + seatCount + ', expansion=' + expansionAmount);
        assert.ok(
          machine.clearanceProfile.minimumAvailableClearance >= 0.16 - 1e-9,
          machine.machineRole + ': clearance floor at Seats=' + seatCount + ', expansion=' + expansionAmount,
        );

        const shellTop = machine.outerHousing.center.y + machine.outerHousing.dimensions.y * 0.5;
        for (const support of supports) {
          const side = String(support.id).endsWith(':RIGHT') ? 'RIGHT' : 'LEFT';
          const tie = ties.find((entry) => entry.attachmentSourceId === support.id);
          const riser = risers.find((entry) => entry.attachmentSourceId === support.id);
          const collar = nodeCollars.find((entry) => entry.attachmentSourceId === support.id);
          assert.ok(tie && riser && collar, machine.machineRole + ':' + side + ': incomplete joint');

          assert.equal(collar.attachmentTargetId, tie.id);
          assert.equal(collar.attachmentRiserId, riser.id);
          assert.equal(collar.center.x, support.center.x);
          assert.equal(collar.center.z, support.center.z);
          assert.equal(collar.center.y, tie.attachmentRailY);
          assert.equal(collar.profile, 'chassis-tie-node-collar-v1');
          assert.ok(collar.center.y > shellTop + 0.04, collar.id + ': collar must clear opaque chassis skin');
          assert.ok(collar.dimensions.x <= 0.24 && collar.dimensions.z <= 0.24, collar.id + ': joint shoe is oversized');
        }

        const anchor = anchorPlates[0];
        assert.equal(anchor.attachmentSourceId, primaryCore.id);
        assert.equal(anchor.attachmentStandoffId, standoffs[0].id);
        assert.deepEqual(anchor.attachmentTargetIds, ties.map((entry) => entry.id));
        assert.equal(anchor.center.x, primaryCore.center.x);
        assert.equal(anchor.center.z, primaryCore.center.z);
        assert.equal(anchor.center.y, ties[0].attachmentRailY);
        assert.equal(anchor.profile, 'chassis-core-anchor-plate-v1');
        assert.ok(anchor.center.y > shellTop + 0.04, anchor.id + ': anchor must clear opaque chassis skin');

        const subjectIds = new Set(machine.subject.sourcePartIds);
        for (const joint of [...nodeCollars, ...anchorPlates]) {
          assert.ok(subjectIds.has(joint.id), joint.id + ': joint missing from machine subject');
          assert.equal(joint.constructionSlice, 'S7');
          assert.equal(joint.constructionOwner, 'frontend/spatial/machine-facility-machinery.js');
        }
      }
    }
  }
});
