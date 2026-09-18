import assert from 'node:assert/strict';
import test from 'node:test';
import { MIN_SEAT_COUNT, MAX_SEAT_COUNT, GUEST_SEAT_COUNT, MACHINE_DEFAULT_SEAT_COUNT, clampSeatCount, parseSeatCountParam, seatPopulationDensity } from '../frontend/spatial/seat-capacity.js';

test('Seat capacity is a single 1–10 authority', () => {
  assert.equal(MIN_SEAT_COUNT, 1); assert.equal(MAX_SEAT_COUNT, 10); assert.equal(GUEST_SEAT_COUNT, 10); assert.equal(MACHINE_DEFAULT_SEAT_COUNT, 10);
  assert.equal(clampSeatCount(0), 1); assert.equal(clampSeatCount(1), 1); assert.equal(clampSeatCount(10), 10); assert.equal(clampSeatCount(16), 10); assert.equal(clampSeatCount('8'), 8); assert.equal(clampSeatCount('nope'), 10);
});
test('guest/machine query parsing uses the same clamp', () => { assert.equal(parseSeatCountParam(''), 10); assert.equal(parseSeatCountParam('?seats=1'), 1); assert.equal(parseSeatCountParam('?seats=8'), 8); assert.equal(parseSeatCountParam('?seats=99'), 10); assert.equal(parseSeatCountParam('?seats=0'), 1); });
test('population density spans the 1–10 range', () => { assert.equal(seatPopulationDensity(1),0); assert.equal(seatPopulationDensity(10),1); });
