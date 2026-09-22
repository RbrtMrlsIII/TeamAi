import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveWorkspaceReceivingPresentation, R0_RECEIVING_PHASE } from '../frontend/spatial/machine-r0-receiving.js';
import { seat1ConnectionEdge, SEAT1_CONNECTION_EDGE_ID } from '../frontend/spatial/seat-connection-edge.js';
import { WORKSPACE_CENTER_ID } from '../frontend/spatial/hero-workspace-core.js';

const edge = seat1ConnectionEdge(
  { x: 4.2, y: 1.4, z: 0.5 },
  { x: 0, y: 0.5, z: 0 },
);

test('R0 receiving remains dormant without a valid semantic edge or activation', () => {
  assert.equal(deriveWorkspaceReceivingPresentation({ edge: null, receptionAmount: 1 }).phase, R0_RECEIVING_PHASE.DORMANT);
  assert.equal(deriveWorkspaceReceivingPresentation({ edge, receptionAmount: 0.01 }).phase, R0_RECEIVING_PHASE.DORMANT);
});

test('R0 receiving follows the declared edge route into WORKSPACE_CENTER', () => {
  const presentation = deriveWorkspaceReceivingPresentation({
    edge,
    receptionAmount: 0.8,
    reducedMotion: true,
  });
  assert.equal(presentation.semanticEdgeId, SEAT1_CONNECTION_EDGE_ID);
  assert.equal(presentation.target.id, WORKSPACE_CENTER_ID);
  assert.equal(presentation.phase, R0_RECEIVING_PHASE.RECEIVING);
  assert.equal(presentation.progress, 0.8);
  assert.ok(presentation.transferPrefix.length >= 2);
  assert.ok(presentation.transferPoint);
});

test('ABSORB turns on the receiver while REFLECT adds a workspace-center wave', () => {
  const absorbing = deriveWorkspaceReceivingPresentation({
    edge,
    receptionAmount: 1,
    heroState: 'ABSORB',
    reducedMotion: true,
  });
  assert.equal(absorbing.phase, R0_RECEIVING_PHASE.ABSORBING);
  assert.equal(absorbing.receiverAmount, 1);
  assert.equal(absorbing.reflectionAmount, 0);

  const reflecting = deriveWorkspaceReceivingPresentation({
    edge,
    receptionAmount: 1,
    heroState: 'REFLECT',
    reducedMotion: true,
  });
  assert.equal(reflecting.phase, R0_RECEIVING_PHASE.REFLECTING);
  assert.equal(reflecting.receiverAmount, 1);
  assert.equal(reflecting.reflectionAmount, 1);
});

test('HANDOFF preserves an active receiver but uses a bounded reflection signal', () => {
  const presentation = deriveWorkspaceReceivingPresentation({
    edge,
    receptionAmount: 0.9,
    heroState: 'HANDOFF',
    reducedMotion: true,
  });
  assert.equal(presentation.phase, R0_RECEIVING_PHASE.HANDOFF_READY);
  assert.equal(presentation.receiverAmount, 1);
  assert.equal(presentation.reflectionAmount, 0.65);
});

test('reduced-motion presentation is deterministic for identical semantic input', () => {
  const input = { edge, receptionAmount: 0.67, heroState: 'CONTRIBUTE', reducedMotion: true, now: 8123 };
  assert.deepEqual(
    deriveWorkspaceReceivingPresentation(input),
    deriveWorkspaceReceivingPresentation(input),
  );
});
