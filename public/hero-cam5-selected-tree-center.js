/**
 * Cam-5 — Center camera on the **selected seat / tree** (presentation only).
 * Cam-2/3 switched camera *ids* but docks still looked at world origin [0,y,0].
 * This module places look-at `t` on the selected seat ring position.
 * Authority: TEAMAI_3D_HERO_HIERARCHY_CAMERA_FOLLOW_CONTRACT.md
 * no 029-released claim.
 */

/** Match hero-flex buildSeats angle: -π/2 + i * 2π/n */
export function seatAngle(index, seatCount) {
  const n = Math.max(1, Math.floor(Number(seatCount) || 1));
  const i = ((Math.floor(Number(index) || 0) % n) + n) % n;
  return -Math.PI / 2 + i * ((Math.PI * 2) / n);
}

/** World-space look-at for a seat on the ring (y ≈ shell rest / open face). */
export function seatWorldTarget(index, seatCount, seatRadius, lookY = 0.95) {
  const a = seatAngle(index, seatCount);
  const r = Number(seatRadius);
  const radius = Number.isFinite(r) && r > 0 ? r : 4.25;
  const y = Number.isFinite(Number(lookY)) ? Number(lookY) : 0.95;
  return [Math.cos(a) * radius, y, Math.sin(a) * radius];
}

/**
 * Dock: camera outside the ring, looking at the selected seat.
 * @param {number} index selectedSeat
 * @param {number} seatCount
 * @param {{ seatRadius?: number }} profile
 * @param {{ elev?: number, distFactor?: number, f?: number, lookY?: number }} [opts]
 */
export function dockTowardSeat(index, seatCount, profile = {}, opts = {}) {
  const r = Number(profile.seatRadius);
  const radius = Number.isFinite(r) && r > 0 ? r : 4.25;
  const lookY = opts.lookY != null ? opts.lookY : 0.95;
  const t = seatWorldTarget(index, seatCount, radius, lookY);
  const a = seatAngle(index, seatCount);
  const elev = opts.elev != null ? opts.elev : 2.3;
  const distFactor = opts.distFactor != null ? opts.distFactor : 1.38;
  const dist = radius * distFactor;
  const p = [Math.cos(a) * dist, elev, Math.sin(a) * dist];
  const f = opts.f != null ? opts.f : 36;
  return { p, t, f };
}

/** Prefer Cam-5 dock for seat-oriented camera ids while a seat is selected. */
export function shouldCenterOnSelectedSeat(cameraId) {
  return cameraId === 'SEAT_CLOSE' || cameraId === 'DETAIL_ANCHOR';
}

export function resolveSelectedSeatDock(cameraId, index, seatCount, profile) {
  if (!shouldCenterOnSelectedSeat(cameraId)) return null;
  if (cameraId === 'DETAIL_ANCHOR') {
    return dockTowardSeat(index, seatCount, profile, {
      elev: 1.95,
      distFactor: 1.18,
      f: 31,
      lookY: 1.05,
    });
  }
  return dockTowardSeat(index, seatCount, profile, {
    elev: 2.35,
    distFactor: 1.38,
    f: 36,
    lookY: 0.95,
  });
}
