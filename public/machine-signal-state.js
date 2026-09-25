/**
 * TEAM-EXPERIENCE-029 / S9
 * Semantic electricity/signal presentation state.
 *
 * This is a projection over an already-declared S8 edge. It never creates
 * topology, semantic identity, or durable task state.
 */
import { createSpatialConstructionContext } from './machine-spatial-root-contract.js';

export const MACHINE_SIGNAL_STATE = Object.freeze({
  IDLE: 'IDLE',
  ACTIVE_SEAT: 'ACTIVE_SEAT',
  ACTIVE_BRANCH: 'ACTIVE_BRANCH',
  CONTRIBUTION_TRANSFER: 'CONTRIBUTION_TRANSFER',
  WORKSPACE_RECEIVING: 'WORKSPACE_RECEIVING',
  ABSORB: 'ABSORB',
  REFLECT: 'REFLECT',
  HANDOFF_READY: 'HANDOFF_READY',
  WAITING_FOR_CONTINUATION: 'WAITING_FOR_CONTINUATION',
  BLOCKED: 'BLOCKED',
  ERROR: 'ERROR',
});

const ROOT_OWNER = 'frontend/spatial/machine-signal-state.js';
const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const normalize = (value) => String(value || '').trim().toUpperCase();

function rootContext(semanticId) {
  return createSpatialConstructionContext({
    slice: 'S9',
    owner: ROOT_OWNER,
    semanticId,
    semanticBoundary: 'presentation-only',
  });
}

function hasSemanticEdge(edge) {
  return Boolean(edge?.semanticEdgeId && Array.isArray(edge?.route) && edge.route.length >= 2);
}

function lifecycleState(state = {}) {
  return normalize(state.heroState || state.lifecycleState || 'IDLE');
}

export function resolveMachineSignalState({
  edge = null,
  state = {},
  selectedBranchId = null,
  reducedMotion = false,
  now = 0,
} = {}) {
  if (!hasSemanticEdge(edge)) return null;

  const lifecycle = lifecycleState(state);
  const selected = edge.sourceBranchId === selectedBranchId || edge.targetBranchId === selectedBranchId;
  const contribution = clamp01(state.contributionAmount);
  const reception = clamp01(state.workspaceReceptionAmount ?? state.workspaceReceivingAmount);
  const focusedAmount = clamp01(state.focusedChildAmount);
  const waiting = Boolean(state.waitingForContinuation);
  const blocked = Boolean(state.blocked) || lifecycle === 'BLOCKED';
  const error = Boolean(state.error) || lifecycle === 'ERROR';

  let phase = MACHINE_SIGNAL_STATE.IDLE;
  let amount = 0;
  let direction = 'none';

  if (error) {
    phase = MACHINE_SIGNAL_STATE.ERROR;
    amount = 1;
  } else if (blocked) {
    phase = MACHINE_SIGNAL_STATE.BLOCKED;
    amount = 1;
  } else if (waiting) {
    phase = MACHINE_SIGNAL_STATE.WAITING_FOR_CONTINUATION;
    amount = selected ? 0.35 : 0.15;
  } else if (lifecycle === 'HANDOFF') {
    phase = MACHINE_SIGNAL_STATE.HANDOFF_READY;
    amount = selected ? 1 : 0.5;
    direction = 'target';
  } else if (lifecycle === 'REFLECT') {
    phase = MACHINE_SIGNAL_STATE.REFLECT;
    amount = selected ? 1 : 0.7;
    direction = 'bidirectional';
  } else if (lifecycle === 'ABSORB') {
    phase = MACHINE_SIGNAL_STATE.ABSORB;
    amount = selected ? 1 : 0.72;
    direction = 'target';
  } else if (reception > 0.02) {
    phase = MACHINE_SIGNAL_STATE.WORKSPACE_RECEIVING;
    amount = reception;
    direction = 'target';
  } else if (contribution > 0.02) {
    phase = MACHINE_SIGNAL_STATE.CONTRIBUTION_TRANSFER;
    amount = contribution;
    direction = 'target';
  } else if (focusedAmount > 0.02 && edge.kind === 'pod-division') {
    phase = MACHINE_SIGNAL_STATE.ACTIVE_BRANCH;
    amount = focusedAmount;
    direction = 'target';
  } else if (selected && edge.kind === 'inner-spoke') {
    phase = MACHINE_SIGNAL_STATE.ACTIVE_SEAT;
    amount = 0.72;
    direction = 'target';
  } else if (selected) {
    phase = MACHINE_SIGNAL_STATE.ACTIVE_BRANCH;
    amount = 0.42;
    direction = 'target';
  }

  const safeAmount = clamp01(amount);
  const pulse = reducedMotion
    ? safeAmount
    : clamp01(safeAmount * (0.72 + 0.28 * (0.5 + 0.5 * Math.sin((Number(now) || 0) * 0.004))));

  return Object.freeze({
    ...rootContext(edge.semanticEdgeId),
    state: phase,
    amount: safeAmount,
    pulse,
    direction,
    semanticEdgeId: edge.semanticEdgeId,
    edgeKind: edge.kind || null,
    selected,
    reducedMotion: Boolean(reducedMotion),
    presentationOnly: true,
  });
}

export function machineSignalVisualProfile(signal) {
  const state = normalize(signal?.state);
  const profiles = {
    [MACHINE_SIGNAL_STATE.IDLE]: { alpha: 0.12, glow: 0.02, speed: 0 },
    [MACHINE_SIGNAL_STATE.ACTIVE_SEAT]: { alpha: 0.42, glow: 0.08, speed: 0.75 },
    [MACHINE_SIGNAL_STATE.ACTIVE_BRANCH]: { alpha: 0.34, glow: 0.07, speed: 0.65 },
    [MACHINE_SIGNAL_STATE.CONTRIBUTION_TRANSFER]: { alpha: 0.56, glow: 0.15, speed: 1.0 },
    [MACHINE_SIGNAL_STATE.WORKSPACE_RECEIVING]: { alpha: 0.64, glow: 0.18, speed: 1.1 },
    [MACHINE_SIGNAL_STATE.ABSORB]: { alpha: 0.60, glow: 0.20, speed: 0.95 },
    [MACHINE_SIGNAL_STATE.REFLECT]: { alpha: 0.64, glow: 0.22, speed: 1.15 },
    [MACHINE_SIGNAL_STATE.HANDOFF_READY]: { alpha: 0.72, glow: 0.24, speed: 0.45 },
    [MACHINE_SIGNAL_STATE.WAITING_FOR_CONTINUATION]: { alpha: 0.26, glow: 0.03, speed: 0.2 },
    [MACHINE_SIGNAL_STATE.BLOCKED]: { alpha: 0.46, glow: 0.06, speed: 0 },
    [MACHINE_SIGNAL_STATE.ERROR]: { alpha: 0.56, glow: 0.12, speed: 0 },
  };
  const base = profiles[state] || profiles[MACHINE_SIGNAL_STATE.IDLE];
  return Object.freeze({
    state: state || MACHINE_SIGNAL_STATE.IDLE,
    ...base,
    amount: clamp01(signal?.amount),
    pulse: clamp01(signal?.pulse),
    direction: signal?.direction || 'none',
    presentationOnly: true,
  });
}
