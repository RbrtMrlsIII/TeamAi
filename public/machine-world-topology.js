/**
 * TEAM-EXPERIENCE-029 / S8
 * Canonical world topology composition.
 *
 * Composes existing Core, Division, Facility and Machinery port owners into
 * one semantic graph with reserved corridors and obstacle-aware routes.
 */
import {
  createSpatialConstructionContext,
  requiredStructuralRootsForSlice,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { validateMachineConnectionTopology } from './machine-hero-topology.js';
import { buildMachineCoreConnections } from './machine-core-topology.js';
import { deriveMachineCorePorts } from './machine-core-assembly.js';
import { deriveFocusedSeatDivisionGeometry } from './machine-seat-division-presentation.js';
import { buildSeatDivisionEdge } from './machine-seat-division-topology.js';
import { deriveMachineFacilityAssemblies } from './machine-facility-assembly.js';
import { deriveMachineFacilityMachinery } from './machine-facility-machinery.js';

export const MACHINE_WORLD_TOPOLOGY_ID = 'MACHINE-WORLD-TOPOLOGY';
export const MACHINE_WORLD_TOPOLOGY_VERSION = 'S8-V1';
const ROOT_OWNER = 'frontend/spatial/machine-world-topology.js';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

function rootContext(semanticId) {
  return createSpatialConstructionContext({
    slice: 'S8',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function subjectPart(subject, semanticId, port) {
  return {
    semanticId,
    branchId: semanticId,
    center: subject?.center || { x: 0, y: 0, z: 0 },
    dimensions: subject
      ? {
          x: Math.max(0.01, subject.max.x - subject.min.x),
          y: Math.max(0.01, subject.max.y - subject.min.y),
          z: Math.max(0.01, subject.max.z - subject.min.z),
        }
      : { x: 0.2, y: 0.2, z: 0.2 },
    port,
  };
}

function partBounds(part, clearance = 0) {
  if (!part?.center || !part?.dimensions) return null;
  const x = Math.abs(finite(part.dimensions.x)) * 0.5 + clearance;
  const y = Math.abs(finite(part.dimensions.y)) * 0.5 + clearance;
  const z = Math.abs(finite(part.dimensions.z)) * 0.5 + clearance;
  return {
    min: {
      x: finite(part.center.x) - x,
      y: finite(part.center.y) - y,
      z: finite(part.center.z) - z,
    },
    max: {
      x: finite(part.center.x) + x,
      y: finite(part.center.y) + y,
      z: finite(part.center.z) + z,
    },
  };
}

function routeBounds(route, radius = 0.08) {
  const points = Array.isArray(route) ? route : [];
  if (points.length < 2) return null;
  const pad = Math.max(0.025, finite(radius, 0.08));
  return Object.freeze({
    min: {
      x: Math.min(...points.map((point) => finite(point.x))) - pad,
      y: Math.min(...points.map((point) => finite(point.y))) - pad,
      z: Math.min(...points.map((point) => finite(point.z))) - pad,
    },
    max: {
      x: Math.max(...points.map((point) => finite(point.x))) + pad,
      y: Math.max(...points.map((point) => finite(point.y))) + pad,
      z: Math.max(...points.map((point) => finite(point.z))) + pad,
    },
  });
}

function segmentIntersectsBounds(start, end, bounds, epsilon = 0.000001) {
  if (!bounds) return false;
  let low = 0;
  let high = 1;
  for (const axis of ['x', 'y', 'z']) {
    const origin = finite(start?.[axis]);
    const delta = finite(end?.[axis]) - origin;
    const min = bounds.min[axis] - epsilon;
    const max = bounds.max[axis] + epsilon;
    if (Math.abs(delta) <= epsilon) {
      if (origin < min || origin > max) return false;
      continue;
    }
    let near = (min - origin) / delta;
    let far = (max - origin) / delta;
    if (near > far) [near, far] = [far, near];
    low = Math.max(low, near);
    high = Math.min(high, far);
    if (low > high) return false;
  }
  return true;
}

function obstacleBounds(obstacle, clearance) {
  return obstacle?.min && obstacle?.max
    ? obstacle
    : partBounds(obstacle, clearance);
}

function routeAvoidsObstacles(route, obstacles = [], clearance = 0.16) {
  const points = Array.isArray(route) ? route : [];
  const bounds = (Array.isArray(obstacles) ? obstacles : [])
    .map((obstacle) => obstacleBounds(obstacle, clearance))
    .filter(Boolean);
  for (let index = 1; index < points.length; index += 1) {
    for (const bound of bounds) {
      if (segmentIntersectsBounds(points[index - 1], points[index], bound)) return false;
    }
  }
  return true;
}

function deriveServiceDeckY(parts = [], clearance = 0.16, minimum = 1.9) {
  const physicalClearance = Math.max(0, finite(clearance));
  const deckMargin = Math.max(0.08, physicalClearance * 0.5);
  const required = Math.max(
    0.25,
    ...(
      Array.isArray(parts) ? parts : []
    ).map((part) =>
      finite(part?.center?.y)
      + Math.abs(finite(part?.dimensions?.y)) * 0.5
      + physicalClearance
      + deckMargin,
    ),
  );
  return Math.max(finite(minimum, 1.9), required);
}

function raisedRoute(source, target, deckY) {
  return Object.freeze([
    Object.freeze({ x: finite(source.x), y: finite(source.y), z: finite(source.z) }),
    Object.freeze({ x: finite(source.x), y: deckY, z: finite(source.z) }),
    Object.freeze({ x: finite(target.x), y: deckY, z: finite(target.z) }),
    Object.freeze({ x: finite(target.x), y: finite(target.y), z: finite(target.z) }),
  ]);
}

function makeEdge({
  semanticEdgeId,
  kind,
  source,
  target,
  route,
  clearance,
  obstacles = [],
  corridorReserved = true,
}) {
  const topology = validateMachineConnectionTopology(
    source,
    target,
    { route },
    { clearance },
  );
  const avoids = routeAvoidsObstacles(route, obstacles, clearance);
  const corridorRadius = Math.max(0.025, finite(clearance) * 0.42);
  return Object.freeze({
    id: semanticEdgeId,
    semanticEdgeId,
    kind,
    sourceBranchId: source.branchId || source.semanticId,
    targetBranchId: target.branchId || target.semanticId,
    sourcePort: source.port,
    targetPort: target.port,
    route: Object.freeze(route),
    topology,
    corridor: Object.freeze({
      id: 'CORRIDOR:' + semanticEdgeId,
      semanticEdgeId,
      radius: corridorRadius,
      bounds: routeBounds(route, corridorRadius),
      reserved: Boolean(corridorReserved),
    }),
    corridorReserved: Boolean(corridorReserved),
    obstacleAvoidance: avoids,
    routeContinuous: topology.valid && topology.reasons.length === 0 && avoids,
    ...rootContext(semanticEdgeId),
    presentationOnly: true,
  });
}

function machinePort(machine, role) {
  return machine?.ports?.find((port) => port.role === role) || null;
}

function safeMachinePart(machine, port) {
  return subjectPart(
    machine?.subject,
    machine?.branchId || 'MACHINE',
    port?.point,
  );
}

function safePodPart(pod, port) {
  return subjectPart(
    pod?.podAssembly?.subject,
    pod?.semanticKey || pod?.branchId || 'POD',
    port,
  );
}

function safeCorePart(hub, port, corePorts) {
  const center = hub?.center || { x: 0, y: 0, z: 0 };
  const maxRadialReach = Math.max(
    ...(
      Array.isArray(corePorts) ? corePorts : []
    ).map((entry) => Math.hypot(
      finite(entry.point.x) - finite(center.x),
      finite(entry.point.z) - finite(center.z),
    ) + finite(entry.radius, 0.13)),
    0.8,
  );
  const maxVerticalReach = Math.max(
    ...(
      Array.isArray(corePorts) ? corePorts : []
    ).map((entry) =>
      Math.abs(finite(entry.point.y) - finite(center.y)) + finite(entry.radius, 0.13),
    ),
    Math.abs(finite(hub?.dimensions?.y)) * 0.5,
  );
  return {
    semanticId: 'HUB-CORE',
    branchId: 'HUB-CORE',
    center: { ...center },
    dimensions: {
      x: maxRadialReach * 2,
      y: maxVerticalReach * 2,
      z: maxRadialReach * 2,
    },
    port,
  };
}

export function buildMachineWorldTopology({
  scene,
  facilityAssemblies = null,
  facilityMachinery = null,
  seatDivisionAmount = 1,
  clearance = 0.16,
} = {}) {
  if (!scene?.hub || !Array.isArray(scene?.parts)) {
    return Object.freeze({
      id: MACHINE_WORLD_TOPOLOGY_ID,
      version: MACHINE_WORLD_TOPOLOGY_VERSION,
      ...rootContext('S8:WORLD'),
      edges: Object.freeze([]),
      corridors: Object.freeze([]),
      valid: false,
      reasons: Object.freeze(['MISSING_SCENE']),
    });
  }

  const innerPods = scene.parts.filter((part) => part?.kind === 'inner-pod');
  const outerHousings = scene.parts.filter((part) => part?.kind === 'outer-housing');
  const facilities = facilityAssemblies || deriveMachineFacilityAssemblies({ outerHousings });
  const machinery = facilityMachinery || deriveMachineFacilityMachinery({
    facilityAssemblies: facilities,
  });
  const corePorts = deriveMachineCorePorts({
    hub: scene.hub,
    expansionAmount: scene.expansionAmount,
    requestedClearance: clearance,
  });

  const edges = [
    ...buildMachineCoreConnections({
      hub: scene.hub,
      innerPods,
      outerHousings,
      seatCount: scene.seatCount,
      expansionAmount: scene.expansionAmount,
    }).map((edge) => {
      const obstacles = scene.parts.filter(
        (part) =>
          part.branchId !== edge.sourceBranchId
          && part.branchId !== edge.targetBranchId,
      );
      const obstacleAvoidance = routeAvoidsObstacles(
        edge.route,
        obstacles,
        clearance,
      );
      const topologyValid = edge?.route?.length >= 2
        && edge?.topology?.valid !== false;
      return Object.freeze({
        ...edge,
        ...rootContext(edge.semanticEdgeId || edge.id),
        corridorReserved: false,
        obstacleAvoidance,
        routeContinuous: topologyValid && obstacleAvoidance,
      });
    }),
  ];

  const divisionIds = Object.freeze([
    'SEAT_CONNECTION',
    'SEAT_BEHAVIOR',
    'SEAT_TOOLKIT',
    'SEAT_CAPABILITIES',
    'SEAT_AUTHORIZATION',
    'SEAT_WORKSPACE_SCOPE',
    'SEAT_TASK_EVIDENCE',
  ]);

  for (const pod of innerPods) {
    for (let index = 0; index < divisionIds.length; index += 1) {
      const childId = divisionIds[index];
      const geometry = deriveFocusedSeatDivisionGeometry({
        parent: pod,
        childId,
        childIndex: index,
        amount: finite(seatDivisionAmount, 1),
      });
      const edge = buildSeatDivisionEdge({
        parent: pod,
        geometry,
        childId,
        childIndex: index,
      });
      if (!geometry || !edge) continue;
      edges.push(makeEdge({
        semanticEdgeId: edge.semanticEdgeId,
        kind: 'pod-division',
        source: {
          ...subjectPart(
            null,
            'TREE-HERO-SEAT#' + pod.seatIndex + ':' + childId,
            edge.sourcePort,
          ),
          center: geometry.center,
          dimensions: {
            x: geometry.dimensions.width,
            y: geometry.dimensions.height,
            z: geometry.dimensions.depth,
          },
          branchId: childId,
        },
        target: {
          ...pod,
          semanticId: pod.semanticKey || pod.branchId,
          port: edge.targetPort,
        },
        route: edge.route,
        clearance,
        obstacles: innerPods.filter((candidate) => candidate !== pod),
      }));
    }
  }

  const machineByBranch = new Map(
    machinery.map((machine) => [machine.branchId, machine]),
  );
  const facilityByBranch = new Map(
    facilities.map((assembly) => [assembly.branchId, assembly]),
  );

  for (const pod of innerPods) {
    const candidates = [...machineByBranch.values()];
    const podAngle = Math.atan2(pod.center.z, pod.center.x);
    const wrap = (angle) =>
      Math.abs(((angle + Math.PI) % (Math.PI * 2)) - Math.PI);
    const machine = candidates.reduce((best, candidate) => {
      if (!best) return candidate;
      const bestHousing = facilityByBranch.get(best.branchId)?.outerHousing;
      const candidateHousing = facilityByBranch.get(candidate.branchId)?.outerHousing;
      const bestAngle = Math.atan2(bestHousing?.center?.z || 0, bestHousing?.center?.x || 0);
      const candidateAngle = Math.atan2(candidateHousing?.center?.z || 0, candidateHousing?.center?.x || 0);
      return wrap(candidateAngle - podAngle) < wrap(bestAngle - podAngle)
        ? candidate
        : best;
    }, null);
    const machineFacility = machine ? facilityByBranch.get(machine.branchId) : null;
    const targetPort = machinePort(machine, 'machine-core-input');
    if (!pod.port || !machine || !machineFacility || !targetPort) continue;

    const source = Object.freeze({
      ...safePodPart(pod, pod.port),
      semanticId: pod.semanticKey || pod.branchId,
      branchId: pod.branchId,
    });
    const target = safeMachinePart(machine, targetPort);
    const deckY = deriveServiceDeckY(scene.parts, clearance, 1.90);

    edges.push(makeEdge({
      semanticEdgeId: 'EDGE:POD-FACILITY:' + pod.branchId + '=>' + machine.branchId,
      kind: 'pod-facility',
      source,
      target,
      route: raisedRoute(source.port, target.port, deckY),
      clearance,
      obstacles: scene.parts.filter(
        (part) => part.branchId !== pod.branchId && part.branchId !== machine.branchId,
      ),
    }));
  }

  for (let index = 0; index < machinery.length; index += 1) {
    const sourceMachine = machinery[index];
    const targetMachine = machinery[(index + 1) % machinery.length];
    const sourceFacility = facilityByBranch.get(sourceMachine?.branchId);
    const targetFacility = facilityByBranch.get(targetMachine?.branchId);
    const sourcePort = machinePort(sourceMachine, 'machine-output');
    const targetPort = machinePort(targetMachine, 'machine-core-input');
    if (!sourcePort || !targetPort || !sourceFacility || !targetFacility) continue;

    const source = safeMachinePart(sourceMachine, sourcePort);
    const target = safeMachinePart(targetMachine, targetPort);
    const deckY = deriveServiceDeckY(scene.parts, clearance, 2.25);

    edges.push(makeEdge({
      semanticEdgeId:
        'EDGE:FACILITY-FACILITY:' +
        sourceMachine.branchId +
        '=>' +
        targetMachine.branchId,
      kind: 'facility-facility',
      source,
      target,
      route: raisedRoute(source.port, target.port, deckY),
      clearance,
      obstacles: scene.parts.filter(
        (part) =>
          part.branchId !== sourceMachine.branchId &&
          part.branchId !== targetMachine.branchId,
      ),
    }));
  }

  if (corePorts.length) {
    for (const machine of machinery) {
      const targetPort = machinePort(machine, 'machine-core-input');
      if (!targetPort) continue;
      const machineFacility = facilityByBranch.get(machine.branchId);
      if (!machineFacility) continue;
      const targetAngle = Math.atan2(
        machineFacility.outerHousing.center.z,
        machineFacility.outerHousing.center.x,
      );
      const wrap = (angle) =>
        Math.abs(((angle + Math.PI) % (Math.PI * 2)) - Math.PI);
      const hubPort = corePorts.reduce(
        (best, port) =>
          !best || wrap(port.angle - targetAngle) < wrap(best.angle - targetAngle)
            ? port
            : best,
        null,
      );
      if (!hubPort) continue;
      const source = safeCorePart(scene.hub, hubPort.point, corePorts);
      const target = safeMachinePart(machine, targetPort);
      const deckY = deriveServiceDeckY(scene.parts, clearance, 2.55);
      edges.push(makeEdge({
        semanticEdgeId: 'EDGE:WORKSPACE-CONTRIBUTION:HUB-CORE=>' + machine.branchId,
        kind: 'workspace-contribution',
        source,
        target,
        route: raisedRoute(source.port, target.port, deckY),
        clearance,
        obstacles: scene.parts.filter(
          (part) => part.branchId !== machine.branchId && part.branchId !== scene.hub.branchId,
        ),
      }));
    }
  }

  for (let index = 0; index < innerPods.length - 1; index += 1) {
    const sourcePod = innerPods[index];
    const targetPod = innerPods[index + 1];
    if (!sourcePod.port || !targetPod.port) continue;
    const source = Object.freeze({
      ...safePodPart(sourcePod, sourcePod.port),
      semanticId: sourcePod.semanticKey || sourcePod.branchId,
      branchId: sourcePod.branchId,
    });
    const target = Object.freeze({
      ...safePodPart(targetPod, targetPod.port),
      semanticId: targetPod.semanticKey || targetPod.branchId,
      branchId: targetPod.branchId,
    });
    const deckY = deriveServiceDeckY(scene.parts, clearance, 1.90);
    edges.push(makeEdge({
      semanticEdgeId:
        'EDGE:ADJACENT-SEAT:' +
        sourcePod.branchId +
        '=>' +
        targetPod.branchId,
      kind: 'adjacent-seat',
      source,
      target,
      route: raisedRoute(source.port, target.port, deckY),
      clearance,
      obstacles: innerPods.filter(
        (part) => part !== sourcePod && part !== targetPod,
      ),
    }));
  }

  const corridors = Object.freeze(
    edges.map((edge) => Object.freeze({
      id: edge.corridor?.id || 'CORRIDOR:' + edge.semanticEdgeId,
      semanticEdgeId: edge.semanticEdgeId,
      bounds: edge.corridor?.bounds || null,
      radius: edge.corridor?.radius || 0,
      reserved: Boolean(edge.corridorReserved),
    })),
  );

  const invalidEdges = edges.filter(
    (edge) =>
      !edge.semanticEdgeId ||
      !edge.routeContinuous ||
      !Array.isArray(edge.route) ||
      edge.route.length < 2,
  );
  const root = rootContext('S8:WORLD');
  return Object.freeze({
    id: MACHINE_WORLD_TOPOLOGY_ID,
    version: MACHINE_WORLD_TOPOLOGY_VERSION,
    ...root,
    seatCount: scene.seatCount,
    edgeCount: edges.length,
    edges: Object.freeze(edges),
    corridors,
    valid: invalidEdges.length === 0,
    reasons: Object.freeze(
      invalidEdges.map((edge) => edge.semanticEdgeId || edge.id),
    ),
    facilityCount: facilities.length,
    machineryCount: machinery.length,
    divisionEdgeCount: edges.filter((edge) => edge.kind === 'pod-division').length,
    facilityEdgeCount: edges.filter((edge) => edge.kind === 'pod-facility').length,
    facilityFacilityEdgeCount: edges.filter((edge) => edge.kind === 'facility-facility').length,
    workspaceContributionEdgeCount: edges.filter((edge) => edge.kind === 'workspace-contribution').length,
    adjacentSeatEdgeCount: edges.filter((edge) => edge.kind === 'adjacent-seat').length,
    presentationOnly: true,
  });
}

const RENDERABLE_WORLD_EDGE_KINDS = Object.freeze([
  'pod-division',
  'pod-facility',
  'facility-facility',
  'workspace-contribution',
  'adjacent-seat',
]);

export function getRenderableMachineWorldEdges(topology) {
  return Object.freeze(
    (Array.isArray(topology?.edges) ? topology.edges : [])
      .filter((edge) =>
        RENDERABLE_WORLD_EDGE_KINDS.includes(edge?.kind)
        && edge?.semanticEdgeId
        && Array.isArray(edge?.route)
        && edge.route.length >= 2
      )
      .map((edge) => Object.freeze({
        semanticEdgeId: edge.semanticEdgeId,
        kind: edge.kind,
        sourceBranchId: edge.sourceBranchId || edge.source?.branchId || null,
        targetBranchId: edge.targetBranchId || edge.target?.branchId || null,
        route: edge.route,
        corridor: edge.corridor || null,
        presentationOnly: true,
      })),
  );
}

export function validateMachineWorldTopology(
  topology,
  { expectedSeatCount = null } = {},
) {
  const reasons = [];
  const root = validateSpatialConstructionNode(topology || {});
  if (!root.valid) reasons.push(...root.reasons);
  if (topology?.constructionSlice !== 'S8') reasons.push('WORLD_TOPOLOGY_NOT_S8');
  if (topology?.constructionOwner !== ROOT_OWNER) reasons.push('WORLD_TOPOLOGY_OWNER_MISMATCH');
  if (expectedSeatCount != null && topology?.seatCount !== expectedSeatCount) {
    reasons.push('WORLD_TOPOLOGY_SEAT_COUNT_MISMATCH');
  }

  const seen = new Set();
  for (const edge of topology?.edges || []) {
    if (!edge?.semanticEdgeId) reasons.push('MISSING_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId && seen.has(edge.semanticEdgeId)) {
      reasons.push('DUPLICATE_SEMANTIC_EDGE_ID');
    }
    if (edge?.semanticEdgeId) seen.add(edge.semanticEdgeId);
    if (!Array.isArray(edge?.route) || edge.route.length < 2) {
      reasons.push(edge?.semanticEdgeId + ':INVALID_ROUTE');
    }
    if (edge?.constructionSlice !== 'S8') {
      reasons.push(edge?.semanticEdgeId + ':EDGE_NOT_S8');
    }
    if (edge?.constructionOwner !== ROOT_OWNER) {
      reasons.push(edge?.semanticEdgeId + ':EDGE_OWNER_MISMATCH');
    }
    if (!edge?.corridorReserved && !['inner-spoke','outer-spine','lattice-link'].includes(edge?.kind)) {
      reasons.push(edge?.semanticEdgeId + ':CORRIDOR_NOT_RESERVED');
    }
    if (edge?.obstacleAvoidance === false) {
      reasons.push(edge?.semanticEdgeId + ':OBSTACLE_AVOIDANCE_FAILED');
    }
    if (edge?.routeContinuous === false) {
      reasons.push(edge?.semanticEdgeId + ':ROUTE_NOT_CONTINUOUS');
    }
  }

  const expectedKinds = {
    'pod-division': topology?.seatCount ? topology.seatCount * 7 : 0,
    'pod-facility': topology?.seatCount || 0,
    'facility-facility': 4,
    'workspace-contribution': 4,
    'adjacent-seat': topology?.seatCount ? Math.max(0, topology.seatCount - 1) : 0,
  };
  for (const [kind, expected] of Object.entries(expectedKinds)) {
    const actual = (topology?.edges || []).filter((edge) => edge.kind === kind).length;
    if (actual !== expected) {
      reasons.push(
        'EDGE_COUNT_' + kind.toUpperCase().replace(/-/g, '_') + '_MISMATCH',
      );
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    edgeCount: topology?.edgeCount || 0,
    corridorCount: topology?.corridors?.length || 0,
    inheritedStructuralRoots: requiredStructuralRootsForSlice('S8'),
  });
}
