/**
 * 031 semantic adjacent-division subject contract.
 * Presentation-only. Subject is derived from transition geometry/state.
 */
const normalize = (value) => Number(Number(value).toFixed(12));

function scaledBounds(geometry, amount) {
  if (!geometry?.center || !geometry?.dimensions) {
    throw new Error('semantic subject requires division geometry');
  }
  const scale = Math.max(0, Math.min(1, Number(amount) || 0));
  const halfWidth = (Number(geometry.dimensions.width) || 0) * 0.5 * scale;
  const halfDepth = (Number(geometry.dimensions.depth) || 0) * 0.5 * scale;
  return {
    minX: normalize(geometry.center.x - halfWidth),
    maxX: normalize(geometry.center.x + halfWidth),
    minZ: normalize(geometry.center.z - halfDepth),
    maxZ: normalize(geometry.center.z + halfDepth),
  };
}

function unionBounds(a, b) {
  return {
    minX: normalize(Math.min(a.minX, b.minX)), maxX: normalize(Math.max(a.maxX, b.maxX)),
    minZ: normalize(Math.min(a.minZ, b.minZ)), maxZ: normalize(Math.max(a.maxZ, b.maxZ)),
  };
}

export function adjacentDivisionSubjectIdentity({ seatIndex = 0, sourceDivisionId, targetDivisionId } = {}) {
  if (!sourceDivisionId || !targetDivisionId) throw new Error('semantic subject requires source and target division identities');
  const seat = Number.isInteger(seatIndex) && seatIndex >= 0 ? seatIndex : 0;
  return `TREE-HERO-SEAT#${seat}:${sourceDivisionId}:${targetDivisionId}:SUBJECT`;
}

export function buildAdjacentDivisionSubject({
  seatIndex = 0,
  sourceDivisionId,
  targetDivisionId,
  sourceGeometry,
  targetGeometry,
  expansion,
  wiring,
} = {}) {
  if (!sourceGeometry || !targetGeometry) throw new Error('semantic subject requires source and target geometry');
  if (!sourceGeometry.port || !targetGeometry.port) throw new Error('semantic subject requires source and target semantic ports');

  const sourceAmount = Math.max(0, Math.min(1, Number(expansion?.sourceAmount) || 0));
  const targetAmount = Math.max(0, Math.min(1, Number(expansion?.targetAmount) || 0));
  const sourceBounds = expansion?.sourceBounds || scaledBounds(sourceGeometry, sourceAmount || 1);
  const targetBounds = expansion?.targetBounds || scaledBounds(targetGeometry, targetAmount || 1);
  const bounds = targetAmount > 0 ? unionBounds(sourceBounds, targetBounds) : sourceBounds;
  const total = sourceAmount + targetAmount;
  const sourceY = Number(sourceGeometry.center?.y) || 0;
  const targetY = Number(targetGeometry.center?.y) || 0;
  const y = total > 0 ? (sourceY * sourceAmount + targetY * targetAmount) / total : sourceY;
  return {
    id: adjacentDivisionSubjectIdentity({ seatIndex, sourceDivisionId, targetDivisionId }),
    semantic: 'ADJACENT_DIVISION_SUBJECT',
    seatIndex, sourceDivisionId, targetDivisionId,
    center: { x: normalize((bounds.minX + bounds.maxX) * 0.5), y: normalize(y), z: normalize((bounds.minZ + bounds.maxZ) * 0.5) },
    bounds,
    footprint: { width: normalize(bounds.maxX - bounds.minX), depth: normalize(bounds.maxZ - bounds.minZ) },
    sourcePort: { ...sourceGeometry.port },
    targetPort: { ...targetGeometry.port },
    wiringId: wiring?.id || null,
    basis: 'transition-geometry',
    presentationOnly: true,
  };
}
