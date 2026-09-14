/**
 * 029 adjacent-division wiring contract.
 * Presentation-only: joins two semantic division geometry descriptors.
 * No provider, authorization, scheduler, or durable-domain authority.
 */
import { connectionCorridorPoint } from './seat-division-geometry.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const normalize = (value) => Number(Number(value).toFixed(12));

export const SEAT1_ADJACENCY_WIRING_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING';

function pointDistance(a, b) {
  return Math.hypot((b.x || 0) - (a.x || 0), (b.z || 0) - (a.z || 0));
}

export function buildAdjacentDivisionWiring({
  sourceGeometry,
  targetGeometry,
  clearance = 0.16,
  amount = 1,
} = {}) {
  if (!sourceGeometry?.port || !targetGeometry?.port) {
    throw new Error('adjacent division wiring requires source and target semantic ports');
  }

  const sourceAtAmount = connectionCorridorPoint(sourceGeometry, clamp(amount, 0, 1));
  const targetPort = targetGeometry.port;
  const dx = targetPort.x - sourceAtAmount.x;
  const dz = targetPort.z - sourceAtAmount.z;
  const length = normalize(Math.max(0.02, Math.hypot(dx, dz)));

  return {
    id: SEAT1_ADJACENCY_WIRING_ID,
    semantic: 'ADJACENT_DIVISION_WIRING',
    from: {
      divisionId: sourceGeometry.id,
      port: { ...sourceGeometry.port },
      projected: sourceAtAmount,
    },
    to: {
      divisionId: targetGeometry.id,
      port: { ...targetPort },
    },
    corridor: {
      length,
      radius: normalize(Math.max(0.025, Number(clearance) * 0.42)),
      yaw: normalize(Math.atan2(dz, dx)),
      reservedFor: ['source-division', 'target-division'],
    },
    presentationOnly: true,
  };
}

/**
 * Build the currently valid visual handoff path for a sequential division transition.
 * The source branch may compact before the target opens, so this frame keeps the
 * target endpoint semantically anchored while never making the target branch active early.
 */
export function buildAdjacentDivisionWiringFrame({
  wiring,
  sourceAmount = 0,
  targetAmount = 0,
  phase = 'REST',
} = {}) {
  if (!wiring?.from?.port || !wiring?.to?.port) return null;

  const source = clamp(sourceAmount, 0, 1);
  const target = clamp(targetAmount, 0, 1);
  const handoff = phase === 'CLOSING_SOURCE' || phase === 'OPENING_ADJACENT' || phase === 'ACTIVE';
  if (!handoff) return null;

  const sourcePoint = wiring.from.projected || wiring.from.port;
  const targetPoint = wiring.to.port;
  const progress = target > 0 ? target : source;

  return {
    id: wiring.id,
    semantic: 'ADJACENT_DIVISION_WIRING_FRAME',
    phase,
    sourceAmount: normalize(source),
    targetAmount: normalize(target),
    activeTarget: target > 0,
    from: { ...sourcePoint },
    to: { ...targetPoint },
    progress: normalize(progress),
    radius: normalize(wiring.corridor?.radius || 0.025),
    yaw: normalize(wiring.corridor?.yaw || 0),
    presentationOnly: true,
  };
}

export function adjacentDivisionWiringPoint(wiring, amount = 0) {
  const t = clamp(amount, 0, 1);
  const a = wiring?.from?.projected || wiring?.from?.port || { x: 0, y: 0, z: 0 };
  const b = wiring?.to?.port || { x: 0, y: 0, z: 0 };
  return {
    x: normalize(a.x + (b.x - a.x) * t),
    y: normalize(a.y + (b.y - a.y) * t),
    z: normalize(a.z + (b.z - a.z) * t),
  };
}

export function adjacentDivisionWiringLength(wiring) {
  const a = wiring?.from?.projected || wiring?.from?.port;
  const b = wiring?.to?.port;
  return a && b ? normalize(pointDistance(a, b)) : 0;
}
