/**
 * F — Health leaf domain read-model (presentation only).
 * source:'domain' only with named contract; else fixture.
 * Never invents authorization / entitlement / durable health.
 */
import {
  HEALTH_STATUS,
  HIERARCHY_PART,
} from './hero-hierarchy-runtime.js';

/** Named contract id required for domain-sourced health. */
export const HEALTH_DOMAIN_CONTRACT_ID = 'seat.connection.health.v1';

export const HEALTH_SOURCE = Object.freeze({
  FIXTURE: 'fixture',
  DOMAIN: 'domain',
});

const ALLOWED = new Set(Object.values(HEALTH_STATUS));

/**
 * Apply a domain read-model only when contract matches.
 * Invalid / missing contract → no-op (fixture remains).
 * Does not write durable state; presentation stamp only.
 */
export function applyHealthReadModel(state, payload = {}) {
  if (!state || typeof state !== 'object') return state;
  const contractId = payload.contractId;
  const status = payload.status;
  const source = payload.source;

  if (source !== HEALTH_SOURCE.DOMAIN) {
    if (source === HEALTH_SOURCE.FIXTURE || source == null) {
      state.healthSource = HEALTH_SOURCE.FIXTURE;
      if (status && ALLOWED.has(status)) state.healthStatus = status;
      state.healthContractId = null;
    }
    return state;
  }

  if (contractId !== HEALTH_DOMAIN_CONTRACT_ID) {
    return state;
  }
  if (!status || !ALLOWED.has(status)) {
    return state;
  }

  state.healthSource = HEALTH_SOURCE.DOMAIN;
  state.healthStatus = status;
  state.healthContractId = HEALTH_DOMAIN_CONTRACT_ID;
  state.presentationOnly = true;
  state.durable = false;
  return state;
}

/** Revert to fixture UNKNOWN. */
export function clearHealthDomain(state) {
  if (!state || typeof state !== 'object') return state;
  state.healthSource = HEALTH_SOURCE.FIXTURE;
  state.healthStatus = HEALTH_STATUS.UNKNOWN;
  state.healthContractId = null;
  return state;
}

/** Presentation view of the health leaf (never authority). */
export function getHealthLeafView(state) {
  const status = (state && state.healthStatus) || HEALTH_STATUS.UNKNOWN;
  const source = (state && state.healthSource) || HEALTH_SOURCE.FIXTURE;
  return {
    leafId: HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE,
    status,
    source,
    contractId: source === HEALTH_SOURCE.DOMAIN ? (state.healthContractId || null) : null,
    presentationOnly: true,
    durable: false,
    authorization: false,
  };
}
