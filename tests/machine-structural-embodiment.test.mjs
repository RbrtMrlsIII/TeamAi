import assert from 'node:assert/strict';
import test from 'node:test';

import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { deriveMachineCoreAssembly } from '../frontend/spatial/machine-core-assembly.js';
import { deriveMachinePodAssembly } from '../frontend/spatial/machine-pod-assembly.js';
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
  assert.equal(core.subject.sourcePartIds.length, 19);

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
  assert.equal(pod.mechanicalDetails.length, 11);

  const divisionAssemblies = DIVISIONS.map((childId, childIndex) => {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent: seatOne,
      childId,
      childIndex,
      amount: 1,
    });
    return { childId, geometry };
  });
  assert.equal(new Set(divisionAssemblies.map(({ geometry }) => geometry.profile)).size, 7);

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
