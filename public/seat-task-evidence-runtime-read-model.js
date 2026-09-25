import {
  createSeatReportPresentation,
  createSeatTransactionPresentation,
} from './seat-runtime-presentation.js';
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT = createSpatialConstructionContext({
  slice: 'S17',
  owner: 'frontend/spatial/seat-task-evidence-runtime-read-model.js',
  semanticId: 'SEAT_TASK_EVIDENCE',
  semanticBoundary: 'presentation-only',
});

const MAX_ITEMS = 20;
const MAX_EVIDENCE_REFS = 30;

function text(value) {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}

function safeList(value, max = MAX_ITEMS) {
  return Object.freeze(
    (Array.isArray(value) ? value : [])
      .map(text)
      .filter(Boolean)
      .slice(0, max),
  );
}

function safeEvidenceRefs(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(
    value
      .map((entry) => {
        if (typeof entry === 'string') {
          const ref = text(entry);
          return ref ? Object.freeze({ ref, kind: 'reference' }) : null;
        }
        if (!entry || typeof entry !== 'object') return null;
        const ref = text(entry.ref || entry.id || entry.path);
        if (!ref) return null;
        return Object.freeze({
          ref,
          kind: text(entry.kind) || 'reference',
          label: text(entry.label),
        });
      })
      .filter(Boolean)
      .slice(0, MAX_EVIDENCE_REFS),
  );
}

export function normalizeSeatTaskEvidenceReadModel(input = {}) {
  const ready = input && typeof input === 'object' ? input : {};
  const source = text(ready.source);
  const authorized = ready.authorized === true;
  const available = source === 'backend-read-model' && ready.available === true;
  const seatId = text(ready.seatId);
  const turnId = text(ready.turnId || ready.latest?.turnId || ready.latest?.executionId);

  const report = authorized && seatId
    ? createSeatReportPresentation({
      seatId,
      turnId,
      responsibility: ready.responsibility,
      completionState: ready.completionState,
      result: text(ready.result),
      summary: text(ready.summary),
      findings: safeList(ready.findings),
      completed: safeList(ready.completed),
      unresolved: safeList(ready.unresolved),
      decisions: safeList(ready.decisions),
      evidenceRefs: safeEvidenceRefs(ready.evidenceRefs || ready.evidence),
      nextAction: text(ready.nextAction),
      nextHandoffContext: text(ready.nextHandoffContext),
      remainingBudget: ready.remainingBudget,
      authoritative: true,
    })
    : createSeatReportPresentation({ authoritative: false });

  const transaction = ready.transaction && typeof ready.transaction === 'object'
    ? createSeatTransactionPresentation({
      ...ready.transaction,
      seatId: ready.transaction.seatId || seatId || '',
      authoritative: authorized && ready.transaction.authoritative === true,
    })
    : null;

  return Object.freeze({
    source: source || 'backend-read-model',
    state: authorized && available && report.available ? 'READY' : available ? 'BACKEND_STATE_REQUIRED' : 'UNAVAILABLE',
    available: available && report.available,
    authorized,
    seatId: authorized ? seatId : null,
    report,
    transaction,
    continuationAvailable: authorized && ready.continuationAvailable === true,
    presentationOnly: true,
  });
}

export function createEmptySeatTaskEvidenceReadModel() {
  return normalizeSeatTaskEvidenceReadModel({
    available: false,
    authorized: false,
  });
}
