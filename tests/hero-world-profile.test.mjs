import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveExpandedMachineCoreRadii,
  deriveMachineWorldProfile,
  MACHINE_WORLD_PROFILE,
  seatPopulationDensity,
} from '../frontend/spatial/hero-world-profile.js';

test('world profile is deterministic across the supported Seat range', () => {
  assert.equal(seatPopulationDensity(1), 0);
  assert.equal(seatPopulationDensity(10), 1);
  const one = deriveMachineWorldProfile(1);
  const ten = deriveMachineWorldProfile(10);
  assert.equal(one.workspaceFootprint, MACHINE_WORLD_PROFILE.workspaceFootprint.min);
  assert.equal(ten.workspaceFootprint, MACHINE_WORLD_PROFILE.workspaceFootprint.max);
  assert.equal(one.seatShellRadius, MACHINE_WORLD_PROFILE.seatShellRadius.min);
  assert.equal(ten.seatShellRadius, MACHINE_WORLD_PROFILE.seatShellRadius.max);
});

test('expanded machine-core radii remain monotonic without changing semantic population', () => {
  for (let count = 1; count <= 10; count += 1) {
    const base = deriveExpandedMachineCoreRadii(count, 0);
    const open = deriveExpandedMachineCoreRadii(count, 1);
    assert.ok(open.seatShellRadius > base.seatShellRadius);
    assert.ok(open.outerHousingRadius > base.outerHousingRadius);
  }
});
