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
 * V0.1 / Vision — world machine baseline (~45°).
 * Owner: HERO_WIDE dock in hero-flex cameras() + apply-cam2 patch (p y/z → 1).
 * Default world elevation ~45° (atan(y/z) with y≈z on HERO_WIDE base).
 * Actual p/t/f still live in hero-flex cameras(); this documents product default.
 * Do not invent a second world camera table.
 */
export const DEFAULT_WORLD_ELEVATION_DEG = 45;

/** Canonical closed-hierarchy / return baseline dock id (Vision V0.1). */
export const WORLD_BASELINE_DOCK_ID = 'HERO_WIDE';

/**
 * Elevation degrees from eye position looking toward origin on XZ (atan2(|y|,|z|)).
 * Pure helper for tests and product notes — presentation only.
 */
export function elevationDegFromEye(p) {
  const y = Math.abs(Number(p && p[1]) || 0);
  const z = Math.abs(Number(p && p[2]) || 0);
  if (y === 0 && z === 0) return 0;
  return (Math.atan2(y, z) * 180) / Math.PI;
}

/** True when eye height/depth ratio is ~45° (within tolDeg). */
export function isNearWorldBaselineElevation(p, tolDeg = 2) {
  const deg = elevationDegFromEye(p);
  return Math.abs(deg - DEFAULT_WORLD_ELEVATION_DEG) <= tolDeg;
}

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
