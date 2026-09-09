/**
 * P-R0 WORKSPACE_ZIPSKILLS crown branch helpers (presentation only).
 * Workspace tree only · not a seat child · optional · not entitlement.
 */
import {
  HIERARCHY_INPUT,
  HIERARCHY_REDUCED_SNAP,
  APP_UI_HANDOFF,
  WORKSPACE_ZIPSKILLS_V1,
} from './hero-hierarchy-runtime.js';

/** Named §9 duration for optional R0 crown branch expand. */
export const ZIPSKILLS_BRANCH_MS = 300;

export function tickZipskillsBranch(state, ringFocus, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  const onR0 = ringFocus && ringFocus.ring === 'r0' && !state.openParentId;
  if (!onR0) {
    if ((state.zipskillsBranchAmount || 0) > 0) state.zipskillsBranchAmount = 0;
    state.zipskillsBranchStartMs = null;
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.zipskillsBranchAmount = 1;
    return state;
  }
  if (state.zipskillsBranchStartMs == null) state.zipskillsBranchStartMs = now;
  const start = state.zipskillsBranchStartMs;
  const progress = Math.min((now - start) / ZIPSKILLS_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.zipskillsBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getZipskillsBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state && state.zipskillsBranchAmount) || 0));
}

export function beginZipskillsBranch(state, ringFocus, opts = {}) {
  const onR0 = ringFocus && ringFocus.ring === 'r0' && !state.openParentId;
  const now = opts.nowMs ?? 0;
  const snap = Boolean(opts.snap);
  if (!onR0) {
    state.zipskillsBranchAmount = 0;
    state.zipskillsBranchStartMs = null;
    return state;
  }
  state.zipskillsBranchStartMs = now;
  state.zipskillsBranchAmount = snap ? 1 : Math.min(state.zipskillsBranchAmount || 0, 0.12);
  state.inputMode = HIERARCHY_INPUT.INSPECT;
  state.cameraId = 'WORKSPACE_ZIPSKILLS';
  return state;
}

export function zipskillsCrownAccessibleName(item, branchAmount = 1) {
  const label = item && item.label ? item.label : 'Workspace ZipSkills';
  const open = (Number(branchAmount) || 0) >= 0.85 ? 'expanded' : 'opening';
  return `Workspace ZipSkills: ${label} (${open}). Optional workspace governance equip; not required; not a seat child; presentation only; not entitlement. Press G for normal UI.`;
}

export function requestZipskillsConfigureHandoff(detail = {}) {
  const item = detail.item || null;
  const intent = {
    source: 'p-r0-workspace-zipskills',
    targetSection: detail.targetSection || 'workspace-zipskills',
    itemId: (item && item.id) || detail.itemId || null,
    kind: 'workspace-skills',
    optional: true,
    notRequired: true,
    workspaceScoped: true,
    notSeatChild: true,
    appUiHandoff: true,
    reason: APP_UI_HANDOFF,
    normalUi: true,
    presentationOnly: true,
    notAuthority: true,
    notEntitlement: true,
  };
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('teamai:app-ui-handoff', { detail: intent }));
  }
  return intent;
}

export { WORKSPACE_ZIPSKILLS_V1 };
