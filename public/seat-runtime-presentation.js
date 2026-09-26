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
  retryable = false,
  cancelable = false,
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
    retryable: authoritative === true && retryable === true,
    cancelable: authoritative === true && cancelable === true,
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
  result = null,
  summary = null,
  findings = [],
  completed = [],
  unresolved = [],
  decisions = [],
  evidenceRefs = [],
  nextAction = null,
  nextHandoffContext = null,
  remainingBudget = null,
  authoritative = false,
} = {}) {
  if (!authoritative) {
    return Object.freeze({
      available: false,
      seatId: String(seatId || ''),
      turnId: String(turnId || ''),
      completionState: 'UNAVAILABLE',
      result: null,
      summary: null,
      findings: [],
      completed: [],
      unresolved: [],
      decisions: [],
      evidenceRefs: [],
      nextAction: null,
      nextHandoffContext: null,
      remainingBudget: null,
      presentationOnly: true,
    });
  }

  const safeList = (value) => Array.isArray(value) ? value.map((item) => String(item)).slice(0, 20) : [];
  const safeEvidenceRefs = (value) => Array.isArray(value)
    ? value.map((item) => Object.freeze({
        ref: String(item?.ref ?? item ?? ''),
        kind: String(item?.kind ?? 'reference'),
        label: item?.label ? String(item.label) : null,
      })).filter((item) => item.ref).slice(0, 30)
    : [];
  return Object.freeze({
    available: true,
    seatId: String(seatId || ''),
    turnId: String(turnId || ''),
    responsibility: responsibility ? String(responsibility) : null,
    completionState: normalizeFeatureState(completionState, 'UNAVAILABLE'),
    result: result ? String(result) : null,
    summary: summary ? String(summary) : null,
    findings: safeList(findings),
    completed: safeList(completed),
    unresolved: safeList(unresolved),
    decisions: safeList(decisions),
    evidenceRefs: safeEvidenceRefs(evidenceRefs),
    nextAction: nextAction ? String(nextAction) : null,
    nextHandoffContext: nextHandoffContext ? String(nextHandoffContext) : null,
    remainingBudget: Number.isFinite(Number(remainingBudget)) ? Math.max(0, Number(remainingBudget)) : null,
    authoritative: true,
    presentationOnly: true,
  });
}
