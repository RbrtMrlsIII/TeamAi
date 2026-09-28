import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';
import { MACHINE_RESPONSIVE_TIER, resolveMachineResponsiveDensity } from './machine-responsive.js';

const ROOT_OWNER = 'frontend/spatial/machine-responsive-readability.js';

const finitePositive = (value, fallback = 1) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

const finite = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;

const rootContext = () => createSpatialConstructionContext({
  slice: 'S23',
  owner: ROOT_OWNER,
  semanticId: 'S23:RESPONSIVE-READABILITY',
  semanticBoundary: 'presentation-only',
});

export function deriveMachineResponsiveReadability({
  responsive = null,
  viewport = { width: 1, height: 1 },
  cameraRadius = 1,
  cameraFov = 44,
  cameraPosition = null,
  cameraTarget = null,
  seatRingRadius = 0,
  seatCount = 1,
  seatCenters = [],
  podSpan = 0,
  podFeatures = [],
  facilitySpan = 0,
  facilityFeatures = [],
} = {}) {
  const width = finitePositive(viewport?.width, 1);
  const height = finitePositive(viewport?.height, 1);
  const radius = finitePositive(cameraRadius, 1);
  const fov = finitePositive(cameraFov, 44);
  const seats = Math.max(1, Math.min(10, Math.floor(finite(seatCount, 1))));
  const ringRadius = Math.max(0, finite(seatRingRadius, 0));
  const resolvedResponsive = responsive || {
    tier: MACHINE_RESPONSIVE_TIER.DESKTOP,
  };
  const tier = MACHINE_RESPONSIVE_TIER[ String(resolvedResponsive.tier || '').toUpperCase() ]
    ? resolvedResponsive.tier
    : MACHINE_RESPONSIVE_TIER.DESKTOP;
  const density = resolveMachineResponsiveDensity(tier);

  const position = Array.isArray(cameraPosition) && cameraPosition.length >= 3
    ? cameraPosition.slice(0, 3).map((value) => finite(value, 0))
    : null;
  const target = Array.isArray(cameraTarget) && cameraTarget.length >= 3
    ? cameraTarget.slice(0, 3).map((value) => finite(value, 0))
    : null;
  const actualRadius = position && target
    ? Math.hypot(position[0] - target[0], position[1] - target[1], position[2] - target[2])
    : radius;
  const resolvedRadius = finitePositive(actualRadius, radius);

  const verticalFieldSpan = 2 * resolvedRadius * Math.tan((fov * Math.PI / 180) / 2);
  const pixelsPerWorldUnit = height / Math.max(verticalFieldSpan, 0.0001);
  const fallbackSeatSpacing = seats > 1
    ? 2 * ringRadius * Math.sin(Math.PI / seats)
    : Infinity;
  const projectedSeatSpacingPx = projectSeatSpacingPx({
    centers: Array.isArray(seatCenters) ? seatCenters : [],
    eye: position,
    target,
    fov,
    width,
    height,
    fallbackWorldSpacing: fallbackSeatSpacing,
    fallbackPixelsPerWorldUnit: pixelsPerWorldUnit,
  });
  const fallbackPodPx = Math.max(0, finite(podSpan, 0)) * pixelsPerWorldUnit;
  const fallbackFacilityPx = Math.max(0, finite(facilitySpan, 0)) * pixelsPerWorldUnit;
  const projectedPodFeaturePx = projectFeatureBoxesPx({
    features: Array.isArray(podFeatures) ? podFeatures : [],
    eye: position,
    target,
    fov,
    width,
    height,
    fallbackPx: fallbackPodPx,
    scale: 1,
  });
  const projectedFacilityFeaturePx = projectFeatureBoxesPx({
    features: Array.isArray(facilityFeatures) ? facilityFeatures : [],
    eye: position,
    target,
    fov,
    width,
    height,
    fallbackPx: fallbackFacilityPx,
    scale: finitePositive(density.facilityFeatureScale, 1),
  });

  const seatSpacingPass = seats <= 1 || projectedSeatSpacingPx >= density.minProjectedSeatSpacingPx;
  const podReadabilityPass = projectedPodFeaturePx >= density.minProjectedFeaturePx;
  const facilityReadabilityPass = projectedFacilityFeaturePx >= density.minProjectedFeaturePx;

  return Object.freeze({
    ...rootContext(),
    tier,
    densityMode: density.mode,
    facilityFeatureScale: finitePositive(density.facilityFeatureScale, 1),
    seatCount: seats,
    cameraRadius: resolvedRadius,
    cameraFov: fov,
    viewportWidth: width,
    viewportHeight: height,
    pixelsPerWorldUnit,
    worldSeatSpacing: fallbackSeatSpacing,
    projectedSeatSpacingPx,
    projectedPodFeaturePx,
    projectedFacilityFeaturePx,
    thresholds: Object.freeze({
      minProjectedSeatSpacingPx: density.minProjectedSeatSpacingPx,
      minProjectedFeaturePx: density.minProjectedFeaturePx,
    }),
    seatSpacingPass,
    podReadabilityPass,
    facilityReadabilityPass,
    readable: seatSpacingPass && podReadabilityPass && facilityReadabilityPass,
    presentationOnly: true,
  });
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function resolveCameraBasis(eye, target) {
  if (!eye || !target) return null;
  let z = [eye[0] - target[0], eye[1] - target[1], eye[2] - target[2]];
  const zl = Math.hypot(z[0], z[1], z[2]) || 1;
  z = z.map((value) => value / zl);
  let x = [z[2], 0, -z[0]];
  const xl = Math.hypot(x[0], x[2]) || 1;
  x = [x[0] / xl, 0, x[2] / xl];
  const y = [
    z[1] * x[2] - z[2] * x[1],
    z[2] * x[0] - z[0] * x[2],
    z[0] * x[1] - z[1] * x[0],
  ];
  return Object.freeze({ x, y, z });
}

function projectPoint(point, eye, basis, fov, width, height) {
  if (!basis || !eye || !point) return null;
  const relative = [
    finite(point?.x) - eye[0],
    finite(point?.y) - eye[1],
    finite(point?.z) - eye[2],
  ];
  const cameraX = dot(relative, basis.x);
  const cameraY = dot(relative, basis.y);
  const cameraZ = dot(relative, basis.z);
  const w = -cameraZ;
  if (!Number.isFinite(w) || w <= 0.0001) return null;
  const focal = 1 / Math.tan((fov * Math.PI / 180) / 2);
  const aspect = width / Math.max(1, height);
  return [
    (focal / aspect * cameraX / w + 1) * width * 0.5,
    (1 - focal * cameraY / w) * height * 0.5,
  ];
}

function projectSeatSpacingPx({
  centers, eye, target, fov, width, height, fallbackWorldSpacing, fallbackPixelsPerWorldUnit,
}) {
  if (!Array.isArray(centers) || centers.length < 2) {
    return Number.isFinite(fallbackWorldSpacing)
      ? fallbackWorldSpacing * fallbackPixelsPerWorldUnit
      : Infinity;
  }
  const basis = resolveCameraBasis(eye, target);
  const projected = centers
    .slice()
    .sort((a, b) => finite(a?.seatIndex, 0) - finite(b?.seatIndex, 0))
    .map((entry) => projectPoint(entry?.center, eye, basis, fov, width, height))
    .filter(Boolean);
  if (projected.length < 2) {
    return Number.isFinite(fallbackWorldSpacing)
      ? fallbackWorldSpacing * fallbackPixelsPerWorldUnit
      : Infinity;
  }
  let minimum = Infinity;
  for (let index = 0; index < projected.length; index += 1) {
    const next = projected[(index + 1) % projected.length];
    const current = projected[index];
    minimum = Math.min(minimum, Math.hypot(next[0] - current[0], next[1] - current[1]));
  }
  return minimum;
}

function projectFeatureBoxesPx({
  features, eye, target, fov, width, height, fallbackPx, scale = 1,
}) {
  if (!Array.isArray(features) || features.length === 0) return fallbackPx;
  const basis = resolveCameraBasis(eye, target);
  if (!basis) return fallbackPx;
  let minimum = Infinity;
  for (const feature of features) {
    const center = feature?.center;
    const dimensions = feature?.dimensions;
    if (!center || !dimensions) continue;
    const dx = Math.max(0, finite(dimensions.x) * scale);
    const dy = Math.max(0, finite(dimensions.y));
    const dz = Math.max(0, finite(dimensions.z) * scale);
    const projected = [];
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        for (const sz of [-1, 1]) {
          const point = projectPoint({
            x: finite(center.x) + sx * dx * 0.5,
            y: finite(center.y) + sy * dy * 0.5,
            z: finite(center.z) + sz * dz * 0.5,
          }, eye, basis, fov, width, height);
          if (point) projected.push(point);
        }
      }
    }
    if (projected.length < 2) continue;
    const xs = projected.map((point) => point[0]);
    const ys = projected.map((point) => point[1]);
    minimum = Math.min(minimum, Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)));
  }
  return Number.isFinite(minimum) ? minimum : fallbackPx;
}
