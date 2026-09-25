import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createEmptySeatTaskEvidenceReadModel,
  normalizeSeatTaskEvidenceReadModel,
  SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT,
} from '../frontend/spatial/seat-task-evidence-runtime-read-model.js';
import { validateSpatialConstructionNode } from '../frontend/spatial/machine-spatial-root-contract.js';

test('S17 Seat task/evidence context inherits the complete S0-S10 spatial roots', () => {
  const validation = validateSpatialConstructionNode(SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT);
  assert.equal(validation.valid, true);
  assert.equal(SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT.constructionSlice, 'S17');
  assert.equal(SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT.semanticId, 'SEAT_TASK_EVIDENCE');
  assert.deepEqual(SEAT_TASK_EVIDENCE_RUNTIME_CONTEXT.inheritedStructuralRoots, [
    'S0','S1','S2','S3','S4','S5','S6','S7','S8','S9','S10',
  ]);
});

test('S17 fails closed without an authoritative Seat/task read model', () => {
  const model = createEmptySeatTaskEvidenceReadModel();
  assert.equal(model.source, 'backend-read-model');
  assert.equal(model.state, 'UNAVAILABLE');
  assert.equal(model.available, false);
  assert.equal(model.seatId, null);
  assert.equal(model.report.available, false);
  assert.equal(model.transaction, null);
});

test('S17 normalizes a real-ID completed turn report and evidence references', () => {
  const model = normalizeSeatTaskEvidenceReadModel({
    source: 'backend-read-model',
    available: true,
    authorized: true,
    seatId: 'seat-runtime-7',
    turnId: 'turn-2026-09-25-17',
    responsibility: 'coder',
    completionState: 'COMPLETED',
    result: 'Task completed with repository proof.',
    summary: 'Implemented the requested change and verified the exact head.',
    findings: ['All required checks passed.'],
    completed: ['Implementation', 'Verification'],
    unresolved: ['Live provider execution remains separately gated.'],
    decisions: ['Keep backend authority outside the renderer.'],
    evidenceRefs: [
      { ref: 'E404-S17', kind: 'engineering-evidence', label: 'S17 repository evidence' },
      'run-12345',
    ],
    nextAction: 'Review the next governed slice.',
    nextHandoffContext: 'Continue from the exact verified head.',
    remainingBudget: 4200,
    continuationAvailable: true,
    transaction: {
      seatId: 'seat-runtime-7',
      transactionId: 'txn-17',
      kind: 'ai-execution',
      state: 'COMPLETED',
      progress: 1,
      authoritative: true,
    },
  });

  assert.equal(model.state, 'READY');
  assert.equal(model.available, true);
  assert.equal(model.report.available, true);
  assert.equal(model.report.seatId, 'seat-runtime-7');
  assert.equal(model.report.turnId, 'turn-2026-09-25-17');
  assert.equal(model.report.result, 'Task completed with repository proof.');
  assert.deepEqual(model.report.findings, ['All required checks passed.']);
  assert.equal(model.report.evidenceRefs[0].ref, 'E404-S17');
  assert.equal(model.report.evidenceRefs[1].ref, 'run-12345');
  assert.equal(model.report.nextHandoffContext, 'Continue from the exact verified head.');
  assert.equal(model.transaction?.transactionId, 'txn-17');
});

test('S17 hides task report when Seat authorization is absent even if data is supplied', () => {
  const model = normalizeSeatTaskEvidenceReadModel({
    source: 'backend-read-model',
    available: true,
    authorized: false,
    seatId: 'seat-runtime-7',
    turnId: 'turn-private',
    summary: 'private',
    evidenceRefs: ['private-ref'],
  });
  assert.equal(model.state, 'BACKEND_STATE_REQUIRED');
  assert.equal(model.available, false);
  assert.equal(model.report.available, false);
  assert.equal(model.seatId, null);
});

test('S17 shell controller consumes the dedicated read-model event and no longer trusts legacy report events', () => {
  const shell = readFileSync('frontend/spatial/shell-nav.js', 'utf8');
  assert.match(shell, /seat-task-evidence-runtime-read-model.js/);
  assert.match(shell, /teamai:seat-task-evidence-runtime-read-model/);
  assert.doesNotMatch(shell, /teamai:seat-runtime-report/);
});

test('S17 browser-delivered read-model mirror remains exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/seat-task-evidence-runtime-read-model.js', 'utf8'),
    readFileSync('public/seat-task-evidence-runtime-read-model.js', 'utf8'),
  );
  assert.equal(
    readFileSync('frontend/spatial/seat-runtime-presentation.js', 'utf8'),
    readFileSync('public/seat-runtime-presentation.js', 'utf8'),
  );
});
