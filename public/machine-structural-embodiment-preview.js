import { createMachineThreeSceneAdapter } from './machine-three-scene-adapter.js';
import { createBranchConnectionCore } from './machine-core-layout.js';
import { deriveMachineCoreAssembly } from './machine-core-assembly.js';
import { deriveMachinePodAssembly } from './machine-pod-assembly.js';
import { deriveMachineSeatDivisionAssembly } from './machine-seat-division-assembly.js';
import {
  deriveFocusedSeatDivisionGeometry,
  resolveSeatDivisionAttachmentTransform,
} from './machine-seat-division-presentation.js';
import { deriveMachineFacilityAssemblies } from './machine-facility-assembly.js';
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

function divisionDescriptors(seat, amount = 1) {
  return DIVISIONS.flatMap((childId, childIndex) => {
    const geometry = deriveFocusedSeatDivisionGeometry({
      parent: seat,
      childId,
      childIndex,
      amount,
    });
    const assembly = deriveMachineSeatDivisionAssembly({
      parent: seat,
      childId,
      childIndex,
      amount,
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

function facilityDescriptors(machines) {
  return machines.flatMap((machine) => {
    const presentation = deriveMachineFacilityMechanismPresentation(machine, {
      amount: 1,
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
    const worldRadius = Math.max(radius, Math.min(30, radius * 1.72));
    return {
      x: spec.target.x + Math.sin(spec.bearing) * worldRadius * 0.82,
      y: spec.target.y + Math.max(4.4, worldRadius * 0.34),
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
  const seatOpenPod = deriveMachinePodAssembly({
    part: model.seatOne,
    expansionAmount: 1,
    payloadDensity: 0.45,
    adjacentCenterSpacing: 2.812,
  });

  const divisions = currentView === 'seat' ? divisionDescriptors(model.seatOne, 1) : [];
  const facilityParts = model.facilityParts;
  const facility = model.machinery.find((machine) => machine.branchId === 'BRANCH-OUTER-BETA') || model.machinery[0];
  const effectiveCore = currentView === 'world' ? model.core : null;
  const effectivePods = currentView === 'world'
    ? model.pods
    : currentView === 'seat'
      ? [seatOpenPod]
      : [];
  const effectiveFacilities = currentView === 'world'
    ? model.machinery
    : currentView === 'facility' && facility
      ? [facility]
      : [];
  const semanticEdges = Array.isArray(model.topology?.edges) ? model.topology.edges : [];
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
    ...model.topology,
    edges: Object.freeze(visibleEdges),
  });
  const assemblyRender = adapter.setAssemblies({
    core: effectiveCore,
    pods: effectivePods,
    facilities: effectiveFacilities,
    divisions: divisions.length ? [{ id: 'S4-SEAT-01', components: divisions, mechanicalDetails: [] }] : [],
  });
  const topologyMode = currentView === 'world'
    ? MACHINE_CAMERA_MODE.WORLD_OVERVIEW
    : currentView === 'seat'
      ? MACHINE_CAMERA_MODE.DIVISION_FOCUS
      : MACHINE_CAMERA_MODE.FACILITY_FOCUS;
  const topologyBranchId = currentView === 'world'
    ? null
    : currentView === 'seat'
      ? 'BRANCH-SEAT-01'
      : facility?.branchId || null;
  const topologyRender = adapter.setTopology(visibleTopology, {
    mode: topologyMode,
    branchId: topologyBranchId,
  });
  canvas.dataset.structuralView = currentView;
  canvas.dataset.structuralTotalTopologyEdges = String(semanticEdges.length);
  canvas.dataset.structuralVisibleTopologyEdges = String(topologyRender.edgeCount);
  canvas.dataset.structuralVisiblePods = String(effectivePods.length);
  canvas.dataset.structuralVisibleFacilities = String(effectiveFacilities.length);
  canvas.dataset.structuralVisibleDivisions = String(currentView === 'seat' ? DIVISIONS.length : 0);
  canvas.dataset.structuralDescriptorCount = String(assemblyRender.descriptorCount);
  canvas.dataset.structuralConduitEdgeKinds = topologyRender.conduitEdgeKinds.join('|');
  canvas.dataset.structuralMaterialModel = 'S24-authored-theme-family';
  const divisionSubject = subjectFromParts(divisions);
  const spec = deriveMachineCameraSpec({
    cameraId: currentView === 'world'
      ? MACHINE_CAMERA_ID.WORLD
      : currentView === 'seat'
        ? MACHINE_CAMERA_ID.DIVISION
        : MACHINE_CAMERA_ID.FACILITY,
    mode: topologyMode,
    worldSubject: model.worldSubject,
    podSubject: seatOpenPod?.subject,
    divisionSubject,
    facilitySubject: facility?.subject,
    viewport: { width: canvas.clientWidth || 1280, height: canvas.clientHeight || 820 },
  });

  adapter.resize();
  adapter.setCameraPose({
    position: positionFromSpec(spec, { world: currentView === 'world' }),
    target: spec.target,
    fov: spec.fov,
  });
  adapter.render();

  setStatus('READY · ' + currentView.toUpperCase() + ' · 10 seats · 4 facilities · 7 divisions · ' + model.topology.edges.length + ' semantic edges · WebGL2 · Three r' + (model.THREE.REVISION || '186'));
}

document.querySelector('[data-view="world"]')?.addEventListener('click', () => {
  currentView = 'world';
  renderView();
});
document.querySelector('[data-view="seat"]')?.addEventListener('click', () => {
  currentView = 'seat';
  renderView();
});
document.querySelector('[data-view="facility"]')?.addEventListener('click', () => {
  currentView = 'facility';
  renderView();
});
window.addEventListener('resize', renderView);
boot();
