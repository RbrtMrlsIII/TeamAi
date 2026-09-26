import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  MACHINE_GUEST_STATE,
  resolveMachineGuestPresentation,
} from '../frontend/spatial/machine-guest-state.js';

test('S11 guest presentation is limited and exposes locked feature vocabulary', () => {
  const state = resolveMachineGuestPresentation({
    worldLayer: true,
    reducedMotion: false,
  });
  assert.equal(state.state, MACHINE_GUEST_STATE.GUEST_LIMITED);
  assert.equal(state.limited, true);
  assert.equal(state.authTransition, false);
  assert.equal(state.autoOrbitEnabled, true);
  assert.ok(state.lockedFeatureIds.includes('workspace-hq'));
  assert.ok(state.lockedFeatureIds.includes('marketplace'));
  assert.ok(!state.lockedFeatureIds.includes('auth-gateway'));
  assert.equal(state.presentationOnly, true);
  assert.equal(state.constructionSlice, 'S11');
  assert.equal(state.constructionLayer, 'product-runtime');
  assert.equal(state.semanticBoundary, 'presentation-only');
  assert.deepEqual(state.inheritedStructuralRoots, Array.from({ length: 11 }, (_, index) => `S${index}`));
});

test('S11 auth transition disables guest orbit without granting feature access', () => {
  const state = resolveMachineGuestPresentation({
    worldLayer: true,
    authTransition: true,
    reducedMotion: false,
  });
  assert.equal(state.state, MACHINE_GUEST_STATE.AUTH_TRANSITION);
  assert.equal(state.autoOrbitEnabled, false);
  assert.equal(state.limited, true);
  assert.ok(state.lockedFeatureIds.includes('workspace-hq'));
});

test('S11 reduced motion disables automatic orbit while preserving guest state', () => {
  const state = resolveMachineGuestPresentation({
    worldLayer: true,
    reducedMotion: true,
  });
  assert.equal(state.state, MACHINE_GUEST_STATE.GUEST_LIMITED);
  assert.equal(state.autoOrbitEnabled, false);
  assert.equal(state.reducedMotion, true);
});

test('S11 authenticated projection exits guest-limited mode without creating authorization', () => {
  const state = resolveMachineGuestPresentation({
    worldLayer: true,
    authenticated: true,
  });
  assert.equal(state.state, MACHINE_GUEST_STATE.AUTHENTICATED);
  assert.equal(state.limited, false);
  assert.equal(state.autoOrbitEnabled, false);
  assert.ok(state.lockedFeatureIds.includes('workspace-hq') === false);
});


test('S11 guest-state source and browser copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/machine-guest-state.js', 'utf8'),
    readFileSync('public/machine-guest-state.js', 'utf8'),
  );
});
