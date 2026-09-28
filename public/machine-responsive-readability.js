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
  seatRingRadius = 0,
  seatCount = 1,
  podSpan = 0,
  facilitySpan = 0,
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

  const verticalFieldSpan = 2 * radius * Math.tan((fov * Math.PI / 180) / 2);
  const pixelsPerWorldUnit = height / Math.max(verticalFieldSpan, 0.0001);
  const worldSeatSpacing = seats > 1
    ? 2 * ringRadius * Math.sin(Math.PI / seats)
    : Infinity;
  const projectedSeatSpacingPx = Number.isFinite(worldSeatSpacing)
    ? worldSeatSpacing * pixelsPerWorldUnit
    : Infinity;
  const projectedPodFeaturePx = Math.max(0, finite(podSpan, 0)) * pixelsPerWorldUnit;
  const projectedFacilityFeaturePx = Math.max(0, finite(facilitySpan, 0)) * pixelsPerWorldUnit;

  const seatSpacingPass = seats <= 1 || projectedSeatSpacingPx >= density.minProjectedSeatSpacingPx;
  const podReadabilityPass = projectedPodFeaturePx >= density.minProjectedFeaturePx;
  const facilityReadabilityPass = projectedFacilityFeaturePx >= density.minProjectedFeaturePx;

  return Object.freeze({
    ...rootContext(),
    tier,
    densityMode: density.mode,
    seatCount: seats,
    cameraRadius: radius,
    cameraFov: fov,
    viewportWidth: width,
    viewportHeight: height,
    pixelsPerWorldUnit,
    worldSeatSpacing,
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
