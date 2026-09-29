import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import {
  collectThreeDescriptors,
  normalizeThreeDescriptor,
  normalizeThreeShape,
  MACHINE_THREE_ADAPTER_ID,
  MACHINE_THREE_ADAPTER_VERSION,
  resolveThreeMaterialPresentation,
  resolveThreePolygonSegments,
  resolveThreePodShellOutline,
  AUTHORED_POD_SHELL_PROFILE,
  buildThreeGeometry,
} from '../frontend/spatial/machine-three-scene-adapter.js';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineCoreAssembly } from '../frontend/spatial/machine-core-assembly.js';
import { deriveMachinePodAssembly } from '../frontend/spatial/machine-pod-assembly.js';
import { deriveMachineSeatDivisionAssembly } from '../frontend/spatial/machine-seat-division-assembly.js';
import { deriveFocusedSeatDivisionGeometry } from '../frontend/spatial/machine-seat-division-presentation.js';
import {
  MACHINE_POD_SHELL_PROFILE,
  getMachinePodShellOutline,
} from '../frontend/spatial/machine-pod-profile.js';
import {
  MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE,
  MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE,
  MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE,
  MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE,
  MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE,
  MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE,
  MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RAIL_RENDER_SHAPE,
  MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE,
  MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE,
  MACHINE_SEAT_CAPABILITIES_LATTICE_ELEMENT_RENDER_SHAPE,
  getMachineSeatCapabilitiesLatticeRecipe,
  resolveMachineSeatCapabilitiesLatticeRailThickness,
  getMachineSeatAuthorizationShieldOutline,
  getMachineSeatBehaviorBaffleOutline,
  getMachineSeatWorkspaceScopeFrameRecipe,
  resolveMachineSeatWorkspaceScopeFrameRailThickness,
  resolveMachineSeatDivisionProfileShape,
} from '../frontend/spatial/machine-seat-division-profile.js';

test('Y1 adapter exposes one stable rendering bridge identity', () => {
  assert.equal(MACHINE_THREE_ADAPTER_ID, 'MACHINE-THREE-SCENE-ADAPTER');
  assert.equal(MACHINE_THREE_ADAPTER_VERSION, 'Y1-V2');
});

test('Y1 shape normalization preserves authored profiles without changing semantic ids', () => {
  assert.equal(normalizeThreeShape({ shape: 'TORUS' }), 'TORUS');
  assert.equal(normalizeThreeShape({ shape: 'CYL' }), 'CYLINDER');
  assert.equal(normalizeThreeShape({ shape: 'CUBE' }), 'BOX');
  assert.equal(normalizeThreeShape({ shape: 'SPH' }), 'SPHERE');
  assert.equal(normalizeThreeShape({ profile: 'hex-foundation' }), 'CYLINDER');
  assert.equal(normalizeThreeShape({ profile: 'semantic-payload-deck' }), 'BOX');
  assert.equal(
    normalizeThreeShape({ profile: AUTHORED_POD_SHELL_PROFILE }),
    'POD_SHELL',
  );
});

test('S4 authorization shield profile overrides only presentation shape', () => {
  assert.equal(
    resolveMachineSeatDivisionProfileShape({
      profile: MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE,
      fallbackShape: 'CUBE',
    }),
    MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE,
  );
  assert.equal(
    resolveMachineSeatDivisionProfileShape({
      profile: 'unrelated-profile',
      fallbackShape: 'CUBE',
    }),
    'CUBE',
  );
  assert.equal(
    normalizeThreeShape({
      shape: 'CUBE',
      profile: MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE,
    }),
    MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE,
  );
  assert.equal(
    normalizeThreeShape({
      shape: 'CUBE',
      profile: MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE,
    }),
    MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE,
  );
});

test('S4 workspace scope frame recipe preserves the existing telescoping descriptor envelope', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const divisionParent = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_WORKSPACE_SCOPE',
    childIndex: 5,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_WORKSPACE_SCOPE',
    childIndex: 5,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find(
    (entry) => entry.profile === MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE,
  );
  assert.ok(component);
  assert.equal(assembly.mechanism.attachment.type, 'TELESCOPING_FRAME');
  assert.equal(assembly.mechanism.attachment.primaryComponent, 'scope-frame');
  assert.equal(assembly.mechanism.attachment.travel, 0.28);

  const recipe = getMachineSeatWorkspaceScopeFrameRecipe();
  assert.equal(recipe.length, 4);
  assert.deepEqual(
    recipe.map((rail) => rail.thickness),
    [0.14, 0.14, 0.14, 0.14],
  );
  const minX = Math.min(...recipe.map((rail) => rail.center.x - rail.dimensions.x * 0.5));
  const maxX = Math.max(...recipe.map((rail) => rail.center.x + rail.dimensions.x * 0.5));
  const minZ = Math.min(...recipe.map((rail) => rail.center.z - rail.dimensions.z * 0.5));
  const maxZ = Math.max(...recipe.map((rail) => rail.center.z + rail.dimensions.z * 0.5));
  assert.equal(minX, -0.50);
  assert.equal(maxX, 0.50);
  assert.equal(minZ, -0.50);
  assert.equal(maxZ, 0.50);

  const apertureWidth = 1 - 0.14 * 2;
  const apertureDepth = 1 - 0.14 * 2;
  assert.equal(apertureWidth, 0.72);
  assert.equal(apertureDepth, 0.72);
  assert.deepEqual(
    recipe.map((rail) => rail.dimensions),
    [
      { x: 1.00, z: 0.14 },
      { x: 1.00, z: 0.14 },
      { x: 0.14, z: 1.00 },
      { x: 0.14, z: 1.00 },
    ],
  );

  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RENDER_SHAPE);
  assert.deepEqual(descriptor.dimensions, component.dimensions);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const epsilon = 1e-6;
  const expected = descriptor.dimensions;
  const expectedRailThickness = resolveMachineSeatWorkspaceScopeFrameRailThickness({
    dimensions: expected,
    rail: recipe[0],
  });
  assert.ok(Math.abs(
    expectedRailThickness - Math.min(expected.x, expected.z) * 0.14,
  ) < 1e-12);
  assert.ok(expectedRailThickness < expected.y * 0.2);
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expectedRailThickness * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expectedRailThickness * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < epsilon);
  assert.equal(geometry.getAttribute('position').count, 144);
  const positionArray = geometry.getAttribute('position').array;
  const midX = expected.x * 0.36;
  const midZ = expected.z * 0.36;
  assert.ok(positionArray.some((value) => Math.abs(value) > midX && Math.abs(value) <= expected.x * 0.5));
  assert.ok(positionArray.some((value) => Math.abs(value) > midZ && Math.abs(value) <= expected.z * 0.5));
  geometry.dispose();
});

test('S4 capability rotary lattice recipe preserves descriptor envelope with explicit thickness', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const divisionParent = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_CAPABILITIES',
    childIndex: 3,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_CAPABILITIES',
    childIndex: 3,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find(
    (entry) => entry.profile === MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE,
  );
  assert.ok(component);
  assert.equal(assembly.mechanism.attachment.type, 'ROTARY_LATTICE');
  assert.equal(assembly.mechanism.attachment.primaryComponent, 'capability-lattice');
  assert.equal(assembly.mechanism.attachment.travel, Math.PI * 0.5);

  const recipe = getMachineSeatCapabilitiesLatticeRecipe();
  assert.equal(recipe.length, 10);
  assert.deepEqual(recipe.slice(0, 4).map((element) => element.dimensions), [
    { x: 1.00, z: 0.12 },
    { x: 1.00, z: 0.12 },
    { x: 0.12, z: 1.00 },
    { x: 0.12, z: 1.00 },
  ]);
  assert.deepEqual(recipe.slice(4).map((element) => Number(element.rotationY.toFixed(12))), [
    0,
    Number((Math.PI / 3).toFixed(12)),
    Number((Math.PI * 2 / 3).toFixed(12)),
    Math.PI,
    Number((Math.PI * 4 / 3).toFixed(12)),
    Number((Math.PI * 5 / 3).toFixed(12)),
  ]);
  const minX = Math.min(...recipe.map((element) => element.center.x - (
    Math.abs(Math.cos(element.rotationY)) * element.dimensions.x
      + Math.abs(Math.sin(element.rotationY)) * element.dimensions.z
  ) * 0.5));
  const maxX = Math.max(...recipe.map((element) => element.center.x + (
    Math.abs(Math.cos(element.rotationY)) * element.dimensions.x
      + Math.abs(Math.sin(element.rotationY)) * element.dimensions.z
  ) * 0.5));
  const minZ = Math.min(...recipe.map((element) => element.center.z - (
    Math.abs(Math.sin(element.rotationY)) * element.dimensions.x
      + Math.abs(Math.cos(element.rotationY)) * element.dimensions.z
  ) * 0.5));
  const maxZ = Math.max(...recipe.map((element) => element.center.z + (
    Math.abs(Math.sin(element.rotationY)) * element.dimensions.x
      + Math.abs(Math.cos(element.rotationY)) * element.dimensions.z
  ) * 0.5));
  assert.equal(minX, -0.50);
  assert.equal(maxX, 0.50);
  assert.equal(minZ, -0.50);
  assert.equal(maxZ, 0.50);

  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE);
  assert.deepEqual(descriptor.dimensions, component.dimensions);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const expected = descriptor.dimensions;
  const expectedThickness = resolveMachineSeatCapabilitiesLatticeRailThickness({
    dimensions: expected,
    element: recipe[0],
  });
  assert.ok(Math.abs(
    expectedThickness - Math.min(expected.x, expected.z) * 0.14,
  ) < 1e-12);
  assert.ok(expectedThickness < expected.y);
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < 1e-6);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < 1e-6);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expectedThickness * 0.5) < 1e-6);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expectedThickness * 0.5) < 1e-6);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < 1e-6);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < 1e-6);
  assert.equal(geometry.getAttribute('position').count, 360);
  const spoke = recipe[5];
  const spokeAngle = spoke.rotationY;
  const spokeCenterX = spoke.center.x * expected.x;
  const spokeCenterZ = spoke.center.z * expected.z;
  const halfLength = spoke.dimensions.x * expected.x * 0.5;
  const halfWidth = spoke.dimensions.z * expected.z * 0.5;
  const expectedVertexX = spokeCenterX + halfLength * Math.cos(spokeAngle) + halfWidth * Math.sin(spokeAngle);
  const expectedVertexZ = spokeCenterZ - halfLength * Math.sin(spokeAngle) + halfWidth * Math.cos(spokeAngle);
  const position = geometry.getAttribute('position').array;
  let rotatedVertexFound = false;
  for (let index = 0; index < position.length; index += 3) {
    if (
      Math.abs(position[index] - expectedVertexX) < 1e-6
      && Math.abs(position[index + 2] - expectedVertexZ) < 1e-6
    ) {
      rotatedVertexFound = true;
      break;
    }
  }
  assert.equal(rotatedVertexFound, true);
  assert.equal(
    normalizeThreeShape({
      shape: 'TORUS',
      profile: MACHINE_SEAT_CAPABILITIES_LATTICE_PROFILE,
    }),
    MACHINE_SEAT_CAPABILITIES_LATTICE_RENDER_SHAPE,
  );
  geometry.dispose();
});

test('S4 behavior baffle profile preserves the existing articulated descriptor envelope', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const divisionParent = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_BEHAVIOR',
    childIndex: 1,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_BEHAVIOR',
    childIndex: 1,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find(
    (entry) => entry.profile === MACHINE_SEAT_BEHAVIOR_BAFFLE_PROFILE,
  );
  assert.ok(component);
  assert.equal(assembly.mechanism.attachment.type, 'HINGED_BAFFLE');
  assert.equal(assembly.mechanism.attachment.primaryComponent, 'rule-baffles');

  const outline = getMachineSeatBehaviorBaffleOutline();
  assert.equal(outline.length, 8);
  const xs = outline.map(([x]) => x);
  const zs = outline.map(([, z]) => z);
  assert.equal(Math.min(...xs), -0.60);
  assert.equal(Math.max(...xs), 0.60);
  assert.equal(Math.min(...zs), -0.60);
  assert.equal(Math.max(...zs), 0.60);

  const turns = outline.map((point, index) => {
    const previous = outline[(index + outline.length - 1) % outline.length];
    const next = outline[(index + 1) % outline.length];
    return (
      (point[0] - previous[0]) * (next[1] - point[1])
      - (point[1] - previous[1]) * (next[0] - point[0])
    );
  });
  assert.ok(turns.every((turn) => turn > 0));

  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE);
  assert.deepEqual(descriptor.dimensions, component.dimensions);

  const openRotation = component.rotationY + assembly.mechanism.attachment.travel;
  assert.ok(openRotation > component.rotationY);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const epsilon = 1e-6;
  const expected = descriptor.dimensions;
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < epsilon);
  assert.equal(geometry.getAttribute('position').count, 84);
  geometry.dispose();
});

test('S4 authorization shield BufferGeometry preserves descriptor envelope', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const podPart = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const pod = deriveMachinePodAssembly({
    part: podPart,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const divisionParent = machine.parts.find((part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01');
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_AUTHORIZATION',
    childIndex: 4,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_AUTHORIZATION',
    childIndex: 4,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find((entry) => entry.profile === MACHINE_SEAT_AUTHORIZATION_SHIELD_PROFILE);
  assert.ok(component);
  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_AUTHORIZATION_SHIELD_RENDER_SHAPE);
  const outline = getMachineSeatAuthorizationShieldOutline();
  assert.equal(outline.length, 8);
  const xs = outline.map(([x]) => x);
  const zs = outline.map(([, z]) => z);
  assert.equal(Math.min(...xs), -0.78);
  assert.equal(Math.max(...xs), 0.78);
  assert.equal(Math.min(...zs), -0.78);
  assert.equal(Math.max(...zs), 0.78);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const epsilon = 1e-6;
  const expected = descriptor.dimensions;
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < epsilon);
  assert.equal(geometry.getAttribute('position').count, 84);
  assert.deepEqual(descriptor.dimensions, component.dimensions);
  geometry.dispose();
});

test('Y1 descriptors preserve S2/S3 semantic identity and dimensions', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const hub = machine.parts.find((part) => part.kind === 'hub');
  const podPart = machine.parts.find((part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01');
  const core = deriveMachineCoreAssembly({ hub, workspaceCore: { radius: 4.046 }, adjacentSeatRadius: 5.05 });
  const pod = deriveMachinePodAssembly({ part: podPart, payloadDensity: 0.45, adjacentCenterSpacing: 2.812 });
  const sample = normalizeThreeDescriptor(core.components[0], core.id);
  assert.equal(sample.id, core.components[0].id);
  assert.equal(sample.semanticId, null);
  assert.equal(sample.constructionSlice, 'S2');
  assert.equal(sample.constructionOwner, 'frontend/spatial/machine-core-assembly.js');
  assert.equal(sample.profile, core.components[0].profile);
  assert.equal(sample.parentId, core.id);
  assert.deepEqual(sample.dimensions, core.components[0].dimensions);
  const descriptors = collectThreeDescriptors({ core, pods: [pod] });
  assert.equal(descriptors.length, core.components.length + core.mechanicalDetails.length + pod.components.length + pod.mechanicalDetails.length);
  assert.ok(descriptors.some((descriptor) => descriptor.id === 'MACHINE-POD:BRANCH-SEAT-01:OUTER-SHELL'));
});

test('Y1 preserves the authored Pod shell profile as an explicit mesh contract', () => {
  assert.equal(AUTHORED_POD_SHELL_PROFILE, 'authored-seat-pod-shell');
  const outline = resolveThreePodShellOutline();
  assert.equal(outline.length, 8);
  assert.deepEqual(outline, [
    [-0.90, -0.25],
    [-0.55, -0.58],
    [0.18, -0.62],
    [0.78, -0.30],
    [0.90, 0.12],
    [0.50, 0.50],
    [-0.30, 0.58],
    [-0.82, 0.30],
  ]);
  const xs = outline.map(([x]) => x);
  const zs = outline.map(([, z]) => z);
  assert.equal(Math.min(...xs), -0.90);
  assert.equal(Math.max(...xs), 0.90);
  assert.equal(Math.min(...zs), -0.62);
  assert.equal(Math.max(...zs), 0.58);
});

test('Y1 and raw WebGL consume one authored Pod profile authority', () => {
  assert.equal(AUTHORED_POD_SHELL_PROFILE, MACHINE_POD_SHELL_PROFILE);
  assert.deepEqual(
    resolveThreePodShellOutline(),
    getMachinePodShellOutline(),
  );

  const adapterSource = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  const rendererSource = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  assert.match(adapterSource, /from '\.\/machine-pod-profile\.js'/);
  assert.match(rendererSource, /from '\.\/machine-pod-profile\.js'/);
  assert.match(rendererSource, /pod: MACHINE_POD_SHELL_OUTLINE/);
});

test('Y1 Pod shell BufferGeometry is bounded by the authored descriptor dimensions', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const podPart = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const pod = deriveMachinePodAssembly({
    part: podPart,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const component = pod.components.find((entry) => entry.role === 'outer-shell');
  const descriptor = normalizeThreeDescriptor(component, pod.id);
  assert.equal(descriptor.shape, 'POD_SHELL');

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);

  const expected = descriptor.dimensions;
  // BufferGeometry stores positions in Float32BufferAttribute. A 1e-9 bound
  // is below the representable precision around these world-space dimensions.
  const epsilon = 1e-6;
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expected.y * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < epsilon);

  assert.equal(geometry.getAttribute('position').count, 84);
  geometry.dispose();
});

test('Y1 Pod shell descriptor keeps authored dimensions as the presentation envelope', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const podPart = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const pod = deriveMachinePodAssembly({
    part: podPart,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const descriptor = normalizeThreeDescriptor(
    pod.components.find((component) => component.role === 'outer-shell'),
    pod.id,
  );
  assert.equal(descriptor.profile, AUTHORED_POD_SHELL_PROFILE);
  assert.equal(descriptor.shape, 'POD_SHELL');
  assert.deepEqual(descriptor.dimensions, pod.components[0].dimensions);
});

test('Y1 preserves authored polygon profiles for Three.js tessellation', () => {
  assert.equal(resolveThreePolygonSegments({ shape: 'CYLINDER', profile: 'hex-foundation' }), 6);
  assert.equal(resolveThreePolygonSegments({ shape: 'CYLINDER', profile: 'oct-reactor' }), 8);
  assert.equal(resolveThreePolygonSegments({ shape: 'CYLINDER', profile: 'dodec-receiving-deck' }), 12);
  assert.equal(resolveThreePolygonSegments({ shape: 'CYLINDER', profile: 'generic-cylinder' }), 10);
});

test('Y1 descriptor conversion is fail-closed for malformed input', () => {
  assert.throws(() => normalizeThreeDescriptor(null), /requires an id/);
});


test('S4 source and browser profile copies remain exact', () => {
  const profileSource = readFileSync('frontend/spatial/machine-seat-division-profile.js', 'utf8');
  const profileBrowser = readFileSync('public/machine-seat-division-profile.js', 'utf8');
  assert.equal(profileBrowser, profileSource);

  const presentationSource = readFileSync('frontend/spatial/machine-seat-division-presentation.js', 'utf8');
  const presentationBrowser = readFileSync('public/machine-seat-division-presentation.js', 'utf8');
  assert.equal(presentationBrowser, presentationSource);

  const rendererSource = readFileSync('frontend/spatial/machine-world-renderer.js', 'utf8');
  assert.match(rendererSource, /getMachineSeatBehaviorBaffleOutline/);
  assert.match(rendererSource, /behaviorBaffle: getMachineSeatBehaviorBaffleOutline\(\)/);
  assert.match(rendererSource, /MACHINE_SEAT_BEHAVIOR_BAFFLE_RENDER_SHAPE/);
  assert.match(rendererSource, /MACHINE_SCOPE_FRAME_RAIL_RENDER_SHAPE/);
  assert.match(presentationSource, /resolveMachineSeatDivisionProfileRecipe/);
  assert.match(presentationSource, /resolveMachineSeatWorkspaceScopeFrameRailThickness/);
  assert.match(presentationSource, /MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RAIL_RENDER_SHAPE/);
  assert.match(profileSource, /MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE/);
});

test('Y1 adapter source and browser copy remain exact', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  const browser = readFileSync('public/machine-three-scene-adapter.js', 'utf8');
  assert.equal(browser, source);
});


test('Y1 never invents semantic identity for component-only geometry', () => {
  const descriptor = normalizeThreeDescriptor({
    id: 'CORE_FOUNDATION_SHELL',
    center: { x: 1, y: 2, z: 3 },
    dimensions: { x: 4, y: 1, z: 4 },
    constructionSlice: 'S2',
    constructionOwner: 'frontend/spatial/machine-core-assembly.js',
  }, 'MACHINE-CORE-ASSEMBLY');
  assert.equal(descriptor.semanticId, null);
  assert.equal(descriptor.id, 'CORE_FOUNDATION_SHELL');
});

test('Y1 adapter copies are still exact after the structural projection extension', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  const browser = readFileSync('public/machine-three-scene-adapter.js', 'utf8');
  assert.equal(browser, source);
});


test('S24 Three bridge consumes the canonical authored material family', () => {
  const authored = {
    metal: { color: [0.7, 0.71, 0.68], rough: 0.22, emit: 0.01 },
    metal2: { color: [0.42, 0.44, 0.43], rough: 0.40, emit: 0.02 },
    glass: { color: [0.72, 0.80, 0.84], rough: 0.19, emit: 0.04 },
    energy: { color: [0.16, 0.55, 0.88], rough: 0.24, emit: 0.12 },
    trace: { color: [0.28, 0.56, 0.72], rough: 0.34, emit: 0.02 },
    seatShell: { color: [0.89, 0.88, 0.84], rough: 0.50, emit: 0.01 },
    seatShellInset: { color: [0.13, 0.15, 0.14], rough: 0.64, emit: 0 },
    workspaceRing: { color: [0.74, 0.75, 0.71], rough: 0.22, emit: 0.01 },
  };
  const shell = resolveThreeMaterialPresentation('seat-shell', authored);
  assert.equal(shell.authoredRole, 'seatShell');
  assert.deepEqual(shell.color, authored.seatShell.color);
  assert.equal(shell.transparent, false);

  const glass = resolveThreeMaterialPresentation('glass', authored);
  assert.equal(glass.authoredRole, 'glass');
  assert.equal(glass.transparent, true);
  assert.equal(glass.metalness, 0.04);

  const energy = resolveThreeMaterialPresentation('energy', authored);
  assert.deepEqual(energy.emissive, authored.energy.color);
  assert.equal(energy.emissiveIntensity, authored.energy.emit);
});

test('S24 unknown material roles fail to a canonical authored structural family', () => {
  const resolved = resolveThreeMaterialPresentation('unknown-role', {
    metal: { color: [0.7, 0.7, 0.7], rough: 0.3, emit: 0 },
    metal2: { color: [0.4, 0.4, 0.4], rough: 0.4, emit: 0 },
  });
  assert.equal(resolved.authoredRole, 'metal2');
});
