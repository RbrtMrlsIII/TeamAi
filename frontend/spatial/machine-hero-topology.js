const EPSILON = 1e-6;

const finite = (value) => Number.isFinite(Number(value));

function pointEqual(a, b, epsilon = EPSILON) {
  return finite(a?.x) && finite(a?.y) && finite(a?.z)
    && Math.abs(Number(a.x) - Number(b.x)) <= epsilon
    && Math.abs(Number(a.y) - Number(b.y)) <= epsilon
    && Math.abs(Number(a.z) - Number(b.z)) <= epsilon;
}

function boundsFor(part) {
  if (!part?.center || !part?.dimensions) return null;
  const values = [part.center.x, part.center.y, part.center.z, part.dimensions.x, part.dimensions.y, part.dimensions.z];
  if (!values.every(finite) || values.some((value) => Number(value) <= 0 && values.indexOf(value) >= 3)) return null;
  return {
    min: {
      x: Number(part.center.x) - Number(part.dimensions.x) / 2,
      y: Number(part.center.y) - Number(part.dimensions.y) / 2,
      z: Number(part.center.z) - Number(part.dimensions.z) / 2,
    },
    max: {
      x: Number(part.center.x) + Number(part.dimensions.x) / 2,
      y: Number(part.center.y) + Number(part.dimensions.y) / 2,
      z: Number(part.center.z) + Number(part.dimensions.z) / 2,
    },
  };
}

function axisGap(a, b, axis) {
  const positiveGap = Number(b.min[axis]) - Number(a.max[axis]);
  const reverseGap = Number(a.min[axis]) - Number(b.max[axis]);
  return Math.max(positiveGap, reverseGap);
}

export function validateMachineConnectionTopology(source, target, wiring, { clearance = 0.16, epsilon = EPSILON } = {}) {
  const reasons = [];
  const requiredClearance = Math.max(0, Number(clearance) || 0);
  const sourceBounds = boundsFor(source);
  const targetBounds = boundsFor(target);

  if (!source?.semanticId || !target?.semanticId) reasons.push('MISSING_SEMANTIC_ID');
  if (source?.semanticId === target?.semanticId) reasons.push('SELF_CONNECTION');
  if (!sourceBounds) reasons.push('INVALID_SOURCE_BOUNDS');
  if (!targetBounds) reasons.push('INVALID_TARGET_BOUNDS');
  if (!source?.port) reasons.push('MISSING_SOURCE_PORT');
  if (!target?.port) reasons.push('MISSING_TARGET_PORT');

  if (sourceBounds && source?.port) {
    for (const axis of ['x', 'y', 'z']) {
      if (!finite(source.port[axis]) || Number(source.port[axis]) < sourceBounds.min[axis] - epsilon || Number(source.port[axis]) > sourceBounds.max[axis] + epsilon) {
        reasons.push('SOURCE_PORT_OUTSIDE_BOUNDS');
        break;
      }
    }
  }

  if (targetBounds && target?.port) {
    for (const axis of ['x', 'y', 'z']) {
      if (!finite(target.port[axis]) || Number(target.port[axis]) < targetBounds.min[axis] - epsilon || Number(target.port[axis]) > targetBounds.max[axis] + epsilon) {
        reasons.push('TARGET_PORT_OUTSIDE_BOUNDS');
        break;
      }
    }
  }

  if (!wiring) reasons.push('MISSING_WIRING_ROUTE');
  if (wiring && (!Array.isArray(wiring.route) || wiring.route.length < 2)) reasons.push('INVALID_WIRING_ROUTE');

  if (wiring?.route?.length >= 2 && source?.port && target?.port) {
    if (!pointEqual(wiring.route[0], source.port, epsilon)) reasons.push('ROUTE_SOURCE_MISMATCH');
    if (!pointEqual(wiring.route[wiring.route.length - 1], target.port, epsilon)) reasons.push('ROUTE_TARGET_MISMATCH');
    if (!wiring.route.every((point) => ['x', 'y', 'z'].every((axis) => finite(point?.[axis])))) reasons.push('NONFINITE_WIRING_POINT');
  }

  let separation = null;
  if (sourceBounds && targetBounds) {
    const axisGaps = {
      x: axisGap(sourceBounds, targetBounds, 'x'),
      y: axisGap(sourceBounds, targetBounds, 'y'),
      z: axisGap(sourceBounds, targetBounds, 'z'),
    };
    separation = { axisGaps, maxGap: Math.max(axisGaps.x, axisGaps.y, axisGaps.z) };
    if (separation.maxGap + epsilon < requiredClearance) reasons.push('AABB_CLEARANCE_UNPROVEN');
  }

  return Object.freeze({
    valid: reasons.length === 0,
    clearance: requiredClearance,
    separation,
    reasons: Object.freeze([...new Set(reasons)]),
  });
}

export function validateMachineGraphTopology(graph, { clearance = 0.16 } = {}) {
  const reasons = [];
  const parts = Array.isArray(graph?.parts) ? graph.parts : [];
  const transitions = Array.isArray(graph?.transitions) ? graph.transitions : [];
  const semanticIds = parts.map((part) => part?.semanticId).filter(Boolean);
  const uniqueSemanticIds = new Set(semanticIds);

  if (semanticIds.length !== uniqueSemanticIds.size) reasons.push('DUPLICATE_SEMANTIC_ID');

  for (const transition of transitions) {
    const source = parts.find((part) => part.semanticId === transition?.sourceDivisionId);
    const target = parts.find((part) => part.semanticId === transition?.targetDivisionId);
    if (!source) reasons.push(`MISSING_SOURCE:${transition?.sourceDivisionId || 'unknown'}`);
    if (!target) reasons.push(`MISSING_TARGET:${transition?.targetDivisionId || 'unknown'}`);
    if (source && target) {
      const validation = validateMachineConnectionTopology(source, target, transition.wiring, { clearance });
      if (!validation.valid) reasons.push(...validation.reasons.map((reason) => `${transition.sourceDivisionId}->${transition.targetDivisionId}:${reason}`));
    }
  }

  return Object.freeze({
    valid: reasons.length === 0,
    reasons: Object.freeze(reasons),
    partCount: parts.length,
    transitionCount: transitions.length,
  });
}
