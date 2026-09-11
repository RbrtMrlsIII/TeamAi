/**
 * Map remaining DOM product actions → hierarchy / tree docks only.
 * Retire lock-only camera presets that ignore open trees.
 * CAM-R-RETIRE: HERO_LOW_ORBIT + TURN_FOLLOW removed from existence.
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

  if (isLockOnlyCamera(id)) {
    if (hierarchyOpen) {
      return {
        allowed: false,
        effectiveCameraId: null,
        retired: true,
        freeNav: true,
        reason: 'lock-only camera retired while hierarchy open',
      };
    }
    return {
      allowed: true,
      effectiveCameraId: 'HERO_WIDE',
      retired: true,
      freeNav: true,
      reason: 'lock-only camera mapped to HERO_WIDE + free nav',
    };
  }

  if (hierarchyOpen && !isTreeAlignedCamera(id)) {
    return {
      allowed: false,
      effectiveCameraId: null,
      retired: false,
      freeNav: true,
      reason: 'non-aligned camera blocked while hierarchy open',
    };
  }

  return {
    allowed: true,
    effectiveCameraId: id,
    retired: false,
    freeNav: false,
    reason: 'tree-aligned or default dock',
  };
}

export function applyResolvedCamera(cameraId, ctx = {}) {
  const resolved = resolveDomCameraAction(cameraId, ctx);
  if (!resolved.allowed || !resolved.effectiveCameraId) return resolved;
  const hero = typeof window !== 'undefined' ? window.TeamAiHero : null;
  if (hero && typeof hero.setCamera === 'function') {
    hero.setCamera(resolved.effectiveCameraId);
  } else if (typeof document !== 'undefined') {
    const btn = document.querySelector(`[data-camera="${resolved.effectiveCameraId}"]`);
    if (btn && !isLockOnlyCamera(resolved.effectiveCameraId)) {
      btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    }
  }
  return resolved;
}
