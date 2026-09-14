#!/usr/bin/env node
/**
 * 029 Seat division focus-compaction patch.
 *
 * Presentation/runtime wiring only. A focused Seat division compacts before the
 * next division becomes active. No domain/config persistence is touched.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const runtimePath = join(root, 'public/hero-hierarchy-runtime.js');
const heroPaths = [
  join(root, 'public/hero-flex.js'),
  join(root, 'public/_flex_src/hero-flex.base.js'),
];

function patchRuntime() {
  let text = readFileSync(runtimePath, 'utf8');
  if (text.includes('DIVISION_FOCUS_CLOSE_MS') && text.includes('tickDivisionFocusTransition')) return false;

  const phaseNeedle = "  CLOSING: 'closing',\n};";
  if (!text.includes(phaseNeedle)) throw new Error('hierarchy phase anchor missing');
  text = text.replace(phaseNeedle, "  CLOSING: 'closing',\n  DIVISION_CLOSING: 'division_closing',\n};");

  const durationNeedle = 'export const CONNECTION_BRANCH_MS = 380;';
  if (!text.includes(durationNeedle)) throw new Error('duration anchor missing');
  text = text.replace(durationNeedle, durationNeedle + '\n/** Compact the active division before changing semantic division focus. */\nexport const DIVISION_FOCUS_CLOSE_MS = 240;');

  const stateNeedle = "    focusedChildId: seed.focusedChildId ?? null,\n    focusedLeafId: seed.focusedLeafId ?? null,\n    phase: seed.phase ?? HIERARCHY_PHASE.REST,";
  if (!text.includes(stateNeedle)) throw new Error('state anchor missing');
  text = text.replace(stateNeedle, "    focusedChildId: seed.focusedChildId ?? null,\n    focusedLeafId: seed.focusedLeafId ?? null,\n    divisionClosingChildId: seed.divisionClosingChildId ?? null,\n    divisionPendingChildId: seed.divisionPendingChildId ?? null,\n    divisionCloseStartMs: seed.divisionCloseStartMs ?? 0,\n    phase: seed.phase ?? HIERARCHY_PHASE.REST,");

  const start = text.indexOf('export function focusChild(state, childId, opts = {}) {');
  const end = text.indexOf('\nexport function focusLeaf', start);
  if (start < 0 || end < 0) throw new Error('focusChild anchors missing');
  const oldBlock = text.slice(start, end);
  const transitionNeedle = "  if (!SEAT_SHELL_V1_CHILDREN.includes(childId)) return state;";
  if (!oldBlock.includes(transitionNeedle)) throw new Error('focusChild validation anchor missing');
  const rewrittenBlock = oldBlock.replace(
    transitionNeedle,
    transitionNeedle + "\n  const now = opts.nowMs ?? 0;\n  const snap = Boolean(opts.snap);\n  if (state.focusedChildId && state.focusedChildId !== childId && !snap && opts.allowTransition !== false && state.phase === HIERARCHY_PHASE.OPEN) {\n    state.divisionClosingChildId = state.focusedChildId;\n    state.divisionPendingChildId = childId;\n    state.divisionCloseStartMs = now;\n    state.phase = HIERARCHY_PHASE.DIVISION_CLOSING;\n    state.focusedLeafId = null;\n    return state;\n  }",
  );
  if (rewrittenBlock === oldBlock) throw new Error('focusChild transition insertion failed');
  text = text.slice(0, start) + rewrittenBlock + text.slice(end);

  const insertAt = text.indexOf('\nexport function focusLeaf(state, leafId) {');
  if (insertAt < 0) throw new Error('focusLeaf insertion anchor missing');
  const transition = `
function resetDivisionBranchAmounts(state) {
  state.connectionBranchAmount = 0;
  state.behaviorBranchAmount = 0;
  state.toolkitBranchAmount = 0;
  state.capabilitiesBranchAmount = 0;
  state.authorizationBranchAmount = 0;
  state.workspaceScopeBranchAmount = 0;
  state.taskEvidenceBranchAmount = 0;
}

export function tickDivisionFocusTransition(state, nowMs, reducedMotion = false) {
  if (state.phase !== HIERARCHY_PHASE.DIVISION_CLOSING || !state.divisionClosingChildId) return state;
  const now = nowMs ?? 0;
  if (HIERARCHY_REDUCED_SNAP && reducedMotion) {
    const pending = state.divisionPendingChildId;
    state.divisionClosingChildId = null;
    state.divisionPendingChildId = null;
    resetDivisionBranchAmounts(state);
    state.phase = HIERARCHY_PHASE.OPEN;
    return focusChild(state, pending, { nowMs: now, snap: true, allowTransition: false });
  }
  const progress = Math.min((now - (state.divisionCloseStartMs ?? now)) / DIVISION_FOCUS_CLOSE_MS, 1);
  const amount = 1 - smoothstep(progress);
  switch (state.divisionClosingChildId) {
    case HIERARCHY_PART.SEAT_CONNECTION: state.connectionBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_BEHAVIOR: state.behaviorBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_TOOLKIT: state.toolkitBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_CAPABILITIES: state.capabilitiesBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_AUTHORIZATION: state.authorizationBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_WORKSPACE_SCOPE: state.workspaceScopeBranchAmount = amount; break;
    case HIERARCHY_PART.SEAT_TASK_EVIDENCE: state.taskEvidenceBranchAmount = amount; break;
    default: resetDivisionBranchAmounts(state); break;
  }
  if (progress >= 1) {
    const pending = state.divisionPendingChildId;
    state.divisionClosingChildId = null;
    state.divisionPendingChildId = null;
    resetDivisionBranchAmounts(state);
    state.phase = HIERARCHY_PHASE.OPEN;
    return focusChild(state, pending, { nowMs: now, snap: false, allowTransition: false });
  }
  return state;
}
`;
  text = text.slice(0, insertAt) + transition + text.slice(insertAt);

  const closeNeedle = "  state.focusedChildId = null;\n  state.connectionBranchAmount = 0;";
  if (!text.includes(closeNeedle)) throw new Error('closeHierarchyParent anchor missing');
  text = text.replace(closeNeedle, "  state.focusedChildId = null;\n  state.divisionClosingChildId = null;\n  state.divisionPendingChildId = null;\n  state.connectionBranchAmount = 0;");

  const openNeedle = "  state.openParentId = seatShellParentId(index);\n  state.selectedSeatIndex = index;";
  if (!text.includes(openNeedle)) throw new Error('openSeatShellParent anchor missing');
  text = text.replace(openNeedle, "  state.openParentId = seatShellParentId(index);\n  state.divisionClosingChildId = null;\n  state.divisionPendingChildId = null;\n  state.selectedSeatIndex = index;");

  writeFileSync(runtimePath, text);
  return true;
}

function patchHero(path) {
  let text = readFileSync(path, 'utf8');
  if (!text.includes('tickDivisionFocusTransition,')) {
    const importNeedle = '  tickHierarchyPose,\n  tickConnectionBranch,';
    if (!text.includes(importNeedle)) return false;
    text = text.replace(importNeedle, '  tickHierarchyPose,\n  tickDivisionFocusTransition,\n  tickConnectionBranch,');
  }
  const frameNeedle = 'tickTaskEvidenceBranch(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();';
  if (text.includes(frameNeedle)) {
    text = text.replace(frameNeedle, 'tickTaskEvidenceBranch(hierarchyRuntime,now,reducedMotion);tickDivisionFocusTransition(hierarchyRuntime,now,reducedMotion);syncHierarchyFromGlobals();');
  }
  writeFileSync(path, text);
  return true;
}

patchRuntime();
for (const path of heroPaths) {
  try { patchHero(path); } catch (err) { if (path.endsWith('/public/hero-flex.js')) throw err; }
}
console.log('Seat division focus compaction patch applied');
