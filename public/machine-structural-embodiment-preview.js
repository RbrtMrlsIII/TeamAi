import { createMachineThreeSceneAdapter } from './machine-three-scene-adapter.js';
import { createBranchConnectionCore } from './machine-core-layout.js';
import { deriveMachineCoreAssembly } from './machine-core-assembly.js';
import { deriveWorkspaceCoreGeometry } from './hero-workspace-core.js';
import { deriveMachineWorldProfile } from './hero-world-profile.js';
import {
  deriveStructuralPreviewChoreography,
  deriveStructuralPreviewChoreographySample,
  STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT,
} from './machine-structural-choreography-sequence.js';
import { deriveThreeCanonicalRingDescriptors } from './machine-three-scene-adapter.js';
import { deriveMachinePodAssembly } from './machine-pod-assembly.js';
import { deriveMachineSeatDivisionAssembly } from './machine-seat-division-assembly.js';
import {
  deriveFocusedSeatDivisionGeometry,
  resolveSeatDivisionAttachmentTransform,
} from './machine-seat-division-presentation.js';
import { deriveMachineFacilityAssemblies } from './machine-facility-assembly.js';
import { deriveMachineWorldFacilityCarrierDescriptors } from './machine-world-facility-carrier.js';
import { deriveMachineWorldFacilityShellDescriptors } from './machine-world-facility-shell.js';
import { deriveMachineWorldPresentationProjection } from './machine-world-presentation-projection.js';
import {
  deriveMachineFacilityMachinery,
  deriveMachineFacilityMechanismPresentation,
} from './machine-facility-machinery.js';
import { buildMachineWorldTopology } from './machine-world-topology.js';
import {
  deriveMachineCameraSpec,
  MACHINE_CAMERA_ID,
  MACHINE_CAMERA_MODE,
} from './machine-camera.js';

const canvas = document.querySelector('canvas');
const status = document.querySelector('[data-structural-status]');
let adapter = null;
let model = null;
let currentView = 'world';
let choreographyStage = 0;
let choreographyFromStage = 0;
let choreographyProgress = 1;
let choreographyFrame = 0;
let choreographyStartedAt = 0;
const CHOREOGRAPHY_DURATION_MS = 900;

const DIVISIONS = Object.freeze([
  'SEAT_CONNECTION',
  'SEAT_BEHAVIOR',
  'SEAT_TOOLKIT',
  'SEAT_CAPABILITIES',
  'SEAT_AUTHORIZATION',
  'SEAT_WORKSPACE_SCOPE',
  'SEAT_TASK_EVIDENCE',
]);

const WORLD_OVERVIEW_TOPOLOGY_KINDS = Object.freeze(new Set([
  'inner-spoke',
  'outer-spine',
  'lattice-link',
  'workspace-contribution',
  'facility-facility',
]));

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

function setStatus(value) {
  if (status) status.textContent = value;
}

function divisionDescriptors(seat, amount = 1, focusedChildId = null) {
  return DIVISIONS.flatMap((childId, childIndex) => {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent: seat,
      childId,
      childIndex,
      amount,
    });
    const childAmount = focusedChildId && childId !== focusedChildId ? 0 : amount;
    const assembly = deriveMachineSeatDivisionAssembly({
      parent: seat,
      childId,
      childIndex,
      amount: childAmount,
      geometry,
    });
    if (!assembly) return [];
    return assembly.components.map((component) => {
      const attachment = resolveSeatDivisionAttachmentTransform(assembly, component, amount);
      return {
        id: component.id,
        semanticId: assembly.semanticId,
        role: component.role,
        profile: component.profile,
        shape: component.shape,
        center: {
          x: assembly.center.x + component.offset.x + attachment.x,
          y: assembly.center.y + component.offset.y + attachment.y,
          z: assembly.center.z + component.offset.z + attachment.z,
        },
        dimensions: component.dimensions,
        rotationY: attachment.rotationY,
        materialRole: component.materialRole,
        constructionSlice: component.constructionSlice,
        constructionOwner: component.constructionOwner,
      };
    });
  });
}

function renderFacilityAssemblies(machines, amount = 0) {
  return (Array.isArray(machines) ? machines : []).map((machine) => {
    const presentation = deriveMachineFacilityMechanismPresentation(machine, {
      amount,
      reducedMotion: true,
    });
    const motionById = new Map(
      presentation.components.map((entry) => [entry.id, entry]),
    );
    const move = (component) => {
      const motion = motionById.get(component.id);
      return {
        ...component,
        center: {
          x: component.center.x + finite(motion?.dx),
          y: component.center.y + finite(motion?.dy),
          z: component.center.z + finite(motion?.dz),
        },
        rotationY: Number.isFinite(Number(motion?.rotationY))
          ? Number(motion.rotationY)
          : finite(component.rotationY),
      };
    };
    return {
      ...machine,
      components: (machine.components || []).map(move),
      mechanicalDetails: (machine.mechanicalDetails || []).map(move),
    };
  });
}

function facilityDescriptors(machines, amount = 1) {
  return machines.flatMap((machine) => {
    const presentation = deriveMachineFacilityMechanismPresentation(machine, {
      amount,
      reducedMotion: true,
    });
    const motionById = new Map(presentation.components.map((item) => [item.id, item]));
    return [...(machine.components || []), ...(machine.mechanicalDetails || [])].map((component) => {
      const motion = motionById.get(component.id);
      return {
        ...component,
        center: {
          x: component.center.x + finite(motion?.dx),
          y: component.center.y + finite(motion?.dy),
          z: component.center.z + finite(motion?.dz),
        },
        rotationY: Number.isFinite(Number(motion?.rotationY))
          ? Number(motion.rotationY)
          : finite(component.rotationY),
      };
    });
  });
}

function subjectFromParts(parts) {
  if (!parts.length) return null;
  const min = {
    x: Math.min(...parts.map((part) => part.center.x - part.dimensions.x / 2)),
    y: Math.min(...parts.map((part) => part.center.y - part.dimensions.y / 2)),
    z: Math.min(...parts.map((part) => part.center.z - part.dimensions.z / 2)),
  };
  const max = {
    x: Math.max(...parts.map((part) => part.center.x + part.dimensions.x / 2)),
    y: Math.max(...parts.map((part) => part.center.y + part.dimensions.y / 2)),
    z: Math.max(...parts.map((part) => part.center.z + part.dimensions.z / 2)),
  };
  return Object.freeze({
    min: Object.freeze(min),
    max: Object.freeze(max),
    center: Object.freeze({
      x: (min.x + max.x) / 2,
      y: (min.y + max.y) / 2,
      z: (min.z + max.z) / 2,
    }),
  });
}

function positionFromSpec(spec, { world = false } = {}) {
  const radius = Number(spec.radius) || 12;
  if (world) {
    const worldRadius = Math.max(radius, Math.min(24, radius));
    return {
      x: spec.target.x + Math.sin(spec.bearing) * worldRadius * 0.82,
      y: spec.target.y + Math.max(4.6, worldRadius * 0.30),
      z: spec.target.z + Math.cos(spec.bearing) * worldRadius,
    };
  }
  return {
    x: spec.target.x + Math.sin(spec.bearing) * radius * 0.82,
    y: spec.target.y + Number(spec.pitch || 0),
    z: spec.target.z + Math.cos(spec.bearing) * radius,
  };
}

async function boot() {
  if (!canvas) return;
  try {
    const THREE = await import('/vendor/three/three.module.js');
    adapter = createMachineThreeSceneAdapter({ THREE, canvas });

    const scene = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
    const hub = scene.parts.find((part) => part.kind === 'hub');
    const seatOne = scene.parts.find((part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01');
    const core = deriveMachineCoreAssembly({
      hub,
      workspaceCore: { radius: 4.046 },
      expansionAmount: 0,
      adjacentSeatRadius: 5.05,
    });
    const pods = scene.parts
      .filter((part) => part.kind === 'inner-pod')
      .map((part) => deriveMachinePodAssembly({
        part,
        expansionAmount: 0,
        payloadDensity: 0.45,
        adjacentCenterSpacing: 2.812,
      }));
    const facilities = deriveMachineFacilityAssemblies({
      outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
    });
    const machinery = deriveMachineFacilityMachinery({
      facilityAssemblies: facilities,
      outerHousings: scene.parts.filter((part) => part.kind === 'outer-housing'),
      clearanceObstacles: scene.parts.filter((part) => part.kind === 'inner-pod'),
      requestedClearance: 0.16,
    });
    const facilityParts = facilityDescriptors(machinery);

    const topology = buildMachineWorldTopology({
      scene,
      facilityAssemblies: facilities,
      facilityMachinery: machinery,
      seatDivisionAmount: 0,
      clearance: 0.16,
    });

    model = Object.freeze({
      THREE,
      seatCount: scene.seatCount,
      scene,
      core,
      pods,
      facilities,
      machinery,
      facilityParts,
      topology,
      worldSubject: subjectFromParts([
        ...core.components,
        ...core.mechanicalDetails,
        ...pods.flatMap((pod) => [...pod.components, ...pod.mechanicalDetails]),
        ...facilityParts,
      ]),
      seatOne,
    });

    setStatus('READY · WORLD · 10 seats · 4 facilities · 7 divisions · ' + topology.edges.length + ' semantic edges · WebGL2 · Three r' + (THREE.REVISION || '186'));
    renderView();
  } catch (error) {
    setStatus('ERROR · ' + (error?.message || 'structural candidate unavailable'));
  }
}

function renderView() {
  if (!adapter || !model) return;

  const choreographyState = deriveStructuralPreviewChoreographySample(
    choreographyFromStage,
    choreographyStage,
    choreographyProgress,
  );
  const choreography = choreographyState.choreography;
  currentView = currentView === 'facility'
    ? 'facility'
    : choreographyState.view;

  const activeScene = createBranchConnectionCore({
    seatCount: model.seatCount,
    expansionAmount: choreography.shell,
  });
  const activeSeat = activeScene.parts.find(
    (part) => part.kind === 'inner-pod' && part.branchId === 'BRANCH-SEAT-01',
  );
  const activePods = activeScene.parts
    .filter((part) => part.kind === 'inner-pod')
    .map((part) => deriveMachinePodAssembly({
      part,
      expansionAmount: choreography.shell,
      payloadDensity: 0.45,
      adjacentCenterSpacing: activeScene.parts
        .filter((entry) => entry.kind === 'inner-pod')
        .length > 1
        ? 2 * Math.hypot(activeSeat?.center.x || 0, activeSeat?.center.z || 0) * Math.sin(Math.PI / model.seatCount)
        : null,
    }));

  const profile = deriveMachineWorldProfile(model.seatCount);
  const workspaceCore = deriveWorkspaceCoreGeometry({
    workspaceRadius: profile.workspaceFootprint,
    expansionAmount: choreography.transformation,
  });
  const activeCore = deriveMachineCoreAssembly({
    hub: activeScene.hub,
    workspaceCore,
    expansionAmount: choreography.transformation,
    receptionAmount: choreography.workspaceReception,
    adjacentSeatRadius: Math.max(
      ...activePods.map((pod) => Math.hypot(pod.center.x, pod.center.z)),
      1,
    ),
  });
  const facilityAssemblies = deriveMachineFacilityAssemblies({
    outerHousings: activeScene.parts.filter((part) => part.kind === 'outer-housing'),
  });
  const machinery = deriveMachineFacilityMachinery({
    facilityAssemblies,
    outerHousings: activeScene.parts.filter((part) => part.kind === 'outer-housing'),
    clearanceObstacles: activeScene.parts.filter((part) => part.kind === 'inner-pod'),
    requestedClearance: 0.16,
  });
  const activeTopology = buildMachineWorldTopology({
    scene: activeScene,
    facilityAssemblies,
    facilityMachinery: machinery,
    seatDivisionAmount: choreographyState.hierarchyOpen
      ? choreography.division
      : choreography.transformation,
    clearance: 0.16,
  });

  const worldPresentation = currentView === 'world'
    ? deriveMachineWorldPresentationProjection({
        facilities: machinery,
        topology: activeTopology,
        seatCount: model.seatCount,
      })
    : {
        facilities: machinery,
        topology: activeTopology,
        scale: 1,
      };

  const seatDivisions = currentView === 'seat'
    ? divisionDescriptors(activeSeat, choreography.division, choreographyState.focusedChildId)
    : [];
  const seatRingRadius = activeScene.parts
    .filter((part) => part.kind === 'inner-pod')
    .reduce((maxRadius, part) => Math.max(maxRadius, Math.hypot(part.center.x, part.center.z)), 0);
  const canonicalRingDescriptors = currentView === 'world'
    ? deriveThreeCanonicalRingDescriptors({
        seatCount: model.seatCount,
        seatRingRadius,
        articulationAmount: choreography.transformation,
        signalAmount: choreography.electrical,
        reducedMotion: true,
      })
    : [];
  const facilityCarrierDescriptors = currentView === 'world'
    ? deriveMachineWorldFacilityCarrierDescriptors(renderTopology)
    : [];

  const facility = machinery.find((machine) => machine.branchId === 'BRANCH-OUTER-BETA') || machinery[0];
  const effectiveFacilitiesSource = currentView === 'world'
    ? machinery
    : currentView === 'facility' && facility
      ? [facility]
      : [];
  const effectiveCore = currentView === 'world' ? activeCore : null;
  const effectivePods = currentView === 'world'
    ? activePods
    : currentView === 'seat'
      ? activeSeat?.podAssembly ? [activeSeat.podAssembly] : [deriveMachinePodAssembly({
          part: activeSeat,
          expansionAmount: choreography.shell,
          payloadDensity: 0.45,
          adjacentCenterSpacing: 2.812,
        })]
      : [];
  const effectiveFacilities = currentView === 'world'
    ? machinery
    : currentView === 'facility' && facility
      ? [facility]
      : [];

  const renderFacilitiesSource = currentView === 'world'
    ? worldPresentation.facilities
    : effectiveFacilitiesSource;
  const renderTopology = currentView === 'world'
    ? worldPresentation.topology
    : activeTopology;
  const facilityParts = facilityDescriptors(renderFacilitiesSource, choreography.transformation);
  const facilityShellDescriptors = currentView === 'world'
    ? deriveMachineWorldFacilityShellDescriptors(renderFacilitiesSource)
    : [];

  const semanticEdges = Array.isArray(renderTopology?.edges) ? renderTopology.edges : [];
  const visibleEdges = currentView === 'world'
    ? semanticEdges.filter((edge) => WORLD_OVERVIEW_TOPOLOGY_KINDS.has(edge?.kind))
    : currentView === 'seat'
      ? semanticEdges.filter((edge) =>
          (edge?.kind === 'pod-division'
            && (String(edge?.sourceBranchId || '').includes('TREE-HERO-SEAT#0')
              || edge?.targetBranchId === 'BRANCH-SEAT-01'))
          || (edge?.kind === 'adjacent-seat'
            && (edge?.sourceBranchId === 'BRANCH-SEAT-01' || edge?.targetBranchId === 'BRANCH-SEAT-01'))
        )
      : facility
        ? semanticEdges.filter((edge) =>
            (edge?.kind === 'pod-facility' || edge?.kind === 'facility-facility')
            && (edge?.sourceBranchId === facility.branchId || edge?.targetBranchId === facility.branchId)
          )
        : [];
  const visibleTopology = Object.freeze({
    ...renderTopology,
    edges: Object.freeze(visibleEdges),
  });

  const assemblyRender = adapter.setAssemblies({
    core: effectiveCore,
    pods: effectivePods,
    facilities: renderFacilityAssemblies(renderFacilitiesSource, choreography.transformation),
    divisions: seatDivisions.length
      ? [{ id: 'S4-SEAT-01', components: seatDivisions, mechanicalDetails: [] }]
      : [],
    extras: [...canonicalRingDescriptors, ...facilityCarrierDescriptors],
  });
  const topologyMode = currentView === 'world'
    ? MACHINE_CAMERA_MODE.WORLD_OVERVIEW
    : currentView === 'seat'
      ? (choreographyState.hierarchyOpen && choreographyState.focusedChildId
          ? MACHINE_CAMERA_MODE.DIVISION_FOCUS
          : choreographyState.choreography.division > 0
            && choreographyState.choreography.division < 0.98
            ? MACHINE_CAMERA_MODE.EXPANSION_FOLLOW
            : MACHINE_CAMERA_MODE.POD_FOCUS)
      : MACHINE_CAMERA_MODE.FACILITY_FOCUS;
  const topologyBranchId = currentView === 'world'
    ? null
    : currentView === 'seat'
      ? 'BRANCH-SEAT-01'
      : facility?.branchId || null;
  const topologyRender = adapter.setTopology(visibleTopology, {
    mode: topologyMode,
    branchId: topologyBranchId,
    divisions: seatDivisions,
  });

  const structuralWorldSubject = subjectFromParts([
    ...activeCore.components,
    ...activeCore.mechanicalDetails,
    ...effectivePods.flatMap((pod) => [...pod.components, ...pod.mechanicalDetails]),
    ...facilityParts,
    ...canonicalRingDescriptors,
    ...facilityCarrierDescriptors,
    ...facilityShellDescriptors,
  ]);

  canvas.dataset.structuralView = currentView;
  canvas.dataset.structuralChoreographyStage = String(choreographyState.stageIndex);
  canvas.dataset.structuralChoreographyFromStage = String(choreographyState.fromStageIndex);
  canvas.dataset.structuralChoreographyToStage = String(choreographyState.toStageIndex);
  canvas.dataset.structuralChoreographyProgress = String(choreographyState.progress);
  canvas.dataset.structuralChoreographyReturningToWorld = String(choreographyState.returningToWorld);
  canvas.dataset.structuralChoreographyPhase = choreography.phase;
  canvas.dataset.structuralChoreographyTransformation = String(choreography.transformation);
  canvas.dataset.structuralChoreographyDivision = String(choreography.division);
  canvas.dataset.structuralChoreographyElectrical = String(choreography.electrical);
  canvas.dataset.structuralChoreographyConnection = String(choreographyState.connectionAmount);
  canvas.dataset.structuralChoreographyFocusedChild = choreographyState.focusedChildId || '';
  canvas.dataset.structuralChoreographyPhaseSource = choreography.phase;
  canvas.dataset.structuralFocusedDivision = choreographyState.focusedChildId || '';
  canvas.dataset.structuralTotalTopologyEdges = String(activeTopology.edges.length);
  canvas.dataset.structuralVisibleTopologyEdges = String(topologyRender.edgeCount);
  canvas.dataset.structuralVisiblePods = String(effectivePods.length);
  canvas.dataset.structuralVisibleFacilities = String(effectiveFacilities.length);
  canvas.dataset.structuralVisibleDivisions = String(currentView === 'seat' ? DIVISIONS.length : 0);
  canvas.dataset.structuralDescriptorCount = String(assemblyRender.descriptorCount);
  canvas.dataset.structuralCanonicalRingDescriptorCount = String(canonicalRingDescriptors.length);
  canvas.dataset.structuralFacilityCarrierDescriptorCount = String(facilityCarrierDescriptors.length);
  canvas.dataset.structuralFacilityShellDescriptorCount = String(facilityShellDescriptors.length);
  canvas.dataset.structuralConduitEdgeKinds = topologyRender.conduitEdgeKinds.join('|');
  canvas.dataset.structuralStructuralConduitSegmentCount = String(topologyRender.structuralConduitSegmentCount);
  canvas.dataset.structuralMaterialModel = 'S24-authored-theme-family';
  canvas.dataset.structuralTopologyMode = topologyMode;
  const divisionSubject = subjectFromParts(seatDivisions);
  const cameraMode = currentView === 'world'
    ? (choreographyState.returningToWorld
        ? MACHINE_CAMERA_MODE.RETURN_TO_WORLD
        : MACHINE_CAMERA_MODE.WORLD_OVERVIEW)
    : currentView === 'seat'
      ? topologyMode === MACHINE_CAMERA_MODE.EXPANSION_FOLLOW
        ? MACHINE_CAMERA_MODE.EXPANSION_FOLLOW
        : MACHINE_CAMERA_MODE.POD_FOCUS
      : MACHINE_CAMERA_MODE.FACILITY_FOCUS;
  const cameraId = currentView === 'world'
    ? MACHINE_CAMERA_ID.WORLD
    : currentView === 'seat'
      ? MACHINE_CAMERA_ID.SEAT
      : MACHINE_CAMERA_ID.FACILITY;
  canvas.dataset.structuralCameraMode = cameraMode;
  const spec = deriveMachineCameraSpec({
    cameraId,
    mode: cameraMode,
    worldSubject: structuralWorldSubject,
    podSubject: effectivePods[0]?.subject,
    divisionSubject,
    coreSubject: activeCore?.subject,
    facilitySubject: facility?.subject,
    parentSubject: effectivePods[0]?.subject,
    viewport: { width: canvas.clientWidth || 1280, height: canvas.clientHeight || 820 },
  });

  adapter.resize();
  adapter.setCameraPose({
    position: positionFromSpec(spec, { world: currentView === 'world' }),
    target: spec.target,
    fov: spec.fov,
  });
  adapter.render();

  setStatus(
    'READY · ' + currentView.toUpperCase()
    + ' · 10 seats · 4 facilities · 7 divisions · '
    + activeTopology.edges.length
    + ' semantic edges · WebGL2 · Three r' + (model.THREE.REVISION || '186'),
  );
}
function cancelChoreographyAnimation() {
  if (choreographyFrame) cancelAnimationFrame(choreographyFrame);
  choreographyFrame = 0;
  choreographyStartedAt = 0;
}

function startChoreographyTransition(targetStage) {
  if (choreographyFrame) return;
  choreographyFromStage = choreographyStage;
  choreographyStage = ((Math.trunc(Number(targetStage) || 0) % STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT)
    + STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT) % STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT;
  choreographyProgress = 0;
  choreographyStartedAt = performance.now();
  const tick = (timestamp) => {
    const elapsed = Math.max(0, timestamp - choreographyStartedAt);
    choreographyProgress = Math.min(1, elapsed / CHOREOGRAPHY_DURATION_MS);
    renderView();
    if (choreographyProgress < 1) {
      choreographyFrame = requestAnimationFrame(tick);
      return;
    }
    choreographyFrame = 0;
    choreographyStartedAt = 0;
    choreographyFromStage = choreographyStage;
    choreographyProgress = 1;
    renderView();
  };
  choreographyFrame = requestAnimationFrame(tick);
}

document.querySelector('[data-view="world"]')?.addEventListener('click', () => {
  cancelChoreographyAnimation();
  choreographyFromStage = 0;
  choreographyStage = 0;
  choreographyProgress = 1;
  currentView = 'world';
  renderView();
});
document.querySelector('[data-view="seat"]')?.addEventListener('click', () => {
  cancelChoreographyAnimation();
  choreographyFromStage = Math.max(choreographyStage, 2);
  choreographyStage = Math.max(choreographyStage, 2);
  choreographyProgress = 1;
  currentView = 'seat';
  renderView();
});
document.querySelector('[data-view="facility"]')?.addEventListener('click', () => {
  cancelChoreographyAnimation();
  currentView = 'facility';
  renderView();
});
document.querySelector('[data-action="transform"]')?.addEventListener('click', () => {
  if (choreographyFrame) return;
  const targetStage = (choreographyStage + 1) % STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT;
  startChoreographyTransition(targetStage);
});
window.addEventListener('resize', renderView);
boot();
