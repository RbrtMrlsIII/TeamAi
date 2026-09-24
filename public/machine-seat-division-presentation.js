import {
  buildSeatDivisionGeometry,
  resolveSeatDivisionSemanticId,
  seatDivisionFanDirection,
  seatDivisionFanRadius,
} from './seat-division-geometry.js';
import { resolveSeatDivisionPayload } from './machine-seat-division-payload.js';
import { buildSeatDivisionEdge } from './machine-seat-division-topology.js';
import {
  deriveMachineSeatDivisionAssembly,
  validateMachineSeatDivisionAssembly,
} from './machine-seat-division-assembly.js';

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

export function resolveSeatDivisionAttachmentTransform(assembly, component, amount) {
  const attachment = assembly?.mechanism?.attachment;
  const t = clamp01(amount);
  if (!attachment) return Object.freeze({
    x: 0,
    y: 0,
    z: 0,
    rotationY: component.rotationY,
    scaleMultiplier: 1,
  });
  const isPrimary = component.profile === attachment.primaryComponent;
  if (!isPrimary) return Object.freeze({
    x: 0,
    y: 0,
    z: 0,
    rotationY: component.rotationY,
    scaleMultiplier: 1,
  });
  const travel = finite(attachment.travel, 0) * t;
  if (attachment.motion === 'rotate') {
    return Object.freeze({
      x: 0,
      y: 0,
      z: 0,
      rotationY: component.rotationY + travel,
      scaleMultiplier: 1,
    });
  }
  const outwardAngle = finite(assembly?.geometry?.angle, 0) + Math.PI;
  return Object.freeze({
    x: Math.cos(outwardAngle) * travel,
    y: 0,
    z: Math.sin(outwardAngle) * travel,
    rotationY: component.rotationY,
    scaleMultiplier: 1,
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
  const assembly = deriveMachineSeatDivisionAssembly({
    parent,
    childId,
    childIndex,
    amount: progress,
    geometry,
  });
  const validation = validateMachineSeatDivisionAssembly(assembly, {
    expectedSemanticId: presentation?.childId || null,
  });
  if (!validation.valid) return null;

  const primitives = { CYL, TORUS, CUBE };
  const materialFor = (role) => ({
    energy: M.energy,
    glass: M.glass,
    trace: M.metal2,
    metal: M.metal,
    metal2: M.metal2,
    'seat-inset': M.glass,
  }[role] || M.metal2);

  for (const component of assembly.components) {
    const primitive = primitives[component.shape];
    if (!primitive) continue;
    const attachmentTransform = resolveSeatDivisionAttachmentTransform(assembly, component, progress);
    const localCenter = {
      x: assembly.center.x + component.offset.x + attachmentTransform.x,
      y: assembly.center.y + component.offset.y + attachmentTransform.y,
      z: assembly.center.z + component.offset.z + attachmentTransform.z,
    };
    const rotation = reducedMotion ? 0 : attachmentTransform.rotationY + finite(t) * (
      component.role === 'articulation-pivots' || component.role === 'tool-cartridges'
        ? 0.06
        : 0
    );
    const height = Math.max(0.025, Number(component.scale.y) || 0.025);
    draw(
      primitive,
      mul(
        T(localCenter.x, localCenter.y - height * 0.5, localCenter.z),
        mul(
          RY(rotation),
          S(
            component.scale.x,
            component.scale.y,
            component.scale.z,
          ),
        ),
      ),
      materialFor(component.materialRole),
      {
        rough: component.materialRole === 'glass' ? 0.24 : 0.34,
        emit: component.materialRole === 'energy' ? 0.16 * (0.45 + 0.55 * progress) : 0.05 * (0.4 + 0.6 * progress),
        alpha: component.materialRole === 'glass' ? 0.72 : 0.88,
      },
    );
  }

  return Object.freeze({
    semantic: assembly.semanticId,
    id: assembly.geometry.id,
    geometry: assembly.geometry,
    assembly,
    amount: progress,
    childId: presentation.childId,
    kind: presentation.kind,
    cameraId: presentation.payload.cameraId,
    edge,
    presentationOnly: true,
  });
}
