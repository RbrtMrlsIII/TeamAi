/**
 * Map remaining DOM product actions → hierarchy / tree docks only.
 * Retire lock-only camera presets that ignore open trees.
 * Authority: TEAMAI_3D_HERO_DOM_CHROME_ABSORPTION.md steps 2–4
 * Presentation only · no 029-released claim.
 */

export const TREE_ALIGNED_CAMERA_IDS = Object.freeze([
  'HERO_WIDE',
  'SEAT_CLOSE',
  'DETAIL_ANCHOR',
  'WORKSPACE_CLOSE',
]);

export const LOCK_ONLY_CAMERA_IDS = Object.freeze([
  'TEAM_ORBIT',
  'OVERHEAD_MAP',
]);

export const DOM_PRODUCT_ACTIONS = Object.freeze({
  'engine:open': { kind: 'handoff', targetSection: 'auth', note: 'Open engine → auth/setup ring handoff' },
  'demo:toggle': { kind: 'presentation', note: 'Turn loop stays presentation demo until workspace gear owns it' },
  'seat-stack:inspect': { kind: 'hierarchy-focus', note: 'Prefer seat shell child faces over DOM list' },
  'inspection:spine': { kind: 'semantic', note: 'Spine publishes semantic camera → tree-aligned dock only' },
  'spatial-part': { kind: 'semantic', note: 'Surface/Focus/Trace → semantic intent, not lock-only camera' },
});

export function isLockOnlyCamera(cameraId) {
  return LOCK_ONLY_CAMERA_IDS.includes(cameraId);
}

export function isTreeAlignedCamera(cameraId) {
  return TREE_ALIGNED_CAMERA_IDS.includes(cameraId);
}

export function resolveDomCameraAction(cameraId, ctx = {}) {
  const id = String(cameraId || '');
  const hierarchyOpen = Boolean(ctx.hierarchyOpen);
  if (isLockOnlyCamera(id) && hierarchyOpen) {
    return { ok: false, reason: 'lock-only-while-tree-open', prefer: 'tree-aligned' };
  }
  if (isTreeAlignedCamera(id) || isLockOnlyCamera(id)) {
    return { ok: true, cameraId: id };
  }
  return { ok: false, reason: 'unknown-camera', cameraId: id };
}
