#!/usr/bin/env node
/**
 * Idempotent P3 SEAT_TOOLKIT branch runtime patch for public/hero-hierarchy-runtime.js
 * Presentation only · optional equip · no entitlement · no 029-released claim
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-hierarchy-runtime.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-hierarchy-runtime.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('TOOLKIT_BRANCH_MS') && t.includes('tickToolkitBranch') && t.includes('requestToolkitConfigureHandoff') && t.includes('childId === HIERARCHY_PART.SEAT_TOOLKIT)')) {
  console.log('P3 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy-runtime is placeholder or truncated');
  process.exit(1);
}

// 1) Constant after BEHAVIOR_BRANCH_MS
if (!t.includes('TOOLKIT_BRANCH_MS')) {
  if (!t.includes('export const BEHAVIOR_BRANCH_MS = 360;')) {
    console.error('BEHAVIOR_BRANCH_MS marker missing');
    process.exit(1);
  }
  t = t.replace(
    'export const BEHAVIOR_BRANCH_MS = 360;',
    'export const BEHAVIOR_BRANCH_MS = 360;\n/** P3: SEAT_TOOLKIT branch expand duration — optional equip face. */\nexport const TOOLKIT_BRANCH_MS = 340;',
  );
}

// 2) Header comment
if (!t.includes('P3: SEAT_TOOLKIT')) {
  t = t.replace(
    " * P2: SEAT_BEHAVIOR branch expand + Do/Don't face handoff helpers.",
    " * P2: SEAT_BEHAVIOR branch expand + Do/Don't face handoff helpers.\n * P3: SEAT_TOOLKIT branch expand + optional equip face handoff helpers.",
  );
}

// 3) APIs after requestBehaviorConfigureHandoff block — insert before openSeatShellParent
const toolkitApis = `
export function tickToolkitBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_TOOLKIT) {
    if ((state.toolkitBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_TOOLKIT) {
      state.toolkitBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.toolkitBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.toolkitBranchAmount = 0;
    return state;
  }
  const start = state.toolkitBranchStartMs ?? now;
  const progress = Math.min((now - start) / TOOLKIT_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.toolkitBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getToolkitBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.toolkitBranchAmount) || 0));
}

export function toolkitFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? "expanded" : "opening";
  return "Seat toolkit face (" + open + "). Optional equip only; not required setup; not entitlement. Press T for normal UI.";
}

export function requestToolkitConfigureHandoff(detail = {}) {
  const intent = {
    source: "p3-seat-toolkit",
    targetSection: detail.targetSection || "toolkit",
    normalUi: true,
    presentationOnly: true,
    optional: true,
  };
  if (typeof window !== "undefined" && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent("teamai:web-ai-seat-configure-request", { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('function tickToolkitBranch')) {
  if (!t.includes('export function openSeatShellParent')) {
    console.error('openSeatShellParent marker missing');
    process.exit(1);
  }
  t = t.replace('export function openSeatShellParent', toolkitApis + 'export function openSeatShellParent');
}

// 4) focusChild mutual exclusion — extend CONNECTION / BEHAVIOR / TOOLKIT
if (!t.includes('childId === HIERARCHY_PART.SEAT_TOOLKIT)')) {
  const focusNeedle = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
    state.behaviorBranchAmount = 0;
  } else if (childId === HIERARCHY_PART.SEAT_BEHAVIOR) {
    state.behaviorBranchStartMs = now;
    state.behaviorBranchAmount = snap ? 1 : Math.min(state.behaviorBranchAmount || 0, 0.15);
    state.connectionBranchAmount = 0;
  } else {
    state.connectionBranchAmount = 0;
    state.behaviorBranchAmount = 0;
  }`;
  const focusInsert = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
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
  if (!t.includes(focusNeedle)) {
    console.error('focusChild needle not found');
    process.exit(1);
  }
  t = t.replace(focusNeedle, focusInsert);
}

fs.writeFileSync(target, t);
console.log('P3 applied to public/hero-hierarchy-runtime.js');
