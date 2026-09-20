import assert from 'node:assert/strict';
import test from 'node:test';
import { createBranchConnectionCore } from '../frontend/spatial/machine-core-layout.js';
import { validateMachineCoreConnections } from '../frontend/spatial/machine-core-topology.js';

test('machine core edges have unique semantic identities, valid ports, and finite routes for 1-10 seats', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const core = createBranchConnectionCore({ seatCount });
    const validation = validateMachineCoreConnections(core);
    assert.equal(validation.valid, true, `${seatCount} seats: ${validation.reasons.join(', ')}`);
    assert.equal(validation.edgeCount, seatCount + 4 + Math.min(seatCount, 2) * 4);
    assert.equal(new Set(validation.semanticEdgeIds).size, validation.edgeCount);
  }
});

test('semantic edge identities do not depend on coordinates', () => {
  const base = createBranchConnectionCore({ seatCount: 10, expansionAmount: 0 });
  const expanded = createBranchConnectionCore({ seatCount: 10, expansionAmount: 1 });
  assert.deepEqual(
    expanded.connections.map((edge) => edge.semanticEdgeId),
    base.connections.map((edge) => edge.semanticEdgeId),
  );
});

test('missing semantic edge identity fails closed', () => {
  const core = createBranchConnectionCore({ seatCount: 10 });
  const mutated = { ...core, connections: [{ ...core.connections[0], semanticEdgeId: null }] };
  const validation = validateMachineCoreConnections(mutated);
  assert.equal(validation.valid, false);
  assert.ok(validation.reasons.includes('MISSING_SEMANTIC_EDGE_ID'));
});
