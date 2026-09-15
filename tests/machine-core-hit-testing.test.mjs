import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { branchAtRingAngle, branchSelectionSummary, pickMachineBranch } from '../frontend/spatial/machine-core-hit-testing.js';

test('hit testing selects the nearest semantic branch part', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const seat = core.parts.find((part) => part.branchId === 'BRANCH-SEAT-04');
  const picked = pickMachineBranch(core, { x: seat.center.x + 0.05, y: seat.center.y, z: seat.center.z });
  assert.equal(picked.branchId, 'BRANCH-SEAT-04');
});

test('ring-angle selection selects the intended seat without index cycling', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const seat = core.parts.find((part) => part.branchId === 'BRANCH-SEAT-08');
  const angle = Math.atan2(seat.center.z, seat.center.x);
  const picked = branchAtRingAngle(core, angle);
  assert.equal(picked.branchId, 'BRANCH-SEAT-08');
});

test('selection summary exposes semantic branch identity and camera handoff', () => {
  const core = createBranchConnectionCore();
  const branch = core.parts.find((part) => part.branchId === 'BRANCH-OUTER-GAMMA');
  const summary = branchSelectionSummary(branch);
  assert.deepEqual(summary, {
    branchId: 'BRANCH-OUTER-GAMMA',
    seatIndex: null,
    kind: 'outer-housing',
    level: branch.level,
    uiStyle: 'outer-diamond',
    cameraId: 'BRANCH_CAMERA_BRANCH-OUTER-GAMMA',
  });
});

test('hit testing fails closed outside the configured tolerance', () => {
  const core = createBranchConnectionCore();
  assert.equal(pickMachineBranch(core, { x: 40, y: 0, z: 40 }), null);
});
