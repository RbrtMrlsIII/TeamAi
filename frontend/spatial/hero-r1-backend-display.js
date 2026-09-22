/**
 * 029 R1 backend display ring renderer.
 * Geometry/render helper only. No backend binding or durable state.
 */
const TAU = Math.PI * 2;

export const BACKEND_DISPLAY_V1 = Object.freeze([
  Object.freeze({ id: 'WORKSPACE_BACKEND_DISPLAY#docs', label: 'Docs platform' }),
  Object.freeze({ id: 'WORKSPACE_BACKEND_DISPLAY#rules', label: 'Rules platform' }),
  Object.freeze({ id: 'WORKSPACE_BACKEND_DISPLAY#connect', label: 'Connect face' }),
]);

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveBackendDisplayPlacements({
  workspaceRadius = 1,
  ringScale = 1,
  catalog = [],
  ringRadius = null,
  angleOffset = 0.35,
  y = 1.05,
} = {}) {
  const r = Math.max(0, ringRadius == null ? finite(workspaceRadius) * Math.max(0, finite(ringScale, 1)) : finite(ringRadius, 0));
  const count = Math.max(0, Array.isArray(catalog) ? catalog.length : 0);
  return Array.from({ length: count }, (_, index) => {
    const angle = -Math.PI / 2 + (index * TAU / Math.max(count, 1)) + finite(angleOffset, 0);
    return Object.freeze({
      index,
      id: catalog[index]?.id ?? null,
      x: Math.cos(angle) * r,
      y: finite(y, 0),
      z: Math.sin(angle) * r,
      angle,
      radius: r,
    });
  });
}

export function drawBackendDisplayRing({
  profile,
  seatCount,
  ringScale,
  catalog,
  ringRadius = null,
  articulationAmount = 1,
  signalAmount = 0,
  ringFocus,
  reducedMotion,
  draw,
  CUBE,
  CYL,
  TORUS,
  SPH,
  T,
  S,
  RY,
  mul,
  M,
}, t = 0) {
  const p = profile(seatCount);
  const articulation = Math.max(0, Math.min(1, finite(articulationAmount, 1)));
  const signal = Math.max(0, Math.min(1, finite(signalAmount, 0)));
  const deploy = 0.68 + 0.32 * articulation;
  const placements = deriveBackendDisplayPlacements({ workspaceRadius: p.workspace, ringScale, ringRadius, catalog });
  for (const placement of placements) {
    const { index, x, y, z, angle, radius } = placement;
    const hinge = reducedMotion ? 0 : (0.018 + 0.028 * articulation) * Math.sin(finite(t) * 0.9 + index * 0.7);
    const focused = ringFocus?.ring === 'r1' && ringFocus.index === index;
    const faceLift = 0.02 + 0.13 * articulation + 0.05 * signal + (focused ? 0.05 : 0);
    const pulse = reducedMotion ? 0 : 0.5 + 0.5 * Math.sin(finite(t) * 1.4 + index);
    const faceScale = focused ? 1.12 : 1;
    const nodeScale = focused ? 1.2 : 1;
    const radial = [Math.cos(angle), 0, Math.sin(angle)];
    const mountX = radial[0] * (radius - 0.34), mountZ = radial[2] * (radius - 0.34);
    draw(CYL, mul(T(mountX, y - 0.08, mountZ), S(0.28 * (focused ? 1.08 : 1), 0.12, 0.28 * (focused ? 1.08 : 1))), M.metal, { rough: 0.42, spec: [0.84, 0.86, 0.82], emit: focused ? 0.04 : 0 });
    draw(CUBE, mul(mul(T(x, y - 0.01 - hinge, z), RY(angle + hinge)), S(0.72 * deploy, 0.16 * deploy, 0.26 * deploy)), M.metal2, { rough: 0.38, spec: [0.86, 0.88, 0.84], alpha: 0.94 });
    draw(CUBE, mul(mul(T(x, y + faceLift, z), RY(angle + Math.PI / 2 + hinge)), S(0.55 * faceScale * deploy, 0.12 * deploy, 0.38 * faceScale * deploy)), M.glass, {
      rough: 0.28, spec: [0.9, 0.92, 0.9], emit: focused ? 0.14 : 0.04 + 0.03 * pulse + 0.08 * signal, alpha: 0.52 + 0.32 * articulation,
    });
    draw(TORUS, mul(T(x, y + 0.08, z), S(0.22 * nodeScale, 1, 0.22 * nodeScale)), focused ? M.energy : M.trace, {
      rough: 0.35, emit: focused ? 0.18 : 0.06 + 0.10 * signal, alpha: 0.42 + 0.36 * articulation,
    });
    for (let segment = 1; segment <= 3; segment += 1) {
      const q = segment / 6;
      const jitter = reducedMotion ? 0 : 0.02 * Math.sin(finite(t) * 2.2 + segment + index);
      const tx = x * (1 - q) + jitter;
      const ty = y * (1 - q * 0.35) + 0.7 * q;
      const tz = z * (1 - q);
      const k = 0.065 * (1 - q * 0.35);
      draw(SPH, mul(T(tx, ty, tz), S(k, k, k)), M.energy, {
        rough: 0.2, emit: 0.12 + 0.08 * pulse * (1 - q), alpha: 0.35 + 0.25 * (1 - q),
      });
    }
  }
}
