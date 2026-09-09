#!/usr/bin/env node
/**
 * Idempotent P4 SEAT_CAPABILITIES branch runtime patch for public/hero-hierarchy-runtime.js
 * Presentation only · CAPABILITY ≠ AUTHORIZATION · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-hierarchy-runtime.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-hierarchy-runtime.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (
  t.includes('CAPABILITIES_BRANCH_MS') &&
  t.includes('tickCapabilitiesBranch') &&
  t.includes('requestCapabilitiesConfigureHandoff') &&
  t.includes('childId === HIERARCHY_PART.SEAT_CAPABILITIES)')
) {
  console.log('P4 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy-runtime is placeholder or truncated');
  process.exit(1);
}

if (!t.includes('CAPABILITIES_BRANCH_MS')) {
  if (!t.includes('export const TOOLKIT_BRANCH_MS = 340;')) {
    console.error('TOOLKIT_BRANCH_MS marker missing');
    process.exit(1);
  }
  t = t.replace(
    'export const TOOLKIT_BRANCH_MS = 340;',
    'export const TOOLKIT_BRANCH_MS = 340;\n/** P4: SEAT_CAPABILITIES branch expand duration — capability face (not authorization). */\nexport const CAPABILITIES_BRANCH_MS = 320;',
  );
}

if (!t.includes('P4: SEAT_CAPABILITIES')) {
  t = t.replace(
    ' * P3: SEAT_TOOLKIT branch expand + optional equip face handoff helpers.',
    ' * P3: SEAT_TOOLKIT branch expand + optional equip face handoff helpers.\n * P4: SEAT_CAPABILITIES branch expand + capability face handoff helpers (not authorization).',
  );
}

const capsApis = `
export function tickCapabilitiesBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_CAPABILITIES) {
    if ((state.capabilitiesBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_CAPABILITIES) {
      state.capabilitiesBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.capabilitiesBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.capabilitiesBranchAmount = 0;
    return state;
  }
  const start = state.capabilitiesBranchStartMs ?? now;
  const progress = Math.min((now - start) / CAPABILITIES_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.capabilitiesBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getCapabilitiesBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.capabilitiesBranchAmount) || 0));
}

export function capabilitiesFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat capabilities face (" + open + "). Capability only; not authorization; not entitlement. Press K for normal UI.";
}

export function requestCapabilitiesConfigureHandoff(detail = {}) {
  const intent = {
    source: "p4-seat-capabilities",
    targetSection: detail.targetSection || "capabilities",
    normalUi: true,
    presentationOnly: true,
    notAuthorization: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('function tickCapabilitiesBranch')) {
  if (!t.includes('export function openSeatShellParent')) {
    console.error('openSeatShellParent marker missing');
    process.exit(1);
  }
  t = t.replace('export function openSeatShellParent', capsApis + 'export function openSeatShellParent');
}

if (!t.includes('childId === HIERARCHY_PART.SEAT_CAPABILITIES)')) {
  const focusNeedle = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
  }`;
  const focusInsert = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    state.capabilitiesBranchStartMs = now;
    state.capabilitiesBranchAmount = snap ? 1 : Math.min(state.capabilitiesBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  }`;
  if (!t.includes(focusNeedle)) {
    console.error('focusChild needle not found');
    process.exit(1);
  }
  t = t.replace(focusNeedle, focusInsert);
}

fs.writeFileSync(target, t);
console.log('P4 applied to public/hero-hierarchy-runtime.js');
