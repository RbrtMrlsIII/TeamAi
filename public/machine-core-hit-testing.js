const TAU = Math.PI * 2;

function normalizeAngle(angle) {
  const value = angle % TAU;
  return value < 0 ? value + TAU : value;
}

function distance2(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

export function pickMachineBranch(core, point, { maxDistance = 1.35 } = {}) {
  if (!core || !point) return null;
  const candidates = core.parts
    .filter((part) => part.kind !== 'hub')
    .map((part) => ({ part, distance: Math.sqrt(distance2(part.center, point)) }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
  return candidates[0]?.part || null;
}

export function branchAtRingAngle(core, angle, { maxAngularDistance = 0.19 } = {}) {
  if (!core) return null;
  const target = normalizeAngle(angle);
  const candidates = core.parts
    .filter((part) => part.kind !== 'hub')
    .map((part) => ({
      part,
      angle: normalizeAngle(Math.atan2(part.center.z, part.center.x)),
    }))
    .map(({ part, angle: candidate }) => ({
      part,
      distance: Math.min(Math.abs(candidate - target), TAU - Math.abs(candidate - target)),
    }))
    .filter(({ distance }) => distance <= maxAngularDistance)
    .sort((a, b) => a.distance - b.distance);
  return candidates[0]?.part || null;
}

export function branchSelectionSummary(part) {
  if (!part) return null;
  return Object.freeze({
    branchId: part.branchId,
    seatIndex: part.seatIndex ?? null,
    kind: part.kind,
    level: part.level,
    uiStyle: part.uiStyle,
    cameraId: part.camera?.cameraId || null,
  });
}
