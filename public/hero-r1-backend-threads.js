/**
 * 029 R1 backend-display presentation thread renderer.
 *
 * Presentation-only relationship layer for the concentric R1 ring.
 * These threads visualize the declared R1 display relationships; they are
 * not backend topology, OAuth, credentials, provider execution, entitlement,
 * or durable state.
 */
import { deriveBackendDisplayPlacements } from './hero-r1-backend-display.js';

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const clamp = (value, min, max) =>
  Math.max(min, Math.min(max, Number(value) || 0));

const clampInt = (value, min, max) =>
  Math.max(min, Math.min(max, Math.floor(Number(value) || 0)));

const distance3 = (a, b) =>
  Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);

const wrapAngle = (angle) => {
  let value = angle;
  while (value <= -Math.PI) value += Math.PI * 2;
  while (value > Math.PI) value -= Math.PI * 2;
  return value;
};

export const R1_BACKEND_PRESENTATION_THREADS_V1 = Object.freeze([
  Object.freeze({
    id: 'WORKSPACE_BACKEND_THREAD#docs→rules',
    from: 'WORKSPACE_BACKEND_DISPLAY#docs',
    to: 'WORKSPACE_BACKEND_DISPLAY#rules',
  }),
  Object.freeze({
    id: 'WORKSPACE_BACKEND_THREAD#rules→connect',
    from: 'WORKSPACE_BACKEND_DISPLAY#rules',
    to: 'WORKSPACE_BACKEND_DISPLAY#connect',
  }),
]);

export function resolveBackendPresentationThreads({
  catalog = [],
  relationships = R1_BACKEND_PRESENTATION_THREADS_V1,
} = {}) {
  const byId = new Map(
    (Array.isArray(catalog) ? catalog : []).map((item) => [item?.id, item]),
  );
  return (Array.isArray(relationships) ? relationships : []).flatMap((relationship) => {
    const source = byId.get(relationship?.from);
    const target = byId.get(relationship?.to);
    if (!source || !target) return [];
    return [{
      id: relationship.id,
      from: relationship.from,
      to: relationship.to,
      presentationOnly: true,
    }];
  });
}

export function pointOnBackendThread(path, amount = 0) {
  const t = clamp(amount, 0, 1);
  const source = path?.source || { x: 0, y: 0, z: 0 };
  const target = path?.target || source;
  const sourceAngle = finite(path?.sourceAngle, Math.atan2(source.z, source.x));
  const angleDelta = finite(
    path?.angleDelta,
    wrapAngle(Math.atan2(target.z, target.x) - sourceAngle),
  );
  const ringRadius = Math.max(
    0,
    finite(path?.ringRadius, Math.hypot(source.x, source.z)),
  );
  const bow = Math.max(0, finite(path?.bow, 0));
  const radius = ringRadius + bow * Math.sin(Math.PI * t) ** 2;
  const angle = sourceAngle + angleDelta * t;
  const y = source.y + (target.y - source.y) * t;
  return {
    x: radius * Math.cos(angle),
    y,
    z: radius * Math.sin(angle),
  };
}

export function deriveBackendPresentationThreadPaths({
  workspaceRadius = 1,
  ringScale = 1,
  catalog = [],
  relationships = R1_BACKEND_PRESENTATION_THREADS_V1,
  bow = null,
  segments = 8,
} = {}) {
  const placements = deriveBackendDisplayPlacements({
    workspaceRadius,
    ringScale,
    catalog,
  });
  const placementById = new Map(placements.map((placement) => [placement.id, placement]));
  const resolved = resolveBackendPresentationThreads({ catalog, relationships });
  const safeSegments = clampInt(segments, 2, 24);
  const ringRadius = Math.max(
    0,
    finite(workspaceRadius, 1) * Math.max(0, finite(ringScale, 1)),
  );
  const safeBow = bow == null
    ? Math.max(0.1, finite(workspaceRadius, 1) * 0.018)
    : Math.max(0, finite(bow, 0.12));

  return resolved.map((thread) => {
    const sourcePlacement = placementById.get(thread.from);
    const targetPlacement = placementById.get(thread.to);
    if (!sourcePlacement || !targetPlacement) return null;

    const sourceAngle = Math.atan2(sourcePlacement.z, sourcePlacement.x);
    const targetAngle = Math.atan2(targetPlacement.z, targetPlacement.x);
    const angleDelta = wrapAngle(targetAngle - sourceAngle);
    const points = Array.from({ length: safeSegments + 1 }, (_, index) => {
      const amount = index / safeSegments;
      return Object.freeze(pointOnBackendThread({
        source: sourcePlacement,
        target: targetPlacement,
        sourceAngle,
        angleDelta,
        ringRadius,
        bow: safeBow,
      }, amount));
    });
    const length = points.slice(1).reduce(
      (sum, point, index) => sum + distance3(points[index], point),
      0,
    );

    return Object.freeze({
      id: thread.id,
      from: thread.from,
      to: thread.to,
      presentationOnly: true,
      model: 'ring-arc',
      ringRadius,
      bow: safeBow,
      sourceAngle,
      angleDelta,
      source: Object.freeze({
        x: sourcePlacement.x,
        y: sourcePlacement.y,
        z: sourcePlacement.z,
        index: sourcePlacement.index,
      }),
      target: Object.freeze({
        x: targetPlacement.x,
        y: targetPlacement.y,
        z: targetPlacement.z,
        index: targetPlacement.index,
      }),
      points,
      length,
    });
  }).filter(Boolean);
}

export function drawBackendDisplayThreads({
  profile,
  seatCount,
  ringScale,
  catalog,
  ringFocus,
  reducedMotion,
  draw,
  CUBE,
  SPH,
  T,
  S,
  RY,
  mul,
  M,
}, t = 0) {
  const p = profile(seatCount);
  const workspaceRadius = p.workspace;
  const paths = deriveBackendPresentationThreadPaths({
    workspaceRadius,
    ringScale,
    catalog,
  });
  const thickness = Math.max(0.028, workspaceRadius * 0.0072);
  const pulseSize = Math.max(0.045, workspaceRadius * 0.011);
  const time = finite(t);
  for (let threadIndex = 0; threadIndex < paths.length; threadIndex += 1) {
    const path = paths[threadIndex];
    const focusedSource = ringFocus?.ring === 'r1' && ringFocus.index === path.source.index;
    const focusedTarget = ringFocus?.ring === 'r1' && ringFocus.index === path.target.index;
    const focused = focusedSource || focusedTarget;
    for (let segmentIndex = 0; segmentIndex < path.points.length - 1; segmentIndex += 1) {
      const a = path.points[segmentIndex];
      const b = path.points[segmentIndex + 1];
      const dx = b.x - a.x;
      const dz = b.z - a.z;
      const yaw = Math.atan2(dz, dx);
      const length = Math.max(0.012, Math.hypot(dx, dz));
      const midX = (a.x + b.x) * 0.5;
      const midY = (a.y + b.y) * 0.5;
      const midZ = (a.z + b.z) * 0.5;
      draw(
        CUBE,
        mul(mul(T(midX, midY, midZ), RY(yaw)), S(length * 0.5, thickness, thickness)),
        M.trace,
        {
          rough: 0.34,
          spec: [0.56, 0.58, 0.55],
          emit: focused ? 0.055 : 0.025,
          alpha: focused ? 0.62 : 0.38,
        },
      );
    }

    const pulseAmount = reducedMotion
      ? 0.5
      : (time * 0.16 + threadIndex * 0.37) % 1;
    const pulse = pointOnBackendThread(path, pulseAmount);
    draw(
      SPH,
      mul(T(pulse.x, pulse.y, pulse.z), S(pulseSize, pulseSize, pulseSize)),
      M.energy,
      {
        rough: 0.18,
        emit: focused ? 0.24 : 0.13,
        alpha: focused ? 0.76 : 0.46,
      },
    );
  }
}
