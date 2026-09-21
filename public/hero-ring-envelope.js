/**
 * Shared concentric world-ring geometry.
 * Ring centerlines derive from the active workspace and outer machine envelope.
 * R1/R2 scale constants remain preferences, never a second geometry authority.
 */
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveConcentricRingEnvelope({
  r0Radius = null,
  r3Radius = null,
  workspaceRadius = 1,
  seatRingRadius = 2,
  ringR1Scale = 1,
  ringR2Scale = 1,
  interRingClearance = 0.18,
} = {}) {
  const workspace = Math.max(
    0,
    finite(r0Radius == null ? workspaceRadius : r0Radius, 0),
  );
  const seat = Math.max(
    workspace,
    finite(r3Radius == null ? seatRingRadius : r3Radius, workspace),
  );
  const requestedGap = Math.max(0.02, finite(interRingClearance, 0.18));
  const availableSpan = Math.max(0, seat - workspace);
  const gap = Math.min(requestedGap, availableSpan / 3);
  const rawR1 = workspace * Math.max(0, finite(ringR1Scale, 1));
  const rawR2 = workspace * Math.max(0, finite(ringR2Scale, 1));
  const r1Min = workspace + gap;
  const r1Max = Math.max(r1Min, seat - gap * 2);
  const r1 = Math.min(r1Max, Math.max(r1Min, rawR1));
  const r2Min = r1 + gap;
  const r2Max = Math.max(r2Min, seat - gap);
  const r2 = Math.min(r2Max, Math.max(r2Min, rawR2));
  return Object.freeze({
    workspaceRadius: workspace,
    seatRingRadius: seat,
    r1Radius: r1,
    r2Radius: r2,
    interRingClearance: gap,
    requestedInterRingClearance: requestedGap,
    radialSpan: availableSpan,
    valid: workspace < r1 && r1 < r2 && r2 < seat,
  });
}
