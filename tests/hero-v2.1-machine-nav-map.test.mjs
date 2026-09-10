/**
 * V2.1 — Machine nav map data (Vision).
 * Owner: pure map over existing hierarchy / docks · no DOM yet
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MACHINE_NAV_MAP,
  machineNavById,
  machineNavSeatBranches,
  machineNavWorldHome,
  machineNavClosedHierarchyEntries,
} from '../public/hero-machine-nav-map.js';
import { SEAT_SHELL_V1_CHILDREN, HIERARCHY_PART } from '../public/hero-hierarchy-runtime.js';
import { WORLD_BASELINE_DOCK_ID } from '../public/hero-cam2-tree-follow.js';

test('V2.1 map is non-empty frozen product list', () => {
  assert.ok(MACHINE_NAV_MAP.length >= 8);
  assert.ok(Object.isFrozen(MACHINE_NAV_MAP));
});

test('V2.1 world home uses baseline dock', () => {
  const home = machineNavWorldHome();
  assert.ok(home);
  assert.equal(home.cameraId, WORLD_BASELINE_DOCK_ID);
  assert.equal(home.kind, 'world');
});

test('V2.1 seat branches cover SEAT_SHELL_V1_CHILDREN', () => {
  const branches = machineNavSeatBranches();
  const ids = new Set(branches.map((b) => b.hierarchyChildId));
  for (const c of SEAT_SHELL_V1_CHILDREN) {
    assert.ok(ids.has(c), c);
  }
  assert.ok(ids.has(HIERARCHY_PART.SEAT_CONNECTION));
});

test('V2.1 lookup by id works', () => {
  assert.equal(machineNavById('missing'), null);
  assert.equal(machineNavById('seat-shell').cameraId, 'SEAT_CLOSE');
});

test('V2.1 closed-hierarchy entries are world or ring only', () => {
  for (const e of machineNavClosedHierarchyEntries()) {
    assert.ok(e.kind === 'world' || e.kind === 'ring');
  }
});
