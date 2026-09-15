/**
 * 031 semantic adjacent-division wiring contract.
 * Presentation-only: joins two semantic division geometry descriptors.
 * No provider, authorization, scheduler, or durable-domain authority.
 */
import { connectionCorridorPoint } from './seat-division-geometry.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));
const normalize = (value) => Number(Number(value).toFixed(12));

export const SEAT1_ADJACENCY_WIRING_ID = 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING';

export function adjacentDivisionWiringIdentity({ seatIndex = 0, sourceDivisionId, targetDivisionId } = {}) {
  const seat = Number.isInteger(seatIndex) && seatIndex >= 0 ? seatIndex : 0;
  if (!sourceDivisionId || !targetDivisionId) {
    throw new Error('adjacent division wiring requires source and target division identities');
  }
  return `TREE-HERO-SEAT#${seat}:${sourceDivisionId}:${targetDivisionId}:ADJACENCY_WIRING`;
}

function pointDistance(a, b) {
  return Math.hypot((b.x || 0) - (a.x || 0), (b.z || 0) - (a.z || 0));
}

function inferDivisionId(geometryId, seatIndex, fallback) {
  if (!geometryId) return fallback;
  const match = String(geometryId).match(/^TREE-HERO-SEAT#(\d+):([^:]+):GEOMETRY$/);
  if (!match) return geometryId;
  return Number(match[1]) === seatIndex ? match[2] : geometryId;
}

export function buildAdjacentDivisionWiring({
  seatIndex = 0,
  sourceDivisionId,
  targetDivisionId,
  sourceGeometry,
  targetGeometry,
  clearance = 0.16,
  amount = 1,
  id,
} = {}) {
  if (!sourceGeometry?.port || !targetGeometry?.port) {
    throw new Error('adjacent division wiring requires source and target semantic ports');
  }

  const resolvedSourceDivisionId = sourceDivisionId || inferDivisionId(sourceGeometry.id, seatIndex, sourceGeometry.id);
  const resolvedTargetDivisionId = targetDivisionId || inferDivisionId(targetGeometry.id, seatIndex, targetGeometry.id);
  const sourceAtAmount = connectionCorridorPoint(sourceGeometry, clamp(amount, 0, 1));
  const targetPort = targetGeometry.port;
  const dx = targetPort.x - sourceAtAmount.x;
  const dz = targetPort.z - sourceAtAmount.z;
  const length = normalize(Math.max(0.02, Math.hypot(dx, dz)));
  const isHistoricalSeatOneFixture = seatIndex === 0
    && resolvedSourceDivisionId === 'SEAT_CONNECTION'
    && (!targetDivisionId || resolvedTargetDivisionId === 'SEAT_CONNECTION' || resolvedTargetDivisionId === 'SEAT_BEHAVIOR');
  const wiringId = id || (
    isHistoricalSeatOneFixture
      ? SEAT1_ADJACENCY_WIRING_ID
      : adjacentDivisionWiringIdentity({
        seatIndex,
        sourceDivisionId: resolvedSourceDivisionId,
        targetDivisionId: resolvedTargetDivisionId,
      })
  );

  return {
    id: wiringId,
    semantic: 'ADJACENT_DIVISION_WIRING',
    seatIndex,
    sourceDivisionId: resolvedSourceDivisionId,
    targetDivisionId: resolvedTargetDivisionId,
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
