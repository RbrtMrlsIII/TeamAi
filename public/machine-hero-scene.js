export const MACHINE_HERO_VERSION = 'M1-preview';

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));

function point(point, fallback = { x: 0, y: 0, z: 0 }) {
  if (!point) return { ...fallback };
  return {
    x: Number.isFinite(Number(point.x)) ? Number(point.x) : fallback.x,
    y: Number.isFinite(Number(point.y)) ? Number(point.y) : fallback.y,
    z: Number.isFinite(Number(point.z)) ? Number(point.z) : fallback.z,
  };
}

function size(value, fallback = { x: 1, y: 1, z: 1 }) {
  const source = value || fallback;
  return {
    x: Math.max(0.001, Number(source.x) || fallback.x),
    y: Math.max(0.001, Number(source.y) || fallback.y),
    z: Math.max(0.001, Number(source.z) || fallback.z),
  };
}

export function makeMachinePart({ id, semanticId, kind = 'division', center, dimensions, port = null, active = false } = {}) {
  if (!id || !semanticId) throw new Error('machine part requires id and semanticId');
  return {
    id,
    semanticId,
    kind,
    center: point(center),
    dimensions: size(dimensions),
    port: port ? point(port) : null,
    active: Boolean(active),
  };
}

export function deriveMachineSubject(parts, padding = 0.12) {
  const candidates = (Array.isArray(parts) ? parts : []).filter(Boolean);
  if (!candidates.length) return null;
  const bounds = candidates.reduce((acc, part) => {
    const half = { x: part.dimensions.x / 2, y: part.dimensions.y / 2, z: part.dimensions.z / 2 };
    acc.minX = Math.min(acc.minX, part.center.x - half.x);
    acc.minY = Math.min(acc.minY, part.center.y - half.y);
    acc.minZ = Math.min(acc.minZ, part.center.z - half.z);
    acc.maxX = Math.max(acc.maxX, part.center.x + half.x);
    acc.maxY = Math.max(acc.maxY, part.center.y + half.y);
    acc.maxZ = Math.max(acc.maxZ, part.center.z + half.z);
    return acc;
  }, { minX: Infinity, minY: Infinity, minZ: Infinity, maxX: -Infinity, maxY: -Infinity, maxZ: -Infinity });
  const pad = Math.max(0, Number(padding) || 0);
  return {
    kind: 'semantic-subject',
    sourcePartIds: candidates.map(({ id }) => id),
    min: { x: bounds.minX - pad, y: bounds.minY - pad, z: bounds.minZ - pad },
    max: { x: bounds.maxX + pad, y: bounds.maxY + pad, z: bounds.maxZ + pad },
    center: { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2, z: (bounds.minZ + bounds.maxZ) / 2 },
  };
}

export function createMachineTransition({ seatIndex = 0, source, target, expansion = {}, wiring = null } = {}) {
  if (!source?.semanticId || !target?.semanticId) throw new Error('machine transition requires source and target semantics');
  const sourcePart = makeMachinePart({ ...source, active: true });
  const targetPart = makeMachinePart(target);
  const subject = deriveMachineSubject([sourcePart, targetPart]);
  return Object.freeze({
    seatIndex: Number(seatIndex),
    sourceDivisionId: sourcePart.semanticId,
    targetDivisionId: targetPart.semanticId,
    sourceGeometry: sourcePart,
    targetGeometry: targetPart,
    sourcePort: sourcePart.port,
    targetPort: targetPart.port,
    expansion: { sourceAmount: clamp(expansion.sourceAmount, 0, 1), targetAmount: clamp(expansion.targetAmount, 0, 1) },
    wiring: wiring ? { ...wiring } : null,
    subject,
  });
}

export function resolveMachineCamera({ cameraId = 'HERO_WIDE', subject = null, viewport = { width: 1, height: 1 }, distance = 8 } = {}) {
  const target = point(subject?.center);
  const width = Math.max(1, Number(viewport.width) || 1);
  const height = Math.max(1, Number(viewport.height) || 1);
  const spanX = subject ? subject.max.x - subject.min.x : 1;
  const spanZ = subject ? subject.max.z - subject.min.z : 1;
  const fit = Math.max(1, Math.hypot(spanX, spanZ));
  return Object.freeze({ cameraId: String(cameraId), target, distance: Math.max(0.1, Number(distance) || 8), scale: Math.min(width, height) / (fit * 3.4), source: subject ? 'semantic-subject' : 'camera-configuration' });
}

export function projectMachinePoint(pointValue, camera, viewport) {
  const p = point(pointValue);
  const target = point(camera?.target);
  const scale = Number(camera?.scale) || 1;
  const width = Math.max(1, Number(viewport?.width) || 1);
  const height = Math.max(1, Number(viewport?.height) || 1);
  return { x: width / 2 + (p.x - target.x) * scale * 2, y: height * 0.55 - (p.z - target.z) * scale * 2 - (p.y - target.y) * scale, depth: p.y - target.y };
}
