/**
 * Issue #400 common frontend feature-state grammar.
 *
 * Presentation/state vocabulary only. This module never decides authorization,
 * entitlement, scheduler eligibility, or durable truth.
 */

export const FEATURE_STATES = Object.freeze([
  'INACTIVE',
  'HOVER',
  'FOCUS',
  'SELECTED',
  'PRESSED',
  'OPENING',
  'OPEN',
  'LOADING',
  'READY',
  'ACTIVE',
  'COMPLETED',
  'HANDOFF',
  'WAITING_FOR_CONTINUATION',
  'DISABLED',
  'UNAVAILABLE',
  'BLOCKED',
  'ERROR',
  'CLOSING',
]);

const PRESENTATION_PRECEDENCE = Object.freeze([
  'BLOCKED',
  'ERROR',
  'DISABLED',
  'UNAVAILABLE',
  'PRESSED',
  'SELECTED',
  'OPENING',
  'OPEN',
  'CLOSING',
  'FOCUS',
  'HOVER',
  'ACTIVE',
  'INACTIVE',
]);

const RANK = new Map(PRESENTATION_PRECEDENCE.map((state, index) => [state, index]));

export function isFeatureState(value) {
  return FEATURE_STATES.includes(String(value || ''));
}

export function normalizeFeatureState(value, fallback = 'INACTIVE') {
  const next = String(value || '');
  return isFeatureState(next) ? next : fallback;
}

export function resolveFeaturePresentationState(states = []) {
  const candidates = Array.isArray(states) ? states : [states];
  let winner = 'INACTIVE';
  let winnerRank = RANK.get(winner);

  for (const value of candidates) {
    const state = normalizeFeatureState(value, '');
    const rank = RANK.get(state);
    if (rank === undefined) continue;
    if (rank < winnerRank) {
      winner = state;
      winnerRank = rank;
    }
  }

  return winner;
}

export function featureStatePrecedence() {
  return PRESENTATION_PRECEDENCE.slice();
}

export function featureStateMetadata(state) {
  const normalized = normalizeFeatureState(state);
  return Object.freeze({
    state: normalized,
    presentationOnly: true,
    interactionTransition: normalized === 'PRESSED',
    continuousMotionAllowed: !['OPENING', 'CLOSING', 'LOADING', 'BLOCKED', 'ERROR', 'DISABLED', 'UNAVAILABLE'].includes(normalized),
  });
}
