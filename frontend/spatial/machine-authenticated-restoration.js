import { clampSeatCount, MAX_SEAT_COUNT } from './seat-capacity.js';
import {
  createSpatialConstructionContext,
  validateSpatialConstructionNode,
} from './machine-spatial-root-contract.js';
import { normalizeWorkspaceReadModel } from './workspace-runtime-read-model.js';

export const AUTHENTICATED_RESTORATION_ID = 'authenticated-world-restoration';

export const AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT = Object.freeze(
  createSpatialConstructionContext({
    slice: 'S12',
    owner: 'frontend/spatial/machine-authenticated-restoration.js',
    semanticId: AUTHENTICATED_RESTORATION_ID,
    semanticBoundary: 'presentation-only',
  }),
);

if (!validateSpatialConstructionNode(AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT).valid) {
  throw new Error('invalid S12 authenticated restoration spatial root contract');
}

const RESTORATION_STATES = Object.freeze({
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  AUTHENTICATED_UNAVAILABLE: 'AUTHENTICATED_UNAVAILABLE',
  AUTHENTICATED_READY: 'AUTHENTICATED_READY',
});

const REASONS = Object.freeze({
  AUTHENTICATION_REQUIRED: 'AUTHENTICATION_REQUIRED',
  IDENTITY_UNAVAILABLE: 'IDENTITY_UNAVAILABLE',
  WORKPLACE_UNAVAILABLE: 'WORKPLACE_UNAVAILABLE',
  PROJECT_UNAVAILABLE: 'PROJECT_UNAVAILABLE',
  TEAM_UNAVAILABLE: 'TEAM_UNAVAILABLE',
  NOT_AUTHORIZED: 'NOT_AUTHORIZED',
  NOT_ENTITLED: 'NOT_ENTITLED',
  SCHEDULER_UNAVAILABLE: 'SCHEDULER_UNAVAILABLE',
  RUNTIME_UNHEALTHY: 'RUNTIME_UNHEALTHY',
  DURABLE_SEATS_UNAVAILABLE: 'DURABLE_SEATS_UNAVAILABLE',
  DURABLE_SEAT_CAPACITY_INVALID: 'DURABLE_SEAT_CAPACITY_INVALID',
});

const text = (value, fallback = '') => {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
};

function normalizeIdentity(value) {
  if (!value || typeof value !== 'object') return null;
  const provider = text(value.provider);
  const subjectId = text(value.subjectId || value.uid);
  if (provider !== 'firebase' || !subjectId) return null;
  return Object.freeze({ provider, subjectId });
}

function normalizeDurableSeat(value) {
  if (!value || typeof value !== 'object') return null;
  const id = text(value.id || value.seatId);
  const label = text(value.label || value.name);
  if (!id || !label || value.durable !== true) return null;
  return Object.freeze({
    id,
    label,
    durable: true,
    state: text(value.state, 'UNKNOWN'),
    kind: text(value.kind, 'seat'),
  });
}

function unavailable(reason, workspace, identity) {
  return Object.freeze({
    ...AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT,
    source: 'backend-read-model',
    identity,
    workspace,
    durableSeats: Object.freeze([]),
    durableSeatCount: 0,
    state: workspace.authenticated
      ? RESTORATION_STATES.AUTHENTICATED_UNAVAILABLE
      : RESTORATION_STATES.AUTHENTICATION_REQUIRED,
    available: false,
    reason,
    returnPath: 'world',
    presentationOnly: true,
    notAuthority: true,
    notDurableState: true,
  });
}

export function normalizeAuthenticatedRestorationReadModel(input = {}) {
  const workspace = normalizeWorkspaceReadModel(input);
  const identity = normalizeIdentity(input.identity);

  if (!workspace.authenticated) {
    return unavailable(REASONS.AUTHENTICATION_REQUIRED, workspace, null);
  }

  if (!identity) {
    return unavailable(REASONS.IDENTITY_UNAVAILABLE, workspace, null);
  }

  if (!workspace.workplace) {
    return unavailable(REASONS.WORKPLACE_UNAVAILABLE, workspace, identity);
  }

  if (!workspace.project) {
    return unavailable(REASONS.PROJECT_UNAVAILABLE, workspace, identity);
  }

  if (!workspace.team) {
    return unavailable(REASONS.TEAM_UNAVAILABLE, workspace, identity);
  }

  if (!workspace.authorized) {
    return unavailable(REASONS.NOT_AUTHORIZED, workspace, identity);
  }

  if (!workspace.entitled) {
    return unavailable(REASONS.NOT_ENTITLED, workspace, identity);
  }

  if (!workspace.schedulerEligible) {
    return unavailable(REASONS.SCHEDULER_UNAVAILABLE, workspace, identity);
  }

  if (!workspace.healthy) {
    return unavailable(REASONS.RUNTIME_UNHEALTHY, workspace, identity);
  }

  const sourceSeats = Array.isArray(input.seats) ? input.seats : [];
  const durableSeats = sourceSeats.map(normalizeDurableSeat).filter(Boolean);

  if (durableSeats.length > MAX_SEAT_COUNT) {
    return unavailable(REASONS.DURABLE_SEAT_CAPACITY_INVALID, workspace, identity);
  }

  if (durableSeats.length < 1) {
    return unavailable(REASONS.DURABLE_SEATS_UNAVAILABLE, workspace, identity);
  }

  return Object.freeze({
    ...AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT,
    source: 'backend-read-model',
    identity,
    workspace,
    durableSeats: Object.freeze(durableSeats),
    durableSeatCount: clampSeatCount(durableSeats.length),
    state: RESTORATION_STATES.AUTHENTICATED_READY,
    available: true,
    reason: null,
    returnPath: 'world',
    presentationOnly: true,
    notAuthority: true,
    notDurableState: true,
  });
}

let current = normalizeAuthenticatedRestorationReadModel();

function publish(model) {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return model;

  const doc = typeof document !== 'undefined' ? document : null;
  doc?.documentElement?.setAttribute?.(
    'data-authenticated-restoration-state',
    model.state,
  );
  doc?.documentElement?.setAttribute?.(
    'data-authenticated-restoration-reason',
    model.reason || '',
  );

  const hero = window.TeamAiHero;
  if (hero && typeof hero.setAuthenticatedRestorationState === 'function') {
    hero.setAuthenticatedRestorationState({
      authenticated: Boolean(model.workspace.authenticated),
      state: model.state,
      reason: model.reason,
      seatCount: model.available ? model.durableSeatCount : null,
    });
  }

  window.dispatchEvent(new CustomEvent('teamai:workspace-runtime-read-model', {
    detail: Object.freeze({ readModel: model.workspace }),
  }));

  if (model.workspace.authenticated) {
    window.TeamAiHeroLayerHandoff?.enterMachineLayer?.({
      source: 'authenticated-restoration',
    });
  }

  window.dispatchEvent(new CustomEvent('teamai:authenticated-restoration-state', {
    detail: model,
  }));

  return model;
}

export function setAuthenticatedRestorationReadModel(input = {}) {
  current = normalizeAuthenticatedRestorationReadModel(input);
  return publish(current);
}

export function getAuthenticatedRestorationReadModel() {
  return current;
}

export function restorationStates() {
  return Object.freeze({ ...RESTORATION_STATES });
}

export function restorationReasons() {
  return Object.freeze({ ...REASONS });
}

export const machineAuthenticatedRestoration = Object.freeze({
  context: AUTHENTICATED_RESTORATION_SPATIAL_CONTEXT,
  normalize: normalizeAuthenticatedRestorationReadModel,
  setReadModel: setAuthenticatedRestorationReadModel,
  getReadModel: getAuthenticatedRestorationReadModel,
  states: restorationStates,
  reasons: restorationReasons,
});

if (typeof window !== 'undefined') {
  window.TeamAiAuthenticatedRestoration = machineAuthenticatedRestoration;
  window.addEventListener('teamai:authenticated-restoration-read-model', (event) => {
    if (event.detail?.readModel) setAuthenticatedRestorationReadModel(event.detail.readModel);
  });
}
