/**
 * 031 semantic adjacent-division transition resolver.
 * Presentation-only reusable mechanism. It composes the existing geometry,
 * expansion, and wiring contracts without activating a new tree/branch pair.
 */
import { buildSeatDivisionGeometry } from './seat-division-geometry.js';
import { buildAdjacentDivisionExpansionEnvelope, advanceAdjacentDivisionExpansion } from './seat-adjacent-division-expansion.js';
import { buildAdjacentDivisionWiring } from './seat-adjacent-division-wiring.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

export function adjacentTransitionIdentity({ seatIndex, sourceDivisionId, targetDivisionId } = {}) {
  const seat = Number.isInteger(seatIndex) && seatIndex >= 0 ? seatIndex : 0;
  if (!sourceDivisionId || !targetDivisionId) {
    throw new Error('adjacent transition requires source and target division identities');
  }
  return `TREE-HERO-SEAT#${seat}:${sourceDivisionId}:${targetDivisionId}:ADJACENT_TRANSITION`;
}

export function buildAdjacentDivisionGeometry({
  center,
  angle,
  radialDistance,
  payload,
  workspaceTarget,
  divisionId,
} = {}) {
  if (!divisionId) throw new Error('adjacent division geometry requires a division identity');
  return buildSeatDivisionGeometry({ center, angle, radialDistance, payload, workspaceTarget, id: divisionId });
}

/**
 * Resolve one semantic adjacent transition from descriptors supplied by the
 * caller. The mechanism is reusable across Seats and branch pairs; callers
 * decide which transitions are actually active in the current product slice.
 */
export function buildAdjacentDivisionTransition({
  seatIndex,
  sourceDivisionId,
  targetDivisionId,
  sourceGeometry,
  targetGeometry,
  sourceAmount = 0,
  targetAmount = 0,
  clearance = 0.16,
  corridorRadius = 0.025,
} = {}) {
  if (!sourceGeometry || !targetGeometry) {
    throw new Error('adjacent transition requires source and target geometry');
  }
  if (!sourceGeometry.port || !targetGeometry.port) {
    throw new Error('adjacent transition requires source and target semantic ports');
  }

  const identity = adjacentTransitionIdentity({ seatIndex, sourceDivisionId, targetDivisionId });
  const source = clamp(sourceAmount, 0, 1);
  const target = clamp(targetAmount, 0, 1);
  const expansion = buildAdjacentDivisionExpansionEnvelope({
    seatIndex,
    sourceDivisionId,
    targetDivisionId,
    sourceGeometry,
    targetGeometry,
    sourceAmount: source,
    targetAmount: target,
    corridorRadius,
    adjacencyGap: clearance,
  });
  const wiring = buildAdjacentDivisionWiring({
    seatIndex,
    sourceDivisionId,
    targetDivisionId,
    sourceGeometry,
    targetGeometry,
    clearance,
    amount: source,
  });

  return {
    id: identity,
    seatIndex,
    sourceDivisionId,
    targetDivisionId,
    sourceAmount: source,
    targetAmount: target,
    phase: target > 0 ? 'TARGET_OPENING_OR_ACTIVE' : 'SOURCE_OPENING_OR_ACTIVE',
    expansion,
    wiring,
    presentationOnly: true,
  };
}

export function advanceAdjacentDivisionTransition(state, elapsedMs, sourceDurationMs = 240, targetDurationMs = 240) {
  if (!state) return null;
  const next = advanceAdjacentDivisionExpansion({
    ...state,
    sourceAmount: clamp(state.sourceAmount, 0, 1),
    targetAmount: clamp(state.targetAmount, 0, 1),
  }, elapsedMs, sourceDurationMs, targetDurationMs);
  if (!next) return null;
  return buildAdjacentDivisionTransition({
    seatIndex: next.seatIndex,
    sourceDivisionId: next.sourceDivisionId,
    targetDivisionId: next.targetDivisionId,
    sourceGeometry: next.sourceGeometry,
    targetGeometry: next.targetGeometry,
    sourceAmount: next.sourceAmount,
    targetAmount: next.targetAmount,
  });
}
