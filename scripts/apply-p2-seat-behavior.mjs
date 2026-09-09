#!/usr/bin/env node
/**
 * Idempotent P2 SEAT_BEHAVIOR patch for public/hero-hierarchy-runtime.js
 * Run from repo root.
 */
import fs from 'node:fs';
import path from 'node:path';

const target = path.join(process.cwd(), 'public/hero-hierarchy-runtime.js');
if (!fs.existsSync(target)) {
  console.error('missing public/hero-hierarchy-runtime.js');
  process.exit(1);
}
let t = fs.readFileSync(target, 'utf8');
if (t.includes('tickBehaviorBranch') && t.includes('BEHAVIOR_BRANCH_MS')) {
  console.log('P2 already applied');
  process.exit(0);
}
if (t.trim() === 'PLACEHOLDER' || t.length < 500) {
  console.error('hierarchy runtime is placeholder or truncated; restore from main first');
  process.exit(1);
}

t = t.replace(
  ' * P1: SEAT_CONNECTION branch expand + configure handoff helpers.\n */',
  " * P1: SEAT_CONNECTION branch expand + configure handoff helpers.\n * P2: SEAT_BEHAVIOR branch expand + Do/Don't face handoff helpers.\n */",
);

if (!t.includes('export const BEHAVIOR_BRANCH_MS')) {
  t = t.replace(
    'export const CONNECTION_BRANCH_MS = 380;\n',
    'export const CONNECTION_BRANCH_MS = 380;\n/** P2: SEAT_BEHAVIOR branch expand duration — §9 home. */\nexport const BEHAVIOR_BRANCH_MS = 360;\n',
  );
}

if (!t.includes('behaviorBranchAmount:')) {
  t = t.replace(
    '    connectionBranchAmount: seed.connectionBranchAmount ?? 0,\n    connectionBranchStartMs: seed.connectionBranchStartMs ?? 0,\n    presentationOnly: true,\n',
    '    connectionBranchAmount: seed.connectionBranchAmount ?? 0,\n    connectionBranchStartMs: seed.connectionBranchStartMs ?? 0,\n    behaviorBranchAmount: seed.behaviorBranchAmount ?? 0,\n    behaviorBranchStartMs: seed.behaviorBranchStartMs ?? 0,\n    presentationOnly: true,\n',
  );
}

if (!t.includes('state.behaviorBranchAmount = 0;')) {
  t = t.replace(
    '  state.connectionBranchAmount = 0;\n  state.connectionBranchStartMs = now;\n  state.phaseStartMs = now;\n',
    '  state.connectionBranchAmount = 0;\n  state.connectionBranchStartMs = now;\n  state.behaviorBranchAmount = 0;\n  state.behaviorBranchStartMs = now;\n  state.phaseStartMs = now;\n',
  );
}

const oldFocus = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
    state.connectionBranchStartMs = now;
    state.connectionBranchAmount = snap ? 1 : Math.min(state.connectionBranchAmount || 0, 0.15);
  } else {
    state.connectionBranchAmount = 0;
  }
  return state;
}`;
const newFocus = `  if (childId === HIERARCHY_PART.SEAT_CONNECTION) {
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
  }
  return state;
}`;
if (t.includes(oldFocus)) t = t.replace(oldFocus, newFocus);

// Accessible-name body uses string concat so this apply script never evaluates ${open}
const apis = `
export function tickBehaviorBranch(state, nowMs, reducedMotion = false) {
  const now = nowMs ?? 0;
  if (!state.openParentId || state.focusedChildId !== HIERARCHY_PART.SEAT_BEHAVIOR) {
    if ((state.behaviorBranchAmount || 0) > 0 && state.focusedChildId !== HIERARCHY_PART.SEAT_BEHAVIOR) {
      state.behaviorBranchAmount = 0;
    }
    return state;
  }
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    state.behaviorBranchAmount = 1;
    return state;
  }
  const parentReady = (state.openAmount || 0) >= 0.55 || state.phase === HIERARCHY_PHASE.OPEN;
  if (!parentReady) {
    state.behaviorBranchAmount = 0;
    return state;
  }
  const start = state.behaviorBranchStartMs ?? now;
  const progress = Math.min((now - start) / BEHAVIOR_BRANCH_MS, 1);
  const x = Math.max(0, Math.min(1, progress));
  state.behaviorBranchAmount = x * x * (3 - 2 * x);
  return state;
}

export function getBehaviorBranchAmount(state) {
  return Math.max(0, Math.min(1, Number(state?.behaviorBranchAmount) || 0));
}

export function behaviorFaceAccessibleName(branchAmount = 1) {
  const open = (Number(branchAmount) || 0) >= 0.85 ? 'expanded' : 'opening';
  return 'Seat behavior face (' + open + '). Do / Don\'t presentation only; not durable policy. Press B for normal UI.';
}

export function requestBehaviorConfigureHandoff(detail = {}) {
  const intent = {
    source: 'p2-seat-behavior',
    targetSection: detail.targetSection || 'behavior',
    normalUi: true,
    presentationOnly: true,
  };
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('teamai:web-ai-seat-configure-request', { detail: intent }));
  }
  return intent;
}

`;

if (!t.includes('export function tickBehaviorBranch')) {
  const anchor = '\nexport function openSeatShellParent';
  if (!t.includes(anchor)) {
    console.error('openSeatShellParent anchor missing');
    process.exit(1);
  }
  t = t.replace(anchor, apis + anchor);
}

fs.writeFileSync(target, t);
console.log('P2 applied to public/hero-hierarchy-runtime.js');
