/**
 * TEAM-EXPERIENCE-029 / Issue #88
 * Authored-mesh material families for light-skeuomorphic Hero.
 * Pure presentation mapping — no backend, no provider calls.
 * Consumes mapHeroThemeLighting-shaped bounds when provided.
 *
 * Hierarchy (light mode):
 *   workspaceRing  → low roughness, high specular (machined metal)
 *   seatShell      → mid roughness (instrument body)
 *   seatShellInset → higher roughness, darker (depth / contact)
 */

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, Number(v) || 0));

/**
 * Signature workspace ring — machined metal, low roughness, high specular.
 * Grazing response is encoded as restrained emit, not bloom.
 * @param {{ roughness?: number, reflectance?: number, emissiveCeilingFloor?: number, grazingRimStrength?: number, themeMode?: string }} [L]
 */
export function authoredRingMaterial(L = {}) {
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const rough = clamp(0.14 + (L.roughness ?? 0.48) * 0.1);
  const refl = clamp(0.9 + (L.reflectance ?? 0.72) * 0.08);
  const grazing = clamp(L.grazingRimStrength ?? 0.62);
  const color =
    mode === 'dark' ? [0.4, 0.44, 0.46] : [0.76, 0.77, 0.73];
  const spec =
    mode === 'dark'
      ? [0.58, 0.61, 0.59]
      : [0.98 * refl, 0.98 * refl, 0.94 * refl];
  return Object.freeze({
    role: 'workspaceRing',
    color: Object.freeze(color),
    rough,
    spec: Object.freeze(spec),
    // bevel / grazing cue — restrained, not decorative bloom
    emit: clamp((L.emissiveCeilingFloor ?? 0.08) * 0.12 + grazing * 0.03),
  });
}

/**
 * Seat outer shell — soft instrument body, mid roughness.
 * @param {{ roughness?: number, reflectance?: number, grazingRimStrength?: number, themeMode?: string }} [L]
 */
export function authoredSeatShellMaterial(L = {}) {
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const rough = clamp(0.4 + (L.roughness ?? 0.48) * 0.22);
  const refl = clamp(0.68 + (L.reflectance ?? 0.72) * 0.18);
  const grazing = clamp(L.grazingRimStrength ?? 0.5);
  const color =
    mode === 'dark' ? [0.2, 0.22, 0.21] : [0.9, 0.89, 0.85];
  const spec =
    mode === 'dark'
      ? [0.38, 0.4, 0.38]
      : [0.84 * refl, 0.83 * refl, 0.79 * refl];
  return Object.freeze({
    role: 'seatShell',
    color: Object.freeze(color),
    rough,
    spec: Object.freeze(spec),
    emit: clamp(grazing * 0.035),
  });
}

/**
 * Darker inset under shell — depth / contact separation (not a second authority).
 * @param {{ shadowSeparationStrength?: number, themeMode?: string }} [L]
 */
export function authoredSeatInsetMaterial(L = {}) {
  const shadow = clamp(L.shadowSeparationStrength ?? 0.56);
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const darken = 0.04 + shadow * 0.06;
  const color =
    mode === 'dark'
      ? [0.06, 0.07, 0.07]
      : [clamp(0.12 - darken), clamp(0.13 - darken), clamp(0.12 - darken)];
  return Object.freeze({
    role: 'seatShellInset',
    color: Object.freeze(color),
    rough: clamp(0.62 + shadow * 0.14),
    spec: Object.freeze([0.22, 0.24, 0.22]),
    emit: 0,
  });
}

/**
 * Static hierarchy check helper for tests and audits.
 * @param {ReturnType<typeof authoredRingMaterial>} ring
 * @param {ReturnType<typeof authoredSeatShellMaterial>} shell
 * @param {ReturnType<typeof authoredSeatInsetMaterial>} inset
 */
export function assertMaterialDepthHierarchy(ring, shell, inset) {
  return (
    ring.role === 'workspaceRing' &&
    shell.role === 'seatShell' &&
    inset.role === 'seatShellInset' &&
    ring.rough < shell.rough &&
    shell.rough < inset.rough &&
    inset.color[0] <= shell.color[0] &&
    inset.emit === 0
  );
}

export const HERO_AUTHORED_MATERIAL_ROLES = Object.freeze([
  'workspaceRing',
  'seatShell',
  'seatShellInset',
]);
