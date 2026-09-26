/**
 * Bridge Seat-stack inspection → camera action map and backend read-model → presentation.
 * Presentation only: no authority, durable writes, provider execution, or permission grants.
 */
import { applyResolvedCamera } from './hero-dom-action-map.js';
import { normalizeSeatTaskEvidenceReadModel } from './seat-task-evidence-runtime-read-model.js';
import {
  clearSeatTransactionPresentation,
  setSeatTransactionPresentation,
} from './machine-transaction-presentation.js';
import './hero-division-label-sync.js';

function projectSeatTaskEvidence(model) {
  const normalized = normalizeSeatTaskEvidenceReadModel(model);
  const report = normalized.report;
  const completion = String(report?.completionState || '').toUpperCase();

  let taskState = 'idle';
  if (normalized.state === 'READY') {
    if (completion === 'COMPLETED') taskState = 'complete';
    else if (completion === 'FAILED' || completion === 'ERROR') taskState = 'failed';
    else if (['RUNNING', 'IN_PROGRESS', 'EXECUTING'].includes(completion)) taskState = 'running';
    else if (['QUEUED', 'PENDING', 'READY'].includes(completion)) taskState = 'queued';
  }

  const resultState = normalized.state === 'READY' && Boolean(report?.result)
    ? 'attached'
    : 'none';
  const evidenceState = normalized.state === 'READY' && Array.isArray(report?.evidenceRefs) && report.evidenceRefs.length
    ? 'recorded'
    : 'none';
  const provenance = normalized.state === 'READY' && report?.evidenceRefs?.[0]?.ref
    ? report.evidenceRefs[0].ref
    : 's17:' + normalized.state.toLowerCase();

  const stackApi = window.TeamAiHeroSeatStack;
  if (!stackApi?.setWorkspaceTaskPresentation) return normalized;

  stackApi.setWorkspaceTaskPresentation({
    taskState,
    resultState,
    evidenceState,
    provenance,
    handoffReady: normalized.continuationAvailable,
  });
  return normalized;
}

window.addEventListener('teamai:web-ai-seat-inspection', (event) => {
  const camera = event.detail?.layer?.camera;
  if (!camera) return;
  const hierarchyOpen = document.querySelector('.hero-shell')?.getAttribute('data-hero-machine-ui') === '1'
    || document.querySelector('.hero-shell')?.dataset?.hierarchyOpen === 'true';
  applyResolvedCamera(camera, { hierarchyOpen });
});

window.addEventListener('teamai:seat-task-evidence-runtime-read-model', (event) => {
  const input = event.detail || {};
  const normalized = projectSeatTaskEvidence(input);
  if (Object.prototype.hasOwnProperty.call(input, 'transaction')) {
    if (normalized.transaction) {
      setSeatTransactionPresentation(normalized.transaction);
    } else {
      clearSeatTransactionPresentation();
    }
  }
});

window.TeamAiHeroSeatTaskEvidence = Object.freeze({
  projectReadModel: projectSeatTaskEvidence,
});
