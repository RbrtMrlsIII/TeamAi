/**
 * 031 semantic adjacent-division expansion envelope.
 * Presentation-only geometry/state contract. Timing is an implementation baseline, not final animation law.
 */
const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const normalize = (value) => Number(Number(value).toFixed(12));

export const SEAT1_ADJACENT_EXPANSION_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENT_EXPANSION';

export function adjacentDivisionExpansionIdentity({ seatIndex = 0, sourceDivisionId, targetDivisionId } = {}) {
  const seat = Number.isInteger(seatIndex) && seatIndex >= 0 ? seatIndex : 0;
  if (!sourceDivisionId || !targetDivisionId) {
    throw new Error('adjacent expansion requires source and target division identities');
  }
  return `TREE-HERO-SEAT#${seat}:${sourceDivisionId}:${targetDivisionId}:ADJACENT_EXPANSION`;
}

function axisBounds(center, halfWidth, halfDepth) {
  return {
    minX: normalize(center.x - halfWidth),
    maxX: normalize(center.x + halfWidth),
    minZ: normalize(center.z - halfDepth),
    maxZ: normalize(center.z + halfDepth),
  };
}

export function buildAdjacentDivisionExpansionEnvelope({
  seatIndex = 0,
  sourceDivisionId,
  targetDivisionId,
  sourceGeometry,
  targetGeometry,
  sourceAmount = 1,
  targetAmount = 0,
  corridorRadius = 0.025,
  adjacencyGap = 0.08,
  id,
} = {}) {
  if (!sourceGeometry?.port || !targetGeometry?.port) {
    throw new Error('adjacent expansion requires source and target semantic ports');
  }

  const resolvedSourceDivisionId = sourceDivisionId || sourceGeometry.id;
  const resolvedTargetDivisionId = targetDivisionId || targetGeometry.id;
  const expansionId = id || adjacentDivisionExpansionIdentity({
    seatIndex,
    sourceDivisionId: resolvedSourceDivisionId,
    targetDivisionId: resolvedTargetDivisionId,
  });
  const sourceScale = clamp(sourceAmount, 0, 1);
  const targetScale = clamp(targetAmount, 0, 1);
  const sourceWidth = (Number(sourceGeometry?.dimensions?.width) || 0) * 0.5 * sourceScale;
  const sourceDepth = (Number(sourceGeometry?.dimensions?.depth) || 0) * 0.5 * sourceScale;
  const targetWidth = (Number(targetGeometry?.dimensions?.width) || 0) * 0.5 * targetScale;
  const targetDepth = (Number(targetGeometry?.dimensions?.depth) || 0) * 0.5 * targetScale;

  const sourceCenter = sourceGeometry.center || sourceGeometry.port;
  const targetCenter = targetGeometry.center || targetGeometry.port;
  const sourceBounds = axisBounds(sourceCenter, sourceWidth + adjacencyGap, sourceDepth + adjacencyGap);
  const targetBounds = axisBounds(targetCenter, targetWidth + adjacencyGap, targetDepth + adjacencyGap);
  const corridor = {
    start: sourceGeometry.port,
    end: targetGeometry.port,
    radius: normalize(Math.max(0.025, Number(corridorRadius) || 0.025)),
  };

  return {
    id: expansionId,
    semantic: 'ADJACENT_DIVISION_EXPANSION',
    seatIndex,
    sourceDivisionId: resolvedSourceDivisionId,
    targetDivisionId: resolvedTargetDivisionId,
    sourceAmount: normalize(sourceScale),
    targetAmount: normalize(targetScale),
    sourceBounds,
    targetBounds,
    corridor,
    clearance: normalize(adjacencyGap),
    collisionRule: 'source-and-target-expanded-bounds-must-not-overlap-corridor',
    presentationOnly: true,
  };
}

export function adjacentExpansionCollidesWithCorridor(envelope) {
  const corridor = envelope?.corridor;
  if (!corridor) return true;
  const x = Number(corridor.start?.x) || 0;
  const z = Number(corridor.start?.z) || 0;
  const b = envelope?.targetBounds;
  if (!b) return true;
  return x >= b.minX && x <= b.maxX && z >= b.minZ && z <= b.maxZ;
}

/**
 * Advance the adjacency sequence in two phases:
 * 1) source division compacts while target remains closed;
 * 2) only after source compaction completes may target expansion begin.
 * This timing remains an implementation baseline, not final animation law.
 */
export function advanceAdjacentDivisionExpansion(state, elapsedMs, sourceDurationMs = 240, targetDurationMs = 240) {
  if (!state) return null;
  const sourceDuration = Math.max(1, Number(sourceDurationMs) || 240);
  const targetDuration = Math.max(1, Number(targetDurationMs) || 240);
  const elapsed = Math.max(0, Number(elapsedMs) || 0);

  if (elapsed < sourceDuration) {
    const t = clamp(elapsed / sourceDuration, 0, 1);
    const sourceAmount = normalize(1 - t);
    return {
      ...state,
      sourceAmount,
      targetAmount: 0,
      phase: 'CLOSING_SOURCE',
    };
  }

  const targetElapsed = elapsed - sourceDuration;
  const targetT = clamp(targetElapsed / targetDuration, 0, 1);
  const targetAmount = normalize(targetT);
  return {
    ...state,
    sourceAmount: 0,
    targetAmount,
    phase: targetT >= 1 ? 'ACTIVE' : 'OPENING_ADJACENT',
  };
}
