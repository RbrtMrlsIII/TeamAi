/**
 * Cam-3 — Free zoom / orbit about **current tree center** while a parent is open.
 * Authority: TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md (Cam-3)
 * Presentation only · no 029-released claim.
 */

/** Product rule: free zoom remains available when a hierarchy parent is open. */
export function navAllowedOnOpenTree() {
  return true;
}

/**
 * Pick the camera dock that represents the current tree (from Cam-2 resolve).
 */
export function baseDockForTree(state = {}, cameraTable = {}) {
  const id = state.cameraId || 'HERO_WIDE';
  return cameraTable[id] || cameraTable.HERO_WIDE || { p: [0, 6.4, 9.6], t: [0, 0.78, 0], f: 39 };
}

/**
 * Build camera pose: zoom scales distance from center target (look-at),
 * yaw/pitch orbit about that center. Look-at never leaves the center.
 */
export function poseAboutTreeCenter(baseDock, nav = {}) {
  const t = (baseDock.t || [0, 0.78, 0]).slice();
  const bp = baseDock.p || [0, 6.4, 9.6];
  const zoom = Number(nav.navZoom);
  const z = Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
  const yaw = Number(nav.navOrbitYaw) || 0;
  const pitch = Number(nav.navOrbitPitch) || 0;

  const dx = bp[0] - t[0];
  const dy = bp[1] - t[1];
  const dz = bp[2] - t[2];
  const dist0 = Math.hypot(dx, dy, dz) || 1;
  const dist = dist0 * z;

  const horiz = Math.hypot(dx, dz) || 1;
  const baseYaw = Math.atan2(dx, dz);
  const elev = Math.atan2(dy, horiz) + pitch * 0.85;
  const yawOut = baseYaw + yaw;

  const cosE = Math.cos(elev);
  const p = [
    t[0] + Math.sin(yawOut) * dist * Math.max(0.15, Math.abs(cosE) || 0.15),
    t[1] + Math.sin(elev) * dist,
    t[2] + Math.cos(yawOut) * dist * Math.max(0.15, Math.abs(cosE) || 0.15),
  ];
  return { p, t, f: baseDock.f ?? 39 };
}

/**
 * Whether wheel/pinch/orbit should apply for the current hierarchy state.
 * Cam-3: always allow when open (center-locked).
 */
export function shouldApplyTreeNav(state = {}, { requireNavigateWhenClosed = true } = {}) {
  if (state.openParentId) return navAllowedOnOpenTree();
  if (!requireNavigateWhenClosed) return true;
  const mode = state.inputMode;
  if (mode && mode !== 'NAVIGATE') return false;
  return true;
}
