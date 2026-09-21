import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveSeatDivisionPayload, SEAT_DIVISION_PAYLOADS } from '../frontend/spatial/machine-seat-division-payload.js';

test('every Seat division has an explicit payload contract', () => {
  assert.deepEqual(
    Object.keys(SEAT_DIVISION_PAYLOADS),
    [
      'SEAT_CONNECTION',
      'SEAT_BEHAVIOR',
      'SEAT_TOOLKIT',
      'SEAT_CAPABILITIES',
      'SEAT_AUTHORIZATION',
      'SEAT_WORKSPACE_SCOPE',
      'SEAT_TASK_EVIDENCE',
    ],
  );
  for (const payload of Object.values(SEAT_DIVISION_PAYLOADS)) {
    assert.equal(payload.presentationOnly, true);
    assert.ok(payload.role);
    assert.ok(payload.labels.length >= 2);
    assert.ok(payload.controls.length >= 2);
  }
});

test('division payloads keep capability, authorization, scope, and entitlement boundaries explicit', () => {
  assert.equal(resolveSeatDivisionPayload('SEAT_CAPABILITIES').authorization, false);
  assert.equal(resolveSeatDivisionPayload('SEAT_AUTHORIZATION').capability, false);
  assert.equal(resolveSeatDivisionPayload('SEAT_WORKSPACE_SCOPE').durableStore, false);
  assert.equal(resolveSeatDivisionPayload('SEAT_TOOLKIT').optional, true);
  assert.equal(resolveSeatDivisionPayload('SEAT_TOOLKIT').entitlement, false);
});
