import assert from 'node:assert/strict';
import test from 'node:test';
import { deriveConcentricRingEnvelope } from '../frontend/spatial/hero-ring-envelope.js';

const workspaceForSeats = (seatCount) => 4.35 + (5.95 - 4.35) * ((seatCount - 1) / 9);

test('concentric envelope preserves R0 < R1 < R2 < R3 for the full seat range', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const workspace = workspaceForSeats(seatCount) * 0.68;
    for (const seatRingRadius of [4.05, 4.55]) {
      const envelope = deriveConcentricRingEnvelope({
        r0Radius: workspace,
        r3Radius: seatRingRadius,
        ringR1Scale: 1.18,
        ringR2Scale: 1.42,
      });
      assert.ok(envelope.workspaceRadius < envelope.r1Radius, `R0/R1 invalid at ${seatCount} seats`);
      assert.ok(envelope.r1Radius < envelope.r2Radius, `R1/R2 invalid at ${seatCount} seats`);
      assert.ok(envelope.r2Radius < envelope.seatRingRadius, `R2/R3 invalid at ${seatCount} seats`);
      assert.equal(envelope.workspaceRadius, workspace);
      assert.equal(envelope.seatRingRadius, seatRingRadius);
      assert.equal(envelope.valid, true);
    }
  }
});

test('envelope remains deterministic when the preferred scales exceed the physical gap', () => {
  const input = {
    workspaceRadius: 5.95,
    seatRingRadius: 6.45,
    ringR1Scale: 1.18,
    ringR2Scale: 1.42,
  };
  assert.deepEqual(
    deriveConcentricRingEnvelope(input),
    deriveConcentricRingEnvelope(input),
  );
});


test('animated expansion keeps the concentric order across the supported Seat range', () => {
  for (let seatCount = 1; seatCount <= 10; seatCount += 1) {
    const footprint = workspaceForSeats(seatCount);
    for (const expansionAmount of [0, 0.25, 0.5, 0.75, 1]) {
      const r0 = footprint * 0.68 * (0.68 + 0.08 * expansionAmount);
      const r3 = (4.05 + (4.55 - 4.05) * ((seatCount - 1) / 9)) + 0.5 * expansionAmount;
      const envelope = deriveConcentricRingEnvelope({
        r0Radius: r0,
        r3Radius: r3,
        ringR1Scale: 1.18,
        ringR2Scale: 1.42,
      });
      assert.equal(envelope.valid, true);
      assert.ok(envelope.workspaceRadius < envelope.r1Radius);
      assert.ok(envelope.r1Radius < envelope.r2Radius);
      assert.ok(envelope.r2Radius < envelope.seatRingRadius);
    }
  }
});
