import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import {
  buildMachineCoreSeat1Connection,
  isCanonicalSeat1Shell,
  MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY,
  MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY,
  MACHINE_CORE_SEAT1_SHELL_KEY,
} from '../frontend/spatial/machine-core-seat-connection.js';

test('Seat-1 connection child stays absent while the machine core is collapsed', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const shell = core.byBranch.get('BRANCH-SEAT-01');
  assert.equal(isCanonicalSeat1Shell(shell), true);
  assert.equal(buildMachineCoreSeat1Connection({ shell, expansionAmount: 0 }), null);
});

test('Seat-1 connection child reuses canonical geometry and edge identities', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const shell = core.byBranch.get('BRANCH-SEAT-01');
  const child = buildMachineCoreSeat1Connection({ shell, expansionAmount: 1 });
  assert.ok(child);
  assert.equal(child.semanticKey, MACHINE_CORE_SEAT1_CONNECTION_SEMANTIC_KEY);
  assert.equal(child.parentSemanticKey, MACHINE_CORE_SEAT1_SHELL_KEY);
  assert.equal(child.semanticId, 'SEAT_CONNECTION');
  assert.equal(child.geometry.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY');
  assert.equal(child.geometry.semantic, 'SEAT_CONNECTION');
  assert.equal(child.edge.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION→WORKSPACE_CENTER');
  assert.equal(child.edge.source.id, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT');
  assert.equal(child.portId, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT');
  assert.equal(child.healthLeaf.semanticKey, MACHINE_CORE_SEAT1_CONNECTION_HEALTH_KEY);
  assert.equal(child.healthLeaf.status, 'unknown');
  assert.equal(child.presentationOnly, true);
  assert.equal(child.geometryCandidate, true);
  assert.equal(child.geometry.corridor.owner, 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY');
  assert.ok(child.geometry.corridor.length > 0);
  assert.deepEqual(child.previewPoint, { x: child.edge.target.x, y: child.edge.target.y, z: child.edge.target.z });
  assert.equal(child.proof.semanticBindingResolved, true);
  assert.equal(child.proof.geometryResolved, true);
  assert.equal(child.proof.connectionPathExecuted, true);
  assert.equal(child.proof.webglDrawPathExecuted, false);
});

test('Seat-1 connection fails closed unless all canonical shell identity fields match', () => {
  const core = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  const shell = core.byBranch.get('BRANCH-SEAT-01');
  assert.equal(isCanonicalSeat1Shell(shell), true);
  for (const seat of core.parts.filter((part) => part.kind === 'inner-pod' && part.seatIndex !== 0)) {
    assert.equal(isCanonicalSeat1Shell(seat), false);
    assert.equal(buildMachineCoreSeat1Connection({ shell: seat, expansionAmount: 1 }), null);
  }
  for (const mutation of [
    { branchId: 'BRANCH-SEAT-02' },
    { seatIndex: 1 },
    { semanticId: 'SEAT_CONNECTION' },
    { semanticKey: 'TREE-HERO-SEAT#1:SEAT_SHELL' },
  ]) {
    assert.equal(buildMachineCoreSeat1Connection({ shell: { ...shell, ...mutation }, expansionAmount: 1 }), null);
  }
  assert.equal(buildMachineCoreSeat1Connection({ shell: core.hub, expansionAmount: 1 }), null);
});

test('public Seat-1 connection runtime stays synchronized with the canonical frontend module', async () => {
  const { readFile } = await import('node:fs/promises');
  const [frontend, publicRuntime] = await Promise.all([
    readFile(new URL('../frontend/spatial/machine-core-seat-connection.js', import.meta.url), 'utf8'),
    readFile(new URL('../public/machine-core-seat-connection.js', import.meta.url), 'utf8'),
  ]);
  assert.equal(publicRuntime, frontend);
});
