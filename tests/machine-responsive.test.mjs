import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MACHINE_RESPONSIVE_TIER,
  resolveMachineResponsive,
  applyMachineResponsiveState,
} from '../frontend/spatial/machine-responsive.js';

test('S23 classifies desktop, compact/tablet, and phone from one breakpoint scale', () => {
  assert.equal(resolveMachineResponsive({ width: 1280, height: 800 }).tier, MACHINE_RESPONSIVE_TIER.DESKTOP);
  assert.equal(resolveMachineResponsive({ width: 820, height: 1180 }).tier, MACHINE_RESPONSIVE_TIER.COMPACT);
  assert.equal(resolveMachineResponsive({ width: 390, height: 844 }).tier, MACHINE_RESPONSIVE_TIER.PHONE);
});

test('S23 preserves the existing aspect-driven camera adaptation', () => {
  assert.equal(resolveMachineResponsive({ width: 1280, height: 800 }).cameraDistanceMultiplier, 0.83);
  assert.equal(resolveMachineResponsive({ width: 790, height: 720 }).cameraDistanceMultiplier, 1.10);
  assert.equal(resolveMachineResponsive({ width: 820, height: 1180 }).cameraDistanceMultiplier, 1.25);
  assert.equal(resolveMachineResponsive({ width: 390, height: 844 }).cameraDistanceMultiplier, 1.25);
  assert.equal(resolveMachineResponsive({ width: 390, height: 844 }).cameraFov, 48);
  assert.equal(resolveMachineResponsive({ width: 390, height: 844 }).minProjectedSeatSpacingPx, 32);
  assert.equal(resolveMachineResponsive({ width: 390, height: 844 }).facilityFeatureScale, 1.13);
});

test('S23 pure viewport classification does not query media capabilities', () => {
  const previous = globalThis.matchMedia;
  let calls = 0;
  globalThis.matchMedia = () => {
    calls += 1;
    return { matches: false };
  };
  try {
    resolveMachineResponsive({ width: 390, height: 844 });
    assert.equal(calls, 0);
  } finally {
    if (previous) globalThis.matchMedia = previous;
    else delete globalThis.matchMedia;
  }
});

test('S23 pointer and hover capabilities are presentation metadata only', () => {
  assert.equal(resolveMachineResponsive({ width: 820, height: 1180, pointerType: 'touch' }).pointer, 'coarse');
  assert.equal(resolveMachineResponsive({ width: 1280, height: 800, pointerType: 'mouse' }).pointer, 'fine');
  assert.equal(resolveMachineResponsive({ width: 1280, height: 800, pointer: 'fine', hover: 'hover' }).hover, 'hover');
});

test('S23 document state does not overwrite user-controlled data-density', () => {
  const attributes = new Map([['data-density', 'compact']]);
  const root = {
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
  };
  const state = applyMachineResponsiveState(root, { width: 390, height: 844 });
  assert.equal(state.tier, MACHINE_RESPONSIVE_TIER.PHONE);
  assert.equal(attributes.get('data-density'), 'compact');
  assert.equal(attributes.get('data-spatial-responsive'), 'phone');
  assert.equal(attributes.get('data-spatial-orientation'), 'portrait');
});
