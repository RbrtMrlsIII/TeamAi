/**
 * V1.1 — Back / Next walk within open seat shell (Vision).
 * Owner: SEAT_SHELL_V1_CHILDREN + focusChild (hierarchy runtime).
 * Presentation only · no 029-released claim · Issue #214
 */
import {
  SEAT_SHELL_V1_CHILDREN,
  focusChild,
  HIERARCHY_PART,
} from './hero-hierarchy-runtime.js';

/** Ordered branch faces on seat shell (C → E product order). */
export const SEAT_BRANCH_WALK_ORDER = SEAT_SHELL_V1_CHILDREN;

/**
 * Resolve next/prev child id in SEAT_SHELL_V1_CHILDREN.
 * @param {string|null} currentId
 * @param {number} delta +1 Next, -1 Back
 * @param {{ wrap?: boolean }} [opts] wrap defaults true
 */
export function resolveSeatBranchStep(currentId, delta = 1, opts = {}) {
  const wrap = opts.wrap !== false;
  const list = SEAT_BRANCH_WALK_ORDER;
  if (!list.length) return null;
  let idx = list.indexOf(currentId);
  if (idx < 0) {
    idx = delta >= 0 ? -1 : 0;
  }
  let next = idx + (delta >= 0 ? 1 : -1);
  if (wrap) {
    next = ((next % list.length) + list.length) % list.length;
  } else if (next < 0 || next >= list.length) {
    return currentId && list.includes(currentId) ? currentId : list[0];
  }
  return list[next];
}

/**
 * Apply Back/Next focus on hierarchy state (mutates via focusChild).
 */
export function cycleSeatShellBranchFocus(state, delta = 1, opts = {}) {
  if (!state || !state.openParentId) return state;
  const nextId = resolveSeatBranchStep(state.focusedChildId, delta, opts);
  if (!nextId) return state;
  return focusChild(state, nextId, opts);
}

export function seatBranchWalkAccessibleName(childId) {
  const labels = {
    [HIERARCHY_PART.SEAT_CONNECTION]: 'Connection',
    [HIERARCHY_PART.SEAT_BEHAVIOR]: 'Behavior',
    [HIERARCHY_PART.SEAT_TOOLKIT]: 'Toolkit',
    [HIERARCHY_PART.SEAT_CAPABILITIES]: 'Capabilities',
    [HIERARCHY_PART.SEAT_AUTHORIZATION]: 'Authorization',
    [HIERARCHY_PART.SEAT_WORKSPACE_SCOPE]: 'Workspace scope',
    [HIERARCHY_PART.SEAT_TASK_EVIDENCE]: 'Task evidence',
  };
  return labels[childId] || String(childId || 'branch');
}
