import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveStructuralPreviewChoreography,
  deriveStructuralPreviewChoreographySample,
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

test('structural preview samples continuously between canonical stages', () => {
  const start = deriveStructuralPreviewChoreographySample(2, 3, 0);
  const middle = deriveStructuralPreviewChoreographySample(2, 3, 0.5);
  const end = deriveStructuralPreviewChoreographySample(2, 3, 1);
  assert.equal(start.choreography.division, 0.4);
  assert.ok(middle.choreography.division > 0.4 && middle.choreography.division < 1);
  assert.equal(end.choreography.division, 1);
  assert.equal(middle.hierarchyOpen, true);
  assert.equal(middle.focusedChildId, 'SEAT_CONNECTION');
});

test('structural preview preserves hierarchy during return until the final frame', () => {
  const middle = deriveStructuralPreviewChoreographySample(5, 0, 0.5);
  const end = deriveStructuralPreviewChoreographySample(5, 0, 1);
  assert.equal(middle.returningToWorld, true);
  assert.equal(middle.view, 'world');
  assert.equal(middle.hierarchyOpen, true);
  assert.equal(middle.focusedChildId, 'SEAT_CONNECTION');
  assert.ok(middle.choreography.transformation > 0 && middle.choreography.transformation < 1);
  assert.equal(end.hierarchyOpen, false);
  assert.equal(end.focusedChildId, null);
  assert.equal(end.choreography.phase, 'STOWED');
});

test('structural preview choreography wraps deterministically', () => {
  assert.equal(deriveStructuralPreviewChoreography(6).stageIndex, 0);
  assert.equal(deriveStructuralPreviewChoreography(-1).stageIndex, 5);
});
