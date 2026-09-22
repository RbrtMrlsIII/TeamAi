/**
 * 029 lifecycle-driven R1/R2 spatial articulation.
 *
 * Pure presentation math. It consumes the canonical machine choreography and
 * produces ring-specific articulation values without introducing state.
 */
const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const smoothstep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export const MACHINE_RING_ARTICULATION_PHASE = Object.freeze({
  STOWED: 'STOWED',
  R1_DEPLOYING: 'R1_DEPLOYING',
  R2_DEPLOYING: 'R2_DEPLOYING',
  LINKED: 'LINKED',
  RECEIVING: 'RECEIVING',
  LIFECYCLE_SIGNAL: 'LIFECYCLE_SIGNAL',
});

export function deriveMachineRingArticulation({
  hierarchyOpen = false,
  choreography = null,
  reducedMotion = false,
} = {}) {
  const model = choreography && typeof choreography === 'object' ? choreography : {};
  const topology = clamp01(model.topology);
  const electrical = clamp01(model.electrical);
  const reception = clamp01(model.workspaceReception);
  const lifecycleReception = clamp01(model.lifecycleReception);
  const division = clamp01(model.division);

  if (!hierarchyOpen && lifecycleReception <= 0.02) {
    return Object.freeze({
      phase: MACHINE_RING_ARTICULATION_PHASE.STOWED,
      r1Amount: 0,
      r2Amount: 0,
      r1Signal: 0,
      r2Signal: 0,
      receiving: 0,
      reducedMotion: Boolean(reducedMotion),
      presentationOnly: true,
    });
  }

  const r1Structural = smoothstep(topology * 0.78 + electrical * 0.22);
  const r2Structural = smoothstep(topology * 0.55 + division * 0.45);
  const lifecycleSignal = lifecycleReception > 0
    ? smoothstep(lifecycleReception)
    : 0;
  const receiving = smoothstep(reception);

  let phase = MACHINE_RING_ARTICULATION_PHASE.LINKED;
  if (hierarchyOpen && topology < 0.98) phase = MACHINE_RING_ARTICULATION_PHASE.R1_DEPLOYING;
  else if (hierarchyOpen && division > 0.02 && division < 0.98) phase = MACHINE_RING_ARTICULATION_PHASE.R2_DEPLOYING;
  else if (receiving > 0.02 && receiving < 0.98) phase = MACHINE_RING_ARTICULATION_PHASE.RECEIVING;
  else if (lifecycleSignal > 0.02) phase = MACHINE_RING_ARTICULATION_PHASE.LIFECYCLE_SIGNAL;

  return Object.freeze({
    phase,
    r1Amount: clamp01(Math.max(r1Structural, lifecycleSignal * 0.82)),
    r2Amount: clamp01(hierarchyOpen ? Math.max(r2Structural, lifecycleSignal * 0.28) : lifecycleSignal * 0.28),
    r1Signal: clamp01(Math.max(electrical, receiving, lifecycleSignal)),
    r2Signal: clamp01(Math.max(division, lifecycleSignal * 0.55)),
    receiving,
    reducedMotion: Boolean(reducedMotion),
    presentationOnly: true,
  });
}
