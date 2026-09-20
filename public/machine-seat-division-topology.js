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
    id: 'TREE-HERO-SEAT#' + seatIndex + ':' + semanticId + ':PORT',
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
    id: geometry.id.replace(/:GEOMETRY$/, ':PORT'),
    tree: 'TREE-HERO-SEAT',
    seatIndex,
    division: child,
    role: 'division-port',
    x: Number(geometry.port.x) || 0,
    y: Number(geometry.port.y) || 0,
    z: Number(geometry.port.z) || 0,
  });
  const mid = Object.freeze({
    x: (source.x + target.x) * 0.5,
    y: Math.max(source.y, target.y) + Math.max(0.06, Number(geometry.clearance) || 0.06),
    z: (source.z + target.z) * 0.5,
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
    route: Object.freeze([source, mid, target]),
    semanticSource: semanticChildKey,
    semanticTarget: parent.semanticKey,
    clearance: Number(geometry.clearance) || 0,
    presentationOnly: true,
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
