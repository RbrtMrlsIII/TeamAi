const EPSILON = 1e-6;

const finite = (value) => Number.isFinite(Number(value));

function pointEqual(a, b, epsilon = EPSILON) {
  return finite(a?.x) && finite(a?.y) && finite(a?.z)
    && Math.abs(Number(a.x) - Number(b.x)) <= epsilon
    && Math.abs(Number(a.y) - Number(b.y)) <= epsilon
    && Math.abs(Number(a.z) - Number(b.z)) <= epsilon;
}

export function validateMachineCoreConnections(core, { epsilon = EPSILON } = {}) {
  const reasons = [];
  const edges = Array.isArray(core?.connections) ? core.connections : [];
  const parts = Array.isArray(core?.parts) ? core.parts : [];
  const byBranch = core?.byBranch instanceof Map
    ? core.byBranch
    : new Map(parts.map((part) => [part?.branchId, part]));
  const seen = new Set();

  for (const edge of edges) {
    const source = byBranch.get(edge?.sourceBranchId);
    const target = byBranch.get(edge?.targetBranchId);
    if (!edge?.semanticEdgeId) reasons.push('MISSING_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId && seen.has(edge.semanticEdgeId)) reasons.push('DUPLICATE_SEMANTIC_EDGE_ID');
    if (edge?.semanticEdgeId) seen.add(edge.semanticEdgeId);
    if (!source) reasons.push('MISSING_SOURCE_BRANCH');
    if (!target) reasons.push('MISSING_TARGET_BRANCH');
    if (source && target && source.branchId === target.branchId) reasons.push('SELF_EDGE');
    if (!source?.port || !pointEqual(edge?.sourcePort, source.port, epsilon)) reasons.push('SOURCE_PORT_MISMATCH');
    if (!target?.port || !pointEqual(edge?.targetPort, target.port, epsilon)) reasons.push('TARGET_PORT_MISMATCH');
    if (!Array.isArray(edge?.route) || edge.route.length < 2) reasons.push('INVALID_EDGE_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.some((point) => !pointEqual(point, point, epsilon))) reasons.push('NONFINITE_EDGE_ROUTE');
    if (Array.isArray(edge?.route) && edge.route.length >= 2) {
      if (!pointEqual(edge.route[0], edge.sourcePort, epsilon)) reasons.push('EDGE_ROUTE_SOURCE_MISMATCH');
      if (!pointEqual(edge.route.at(-1), edge.targetPort, epsilon)) reasons.push('EDGE_ROUTE_TARGET_MISMATCH');
    }
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
