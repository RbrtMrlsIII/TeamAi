import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveStructuralPreviewChoreography,
  expectedStructuralPreviewChoreographyPhases,
  STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT,
} from '../frontend/spatial/machine-structural-choreography-sequence.js';

test('structural preview follows the canonical transformation choreography phases', () => {
  assert.deepEqual(
    expectedStructuralPreviewChoreographyPhases(),
    [
      'STOWED',
      'SHELL_DEPLOYING',
      'DIVISION_DEPLOYING',
      'TOPOLOGY_LINKING',
      'ELECTRICAL_TRANSFER',
      'SETTLED',
    ],
  );
  assert.equal(STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT, 6);
  for (let index = 0; index < 6; index += 1) {
    const state = deriveStructuralPreviewChoreography(index);
    assert.equal(state.stageIndex, index);
    assert.equal(state.choreography.phase, expectedStructuralPreviewChoreographyPhases()[index]);
    assert.equal(state.choreography.presentationOnly, true);
    assert.equal(state.hierarchyOpen, index >= 2 && index <= 5);
    assert.equal(state.focusedChildId, index >= 2 && index <= 5 ? 'SEAT_CONNECTION' : null);
  }
});

test('structural preview choreography wraps deterministically', () => {
  assert.equal(
    deriveStructuralPreviewChoreography(6).stageIndex,
    0,
  );
  assert.equal(
    deriveStructuralPreviewChoreography(-1).stageIndex,
    5,
  );
});
