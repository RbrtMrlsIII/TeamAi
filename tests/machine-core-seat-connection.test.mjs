import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  buildMachineCoreSeat1Connection,
  MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY,
  MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY,
} from '../frontend/spatial/machine-core-seat-connection.js';

test('Seat-1 connection child stays absent while the machine core is collapsed', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const shell = core.byBranch.get('BRANCH-SEAT-01');
  assert.equal(buildMachineCoreSeat1Connection({ shell, expansionAmount: 0 }), null);
});

test('Seat-1 connection child reuses the canonical geometry and edge identities', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const shell = core.byBranch.get('BRANCH-SEAT-01');
  const child = buildMachineCoreSeat1Connection({ shell, expansionAmount: 1 });

  assert.ok(child);
  assert.equal(child.semanticKey, MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY);
  assert.equal(child.parentSemanticKey, 'TREE-HERO-SEAT#0:SEAT_SHELL');
  assert.equal(child.semanticId, 'SEAT_CONNECTION');
  assert.equal(child.geometry.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY');
  assert.equal(child.geometry.semantic, 'SEAT_CONNECTION');
  assert.equal(child.edge.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION→WORKSPACE_CENTER');
  assert.equal(child.edge.source.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT');
  assert.equal(child.portId, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT');
  assert.equal(child.healthLeaf.semanticKey, MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY);
  assert.equal(child.healthLeaf.status, 'unknown');
  assert.equal(child.presentationOnly, true);
  assert.equal(child.geometry.corridor.owner, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY');
  assert.ok(child.geometry.corridor.length > 0);
  assert.deepEqual(child.previewPoint, { x: child.edge.target.x, y: child.edge.target.y, z: child.edge.target.z });
});

test('Seat-1 connection composition fails closed for every other machine-core Seat', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  for (const seat of core.parts.filter((part) => part.kind === 'inner-pod' && part.seatIndex !== 0)) {
    assert.equal(buildMachineCoreSeat1Connection({ shell: seat, expansionAmount: 1 }), null);
  }
});
