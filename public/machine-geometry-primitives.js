/**
 * Shared epsilon-tolerant geometry primitives used by the machine topology
 * validators (machine-core-topology.js, machine-hero-topology.js,
 * machine-seat-division-topology.js). Presentation-layer geometry only --
 * no 029-released claim.
 */
export const EPSILON = 1e-6;

export const finite = (value) => Number.isFinite(Number(value));

export function pointEqual(a, b, epsilon = EPSILON) {
  return finite(a?.x) && finite(a?.y) && finite(a?.z)
    && Math.abs(Number(a.x) - Number(b.x)) <= epsilon
    && Math.abs(Number(a.y) - Number(b.y)) <= epsilon
    && Math.abs(Number(a.z) - Number(b.z)) <= epsilon;
}
