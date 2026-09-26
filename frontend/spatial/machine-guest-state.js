import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';
import { listFrontendFeatures, getGuestPresentationState } from './feature-registry.js';
import { resolveFeatureAccess } from './feature-access.js';

export const MACHINE_GUEST_STATE = Object.freeze({
  GUEST_LIMITED: 'GUEST_LIMITED',
  AUTH_TRANSITION: 'AUTH_TRANSITION',
  AUTHENTICATED: 'AUTHENTICATED',
});

const ROOT_OWNER = 'frontend/spatial/machine-guest-state.js';

function rootContext(semanticId = null) {
  return createSpatialConstructionContext({
    slice: 'S11',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

export function resolveMachineGuestPresentation({
  authenticated = false,
  authTransition = false,
  worldLayer = false,
  reducedMotion = false,
} = {}) {
  const state = authenticated
    ? MACHINE_GUEST_STATE.AUTHENTICATED
    : authTransition
      ? MACHINE_GUEST_STATE.AUTH_TRANSITION
      : MACHINE_GUEST_STATE.GUEST_LIMITED;

  const features = listFrontendFeatures().map((feature) => {
    const guest = getGuestPresentationState(feature);
    const access = resolveFeatureAccess(feature, { authenticated });
    return Object.freeze({
      featureId: feature.id,
      presentation: guest?.presentation || null,
      interaction: access?.interaction || null,
      activationAllowed: access?.activationAllowed === true,
      presentationOnly: true,
    });
  });

  const lockedFeatureIds = features
    .filter((feature) => feature.interaction === 'DISCOVERABLE_LOCKED')
    .map((feature) => feature.featureId);

  return Object.freeze({
    ...rootContext('S11:GUEST:' + state),
    state,
    authenticated: Boolean(authenticated),
    authTransition: Boolean(authTransition),
    worldLayer: Boolean(worldLayer),
    reducedMotion: Boolean(reducedMotion),
    limited: !authenticated,
    autoOrbitEnabled: Boolean(
      worldLayer
      && !authenticated
      && !authTransition
      && !reducedMotion
      && state === MACHINE_GUEST_STATE.GUEST_LIMITED,
    ),
    lockedFeatureIds: Object.freeze(lockedFeatureIds),
    authFeatureId: 'auth-gateway',
    presentationOnly: true,
  });
}
