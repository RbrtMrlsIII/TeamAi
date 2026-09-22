import { isFeatureState, normalizeFeatureState } from './feature-state.js';

export const SEAT_TRANSACTION_KINDS = Object.freeze([
  'navigation',
  'retrieval',
  'connection-test',
  'mcp-invocation',
  'ai-execution',
  'handoff-continuation',
  'storage-operation',
  'commerce-verification',
  'authorization',
  'recovery',
]);

export function isSeatTransactionKind(value) {
  return SEAT_TRANSACTION_KINDS.includes(String(value || ''));
}

export function createSeatTransactionPresentation({
  seatId,
  transactionId,
  kind,
  state = 'LOADING',
  progress = null,
  authoritative = false,
  startedAt = null,
  completedAt = null,
  errorCode = null,
} = {}) {
  const normalizedKind = String(kind || '');
  if (!isSeatTransactionKind(normalizedKind)) return null;
  const normalizedState = normalizeFeatureState(state, 'LOADING');
  if (!isFeatureState(normalizedState)) return null;

  return Object.freeze({
    seatId: String(seatId || ''),
    transactionId: String(transactionId || ''),
    kind: normalizedKind,
    state: normalizedState,
    progress: Number.isFinite(Number(progress)) ? Math.max(0, Math.min(1, Number(progress))) : null,
    authoritative: authoritative === true,
    presentationOnly: true,
    startedAt: startedAt ?? null,
    completedAt: completedAt ?? null,
    errorCode: errorCode ? String(errorCode) : null,
  });
}

export function createSeatReportPresentation({
  seatId,
  turnId,
  responsibility = null,
  completionState = 'UNAVAILABLE',
  completed = [],
  unresolved = [],
  decisions = [],
  nextAction = null,
  remainingBudget = null,
  authoritative = false,
} = {}) {
  if (!authoritative) {
    return Object.freeze({
      available: false,
      seatId: String(seatId || ''),
      turnId: String(turnId || ''),
      completionState: 'UNAVAILABLE',
      presentationOnly: true,
    });
  }

  const safeList = (value) => Array.isArray(value) ? value.map((item) => String(item)).slice(0, 20) : [];
  return Object.freeze({
    available: true,
    seatId: String(seatId || ''),
    turnId: String(turnId || ''),
    responsibility: responsibility ? String(responsibility) : null,
    completionState: normalizeFeatureState(completionState, 'UNAVAILABLE'),
    completed: safeList(completed),
    unresolved: safeList(unresolved),
    decisions: safeList(decisions),
    nextAction: nextAction ? String(nextAction) : null,
    remainingBudget: Number.isFinite(Number(remainingBudget)) ? Math.max(0, Number(remainingBudget)) : null,
    authoritative: true,
    presentationOnly: true,
  });
}
