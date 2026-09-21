import { validateMachineConnectionTopology } from './machine-hero-topology.js';

const EPSILON = 1e-6;

const finite = (value) => Number.isFinite(Number(value));

const equalPoint = (a, b, epsilon = EPSILON) =>
  finite(a?.x) && finite(a?.y) && finite(a?.z)
  && Math.abs(Number(a.x) - Number(b.x)) <= epsilon
  && Math.abs(Number(a.y) - Number(b.y)) <= epsilon
  && Math.abs(Number(a.z) - Number(b.z)) <= epsilon;

function branchCenter(parent) {
  return {
    x: Number(parent?.center?.x) || 0,
    y: Number(parent?.center?.y) || 0,
    z: Number(parent?.center?.z) || 0,
  };
}

export function seatDivisionPort(parent, childId, childIndex = 0) {
  const seatIndex = Number.isInteger(parent?.seatIndex) ? parent.seatIndex : null;
  const semanticId = String(childId || '');
  if (seatIndex == null || !semanticId.startsWith('SEAT_')) return null;
  const center = branchCenter(parent);
  const angle = Math.atan2(center.z, center.x);
  const radialX = Math.cos(angle);
  const radialZ = Math.sin(angle);
  const tangentX = -radialZ;
  const tangentZ = radialX;
  const scale = Math.max(
    Number(parent?.dimensions?.x) || 0,
    Number(parent?.dimensions?.z) || 0,
    0.2,
  );
  const index = Math.max(0, Number(childIndex) || 0);
  const tangentOffset = scale * 0.06 * (index - 3);
  const radialOffset = scale * 0.46;
  return Object.freeze({
    id: 'TREE-HERO-SEAT#' + seatIndex + ':SEAT_SHELL:' + semanticId + ':PORT',
    tree: 'TREE-HERO-SEAT',
    seatIndex,
    division: semanticId,
    role: 'seat-shell-port',
    x: center.x + radialX * radialOffset + tangentX * tangentOffset,
    y: center.y + Math.max(0.08, Number(parent?.dimensions?.y) || 0.5) * 0.18,
    z: center.z + radialZ * radialOffset + tangentZ * tangentOffset,
  });
}

export function buildSeatDivisionEdge({
  parent,
  geometry,
  childId,
  childIndex = 0,
} = {}) {
  const child = String(childId || '');
  const seatIndex = Number.isInteger(parent?.seatIndex) ? parent.seatIndex : null;
  if (
    seatIndex == null
    || !child.startsWith('SEAT_')
    || !geometry?.port
    || !parent?.semanticKey
  ) return null;

  const target = seatDivisionPort(parent, child, childIndex);
  if (!target) return null;
  const source = Object.freeze({
    id: geometry.id.replace(/:GEOMETRY$/, ':DIVISION_PORT'),
    tree: 'TREE-HERO-SEAT',
    seatIndex,
    division: child,
    role: 'division-port',
    x: Number(geometry.port.x) || 0,
    y: Number(geometry.port.y) || 0,
    z: Number(geometry.port.z) || 0,
  });
  const clearance = Math.max(0.06, Number(geometry.clearance) || 0.06);
  const parentHeight = Math.max(0.2, Number(parent?.dimensions?.y) || 0.5);
  const deckY = Math.max(source.y, target.y) + parentHeight + clearance * 2;
  const sourceLift = Object.freeze({
    x: source.x,
    y: deckY,
    z: source.z,
  });
  const targetLift = Object.freeze({
    x: target.x,
    y: deckY,
    z: target.z,
  });
  const semanticChildKey = 'TREE-HERO-SEAT#' + seatIndex + ':' + child;
  const semanticEdgeId = 'EDGE:SEAT-DIVISION:' + semanticChildKey + '=>' + parent.semanticKey;
  return Object.freeze({
    id: semanticEdgeId,
    semanticEdgeId,
    kind: 'seat-division',
    sourceBranchId: child,
    targetBranchId: parent.branchId,
    sourcePort: source,
    targetPort: target,
    route: Object.freeze([source, sourceLift, targetLift, target]),
    semanticSource: semanticChildKey,
    semanticTarget: parent.semanticKey,
    clearance: Number(geometry.clearance) || 0,
    presentationOnly: true,
  });
}

function boundsForGeometry(geometry, padding = 0) {
  if (!geometry?.center || !geometry?.dimensions) return null;
  const half = {
    x: Math.max(0, Number(geometry.dimensions.width) || 0) * 0.5 + padding,
    y: Math.max(0, Number(geometry.dimensions.height) || 0) * 0.5 + padding,
    z: Math.max(0, Number(geometry.dimensions.depth) || 0) * 0.5 + padding,
  };
  const center = {
    x: Number(geometry.center.x) || 0,
    y: Number(geometry.center.y) || 0,
    z: Number(geometry.center.z) || 0,
  };
  return {
    min: { x: center.x - half.x, y: center.y - half.y, z: center.z - half.z },
    max: { x: center.x + half.x, y: center.y + half.y, z: center.z + half.z },
  };
}

function segmentIntersectsAabb(a, b, bounds, epsilon = EPSILON) {
  if (!bounds) return false;
  let tMin = 0;
  let tMax = 1;
  for (const axis of ['x', 'y', 'z']) {
    const start = Number(a?.[axis]);
    const delta = Number(b?.[axis]) - start;
    const min = bounds.min[axis] - epsilon;
    const max = bounds.max[axis] + epsilon;
    if (!Number.isFinite(start) || !Number.isFinite(delta)) return true;
    if (Math.abs(delta) <= epsilon) {
      if (start < min || start > max) return false;
      continue;
    }
    const inverse = 1 / delta;
    let near = (min - start) * inverse;
    let far = (max - start) * inverse;
    if (near > far) [near, far] = [far, near];
    tMin = Math.max(tMin, near);
    tMax = Math.min(tMax, far);
    if (tMin > tMax) return false;
  }
  return tMax >= 0 && tMin <= 1;
}

export function validateSeatDivisionNetwork({
  parent,
  divisions = [],
  edges = [],
  obstacles = divisions,
  clearance = 0.16,
  epsilon = EPSILON,
} = {}) {
  const reasons = [];
  const list = Array.isArray(divisions) ? divisions.filter(Boolean) : [];
  const normalizedEdges = Array.isArray(edges) ? edges.filter(Boolean) : [];
  const byChild = new Map(
    list.map((division) => [String(division.semantic), division]),
  );

  for (const edge of normalizedEdges) {
    const source = byChild.get(String(edge.semanticSource || '').split(':').at(-1));
    const target = parent;
    if (!source || !target) {
      reasons.push('MISSING_NETWORK_ENDPOINT');
      continue;
    }
    const sourcePart = {
      semanticId: edge.sourcePort?.division || source.semantic || null,
      center: source.center,
      dimensions: {
        x: source.dimensions?.width,
        y: source.dimensions?.height,
        z: source.dimensions?.depth,
      },
      port: edge.sourcePort,
    };
    const targetPart = {
      semanticId: target.semanticId,
      center: target.center,
      dimensions: target.dimensions,
      port: edge.targetPort,
    };
    const topology = validateMachineConnectionTopology(sourcePart, targetPart, {
      route: edge.route,
    }, { clearance, epsilon });
    if (!topology.valid) {
      reasons.push(...topology.reasons.map((reason) => edge.semanticEdgeId + ':' + reason));
    }

    const obstacleList = Array.isArray(obstacles) ? obstacles : [];
    for (const obstacle of obstacleList) {
      if (!obstacle || obstacle === source || obstacle === target) continue;
      const obstacleSemantic = String(obstacle.semantic || obstacle.id || '');
      if (
        obstacleSemantic === String(edge.semanticSource || '').split(':').at(-1)
        || obstacleSemantic === String(edge.semanticTarget || '').split(':').at(-1)
      ) {
        continue;
      }
      const bounds = boundsForGeometry(obstacle, Math.max(0, Number(clearance) || 0));
      if (!bounds || !Array.isArray(edge.route) || edge.route.length < 2) continue;
      for (let index = 1; index < edge.route.length; index += 1) {
        if (segmentIntersectsAabb(edge.route[index - 1], edge.route[index], bounds, epsilon)) {
          reasons.push(edge.semanticEdgeId + ':ROUTE_CROSSES_OBSTACLE:' + obstacleSemantic);
          break;
        }
      }
    }
  }

  const identities = normalizedEdges.map((edge) => edge.semanticEdgeId).filter(Boolean);
  if (identities.length !== new Set(identities).size) reasons.push('DUPLICATE_SEMANTIC_EDGE_ID');

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    divisionCount: list.length,
    edgeCount: normalizedEdges.length,
  });
}

export function validateSeatDivisionEdges(edges = [], { expectedCount = 0, epsilon = EPSILON } = {}) {
  const reasons = [];
  const seen = new Set();
  const list = Array.isArray(edges) ? edges : [];
  for (const edge of list) {
    if (!edge?.semanticEdgeId) reasons.push('MISSING_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId && seen.has(edge.semanticEdgeId)) reasons.push('DUPLICATE_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId) seen.add(edge.semanticEdgeId);
    if (!edge?.sourcePort?.id || !edge?.targetPort?.id) reasons.push('MISSING_PORT_ID');
    if (!Array.isArray(edge?.route) || edge.route.length < 2) reasons.push('INVALID_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.some((point) => !equalPoint(point, point, epsilon))) reasons.push('NONFINITE_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.length >= 2) {
      if (!equalPoint(edge.route[0], edge.sourcePort, epsilon)) reasons.push('SOURCE_ROUTE_MISMATCH');
      if (!equalPoint(edge.route.at(-1), edge.targetPort, epsilon)) reasons.push('TARGET_ROUTE_MISMATCH');
    }
  }
  if (Number.isInteger(expectedCount) && expectedCount > 0 && list.length !== expectedCount) reasons.push('UNEXPECTED_EDGE_COUNT');
  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze([...new Set(reasons)]),
    edgeCount: list.length,
    semanticEdgeIds: Object.freeze([...seen]),
  });
}
