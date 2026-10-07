import assert from 'node:assert/strict';
import test from 'node:test';

import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineCoreAssembly } from '../frontend/spatial/machine-core-assembly.js';
import { deriveMachinePodAssembly } from '../frontend/spatial/machine-pod-assembly.js';
import { deriveMachineSeatDivisionAssembly } from '../frontend/spatial/machine-seat-division-assembly.js';
import {
  deriveFocusedSeatDivisionGeometry,
} from '../frontend/spatial/machine-seat-division-presentation.js';
import {
  deriveMachineFacilityAssemblies,
} from '../frontend/spatial/machine-facility-assembly.js';
import {
  deriveMachineFacilityMachinery,
  deriveMachineFacilityMechanismPresentation,
} from '../frontend/spatial/machine-facility-machinery.js';
import {
  buildMachineWorldTopology,
  validateMachineWorldTopology,
} from '../frontend/spatial/machine-world-topology.js';
import {
  deriveMachineCameraSpec,
  MACHINE_CAMERA_ID,
  MACHINE_CAMERA_MODE,
} from '../frontend/spatial/machine-camera.js';
import { deriveMachineResponsiveReadability } from '../frontend/spatial/machine-responsive-readability.js';
import {
  deriveMachineWorldFacilityShellDescriptors,
  validateMachineWorldFacilityShellDescriptors,
  getMachineWorldFacilityBodyOutline,
} from '../frontend/spatial/machine-world-facility-shell.js';
import { resolveMachineResponsive } from '../frontend/spatial/machine-responsive.js';

const DIVISIONS = Object.freeze([
  'SEAT_CONNECTION',
  'SEAT_BEHAVIOR',
  'SEAT_TOOLKIT',
  'SEAT_CAPABILITIES',
  'SEAT_AUTHORIZATION',
  'SEAT_WORKSPACE_SCOPE',
  'SEAT_TASK_EVIDENCE',
]);

test('S2-S10 compose into one structurally coherent 10-seat world', () => {
  const sceneClosed = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const sceneOpen = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });

  assert.equal(sceneClosed.seatCount, 10);
  assert.equal(sceneClosed.parts.filter((part) => part.kind === 'hub').length, 1);
  assert.equal(sceneClosed.parts.filter((part) => part.kind === 'inner-pod').length, 10);
  assert.equal(sceneClosed.parts.filter((part) => part.kind === 'outer-housing').length, 4);

  const hub = sceneClosed.parts.find((part) => part.kind === 'hub');
  assert.ok(hub);

  const core = deriveMachineCoreAssembly({
    hub,
    workspaceCore: { radius: 4.046 },
    expansionAmount: 0,
    adjacentSeatRadius: 5.05,
  });
  assert.equal(core.constructionSlice, 'S2');
  const coreSubjectIds = new Set(core.subject.sourcePartIds);
  assert.ok(core.subject.sourcePartIds.length >= core.components.length + core.mechanicalDetails.length);
  assert.ok(core.components.every((component) => coreSubjectIds.has(component.id)));
  assert.ok(core.mechanicalDetails.every((detail) => coreSubjectIds.has(detail.id)));

  const seatOne = sceneClosed.byBranch.get('BRANCH-SEAT-01');
  assert.ok(seatOne);
  const pod = deriveMachinePodAssembly({
    part: seatOne,
    expansionAmount: 0,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });
  assert.equal(pod.constructionSlice, 'S3');
  assert.equal(pod.components.length, 7);
  assert.equal(pod.mechanicalDetails.length, 23);

  const divisionAssemblies = DIVISIONS.map((childId, childIndex) => {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent: seatOne,
      childId,
      childIndex,
      amount: 1,
    });
    const assembly = deriveMachineSeatDivisionAssembly({
      parent: seatOne,
      childId,
      childIndex,
      amount: 1,
      geometry,
    });
    return { childId, geometry, assembly };
  });
  const divisionSignatures = new Set(
    divisionAssemblies.map(({ assembly }) =>
      assembly.components.map(({ profile, shape }) => profile + ':' + shape).join('|'),
    ),
  );
  assert.equal(divisionSignatures.size, DIVISIONS.length);
  assert.ok(divisionAssemblies.every(({ assembly }) => assembly.components.length === 3));

  const facilityAssemblies = deriveMachineFacilityAssemblies({
    outerHousings: sceneClosed.parts.filter((part) => part.kind === 'outer-housing'),
  });
  assert.equal(facilityAssemblies.length, 4);
  assert.equal(new Set(facilityAssemblies.flatMap((item) => item.facilities.map((facility) => facility.id))).size, 11);

  const facilityMachinery = deriveMachineFacilityMachinery({
    facilityAssemblies,
    outerHousings: sceneClosed.parts.filter((part) => part.kind === 'outer-housing'),
    clearanceObstacles: sceneClosed.parts.filter((part) => part.kind === 'inner-pod'),
    requestedClearance: 0.16,
  });
  assert.equal(facilityMachinery.length, 4);
  assert.equal(new Set(facilityMachinery.map((machine) => machine.machineRole)).size, 4);
  assert.ok(facilityMachinery.every((machine) =>
    machine.clearanceProfile.safe
    && machine.mechanismGraph.length >= 4
    && machine.payloadSurface?.componentId,
  ));

  const topology = buildMachineWorldTopology({
    scene: sceneClosed,
    facilityAssemblies,
    facilityMachinery,
    seatDivisionAmount: 1,
    clearance: 0.16,
  });
  const topologyValidation = validateMachineWorldTopology(topology, { expectedSeatCount: 10 });
  assert.equal(topologyValidation.valid, true, topologyValidation.reasons.join(', '));
  assert.equal(topology.divisionEdgeCount, 70);
  assert.equal(topology.facilityEdgeCount, 10);
  assert.equal(topology.facilityFacilityEdgeCount, 4);
  assert.equal(topology.workspaceContributionEdgeCount, 4);
  assert.equal(topology.adjacentSeatEdgeCount, 9);

  const camera = deriveMachineCameraSpec({
    cameraId: MACHINE_CAMERA_ID.SEAT,
    mode: MACHINE_CAMERA_MODE.POD_FOCUS,
    worldSubject: {
      center: { x: 0, y: 1, z: 0 },
      min: { x: -10.55, y: 0, z: -10.55 },
      max: { x: 10.55, y: 2, z: 10.55 },
    },
    podSubject: pod.subject,
    viewport: { width: 1280, height: 800 },
  });
  assert.equal(camera.mode, MACHINE_CAMERA_MODE.POD_FOCUS);
  assert.deepEqual(camera.target, pod.subject.center);
  assert.ok(camera.radius > 4 && camera.radius < 6);

  const closedPod = deriveMachinePodAssembly({ part: seatOne, expansionAmount: 0 });
  const openPod = deriveMachinePodAssembly({ part: sceneOpen.byBranch.get('BRANCH-SEAT-01'), expansionAmount: 1 });
  assert.notDeepEqual(closedPod.subject, openPod.subject);
  assert.equal(openPod.mechanicalPresentation.amount, 1);

  const responsive = resolveMachineResponsive({ width: 390, height: 844 });
  const readability = deriveMachineResponsiveReadability({
    responsive,
    viewport: { width: 390, height: 844 },
    cameraRadius: 27.5,
    cameraFov: 48,
    cameraPosition: [2.4559020495, 10.62, 29.8501249583],
    cameraTarget: [0, 0.42, 0],
    seatCount: 10,
    seatCenters: sceneClosed.parts
      .filter((part) => part.kind === 'inner-pod')
      .map((part) => ({ seatIndex: part.seatIndex, center: part.center })),
    podFeatures: [seatOne].map((part) => ({ center: part.center, dimensions: part.dimensions })),
    facilityFeatures: facilityAssemblies.flatMap((assembly) =>
      assembly.components.map((component) => ({ center: component.center, dimensions: component.dimensions })),
    ),
    seatRingRadius: Math.max(...sceneClosed.parts
      .filter((part) => part.kind === 'inner-pod')
      .map((part) => Math.hypot(part.center.x, part.center.z))),
    podSpan: Math.max(...sceneClosed.parts
      .filter((part) => part.kind === 'inner-pod')
      .map((part) => Math.max(part.dimensions.x, part.dimensions.z))),
    facilitySpan: Math.min(...facilityAssemblies
      .flatMap((assembly) => assembly.components.map((component) => Math.max(component.dimensions.x, component.dimensions.z)))),
  });
  assert.equal(responsive.tier, 'phone');
  assert.equal(readability.readable, true);
});
test('S7 facility body shells form four authored manufactured families without consuming topology authority', () => {
  const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const facilities = deriveMachineFacilityAssemblies({
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({
    facilityAssemblies: facilities,
    outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
    clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
    requestedClearance: 0.16,
  });

  const shells = deriveMachineWorldFacilityShellDescriptors(machinery);
  const validation = validateMachineWorldFacilityShellDescriptors(shells);

  assert.equal(validation.valid, true, validation.reasons.join(', '));
  assert.equal(shells.length, 20);
  assert.equal(new Set(shells.map((entry) => entry.branchId)).size, 4);
  assert.equal(new Set(shells.map((entry) => entry.silhouette)).size, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'main-shell').length, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'base-collar').length, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'shoulder-plate').length, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'upper-cap').length, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'mechanism-housing').length, 4);
  assert.equal(shells.filter((entry) => entry.layer === 'mechanism-housing').length, 4);
  assert.ok(shells.every((entry) => entry.presentationOnly === true));
  assert.ok(shells.every((entry) => entry.constructionSlice === 'S7'));
  assert.ok(shells.every((entry) => entry.constructionOwner === 'frontend/spatial/machine-world-facility-shell.js'));

  const pods = scene.parts.filter((part) => part.kind === 'inner-pod');
  let minimumConservativeXZClearance = Infinity;
  for (const shell of shells) {
    const shellRadius = Math.hypot(shell.dimensions.x * 0.5, shell.dimensions.z * 0.5);
    for (const pod of pods) {
      const centerDistance = Math.hypot(
        shell.center.x - pod.center.x,
        shell.center.z - pod.center.z,
      );
      const podRadius = Math.hypot(pod.dimensions.x * 0.5, pod.dimensions.z * 0.5);
      minimumConservativeXZClearance = Math.min(
        minimumConservativeXZClearance,
        centerDistance - shellRadius - podRadius,
      );
    }
  }
  assert.ok(minimumConservativeXZClearance > 0.16);
});

test('S7 facility body shell helper returns authored silhouette outlines', () => {
  for (const silhouette of ['fin', 'arc', 'diamond', 'blade']) {
    const outline = getMachineWorldFacilityBodyOutline(silhouette);
    assert.ok(Array.isArray(outline));
    assert.equal(outline.length, 8);
  }
  assert.equal(getMachineWorldFacilityBodyOutline('unknown'), null);
});
