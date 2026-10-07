import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
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

test('S2 authored mechanical detail layer adds real internal machine structure without changing canonical roles', () => {
  const assembly = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    expansionAmount: 1,
  });
  assert.equal(assembly.version, 'S2-V5');
  const braces = assembly.mechanicalDetails.filter((item) => item.role === 'foundation-brace');
  const guards = assembly.mechanicalDetails.filter((item) => item.role === 'reactor-guard');
  const housing = assembly.mechanicalDetails.filter((item) => item.role === 'reactor-inner-housing');

  assert.equal(braces.length, 6);
  assert.equal(guards.length, 6);
  const panels = assembly.mechanicalDetails.filter((item) => item.role === 'foundation-panel');
  const portCollars = assembly.mechanicalDetails.filter((item) => item.role === 'port-collar');
  const ribs = assembly.mechanicalDetails.filter((item) => item.role === 'reactor-rib');
  const bands = assembly.mechanicalDetails.filter((item) => item.role === 'reactor-band');
  assert.equal(housing.length, 1);
  assert.equal(panels.length, 6);
  assert.equal(portCollars.length, 4);
  assert.equal(ribs.length, 6);
  assert.equal(bands.length, 3);
  assert.ok(braces.every((item) => item.profile === 'radial-foundation-brace'));
  assert.ok(guards.every((item) => item.profile === 'reactor-guard-post'));
  assert.equal(housing[0].profile, 'nested-reactor-housing');
  assert.ok(assembly.mechanicalDetails.every((item) => item.constructionSlice === 'S2'));
  assert.ok(assembly.mechanicalDetails.every((item) => item.constructionOwner === 'frontend/spatial/machine-core-assembly.js'));
  assert.equal(assembly.mechanicalDetails.length, 32);
  const subjectIds = new Set(assembly.subject.sourcePartIds);
  assert.ok(assembly.mechanicalDetails.every((item) => subjectIds.has(item.id)));

  const detailExtent = Math.max(
    ...assembly.mechanicalDetails.map((item) =>
      Math.hypot(item.center.x, item.center.z)
      + Math.hypot(item.dimensions.x * 0.5, item.dimensions.z * 0.5)
    ),
  );
  assert.ok(detailExtent <= assembly.envelope.radius + 0.02);
  assert.equal(assembly.envelope.radius >= assembly.components[0].radius, true);
});

test('S2 reactor cage adds authored vertical fins without expanding the proven core envelope', () => {
  const assembly = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    expansionAmount: 1,
  });

  const fins = assembly.mechanicalDetails.filter((item) => item.role === 'reactor-cage-fin');
  assert.equal(fins.length, 8);
  assert.ok(fins.every((item) => item.profile === 'radial-reactor-cage-fin'));
  assert.ok(fins.every((item) => Array.isArray(item.outline)));
  assert.ok(fins.every((item) => item.outline.length === 7));

  for (const fin of fins) {
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
    }
    assert.ok(signedArea2 > 0);
    assert.ok(Math.min(...turns) > 0);
    const radialExtent =
      Math.hypot(fin.center.x, fin.center.z)
      + Math.hypot(fin.dimensions.x * 0.5, fin.dimensions.z * 0.5);
    assert.ok(radialExtent < assembly.envelope.radius - 0.20);
  }

  const subjectIds = new Set(assembly.subject.sourcePartIds);
  assert.ok(fins.every((item) => subjectIds.has(item.id)));
  assert.equal(validateMachineCoreAssembly(assembly).valid, true);
});

test('S2 raw Hero and Three adapter consume the authored reactor-cage fin profile', () => {
  const renderer = readFileSync(
    'frontend/spatial/machine-world-renderer.js',
    'utf8',
  );
  const adapter = readFileSync(
    'frontend/spatial/machine-three-scene-adapter.js',
    'utf8',
  );

  assert.match(renderer, /reactor-cage-fin/);
  assert.match(renderer, /CORE_FIN/);
  assert.match(adapter, /buildExtrudedPolygonGeometry\\(THREE, descriptor, descriptor\\.outline\\)/);
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
