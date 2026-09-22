import assert from 'node:assert/strict';
import test from 'node:test';
import {
  deriveMachineRingArticulation,
  MACHINE_RING_ARTICULATION_PHASE,
} from '../frontend/spatial/machine-ring-articulation.js';

const choreography = (overrides = {}) => ({
  topology: 0,
  electrical: 0,
  workspaceReception: 0,
  lifecycleReception: 0,
  division: 0,
  ...overrides,
});

test('closed idle world keeps R1 and R2 stowed', () => {
  const model = deriveMachineRingArticulation({ hierarchyOpen: false, choreography: choreography() });
  assert.equal(model.phase, MACHINE_RING_ARTICULATION_PHASE.STOWED);
  assert.equal(model.r1Amount, 0);
  assert.equal(model.r2Amount, 0);
  assert.equal(model.r1Signal, 0);
  assert.equal(model.r2Signal, 0);
});

test('R1 activates from topology before R2 receives division articulation', () => {
  const linking = deriveMachineRingArticulation({
    hierarchyOpen: true,
    choreography: choreography({ topology: 0.7 }),
  });
  assert.equal(linking.phase, MACHINE_RING_ARTICULATION_PHASE.R1_DEPLOYING);
  assert.ok(linking.r1Amount > 0);
  assert.ok(linking.r1Amount >= linking.r2Amount);

  const division = deriveMachineRingArticulation({
    hierarchyOpen: true,
    choreography: choreography({ topology: 1, division: 0.4 }),
  });
  assert.equal(division.phase, MACHINE_RING_ARTICULATION_PHASE.R2_DEPLOYING);
  assert.ok(division.r2Amount > 0);
});

test('receiving raises R1 signal while keeping R2 structural articulation bounded', () => {
  const receiving = deriveMachineRingArticulation({
    hierarchyOpen: true,
    choreography: choreography({ topology: 1, electrical: 0.9, workspaceReception: 0.55 }),
  });
  assert.equal(receiving.phase, MACHINE_RING_ARTICULATION_PHASE.RECEIVING);
  assert.equal(receiving.r1Signal, 0.9);
  assert.ok(receiving.r2Amount > 0 && receiving.r2Amount < 1);

  const lifecycle = deriveMachineRingArticulation({
    hierarchyOpen: false,
    choreography: choreography({ lifecycleReception: 0.8 }),
  });
  assert.equal(lifecycle.phase, MACHINE_RING_ARTICULATION_PHASE.LIFECYCLE_SIGNAL);
  assert.ok(lifecycle.r1Amount > 0);
  assert.ok(lifecycle.r2Amount > 0);
  assert.equal(lifecycle.r2Amount, 0.28);
});

test('articulation increases monotonically with structural progress', () => {
  const low = deriveMachineRingArticulation({
    hierarchyOpen: true,
    choreography: choreography({ topology: 0.2 }),
  });
  const high = deriveMachineRingArticulation({
    hierarchyOpen: true,
    choreography: choreography({ topology: 0.8 }),
  });
  assert.ok(high.r1Amount >= low.r1Amount);
  assert.ok(high.r2Amount >= low.r2Amount);
});

test('reduced motion preserves semantic articulation values', () => {
  const input = {
    hierarchyOpen: true,
    choreography: choreography({ topology: 0.9, electrical: 0.8, workspaceReception: 0.7, division: 0.6 }),
  };
  const full = deriveMachineRingArticulation({ ...input, reducedMotion: false });
  const reduced = deriveMachineRingArticulation({ ...input, reducedMotion: true });
  assert.equal(reduced.reducedMotion, true);
  assert.equal(full.phase, reduced.phase);
  assert.equal(full.r1Amount, reduced.r1Amount);
  assert.equal(full.r2Amount, reduced.r2Amount);
  assert.equal(full.r1Signal, reduced.r1Signal);
  assert.equal(full.r2Signal, reduced.r2Signal);
  assert.equal(full.receiving, reduced.receiving);
});
