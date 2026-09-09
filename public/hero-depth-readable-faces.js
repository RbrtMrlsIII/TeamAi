/**
 * Depth-readable faces — FOV/scale helpers for general hierarchy faces (not only login/config).
 * Authority: TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md §5
 * Presentation only · no 029-released claim.
 */

export const TREE_FACE_FOV_BOOST = 2.5;
export const TREE_LEAF_FOV_BOOST = 3.5;
export const TREE_FACE_SCALE_MIN = 0.92;

export function depthReadableFovBoost(state = {}, narrowBoost = 0) {
  const narrow = Number(narrowBoost) || 0;
  if (!state || !state.openParentId) return narrow;
  if (state.focusedLeafId) return narrow + TREE_LEAF_FOV_BOOST;
  if (state.focusedChildId) return narrow + TREE_FACE_FOV_BOOST;
  return narrow + TREE_FACE_FOV_BOOST * 0.5;
}

export function depthReadableFaceScale(state = {}) {
  if (!state || !state.openParentId) return 1;
  if (state.focusedLeafId) return Math.max(TREE_FACE_SCALE_MIN, 1.08);
  if (state.focusedChildId) return Math.max(TREE_FACE_SCALE_MIN, 1.04);
  return 1;
}
