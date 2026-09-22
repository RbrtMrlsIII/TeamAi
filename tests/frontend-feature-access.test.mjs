import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { canGuestActivateFeature, guestActivationFeatureIds, resolveFeatureAccess } from '../frontend/spatial/feature-access.js';

test('guests can discover all registered facilities but only activate the auth gateway', () => {
  assert.deepEqual(guestActivationFeatureIds(), ['auth-gateway']);

  const locked = resolveFeatureAccess('storage');
  assert.deepEqual(locked, {
    featureId: 'storage',
    visibility: 'DISCOVERABLE',
    interaction: 'DISCOVERABLE_LOCKED',
    mutation: 'BLOCKED_UNTIL_AUTHENTICATED',
    activationAllowed: false,
    presentationOnly: true,
  });

  const auth = resolveFeatureAccess('auth-gateway');
  assert.equal(auth?.interaction, 'GUEST_ACTION');
  assert.equal(auth?.activationAllowed, true);
  assert.equal(canGuestActivateFeature('auth-gateway'), true);
  assert.equal(canGuestActivateFeature('marketplace'), false);
});

test('authenticated context still delegates mutation authority to backend/runtime', () => {
  const access = resolveFeatureAccess('marketplace', { authenticated: true });
  assert.deepEqual(access, {
    featureId: 'marketplace',
    visibility: 'DISCOVERABLE',
    interaction: 'AUTHENTICATED_CONTEXT',
    mutation: 'BACKEND_AUTHORITY_REQUIRED',
    activationAllowed: true,
    presentationOnly: true,
  });
});

test('unknown feature ids fail closed', () => {
  assert.equal(resolveFeatureAccess('not-real'), null);
});

test('source and public guest access modules remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/feature-access.js', 'utf8'),
    readFileSync('public/feature-access.js', 'utf8'),
  );
});
