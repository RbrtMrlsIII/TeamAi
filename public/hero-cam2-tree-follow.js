/**
 * Cam-2 — Hierarchy tree camera follow (presentation only).
 * Every opened parent/child tree gets a pre-made dock aimed at that tree's center target.
 * Authority: TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md
 * no 029-released claim.
 */
import {
  HIERARCHY_PART,
  HIERARCHY_INPUT,
} from './hero-hierarchy-runtime.js';

/** Named docks used when a hierarchy tree is open. */
export const TREE_CAMERA = Object.freeze({
  WORLD: 'HERO_WIDE',
  SEAT_SHELL: 'SEAT_CLOSE',
  SEAT_CHILD_NEAR: 'SEAT_CLOSE',
  SEAT_CHILD_DETAIL: 'DETAIL_ANCHOR',
  WORKSPACE: 'WORKSPACE_CLOSE',
  SETUP_FILL: 'DETAIL_ANCHOR',
});

/**
 * Default world elevation ~45° (atan(y/z) with y≈z on HERO_WIDE base).
 * Actual p/t/f still live in hero-flex cameras(); this documents product default.
 */
export const DEFAULT_WORLD_ELEVATION_DEG = 45;

/** Child ids that prefer a closer/detail dock for readability. */
const DETAIL_CHILDREN = new Set([
  HIERARCHY_PART.SEAT_CAPABILITIES,
  HIERARCHY_PART.SEAT_AUTHORIZATION,
  HIERARCHY_PART.SEAT_WORKSPACE_SCOPE,
  HIERARCHY_PART.SEAT_TASK_EVIDENCE,
  HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE,
  HIERARCHY_PART.SEAT_TOOLKIT,
]);

/**
 * Resolve the camera id that should follow the current hierarchy tree.
 */
export function resolveTreeCamera(state = {}, ctx = {}) {
  const openParentId = state.openParentId || null;
  const focusedChildId = state.focusedChildId || null;
  const focusedLeafId = state.focusedLeafId || null;
  const ring = ctx.ring != null ? ctx.ring : null;
  const setupFill = Number(ctx.setupFill) || 0;

  if (setupFill > 0.05) {
    return {
      cameraId: TREE_CAMERA.SETUP_FILL,
      treeCenter: 'setup-ring',
      inputHint: HIERARCHY_INPUT.INSPECT,
    };
  }

  if (!openParentId) {
    if (ring === 'r0' || ring === 'r1') {
      return {
        cameraId: TREE_CAMERA.WORKSPACE,
        treeCenter: ring === 'r0' ? 'workspace-r0' : 'backend-r1',
        inputHint: HIERARCHY_INPUT.NAVIGATE,
      };
    }
    return {
      cameraId: TREE_CAMERA.WORLD,
      treeCenter: 'world',
      inputHint: HIERARCHY_INPUT.NAVIGATE,
    };
  }

  if (String(openParentId).startsWith(HIERARCHY_PART.SEAT_SHELL)) {
    if (focusedLeafId || (focusedChildId && DETAIL_CHILDREN.has(focusedChildId))) {
      return {
        cameraId: TREE_CAMERA.SEAT_CHILD_DETAIL,
        treeCenter: focusedLeafId || focusedChildId || 'seat-child',
        inputHint: HIERARCHY_INPUT.INSPECT,
      };
    }
    if (focusedChildId) {
      return {
        cameraId: TREE_CAMERA.SEAT_CHILD_NEAR,
        treeCenter: focusedChildId,
        inputHint: HIERARCHY_INPUT.INSPECT,
      };
    }
    return {
      cameraId: TREE_CAMERA.SEAT_SHELL,
      treeCenter: openParentId,
      inputHint: HIERARCHY_INPUT.INSPECT,
    };
  }

  return {
    cameraId: TREE_CAMERA.WORLD,
    treeCenter: 'world',
    inputHint: HIERARCHY_INPUT.NAVIGATE,
  };
}

export function shouldFollowTree(state = {}) {
  return Boolean(state && state.openParentId);
}
