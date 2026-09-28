import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MACHINE_RESPONSIVE_DENSITY,
  MACHINE_RESPONSIVE_TIER,
  resolveMachineResponsive,
} from '../frontend/spatial/machine-responsive.js';
import { deriveMachineResponsiveReadability } from '../frontend/spatial/machine-responsive-readability.js';

test('S23 exposes one presentation density policy without changing user-controlled data-density', () => {
  const desktop = resolveMachineResponsive({ width: 1280, height: 800 });
  const compact = resolveMachineResponsive({ width: 820, height: 1180 });
  const phone = resolveMachineResponsive({ width: 390, height: 844 });

  assert.equal(desktop.presentationDensity, MACHINE_RESPONSIVE_DENSITY.desktop.mode);
  assert.equal(compact.presentationDensity, MACHINE_RESPONSIVE_DENSITY.compact.mode);
  assert.equal(phone.presentationDensity, MACHINE_RESPONSIVE_DENSITY.phone.mode);
  assert.ok(desktop.minProjectedSeatSpacingPx > compact.minProjectedSeatSpacingPx);
  assert.ok(compact.minProjectedSeatSpacingPx > phone.minProjectedSeatSpacingPx);
  assert.ok(desktop.minProjectedFeaturePx > compact.minProjectedFeaturePx);
  assert.ok(compact.minProjectedFeaturePx > phone.minProjectedFeaturePx);
});

test('S23 computes conservative screen-space density/readability for the 10-seat machine', () => {
  const responsive = resolveMachineResponsive({ width: 390, height: 844 });
  const result = deriveMachineResponsiveReadability({
    responsive,
    viewport: { width: 390, height: 844 },
    cameraRadius: 24,
    cameraFov: 48,
    seatRingRadius: 8,
    seatCount: 10,
    podSpan: 1.34,
    facilitySpan: 0.48,
  });

  assert.equal(result.tier, MACHINE_RESPONSIVE_TIER.PHONE);
  assert.equal(result.densityMode, 'compact');
  assert.equal(result.seatCount, 10);
  assert.ok(result.projectedSeatSpacingPx >= result.thresholds.minProjectedSeatSpacingPx);
  assert.ok(result.projectedPodFeaturePx >= result.thresholds.minProjectedFeaturePx);
  assert.ok(result.projectedFacilityFeaturePx >= result.thresholds.minProjectedFeaturePx);
  assert.equal(result.readable, true);
  assert.equal(result.presentationOnly, true);
});

test('S23 fails the readability contract when the projected machine is genuinely too small', () => {
  const responsive = resolveMachineResponsive({ width: 390, height: 844 });
  const result = deriveMachineResponsiveReadability({
    responsive,
    viewport: { width: 390, height: 844 },
    cameraRadius: 80,
    cameraFov: 48,
    seatRingRadius: 3,
    seatCount: 10,
    podSpan: 0.3,
    facilitySpan: 0.4,
  });

  assert.equal(result.readable, false);
  assert.equal(result.seatSpacingPass, false);
  assert.equal(result.podReadabilityPass, false);
  assert.equal(result.facilityReadabilityPass, false);
});


test('S23 projects actual machine geometry through the supplied final phone camera pose', () => {
  const responsive = resolveMachineResponsive({ width: 390, height: 844 });
  const seatCenters = [
    [0, 5.05, 0.6, 0], [1, 4.0855358216, 0.77, 2.9683155241],
    [2, 1.5605358216, 0.63, 4.8028354073], [3, -1.5605358216, 0.8, 4.8028354073],
    [4, -4.0855358216, 0.66, 2.9683155241], [5, -5.05, 0.83, 0],
    [6, -4.0855358216, 0.69, -2.9683155241], [7, -1.5605358216, 0.86, -4.8028354073],
    [8, 1.5605358216, 0.72, -4.8028354073], [9, 4.0855358216, 0.89, -2.9683155241],
  ].map(([seatIndex, x, y, z]) => ({ seatIndex, center: { x, y, z } }));
  const result = deriveMachineResponsiveReadability({
    responsive,
    viewport: { width: 390, height: 844 },
    cameraRadius: 27.5,
    cameraFov: 48,
    cameraPosition: [2.4559020495, 10.62, 29.8501249583],
    cameraTarget: [0, 0.42, 0],
    seatCount: 10,
    seatCenters,
    podFeatures: [{ center: { x: 5.05, y: 0.6, z: 0 }, dimensions: { x: 1.34, y: 0.62, z: 1.08 } }],
    facilityFeatures: [{ center: { x: -0.41, y: 1.5, z: -10.03 }, dimensions: { x: 0.56, y: 0.18, z: 0.46 } }],
  });
  assert.equal(result.tier, MACHINE_RESPONSIVE_TIER.PHONE);
  assert.equal(result.facilityFeatureScale, 1.13);
  assert.ok(result.projectedSeatSpacingPx >= result.thresholds.minProjectedSeatSpacingPx);
  assert.ok(result.projectedPodFeaturePx >= result.thresholds.minProjectedFeaturePx);
  assert.ok(result.projectedFacilityFeaturePx >= result.thresholds.minProjectedFeaturePx);
  assert.ok(result.projectedFacilityFeaturePx >= 14);
  assert.equal(result.readable, true);
});
