/** R2 setup/config ring draw — presentation only (not auth authority). */
import { RING_R2_SCALE } from './hero-hierarchy-runtime.js';
export function drawSetupConfigRing(ctx, t) {
  const fill = Math.max(0, Math.min(1, Number(ctx && ctx.fillAmount) || 0));
  const { profile, seatCount, reducedMotion, draw, CYL, TORUS, CUBE, T, S, RY, mul, M, focusedIndex } = ctx;
  const items = (typeof window !== 'undefined' && window.TeamAiHero && window.TeamAiHero.SETUP_CONFIG_V1)
    ? window.TeamAiHero.SETUP_CONFIG_V1
    : [
        { id: 'WORKSPACE_SETUP_ENGINE#core', label: 'Setup engine', kind: 'engine' },
        { id: 'WORKSPACE_AUTH_MECHANISM#login', label: 'Login mechanism', kind: 'auth' },
        { id: 'WORKSPACE_AUTH_MECHANISM#register', label: 'Register mechanism', kind: 'auth' },
        { id: 'WORKSPACE_CONFIG_BRANCH#primary', label: 'Config branch', kind: 'branch' },
      ];
  const p = profile(seatCount);
  const r = p.workspace * RING_R2_SCALE;
  const n = items.length;
  for (let i = 0; i < n; i++) {
    const item = items[i];
    const a = -Math.PI / 2 + i * (Math.PI * 2 / Math.max(n, 1)) + 0.08;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const y = 0.95;
    const spin = reducedMotion ? 0 : t * 0.35 + i;
    const gear = item.kind === 'engine' || item.kind === 'auth';
    const focused = focusedIndex === i;
    const fullArea = item.kind === 'auth' || item.kind === 'config' || item.kind === 'branch';
    const scale = (gear ? 0.42 : 0.36) * (1 + 0.35 * (focused && fullArea ? fill : 0));
    draw(CYL, mul(T(x, y, z), S(scale * 1.1, 0.14, scale * 1.1)), M.metal, {
      rough: 0.4, spec: [0.82, 0.84, 0.8], emit: focused ? 0.12 : 0.02,
    });
    draw(TORUS, mul(mul(T(x, y + 0.09, z), RY(spin)), S(scale * (focused ? 1.15 : 1), 1, scale * (focused ? 1.15 : 1))), item.kind === 'auth' || focused ? M.energy : M.metal2, {
      rough: 0.28, emit: focused ? 0.2 : (item.kind === 'auth' ? 0.1 : 0.03), alpha: 0.85,
    });
    draw(CUBE, mul(mul(T(x, y + 0.16, z), RY(a)), S(0.22, 0.06, 0.14)), M.glass, {
      rough: 0.25, emit: 0.05, alpha: 0.7,
    });
  }
}
