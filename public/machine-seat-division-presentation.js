import {
  buildSeatDivisionGeometry,
  resolveSeatDivisionSemanticId,
  seatDivisionFanDirection,
  seatDivisionFanRadius,
} from './seat-division-geometry.js';
import { resolveSeatDivisionPayload } from './machine-seat-division-payload.js';
import { buildSeatDivisionEdge } from './machine-seat-division-topology.js';

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
const clamp01 = (value) => Math.max(0, Math.min(1, finite(value, 0)));

export function resolveSeatDivisionPresentation(childId) {
  const semanticId = resolveSeatDivisionSemanticId(
    'TREE-HERO-SEAT#0:' + String(childId ?? '') + ':GEOMETRY',
  );
  if (!semanticId || !semanticId.startsWith('SEAT_')) return null;
  const label = semanticId
    .slice(5)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
  const kind = semanticId.includes('CONNECTION')
    ? 'connection'
    : semanticId.includes('AUTHORIZATION')
      ? 'authorization'
      : semanticId.includes('WORKSPACE_SCOPE')
        ? 'workspace-scope'
        : semanticId.includes('TASK_EVIDENCE')
          ? 'task-evidence'
          : semanticId.includes('TOOLKIT')
            ? 'toolkit'
            : semanticId.includes('CAPABILITIES')
              ? 'capabilities'
              : 'behavior';
  const payload = resolveSeatDivisionPayload(semanticId);
  if (!payload) return null;
  return Object.freeze({
    childId: semanticId,
    label: payload.label || label,
    kind,
    payload,
  });
}

export function deriveFocusedSeatDivisionGeometry({
  parent,
  childId,
  childIndex = 0,
  amount = 0,
  workspaceTarget = { x: 0, y: 0.5, z: 0 },
} = {}) {
  const presentation = resolveSeatDivisionPresentation(childId);
  if (!presentation || !parent?.center || !parent?.dimensions || !Number.isInteger(parent?.seatIndex)) return null;
  const t = clamp01(amount);
  const index = Math.max(0, Number(childIndex) || 0);
  const parentScale = Math.max(
    finite(parent.dimensions.x, 0),
    finite(parent.dimensions.z, 0),
    0.2,
  );
  const direction = seatDivisionFanDirection(parent, index);
  const radialOffset = seatDivisionFanRadius(parent, t);
  const y = finite(parent.level, finite(parent.center.y, 0))
    + finite(parent.dimensions.y, 0) * (0.68 + 0.55 * t + index * 0.08);
  const center = {
    x: finite(parent.center.x, 0) + direction.x * radialOffset,
    y,
    z: finite(parent.center.z, 0) + direction.z * radialOffset,
  };
  return buildSeatDivisionGeometry({
    center,
    angle: Math.atan2(direction.z, direction.x) + Math.PI,
    radialDistance: radialOffset,
    payload: presentation.payload,
    baseWidth: parentScale * 0.38,
    baseDepth: parentScale * 0.28,
    baseHeight: Math.max(0.06, finite(parent.dimensions.y, 0.62) * 0.14),
    clearance: Math.max(0.08, finite(parent.seam, 0.18) * 1.2),
    workspaceTarget,
    id: 'TREE-HERO-SEAT#' + parent.seatIndex + ':' + presentation.childId + ':GEOMETRY',
  });
}

export function drawFocusedSeatDivision({
  parent,
  childId,
  childIndex = 0,
  amount = 0,
  reducedMotion = false,
  draw,
  CYL,
  TORUS,
  CUBE,
  T,
  S,
  RY,
  mul,
  M,
}, t = 0) {
  const geometry = deriveFocusedSeatDivisionGeometry({
    parent,
    childId,
    childIndex,
    amount,
  });
  if (!geometry || !draw) return null;
  const presentation = resolveSeatDivisionPresentation(childId);
  const progress = clamp01(amount);
  const edge = buildSeatDivisionEdge({
    parent,
    geometry,
    childId,
    childIndex,
  });
  const deploy = 0.38 + progress * 0.62;
  const size = Math.max(0.22, Math.max(geometry.dimensions.width, geometry.dimensions.depth) * 0.74);
  const spin = reducedMotion ? 0 : finite(t) * 0.28 + Number(childIndex) * 0.21;
  const material = presentation.kind === 'connection' || presentation.kind === 'authorization'
    ? M.energy
    : presentation.kind === 'toolkit'
      ? M.glass
      : M.metal2;
  draw(CYL, mul(T(geometry.center.x, geometry.center.y, geometry.center.z), S(size * deploy, geometry.dimensions.height * deploy, size * deploy)), material, {
    rough: 0.34,
    emit: presentation.kind === 'connection' ? 0.18 * deploy : 0.06 * deploy,
    alpha: 0.88,
  });
  draw(TORUS, mul(
    mul(T(geometry.center.x, geometry.center.y + geometry.dimensions.height * 0.7, geometry.center.z), RY(spin)),
    S(size * (0.68 + 0.18 * progress), 1, size * (0.68 + 0.18 * progress)),
  ), material, {
    rough: 0.28,
    emit: 0.12 * deploy,
    alpha: 0.76,
  });
  draw(CUBE, mul(
    mul(T(geometry.center.x, geometry.center.y + geometry.dimensions.height, geometry.center.z), RY(spin)),
    S(size * 0.72, Math.max(0.035, geometry.dimensions.height * 0.38), size * 0.34),
  ), M.glass, {
    rough: 0.24,
    emit: 0.08 * deploy,
    alpha: 0.7,
  });
  return Object.freeze({
    semantic: geometry.semantic,
    id: geometry.id,
    geometry,
    amount: progress,
    childId: presentation.childId,
    kind: presentation.kind,
    cameraId: presentation.payload.cameraId,
    edge,
    presentationOnly: true,
  });
}
