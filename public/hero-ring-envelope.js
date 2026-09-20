/**
 * Shared concentric world-ring geometry.
 * Ring centerlines derive from the active workspace and outer machine envelope.
 * R1/R2 scale constants remain preferences, never a second geometry authority.
 */
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveConcentricRingEnvelope({
  workspaceRadius = 1,
  seatRingRadius = 2,
  ringR1Scale = 1,
  ringR2Scale = 1,
  interRingClearance = 0.18,
} = {}) {
  const workspace = Math.max(0, finite(workspaceRadius, 0));
  const gap = Math.max(0.02, finite(interRingClearance, 0.18));
  const seat = Math.max(workspace + gap * 3, finite(seatRingRadius, workspace));
  const rawR1 = workspace * Math.max(0, finite(ringR1Scale, 1));
  const rawR2 = workspace * Math.max(0, finite(ringR2Scale, 1));
  const r1Max = Math.max(workspace + gap, seat - gap * 2);
  const r2Max = Math.max(workspace + gap * 2, seat - gap);
  const r1 = Math.min(r1Max, Math.max(workspace + gap, rawR1));
  const r2 = Math.min(r2Max, Math.max(r1 + gap, rawR2));
  return Object.freeze({
    workspaceRadius: workspace,
    seatRingRadius: seat,
    r1Radius: r1,
    r2Radius: Math.max(r1 + gap, r2),
    interRingClearance: gap,
  });
}
