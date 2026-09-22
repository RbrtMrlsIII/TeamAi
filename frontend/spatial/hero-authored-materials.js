/**
 * TEAM-EXPERIENCE-029 / Issue #88
 * Authored-mesh material families for light-skeuomorphic Hero.
 * Pure presentation mapping — no backend, no provider calls.
 * Consumes mapHeroThemeLighting output bounds when provided.
 */

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, Number(v) || 0));

/**
 * Signature workspace ring — machined metal, low roughness, high specular.
 * @param {{ roughness?: number, reflectance?: number, emissiveCeilingFloor?: number, themeMode?: string }} [L]
 */
export function authoredRingMaterial(L = {}) {
  const rough = clamp(0.18 + (L.roughness ?? 0.48) * 0.12);
  const refl = clamp(0.88 + (L.reflectance ?? 0.72) * 0.1);
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const color =
    mode === 'dark' ? [0.42, 0.46, 0.48] : [0.74, 0.75, 0.71];
  const spec =
    mode === 'dark'
      ? [0.55, 0.58, 0.56]
      : [0.97 * refl, 0.97 * refl, 0.93 * refl];
  return Object.freeze({
    role: 'workspaceRing',
    color: Object.freeze(color),
    rough,
    spec: Object.freeze(spec),
    emit: clamp((L.emissiveCeilingFloor ?? 0.08) * 0.15),
  });
}

/**
 * Seat outer shell — soft instrument body, mid roughness.
 * @param {{ roughness?: number, reflectance?: number, grazingRimStrength?: number, themeMode?: string }} [L]
 */
export function authoredSeatShellMaterial(L = {}) {
  const rough = clamp(0.42 + (L.roughness ?? 0.48) * 0.2);
  const refl = clamp(0.7 + (L.reflectance ?? 0.72) * 0.18);
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const color =
    mode === 'dark' ? [0.22, 0.24, 0.23] : [0.89, 0.88, 0.84];
  const spec =
    mode === 'dark'
      ? [0.4, 0.42, 0.4]
      : [0.86 * refl, 0.85 * refl, 0.81 * refl];
  return Object.freeze({
    role: 'seatShell',
    color: Object.freeze(color),
    rough,
    spec: Object.freeze(spec),
    emit: clamp((L.grazingRimStrength ?? 0.5) * 0.04),
  });
}

/**
 * Darker inset under shell — depth / contact separation (not a second authority).
 * @param {{ shadowSeparationStrength?: number, themeMode?: string }} [L]
 */
export function authoredSeatInsetMaterial(L = {}) {
  const shadow = clamp(L.shadowSeparationStrength ?? 0.56);
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const color =
    mode === 'dark'
      ? [0.08, 0.09, 0.09]
      : [0.13 - shadow * 0.02, 0.15 - shadow * 0.02, 0.14 - shadow * 0.02];
  return Object.freeze({
    role: 'seatShellInset',
    color: Object.freeze(color.map((c) => clamp(c))),
    rough: clamp(0.58 + shadow * 0.12),
    spec: Object.freeze([0.28, 0.3, 0.28]),
    emit: 0,
  });
}

export const HERO_AUTHORED_MATERIAL_ROLES = Object.freeze([
  'workspaceRing',
  'seatShell',
  'seatShellInset',
]);
