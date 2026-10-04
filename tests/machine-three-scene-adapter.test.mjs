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
  MACHINE_SEAT_CONNECTION_COUPLER_PROFILE,
  MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE,
  MACHINE_SEAT_TOOLKIT_RACK_PROFILE,
  MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE,
  getMachineSeatCapabilitiesLatticeRecipe,
  resolveMachineSeatCapabilitiesLatticeRailThickness,
  getMachineSeatConnectionCouplerRecipe,
  resolveMachineSeatConnectionCouplerRailThickness,
  getMachineSeatToolkitRackRecipe,
  resolveMachineSeatToolkitRackRailThickness,
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
    { x: 1.00, z: 0.12 },
    { x: 1.00, z: 0.12 },
  ]);
  const expectedSpokeAngles = [
    0,
    Math.PI / 3,
    Math.PI * 2 / 3,
    Math.PI,
    Math.PI * 4 / 3,
    Math.PI * 5 / 3,
  ];
  recipe.slice(4).forEach((element, index) => {
    assert.ok(Math.abs(element.rotationY - expectedSpokeAngles[index]) < 1e-12);
  });
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

test('S4 connection radial coupler recipe preserves descriptor envelope with explicit thickness', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const divisionParent = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_CONNECTION',
    childIndex: 0,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_CONNECTION',
    childIndex: 0,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find(
    (entry) => entry.profile === MACHINE_SEAT_CONNECTION_COUPLER_PROFILE,
  );
  assert.ok(component);
  assert.equal(assembly.mechanism.attachment.type, 'RADIAL_COUPLER');
  assert.equal(assembly.mechanism.attachment.primaryComponent, 'coupler-ring');
  assert.equal(assembly.mechanism.attachment.travel, 0.24);

  const recipe = getMachineSeatConnectionCouplerRecipe();
  assert.equal(recipe.length, 12);
  assert.deepEqual(recipe.slice(0, 8).map((element) => element.dimensions), Array.from(
    { length: 8 },
    () => ({ x: 0.34, z: 0.12 }),
  ));
  recipe.slice(0, 8).forEach((element, index) => {
    const angle = index * Math.PI / 4;
    assert.ok(Math.abs(element.rotationY - (angle + Math.PI * 0.5)) < 1e-12);
    assert.ok(Math.abs(element.center.x - 0.44 * Math.cos(angle)) < 1e-12);
    assert.ok(Math.abs(element.center.z - 0.44 * Math.sin(angle)) < 1e-12);
  });
  recipe.slice(8).forEach((element, index) => {
    const angle = index * Math.PI / 2;
    assert.ok(Math.abs(element.rotationY - angle) < 1e-12);
    assert.deepEqual(element.dimensions, { x: 0.20, z: 0.16 });
  });
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
  assert.ok(Math.abs(minX + 0.50) < 1e-12);
  assert.ok(Math.abs(maxX - 0.50) < 1e-12);
  assert.ok(Math.abs(minZ + 0.50) < 1e-12);
  assert.ok(Math.abs(maxZ - 0.50) < 1e-12);

  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE);
  assert.deepEqual(descriptor.dimensions, component.dimensions);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const expected = descriptor.dimensions;
  const expectedThickness = resolveMachineSeatConnectionCouplerRailThickness({
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
  assert.equal(geometry.getAttribute('position').count, 432);
  const lug = recipe[8];
  const lugAngle = lug.rotationY;
  const lugCenterX = lug.center.x * expected.x;
  const lugCenterZ = lug.center.z * expected.z;
  const halfLength = lug.dimensions.x * expected.x * 0.5;
  const halfWidth = lug.dimensions.z * expected.z * 0.5;
  const expectedVertexX = lugCenterX + halfLength * Math.cos(lugAngle) + halfWidth * Math.sin(lugAngle);
  const expectedVertexZ = lugCenterZ - halfLength * Math.sin(lugAngle) + halfWidth * Math.cos(lugAngle);
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
      profile: MACHINE_SEAT_CONNECTION_COUPLER_PROFILE,
    }),
    MACHINE_SEAT_CONNECTION_COUPLER_RENDER_SHAPE,
  );
  geometry.dispose();
});

test('S4 toolkit telescoping rack recipe preserves the existing descriptor envelope', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const divisionParent = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const geometryDescriptor = deriveFocusedSeatDivisionGeometry({
    parent: divisionParent,
    childId: 'SEAT_TOOLKIT',
    childIndex: 2,
    amount: 1,
  });
  const assembly = deriveMachineSeatDivisionAssembly({
    parent: divisionParent,
    childId: 'SEAT_TOOLKIT',
    childIndex: 2,
    amount: 1,
    geometry: geometryDescriptor,
  });
  const component = assembly.components.find(
    (entry) => entry.profile === MACHINE_SEAT_TOOLKIT_RACK_PROFILE,
  );
  assert.ok(component);
  assert.equal(assembly.mechanism.attachment.type, 'TELESCOPING_RACK');
  assert.equal(assembly.mechanism.attachment.primaryComponent, 'equipment-rack');
  assert.equal(assembly.mechanism.attachment.travel, 0.32);

  const recipe = getMachineSeatToolkitRackRecipe();
  assert.equal(recipe.length, 6);
  assert.deepEqual(
    recipe.map((rail) => rail.thickness),
    [0.14, 0.14, 0.14, 0.14, 0.14, 0.14],
  );
  assert.deepEqual(
    recipe.map((rail) => rail.dimensions),
    [
      { x: 1.00, z: 0.14 },
      { x: 1.00, z: 0.14 },
      { x: 0.14, z: 1.00 },
      { x: 0.14, z: 1.00 },
      { x: 1.00, z: 0.10 },
      { x: 1.00, z: 0.10 },
    ],
  );
  const minX = Math.min(...recipe.map((rail) => rail.center.x - rail.dimensions.x * 0.5));
  const maxX = Math.max(...recipe.map((rail) => rail.center.x + rail.dimensions.x * 0.5));
  const minZ = Math.min(...recipe.map((rail) => rail.center.z - rail.dimensions.z * 0.5));
  const maxZ = Math.max(...recipe.map((rail) => rail.center.z + rail.dimensions.z * 0.5));
  assert.equal(minX, -0.50);
  assert.equal(maxX, 0.50);
  assert.equal(minZ, -0.50);
  assert.equal(maxZ, 0.50);

  const descriptor = normalizeThreeDescriptor(component, assembly.id);
  assert.equal(descriptor.shape, MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE);
  assert.deepEqual(descriptor.dimensions, component.dimensions);

  const geometry = buildThreeGeometry(THREE, descriptor);
  geometry.computeBoundingBox();
  assert.ok(geometry.boundingBox);
  const epsilon = 1e-6;
  const expected = descriptor.dimensions;
  const expectedRailThickness = resolveMachineSeatToolkitRackRailThickness({
    dimensions: expected,
    rail: recipe[0],
  });
  assert.ok(Math.abs(
    expectedRailThickness - Math.min(expected.x, expected.z) * 0.14,
  ) < 1e-12);
  assert.ok(expectedRailThickness < expected.y);
  assert.ok(Math.abs(geometry.boundingBox.max.x - expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.x + expected.x * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.y - expectedRailThickness * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.y + expectedRailThickness * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.max.z - expected.z * 0.5) < epsilon);
  assert.ok(Math.abs(geometry.boundingBox.min.z + expected.z * 0.5) < epsilon);
  assert.equal(geometry.getAttribute('position').count, 216);
  const positionArray = geometry.getAttribute('position').array;
  const midX = expected.x * 0.36;
  const midZ = expected.z * 0.36;
  assert.ok(positionArray.some((value) => Math.abs(value) > midX && Math.abs(value) <= expected.x * 0.5 + epsilon));
  assert.ok(positionArray.some((value) => Math.abs(value) > midZ && Math.abs(value) <= expected.z * 0.5 + epsilon));
  const shelf = recipe[4];
  const shelfCenterZ = shelf.center.z * expected.z;
  const shelfHalfZ = shelf.dimensions.z * expected.z * 0.5;
  let shelfVertexFound = false;
  for (let index = 0; index < positionArray.length; index += 3) {
    if (Math.abs(positionArray[index + 2] - (shelfCenterZ + shelfHalfZ)) < epsilon) {
      shelfVertexFound = true;
      break;
    }
  }
  assert.equal(shelfVertexFound, true);
  assert.equal(
    normalizeThreeShape({
      shape: 'CUBE',
      profile: MACHINE_SEAT_TOOLKIT_RACK_PROFILE,
    }),
    MACHINE_SEAT_TOOLKIT_RACK_RENDER_SHAPE,
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

test('S24 measured Pod status role resolves to authored accent without changing geometry', () => {
  const descriptor = normalizeThreeDescriptor({
    id: 'MACHINE-POD:BRANCH-SEAT-01:STATUS-INDICATOR',
    role: 'status-indicator',
    shape: 'TORUS',
    materialRole: 'trace',
    center: { x: 2, y: 1, z: -3 },
    dimensions: { x: 0.6, y: 0.08, z: 0.6 },
    constructionSlice: 'S3',
    constructionOwner: 'frontend/spatial/machine-pod-assembly.js',
  }, 'MACHINE-POD-ASSEMBLY');
  assert.equal(descriptor.materialRole, 'accent');
  assert.equal(descriptor.role, undefined);
  assert.deepEqual(descriptor.dimensions, { x: 0.6, y: 0.08, z: 0.6 });
  assert.deepEqual(descriptor.center, { x: 2, y: 1, z: -3 });
});

test('S24 Three bridge derives restrained local practical lights from existing machine points', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  assert.match(source, /TEAMAI_LOCAL_PRACTICAL_LIGHTS/);
  assert.match(source, /new THREE\.PointLight/);
  assert.match(source, /port\.role === 'signal'/);
  assert.match(source, /part\.role === 'status-indicator'/);
  assert.match(source, /port\.role === 'machine-output'/);
  assert.match(source, /const podIntensity = pods\.length === 1 \? 0\.34 : 0\.11/);
  assert.match(source, /intensity: pods\.length === 1 \? 0\.12 : 0\.035/);
  assert.match(source, /intensity: 0\.12/);
});
 
test('S24 physical conduit presentation is subordinate and bounded', () => {
  const authored = {
    metal: { color: [0.7, 0.7, 0.7], rough: 0.3, emit: 0 },
    metal2: { color: [0.4, 0.4, 0.4], rough: 0.4, emit: 0 },
    glass: { color: [0.2, 0.6, 0.8], rough: 0.22, emit: 0.05 },
    energy: { color: [0.08, 0.64, 1.0], rough: 0.24, emit: 0.18 },
    trace: { color: [0.16, 0.54, 0.76], rough: 0.30, emit: 0.04 },
    conduit: { color: [0.18, 0.30, 0.38], rough: 0.46, emit: 0.01 },
    seatShell: { color: [0.34, 0.56, 0.70], rough: 0.5, emit: 0.01 },
    seatShellInset: { color: [0.035, 0.07, 0.11], rough: 0.64, emit: 0 },
    workspaceRing: { color: [0.42, 0.62, 0.76], rough: 0.22, emit: 0.01 },
  };
  const conduit = resolveThreeMaterialPresentation('conduit', authored);
  assert.equal(conduit.authoredRole, 'conduit');
  assert.equal(conduit.transparent, true);
  assert.equal(conduit.opacity, 0.50);
  assert.equal(conduit.metalness, 0.46);
});

test('S24 semantic division families resolve to authored presentation colors', () => {
  const expected = new Map([
    ['SEAT_CONNECTION', 'divisionConnection'],
    ['SEAT_BEHAVIOR', 'divisionBehavior'],
    ['SEAT_TOOLKIT', 'divisionToolkit'],
    ['SEAT_CAPABILITIES', 'divisionCapabilities'],
    ['SEAT_AUTHORIZATION', 'divisionAuthorization'],
    ['SEAT_WORKSPACE_SCOPE', 'divisionScope'],
    ['SEAT_TASK_EVIDENCE', 'divisionEvidence'],
  ]);
  for (const [semanticId, materialRole] of expected) {
    const descriptor = normalizeThreeDescriptor({
      id: 'DIVISION:' + semanticId,
      semanticId,
      role: 'division-component',
      materialRole: 'metal2',
      center: { x: 0, y: 1, z: 0 },
      dimensions: { x: 0.8, y: 0.1, z: 0.6 },
      constructionSlice: 'S4',
      constructionOwner: 'frontend/spatial/machine-seat-division-assembly.js',
    }, 'MACHINE-SEAT-DIVISION-ASSEMBLY');
    assert.equal(descriptor.materialRole, materialRole);
    assert.deepEqual(descriptor.center, { x: 0, y: 1, z: 0 });
    assert.deepEqual(descriptor.dimensions, { x: 0.8, y: 0.1, z: 0.6 });
  }
});

test('S24 Three bridge embodies measured expanded Pod shell panels from S3 presentation data', () => {
  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const podPart = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const closed = deriveMachinePodAssembly({
    part: podPart,
    expansionAmount: 0,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const open = deriveMachinePodAssembly({
    part: podPart,
    expansionAmount: 1,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const closedShells = collectThreeDescriptors({ pods: [closed] })
    .filter((descriptor) => descriptor.profile === AUTHORED_POD_SHELL_PROFILE);
  const openShells = collectThreeDescriptors({ pods: [open] })
    .filter((descriptor) => descriptor.profile === AUTHORED_POD_SHELL_PROFILE);

  assert.equal(closedShells.length, 1);
  assert.equal(openShells.length, 2);
  const base = open.components.find((entry) => entry.role === 'outer-shell');
  const mechanical = open.mechanicalPresentation;
  const expectedX = Math.abs(base.dimensions.x) * 0.54;
  const expectedZ = Math.abs(base.dimensions.z) * 0.88;
  for (const [index, side] of [-1, 1].entries()) {
    const panel = openShells[index];
    assert.equal(panel.materialRole, 'seat-shell');
    assert.deepEqual(panel.dimensions, {
      x: expectedX,
      y: base.dimensions.y,
      z: expectedZ,
    });
    assert.ok(Math.abs(
      panel.center.x - (
        base.center.x
        + mechanical.tangent.x * mechanical.shellPanelSeparation * side
        + mechanical.outward.x * mechanical.shellPanelTravel
      ),
    ) < 1e-12);
    assert.ok(Math.abs(
      panel.center.z - (
        base.center.z
        + mechanical.tangent.z * mechanical.shellPanelSeparation * side
        + mechanical.outward.z * mechanical.shellPanelTravel
      ),
    ) < 1e-12);
    assert.ok(Math.abs(
      panel.rotationY - (
        mechanical.outwardAngle
        + mechanical.shellPanelRotation * side
      ),
    ) < 1e-12);
  }
});

test('S24 maps measured Pod mechanical rings to ring geometry instead of box fallback', () => {
  assert.equal(
    normalizeThreeShape({ profile: 'concentric-articulation' }),
    'TORUS',
  );
  assert.equal(
    normalizeThreeShape({ profile: 'status-band' }),
    'TORUS',
  );

  const machine = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const podPart = machine.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const pod = deriveMachinePodAssembly({
    part: podPart,
    expansionAmount: 1,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  const descriptors = collectThreeDescriptors({ pods: [pod] });
  const articulation = descriptors.find((descriptor) => (
    descriptor.id.endsWith(':ARTICULATION')
  ));
  const status = descriptors.find((descriptor) => (
    descriptor.id.endsWith(':STATUS-INDICATOR')
  ));
  assert.ok(articulation);
  assert.ok(status);
  assert.equal(articulation.shape, 'TORUS');
  assert.equal(status.shape, 'TORUS');

  const articulationGeometry = buildThreeGeometry(THREE, articulation);
  const statusGeometry = buildThreeGeometry(THREE, status);
  assert.ok(articulationGeometry.getAttribute('position').count > 0);
  assert.ok(statusGeometry.getAttribute('position').count > 0);
  assert.notEqual(articulationGeometry.getAttribute('position').count, 36);
  assert.notEqual(statusGeometry.getAttribute('position').count, 36);
  articulationGeometry.dispose();
  statusGeometry.dispose();
});

test('Y1 preserves the authored Pod shell profile as an explicit mesh contract', () => {
  assert.equal(AUTHORED_POD_SHELL_PROFILE, 'authored-seat-pod-shell');
  const outline = resolveThreePodShellOutline();
  assert.equal(outline.length, 12);
  assert.deepEqual(outline, [
    [-0.90, 0.00],
    [-0.78, -0.35],
    [-0.45, -0.55],
    [0.00, -0.60],
    [0.45, -0.55],
    [0.78, -0.35],
    [0.90, 0.00],
    [0.78, 0.35],
    [0.45, 0.55],
    [0.00, 0.60],
    [-0.45, 0.55],
    [-0.78, 0.35],
  ]);
  const xs = outline.map(([x]) => x);
  const zs = outline.map(([, z]) => z);
  assert.equal(Math.min(...xs), -0.90);
  assert.equal(Math.max(...xs), 0.90);
  assert.equal(Math.min(...zs), -0.60);
  assert.equal(Math.max(...zs), 0.60);
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

  assert.equal(geometry.getAttribute('position').count, 276);
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
  assert.match(rendererSource, /MACHINE_CONNECTION_COUPLER_ELEMENT_RENDER_SHAPE/);
  assert.match(rendererSource, /MACHINE_TOOLKIT_RACK_ELEMENT_RENDER_SHAPE/);
  assert.match(presentationSource, /resolveMachineSeatDivisionProfileRecipe/);
  assert.match(presentationSource, /resolveMachineSeatWorkspaceScopeFrameRailThickness/);
  assert.match(presentationSource, /MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_RAIL_RENDER_SHAPE/);
  assert.match(presentationSource, /MACHINE_SEAT_CONNECTION_COUPLER_ELEMENT_RENDER_SHAPE/);
  assert.match(presentationSource, /MACHINE_SEAT_TOOLKIT_RACK_ELEMENT_RENDER_SHAPE/);
  assert.match(profileSource, /MACHINE_SEAT_WORKSPACE_SCOPE_FRAME_PROFILE/);
  assert.match(profileSource, /MACHINE_SEAT_CONNECTION_COUPLER_PROFILE/);
  assert.match(profileSource, /MACHINE_SEAT_TOOLKIT_RACK_PROFILE/);
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

test('Y1 topology projection forwards scope to physical conduit rendering', () => {
  const source = readFileSync('frontend/spatial/machine-three-scene-adapter.js', 'utf8');
  assert.match(
    source,
    /function setTopology\(topology = null, \{[\s\S]*?mode = 'WORLD_OVERVIEW',[\s\S]*?branchId = null/,
  );
  assert.match(
    source,
    /getRenderableMachineWorldConduitSegments\(topology, \{[\s\S]*?mode,[\s\S]*?branchId,/,
  );
  assert.match(source, /conduitEdgeKinds: Object\.freeze/);
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
