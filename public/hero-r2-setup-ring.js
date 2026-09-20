/**
 * 029 R2 setup/config mechanical ring renderer.
 * Presentation only. The canonical Hero supplies the authoritative ring scale.
 */
const TAU = Math.PI * 2;
const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

const DEFAULT_ITEMS = Object.freeze([
  Object.freeze({ id: 'WORKSPACE_SETUP_ENGINE#core', label: 'Setup engine', kind: 'engine' }),
  Object.freeze({ id: 'WORKSPACE_AUTH_MECHANISM#login', label: 'Login mechanism', kind: 'auth' }),
  Object.freeze({ id: 'WORKSPACE_AUTH_MECHANISM#register', label: 'Register mechanism', kind: 'auth' }),
  Object.freeze({ id: 'WORKSPACE_CONFIG_BRANCH#primary', label: 'Config branch', kind: 'branch' }),
]);

export function resolveSetupConfigItems(items = DEFAULT_ITEMS) {
  return Array.isArray(items) && items.length ? items : DEFAULT_ITEMS;
}

export function deriveSetupConfigPlacements({
  workspaceRadius = 1,
  ringScale = 1,
  items = DEFAULT_ITEMS,
  angleOffset = 0.08,
  y = 0.95,
} = {}) {
  const resolved = resolveSetupConfigItems(items);
  const radius = Math.max(0, finite(workspaceRadius) * Math.max(0, finite(ringScale, 1)));
  return resolved.map((item, index) => {
    const angle = -Math.PI / 2 + (index * TAU / Math.max(resolved.length, 1)) + finite(angleOffset, 0);
    return Object.freeze({
      index,
      id: item.id,
      kind: item.kind,
      label: item.label,
      x: Math.cos(angle) * radius,
      y: finite(y, 0),
      z: Math.sin(angle) * radius,
      angle,
      radius,
    });
  });
}

export function drawSetupConfigRing({
  profile,
  seatCount,
  ringScale = 1,
  items = DEFAULT_ITEMS,
  focusedIndex = -1,
  fillAmount = 0,
  reducedMotion = false,
  draw,
  CYL,
  TORUS,
  CUBE,
  T,
  S,
  RY,
  mul,
  M,
}, t = 0) {
  const fill = Math.max(0, Math.min(1, Number(fillAmount) || 0));
  const placements = deriveSetupConfigPlacements({
    workspaceRadius: profile(seatCount).workspace,
    ringScale,
    items,
  });
  for (const placement of placements) {
    const { index, x, y, z, angle, kind } = placement;
    const focused = Number(focusedIndex) === index;
    const spin = reducedMotion ? 0 : finite(t) * 0.35 + index;
    const gear = kind === 'engine' || kind === 'auth';
    const fullArea = kind === 'auth' || kind === 'config' || kind === 'branch';
    const deploy = focused && fullArea ? 1 + 0.35 * fill : 1;
    const scale = (gear ? 0.42 : 0.36) * deploy;
    draw(CYL, mul(T(x, y, z), S(scale * 1.1, 0.14, scale * 1.1)), M.metal, {
      rough: 0.4, spec: [0.82, 0.84, 0.8], emit: focused ? 0.12 : 0.02,
    });
    draw(TORUS, mul(mul(T(x, y + 0.09, z), RY(spin)), S(scale * (focused ? 1.15 : 1), 1, scale * (focused ? 1.15 : 1))), kind === 'auth' || focused ? M.energy : M.metal2, {
      rough: 0.28, emit: focused ? 0.2 : (kind === 'auth' ? 0.1 : 0.03), alpha: 0.85,
    });
    draw(CUBE, mul(mul(T(x, y + 0.16, z), RY(angle)), S(0.22, 0.06, 0.14)), M.glass, {
      rough: 0.25, emit: 0.05, alpha: 0.7,
    });
  }
}
