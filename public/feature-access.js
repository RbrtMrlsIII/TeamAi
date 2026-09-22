import { getFrontendFeature } from './feature-registry.js';

const GUEST_AUTH_ACTIVATION = Object.freeze(['auth-gateway']);

export function resolveFeatureAccess(featureOrId, { authenticated = false } = {}) {
  const feature = typeof featureOrId === 'string' ? getFrontendFeature(featureOrId) : featureOrId;
  if (!feature) return null;

  if (authenticated) {
    return Object.freeze({
      featureId: feature.id,
      visibility: 'DISCOVERABLE',
      interaction: 'AUTHENTICATED_CONTEXT',
      mutation: 'BACKEND_AUTHORITY_REQUIRED',
      activationAllowed: true,
      presentationOnly: true,
    });
  }

  const authActivation = GUEST_AUTH_ACTIVATION.includes(feature.id);
  return Object.freeze({
    featureId: feature.id,
    visibility: 'DISCOVERABLE',
    interaction: authActivation ? 'GUEST_ACTION' : 'DISCOVERABLE_LOCKED',
    mutation: authActivation ? 'AUTH_GATEWAY' : 'BLOCKED_UNTIL_AUTHENTICATED',
    activationAllowed: authActivation,
    presentationOnly: true,
  });
}

export function canGuestActivateFeature(featureOrId) {
  return resolveFeatureAccess(featureOrId, { authenticated: false })?.activationAllowed === true;
}

export function guestActivationFeatureIds() {
  return GUEST_AUTH_ACTIVATION.slice();
}
