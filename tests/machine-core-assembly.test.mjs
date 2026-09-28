import assert from 'node:assert/strict';
import test from 'node:test';
import {
  CORE_COMPONENT_ROLES,
  CORE_PORT_ROLES,
  MACHINE_CORE_ASSEMBLY_ID,
  deriveMachineCoreAssembly,
  deriveMachineCorePorts,
  validateMachineCoreAssembly,
} from '../frontend/spatial/machine-core-assembly.js';

const hub = {
  center: { x: 0, y: 0.42, z: 0 },
  dimensions: { x: 2.6, y: 0.78, z: 2.6 },
};

test('S2 creates a layered physical core with stable root ownership', () => {
  const assembly = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    expansionAmount: 1,
    receptionAmount: 0.8,
    adjacentSeatRadius: 5.05,
  });

  assert.equal(assembly.id, MACHINE_CORE_ASSEMBLY_ID);
  assert.equal(assembly.constructionSlice, 'S2');
  assert.equal(assembly.constructionOwner, 'frontend/spatial/machine-core-assembly.js');
  assert.deepEqual(assembly.components.map((component) => component.role), CORE_COMPONENT_ROLES);
  assert.deepEqual(assembly.ports.map((port) => port.role), CORE_PORT_ROLES);
  assert.deepEqual(assembly.ports.map((port) => port.id), deriveMachineCorePorts({ hub, expansionAmount: 1 }).map((port) => port.id));
  assert.equal(assembly.portByRole.north.id, assembly.ports[0].id);
  assert.equal(assembly.envelope.portReach > 1.5, true);
  assert.ok(assembly.subject.max.x >= Math.max(...assembly.ports.map((port) => port.point.x + port.radius)) - 0.08);
  assert.ok(assembly.subject.max.z >= Math.max(...assembly.ports.map((port) => port.point.z + port.radius)) - 0.08);
  assert.equal(assembly.components.every((component) => component.constructionSlice === 'S2'), true);
  assert.equal(assembly.ports.every((port) => port.constructionSlice === 'S2'), true);
  assert.ok(assembly.subject);
  assert.ok(assembly.envelope.radius > hub.dimensions.x / 2);
  assert.ok(assembly.envelope.radialCenterlineGap > 0.16);
  assert.equal(validateMachineCoreAssembly(assembly).valid, true);
});

test('S2 concentric mechanisms respond monotonically to expansion and reception', () => {
  const collapsed = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    receptionAmount: 0,
  });
  const active = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    expansionAmount: 1,
    receptionAmount: 1,
  });

  assert.ok(active.concentricMechanisms.every((item, index) =>
    item.radius >= collapsed.concentricMechanisms[index].radius,
  ));
  assert.ok(active.concentricMechanisms.every((item, index) =>
    item.signal >= collapsed.concentricMechanisms[index].signal,
  ));
});

test('S2 fails closed on corrupted assembly or component root ownership', () => {
  const assembly = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
  });
  const invalid = {
    ...assembly,
    constructionSlice: 'S3',
    components: assembly.components.map((component, index) =>
      index === 0 ? { ...component, constructionSlice: 'S3' } : component,
    ),
  };

  const validation = validateMachineCoreAssembly(invalid);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('CORE_ASSEMBLY_NOT_ROOTED_AT_S2'));
  assert.ok(validation.reasons.includes('COMPONENT_NOT_S2:CORE_FOUNDATION_SHELL'));
});

test('S2 rejects a core whose seat-ring clearance is below the requested floor', () => {
  const assembly = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    adjacentSeatRadius: 1.55,
    requestedClearance: 0.16,
  });
  const validation = validateMachineCoreAssembly(assembly);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('CORE_TO_SEAT_CLEARANCE_UNPROVEN'));
});
