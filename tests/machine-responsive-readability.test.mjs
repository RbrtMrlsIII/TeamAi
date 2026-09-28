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
