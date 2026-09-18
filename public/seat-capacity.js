/**
 * Runtime projection of the Product Law Seat-capacity rule.
 * Entitlement still decides which durable Seats an authenticated user may restore.
 * Tree 1–8 is a different vocabulary.
 */
export const MIN_SEAT_COUNT = 1;
export const MAX_SEAT_COUNT = 10;
export const GUEST_SEAT_COUNT = 10;
export const MACHINE_DEFAULT_SEAT_COUNT = 10;

export function clampSeatCount(value, fallback = MACHINE_DEFAULT_SEAT_COUNT) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) {
    const fb = Math.floor(Number(fallback));
    return Number.isFinite(fb) ? Math.min(MAX_SEAT_COUNT, Math.max(MIN_SEAT_COUNT, fb)) : MACHINE_DEFAULT_SEAT_COUNT;
  }
  return Math.min(MAX_SEAT_COUNT, Math.max(MIN_SEAT_COUNT, n));
}

export function parseSeatCountParam(search = globalThis.location?.search, fallback = GUEST_SEAT_COUNT) {
  const raw = new URLSearchParams(search || '').get('seats');
  if (raw == null || String(raw).trim() === '') return fallback;
  return clampSeatCount(raw, fallback);
}

export function seatPopulationDensity(count) {
  const n = clampSeatCount(count);
  return (n - MIN_SEAT_COUNT) / (MAX_SEAT_COUNT - MIN_SEAT_COUNT);
}

export const SEAT_CAPACITY = Object.freeze({min:MIN_SEAT_COUNT,max:MAX_SEAT_COUNT,guestDefault:GUEST_SEAT_COUNT,machineDefault:MACHINE_DEFAULT_SEAT_COUNT});
