/**
 * 029 R0 workspace receiving choreography.
 *
 * Pure semantic/presentation math. The canonical renderer owns WebGL drawing.
 * The source edge route remains the only geometry authority.
 */
import { electricalRoutePoint, electricalRoutePrefix, resolveElectricalEdgeRoute } from './machine-energy-flow.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

export const R0_RECEIVING_PHASE = Object.freeze({
  DORMANT: 'DORMANT',
  RECEIVING: 'RECEIVING',
  ABSORBING: 'ABSORBING',
  REFLECTING: 'REFLECTING',
  HANDOFF_READY: 'HANDOFF_READY',
});

export function deriveWorkspaceReceivingPresentation({
  edge = null,
  receptionAmount = 0,
  heroState = 'IDLE',
  reducedMotion = false,
  now = 0,
} = {}) {
  const route = resolveElectricalEdgeRoute(edge);
  const reception = clamp01(receptionAmount);
  const lifecycle = String(heroState || 'IDLE').toUpperCase();

  if (route.length < 2 || reception <= 0.02) {
    return Object.freeze({
      phase: R0_RECEIVING_PHASE.DORMANT,
      route: Object.freeze([]),
      progress: 0,
      transferPoint: null,
      transferPrefix: Object.freeze([]),
      target: null,
      receiverAmount: 0,
      reflectionAmount: 0,
      presentationOnly: true,
      reducedMotion: Boolean(reducedMotion),
    });
  }

  let phase = R0_RECEIVING_PHASE.RECEIVING;
  if (lifecycle === 'ABSORB') phase = R0_RECEIVING_PHASE.ABSORBING;
  else if (lifecycle === 'REFLECT') phase = R0_RECEIVING_PHASE.REFLECTING;
  else if (lifecycle === 'HANDOFF') phase = R0_RECEIVING_PHASE.HANDOFF_READY;

  const cycle = reducedMotion ? 1 : ((Math.max(0, Number(now) || 0) / 1000) % 0.9) / 0.9;
  const progress = reducedMotion
    ? reception
    : Math.min(1, reception * (0.35 + cycle * 0.65));
  const transferPoint = electricalRoutePoint(route, progress);
  const transferPrefix = electricalRoutePrefix(route, progress);
  const receiverAmount = phase === R0_RECEIVING_PHASE.RECEIVING
    ? clamp01(reception * (progress >= reception * 0.92 ? 1 : 0.42))
    : 1;
  const reflectionAmount = phase === R0_RECEIVING_PHASE.REFLECTING
    ? 1
    : phase === R0_RECEIVING_PHASE.HANDOFF_READY
      ? 0.65
      : 0;

  return Object.freeze({
    phase,
    route,
    progress,
    transferPoint,
    transferPrefix,
    target: Object.freeze({ ...route.at(-1) }),
    receiverAmount,
    reflectionAmount,
    presentationOnly: true,
    reducedMotion: Boolean(reducedMotion),
  });
}
