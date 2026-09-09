#!/usr/bin/env node
/**
 * Idempotent P5 SEAT_AUTHORIZATION branch runtime patch for public/hero-hierarchy-runtime.js
 * Presentation only · AUTHORIZATION ≠ CAPABILITY · no entitlement · no 029-released claim
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
  t.includes('AUTHORIZATION_BRANCH_MS') &&
  t.includes('tickAuthorizationBranch') &&
  t.includes('requestAuthorizationConfigureHandoff') &&
  t.includes('childId === HIERARCHY_PART.SEAT_AUTHORIZATION)')
) {
  console.log('P5 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy-runtime is placeholder or truncated');
  process.exit(1);
}

if (!t.includes('AUTHORIZATION_BRANCH_MS')) {
  if (!t.includes('export const CAPABILITIES_BRANCH_MS = 320;')) {
    console.error('CAPABILITIES_BRANCH_MS marker missing');
    process.exit(1);
  }
  t = t.replace(
    'export const CAPABILITIES_BRANCH_MS = 320;',
    'export const CAPABILITIES_BRANCH_MS = 320;\n/** P5: SEAT_AUTHORIZATION branch expand duration — authorization face (not capability). */\nexport const AUTHORIZATION_BRANCH_MS = 300;',
  );
}

if (!t.includes('P5: SEAT_AUTHORIZATION')) {
  t = t.replace(
    ' * P4: SEAT_CAPABILITIES branch expand + capability face handoff helpers (not authorization).',
    ' * P4: SEAT_CAPABILITIES branch expand + capability face handoff helpers (not authorization).\n * P5: SEAT_AUTHORIZATION branch expand + authorization face handoff helpers (not capability).',
  );
}

const authApis = `
export function tickAuthorizationBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_AUTHORIZATION) {
    if ((state.authorizationBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_AUTHORIZATION) {
      state.authorizationBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.authorizationBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.authorizationBranchAmount = 0;
    return state;
  }
  const start = state.authorizationBranchStartMs ?? now;
  const progress = Math.min((now - start) / AUTHORIZATION_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.authorizationBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getAuthorizationBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.authorizationBranchAmount) || 0));
}

export function authorizationFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat authorization face (" + open + "). Authorization only; not capability; not entitlement. Press A for normal UI.";
}

export function requestAuthorizationConfigureHandoff(detail = {}) {
  const intent = {
    source: "p5-seat-authorization",
    targetSection: detail.targetSection || "authorization",
    normalUi: true,
    presentationOnly: true,
    notCapability: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('function tickAuthorizationBranch')) {
  if (!t.includes('export function openSeatShellParent')) {
    console.error('openSeatShellParent marker missing');
    process.exit(1);
  }
  t = t.replace('export function openSeatShellParent', authApis + 'export function openSeatShellParent');
}

if (!t.includes('childId === HIERARCHY_PART.SEAT_AUTHORIZATION)')) {
  const focusNeedle = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
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
  const focusInsert = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    state.capabilitiesBranchStartMs = now;
    state.capabilitiesBranchAmount = snap ? 1 : Math.min(state.capabilitiesBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_AUTHORIZATION) {
    state.authorizationBranchStartMs = now;
    state.authorizationBranchAmount = snap ? 1 : Math.min(state.authorizationBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  }`;
  if (!t.includes(focusNeedle)) {
    console.error('focusChild needle not found');
    process.exit(1);
  }
  t = t.replace(focusNeedle, focusInsert);
}

fs.writeFileSync(target, t);
console.log('P5 applied to public/hero-hierarchy-runtime.js');
