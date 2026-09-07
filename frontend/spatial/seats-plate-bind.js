/**
 * Phase 2 helper: Seat plate projection helpers for shell-nav / tests.
 * Presentation only — no Firestore or provider calls.
 */
import {
  projectSeat,
  normalizeConnectionHealth,
  applyProjectionToHeroSeatStack,
} from "./seat-read-model.js";

export function projectedSeatFromRaw(raw, seatId) {
  return projectSeat(raw || {}, { seatId: seatId || "unknown", source: "fixture" });
}

export function presentationActivationAllowed(raw) {
  const p = projectedSeatFromRaw(raw, raw?.id);
  return p.activationAllowedPresentation;
}

export function mirrorHealthToHero(raw, seatId) {
  return applyProjectionToHeroSeatStack(projectedSeatFromRaw(raw, seatId));
}

export {
  projectSeat,
  normalizeConnectionHealth,
  applyProjectionToHeroSeatStack,
};
