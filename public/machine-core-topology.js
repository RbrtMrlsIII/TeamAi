import { deriveMachineCorePorts } from './machine-core-assembly.js';
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';
import { EPSILON, pointEqual } from './machine-geometry-primitives.js';

const ROOT_OWNER = 'frontend/spatial/machine-core-topology.js';
const makeSemanticEdgeId = (sourceBranchId, targetBranchId, kind) => `EDGE:${kind}:${sourceBranchId}->${targetBranchId}`;

function nearestCorePort(part, ports) {
  if (!part || !Array.isArray(ports) || !ports.length) return null;
  const angle = Math.atan2(Number(part.center?.z) || 0, Number(part.center?.x) || 0);
  const wrapped = (value) => {
    const twoPi = Math.PI * 2;
    const normalized = ((value % twoPi) + twoPi) % twoPi;
    return normalized > Math.PI ? normalized - twoPi : normalized;
  };
  return ports.reduce((best, port) => {
    if (!best) return port;
    const candidateDistance = Math.abs(wrapped(angle - port.angle));
    const bestDistance = Math.abs(wrapped(angle - best.angle));
    return candidateDistance < bestDistance ? port : best;
  }, null);
}

function rootedEdge(semanticEdgeId, payload) {
  return {
    ...payload,
    ...createSpatialConstructionContext({
      slice: 'S8',
      owner: ROOT_OWNER,
      semanticId: semanticEdgeId,
      semanticBoundary: 'presentation-only',
    }),
  };
}

function portAttachedToPart(part, port, tolerance = 0.18) {
  if (!part?.center || !part?.dimensions || !port) return false;
  const halfX = Math.abs(Number(part.dimensions.x) || 0) * 0.5 + tolerance;
  const halfY = Math.abs(Number(part.dimensions.y) || 0) * 0.5 + tolerance;
  const halfZ = Math.abs(Number(part.dimensions.z) || 0) * 0.5 + tolerance;
  return (
    Math.abs(Number(port.x) - Number(part.center.x)) <= halfX
    && Math.abs(Number(port.y) - Number(part.center.y)) <= halfY
    && Math.abs(Number(port.z) - Number(part.center.z)) <= halfZ
  );
}

export function buildMachineCoreConnections({
  hub,
  innerPods = [],
  outerHousings = [],
  seatCount = innerPods.length,
  expansionAmount = 0,
  requestedClearance = 0.16,
} = {}) {
  if (!hub?.center || !hub?.dimensions) return Object.freeze([]);
  const ports = deriveMachineCorePorts({ hub, expansionAmount, requestedClearance });
  if (!ports.length) return Object.freeze([]);
  const connections = [];
  const count = Math.max(1, Number(seatCount) || innerPods.length || 1);

  for (const pod of innerPods) {
    const corePort = nearestCorePort(pod, ports);
    if (!corePort?.point || !pod?.port) continue;
    const semanticEdgeId = makeSemanticEdgeId('HUB-CORE', pod.branchId, 'inner-spoke');
    connections.push(rootedEdge(semanticEdgeId, {
      id: `${pod.branchId}:HUB`,
      semanticEdgeId,
      sourceBranchId: 'HUB-CORE',
      targetBranchId: pod.branchId,
      sourcePort: corePort.point,
      targetPort: pod.port,
      sourceCorePortId: corePort.id,
      kind: 'inner-spoke',
      route: [
        corePort.point,
        { x: pod.center.x * 0.52, y: Math.max(hub.level, pod.level) + 0.22, z: pod.center.z * 0.52 },
        pod.port,
      ],
    }));
  }

  outerHousings.forEach((housing, index) => {
    const corePort = nearestCorePort(housing, ports);
    if (!corePort?.point || !housing?.port) return;
    const semanticEdgeId = makeSemanticEdgeId('HUB-CORE', housing.branchId, 'outer-spine');
    connections.push(rootedEdge(semanticEdgeId, {
      id: `${housing.branchId}:HUB`,
      semanticEdgeId,
      sourceBranchId: 'HUB-CORE',
      targetBranchId: housing.branchId,
      sourcePort: corePort.point,
      targetPort: housing.port,
      sourceCorePortId: corePort.id,
      kind: 'outer-spine',
      route: [
        corePort.point,
        { x: housing.center.x * 0.35, y: housing.level + 0.26, z: housing.center.z * 0.35 },
        housing.port,
      ],
    }));

    const base = Math.floor(index * count / 4 + 0.5);
    const left = innerPods[base % Math.max(1, innerPods.length)];
    const right = innerPods[(base + 1) % Math.max(1, innerPods.length)];
    for (const pod of new Set([left, right])) {
      if (!pod?.port || !housing?.port) continue;
      const latticeSemanticEdgeId = makeSemanticEdgeId(housing.branchId, pod.branchId, 'lattice-link');
      connections.push(rootedEdge(latticeSemanticEdgeId, {
        id: `${housing.branchId}:${pod.branchId}`,
        semanticEdgeId: latticeSemanticEdgeId,
        sourceBranchId: housing.branchId,
        targetBranchId: pod.branchId,
        sourcePort: housing.port,
        targetPort: pod.port,
        kind: 'lattice-link',
        route: [
          housing.port,
          { x: (housing.center.x + pod.center.x) / 2, y: Math.max(housing.level, pod.level) + 0.36, z: (housing.center.z + pod.center.z) / 2 },
          pod.port,
        ],
      }));
    }
  });

  return Object.freeze(connections);
}

export function validateMachineCoreConnections(core, { epsilon = EPSILON } = {}) {
  const reasons = [];
  const edges = Array.isArray(core?.connections) ? core.connections : [];
  const parts = Array.isArray(core?.parts) ? core.parts : [];
  const byBranch = core?.byBranch instanceof Map
    ? core.byBranch
    : new Map(parts.map((part) => [part?.branchId, part]));
  const seen = new Set();
  const corePorts = deriveMachineCorePorts({ hub: core?.hub, expansionAmount: core?.expansionAmount });

  for (const edge of edges) {
    const source = byBranch.get(edge?.sourceBranchId);
    const target = byBranch.get(edge?.targetBranchId);
    if (!edge?.semanticEdgeId) reasons.push('MISSING_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId && seen.has(edge.semanticEdgeId)) reasons.push('DUPLICATE_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId) seen.add(edge.semanticEdgeId);
    if (!source) reasons.push('MISSING_SOURCE_BRANCH');
    if (!target) reasons.push('MISSING_TARGET_BRANCH');
    if (source && target && source.branchId === target.branchId) reasons.push('SELF_EDGE');
    if (edge?.sourceBranchId === 'HUB-CORE') {
      const corePort = corePorts.find((port) => pointEqual(edge?.sourcePort, port.point, epsilon));
      if (!corePort) reasons.push('SOURCE_CORE_PORT_MISMATCH');
      if (!edge?.sourceCorePortId) reasons.push('MISSING_SOURCE_CORE_PORT_ID');
      if (edge?.sourceCorePortId && corePort && edge.sourceCorePortId !== corePort.id) reasons.push('SOURCE_CORE_PORT_ID_MISMATCH');
    } else if (!source?.port || !pointEqual(edge?.sourcePort, source.port, epsilon)) {
      reasons.push('SOURCE_PORT_MISMATCH');
    }
    if (edge?.sourceBranchId !== 'HUB-CORE' && source && !portAttachedToPart(source, edge.sourcePort)) {
      reasons.push('SOURCE_PORT_DETACHED_FROM_PART');
    }
    if (!target?.port || !pointEqual(edge?.targetPort, target.port, epsilon)) reasons.push('TARGET_PORT_MISMATCH');
    if (target && !portAttachedToPart(target, edge.targetPort)) {
      reasons.push('TARGET_PORT_DETACHED_FROM_PART');
    }
    if (!Array.isArray(edge?.route) || edge.route.length < 2) reasons.push('INVALID_EDGE_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.some((point) => !pointEqual(point, point, epsilon))) reasons.push('NONFINITE_EDGE_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.length >= 2) {
      if (!pointEqual(edge.route[0], edge.sourcePort, epsilon)) reasons.push('EDGE_ROUTE_SOURCE_MISMATCH');
      if (!pointEqual(edge.route.at(-1), edge.targetPort, epsilon)) reasons.push('EDGE_ROUTE_TARGET_MISMATCH');
    }
    if (edge?.constructionSlice !== 'S8') reasons.push('EDGE_NOT_ROOTED_AT_S8');
    if (edge?.constructionOwner !== ROOT_OWNER) reasons.push('EDGE_TOPOLOGY_OWNER_MISMATCH');
  }

  const expectedSeatCount = Math.max(1, Number(core?.seatCount) || 0);
  const expectedKinds =
    edges.filter((edge) => edge?.kind === 'inner-spoke').length === expectedSeatCount
    && edges.filter((edge) => edge?.kind === 'outer-spine').length === 4
    && edges.filter((edge) => edge?.kind === 'lattice-link').length === Math.min(expectedSeatCount, 2) * 4;
  if (!expectedKinds) reasons.push('UNEXPECTED_EDGE_KIND_COUNTS');

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    edgeCount: edges.length,
    semanticEdgeIds: Object.freeze([...seen]),
  });
}
