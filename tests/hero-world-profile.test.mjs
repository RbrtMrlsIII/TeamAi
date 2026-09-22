import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';

test('machine core, renderer, and controller share the same Seat and housing radii', () => {
  for (let count = 1; count <= 10; count += 1) {
    const profile = deriveMachineWorldProfile(count);
    const core = createBranchConnectionCore({ seatCount: count });
    const seatRadii = core.parts
      .filter((part) => part.kind === 'inner-pod')
      .map((part) => Math.hypot(part.center.x, part.center.z));
    const housingRadii = core.parts
      .filter((part) => part.kind === 'outer-housing')
      .map((part) => Math.hypot(part.center.x, part.center.z));
    assert.ok(seatRadii.every((radius) => Math.abs(radius - profile.seatShellRadius) < 1e-9));
    assert.ok(housingRadii.every((radius) => Math.abs(radius - profile.outerHousingRadius) < 1e-9));
  }
});


test('controller no longer owns a private seat radius formula', async () => {
  const source = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /function seatRadiusForCount/);
  assert.match(source, /deriveMachineWorldProfile\(seatCount\)\.seatShellRadius/);
});
