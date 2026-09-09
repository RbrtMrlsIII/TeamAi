#!/usr/bin/env node
/**
 * Idempotent P6 SEAT_WORKSPACE_SCOPE branch runtime patch for public/hero-hierarchy-runtime.js
 * Presentation only · WORKSPACE ≠ FIRESTORE · no entitlement · no 029-released claim
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
  t.includes('WORKSPACE_SCOPE_BRANCH_MS') &&
  t.includes('tickWorkspaceScopeBranch') &&
  t.includes('requestWorkspaceScopeConfigureHandoff') &&
  t.includes('childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE)')
) {
  console.log('P6 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy-runtime is placeholder or truncated');
  process.exit(1);
}

if (!t.includes('WORKSPACE_SCOPE_BRANCH_MS')) {
  if (!t.includes('export const AUTHORIZATION_BRANCH_MS = 300;')) {
    console.error('AUTHORIZATION_BRANCH_MS marker missing');
    process.exit(1);
  }
  t = t.replace(
    'export const AUTHORIZATION_BRANCH_MS = 300;',
    'export const AUTHORIZATION_BRANCH_MS = 300;\n/** P6: SEAT_WORKSPACE_SCOPE branch expand duration — workspace scope face (not Firestore authority). */\nexport const WORKSPACE_SCOPE_BRANCH_MS = 280;',
  );
}

if (!t.includes('P6: SEAT_WORKSPACE_SCOPE')) {
  t = t.replace(
    ' * P5: SEAT_AUTHORIZATION branch expand + authorization face handoff helpers (not capability).',
    ' * P5: SEAT_AUTHORIZATION branch expand + authorization face handoff helpers (not capability).\n * P6: SEAT_WORKSPACE_SCOPE branch expand + workspace scope face handoff helpers (not Firestore).',
  );
}

const wsApis = `
export function tickWorkspaceScopeBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_WORKSPACE_SCOPE) {
    if ((state.workspaceScopeBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_WORKSPACE_SCOPE) {
      state.workspaceScopeBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.workspaceScopeBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.workspaceScopeBranchAmount = 0;
    return state;
  }
  const start = state.workspaceScopeBranchStartMs ?? now;
  const progress = Math.min((now - start) / WORKSPACE_SCOPE_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.workspaceScopeBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getWorkspaceScopeBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.workspaceScopeBranchAmount) || 0));
}

export function workspaceScopeFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat workspace scope face (" + open + "). Workspace scope only; not Firestore; not entitlement. Press W for normal UI.";
}

export function requestWorkspaceScopeConfigureHandoff(detail = {}) {
  const intent = {
    source: "p6-seat-workspace-scope",
    targetSection: detail.targetSection || "workspace-scope",
    normalUi: true,
    presentationOnly: true,
    notFirestore: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('function tickWorkspaceScopeBranch')) {
  if (!t.includes('export function openSeatShellParent')) {
    console.error('openSeatShellParent marker missing');
    process.exit(1);
  }
  t = t.replace('export function openSeatShellParent', wsApis + 'export function openSeatShellParent');
}

if (!t.includes('childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE)')) {
  const focusNeedle = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
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
  const focusInsert = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    state.capabilitiesBranchStartMs = now;
    state.capabilitiesBranchAmount = snap ? 1 : Math.min(state.capabilitiesBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_AUTHORIZATION) {
    state.authorizationBranchStartMs = now;
    state.authorizationBranchAmount = snap ? 1 : Math.min(state.authorizationBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE) {
    state.workspaceScopeBranchStartMs = now;
    state.workspaceScopeBranchAmount = snap ? 1 : Math.min(state.workspaceScopeBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  }`;
  if (!t.includes(focusNeedle)) {
    console.error('focusChild needle not found');
    process.exit(1);
  }
  t = t.replace(focusNeedle, focusInsert);
}

fs.writeFileSync(target, t);
console.log('P6 applied to public/hero-hierarchy-runtime.js');
