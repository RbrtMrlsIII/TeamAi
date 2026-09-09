#!/usr/bin/env node
/**
 * Idempotent P7 SEAT_TASK_EVIDENCE branch runtime patch for public/hero-hierarchy-runtime.js
 * Presentation only · evidence face · no entitlement · no 029-released claim
 * Avoid forbidden presentation tokens: firestore, paypal, scheduler eligibility
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
  t.includes('TASK_EVIDENCE_BRANCH_MS') &&
  t.includes('tickTaskEvidenceBranch') &&
  t.includes('requestTaskEvidenceConfigureHandoff') &&
  t.includes('childId === HIERARCHY_PART.SEAT_TASK_EVIDENCE)')
) {
  console.log('P7 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy-runtime is placeholder or truncated');
  process.exit(1);
}

if (!t.includes('TASK_EVIDENCE_BRANCH_MS')) {
  if (!t.includes('export const WORKSPACE_SCOPE_BRANCH_MS = 280;')) {
    console.error('WORKSPACE_SCOPE_BRANCH_MS marker missing');
    process.exit(1);
  }
  t = t.replace(
    'export const WORKSPACE_SCOPE_BRANCH_MS = 280;',
    'export const WORKSPACE_SCOPE_BRANCH_MS = 280;\n/** P7: SEAT_TASK_EVIDENCE branch expand duration — task evidence face (presentation only). */\nexport const TASK_EVIDENCE_BRANCH_MS = 260;',
  );
}

if (!t.includes('P7: SEAT_TASK_EVIDENCE')) {
  t = t.replace(
    ' * P6: SEAT_WORKSPACE_SCOPE branch expand + workspace scope face handoff helpers (not durable store).',
    ' * P6: SEAT_WORKSPACE_SCOPE branch expand + workspace scope face handoff helpers (not durable store).\n * P7: SEAT_TASK_EVIDENCE branch expand + task evidence face handoff helpers (presentation only).',
  );
}

const evApis = `
export function tickTaskEvidenceBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_TASK_EVIDENCE) {
    if ((state.taskEvidenceBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_TASK_EVIDENCE) {
      state.taskEvidenceBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.taskEvidenceBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.taskEvidenceBranchAmount = 0;
    return state;
  }
  const start = state.taskEvidenceBranchStartMs ?? now;
  const progress = Math.min((now - start) / TASK_EVIDENCE_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.taskEvidenceBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getTaskEvidenceBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.taskEvidenceBranchAmount) || 0));
}

export function taskEvidenceFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat task evidence face (" + open + "). Evidence presentation only; not authority; not entitlement. Press E for normal UI.";
}

export function requestTaskEvidenceConfigureHandoff(detail = {}) {
  const intent = {
    source: "p7-seat-task-evidence",
    targetSection: detail.targetSection || "task-evidence",
    normalUi: true,
    presentationOnly: true,
    notAuthority: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('function tickTaskEvidenceBranch')) {
  if (!t.includes('export function openSeatShellParent')) {
    console.error('openSeatShellParent marker missing');
    process.exit(1);
  }
  t = t.replace('export function openSeatShellParent', evApis + 'export function openSeatShellParent');
}

if (!t.includes('childId === HIERARCHY_PART.SEAT_TASK_EVIDENCE)')) {
  const focusNeedle = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
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
  const focusInsert = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TOOLKIT) {
    state.toolkitBranchStartMs = now;
    state.toolkitBranchAmount = snap ? 1 : Math.min(state.toolkitBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_CAPABILITIES) {
    state.capabilitiesBranchStartMs = now;
    state.capabilitiesBranchAmount = snap ? 1 : Math.min(state.capabilitiesBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_AUTHORIZATION) {
    state.authorizationBranchStartMs = now;
    state.authorizationBranchAmount = snap ? 1 : Math.min(state.authorizationBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_WORKSPACE_SCOPE) {
    state.workspaceScopeBranchStartMs = now;
    state.workspaceScopeBranchAmount = snap ? 1 : Math.min(state.workspaceScopeBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_TASK_EVIDENCE) {
    state.taskEvidenceBranchStartMs = now;
    state.taskEvidenceBranchAmount = snap ? 1 : Math.min(state.taskEvidenceBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
    state.toolkitBranchAmount = 0;
    state.capabilitiesBranchAmount = 0;
    state.authorizationBranchAmount = 0;
    state.workspaceScopeBranchAmount = 0;
    state.taskEvidenceBranchAmount = 0;
  }`;
  if (!t.includes(focusNeedle)) {
    console.error('focusChild needle not found');
    process.exit(1);
  }
  t = t.replace(focusNeedle, focusInsert);
}

fs.writeFileSync(target, t);
console.log('P7 applied to public/hero-hierarchy-runtime.js');
