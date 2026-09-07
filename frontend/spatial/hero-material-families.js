/* TEAM-EXPERIENCE-029 Issue #88 — manufactured material families.
 * Consumes already-mapped theme-lighting adapter outputs.
 * Owns no theme root, no domain state, no scheduler, no Firestore.
 */

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

const FAMILY = Object.freeze({
  workspaceRing: Object.freeze({
    roughnessBias: -0.18,
    reflectanceBias: 0.16,
    grazingBias: 0.10,
    shadowBias: -0.08,
    insetSeparation: 0.22,
    specFloor: 0.78,
  }),
  seatShell: Object.freeze({
    roughnessBias: 0.08,
    reflectanceBias: -0.06,
    grazingBias: 0.04,
    shadowBias: 0.10,
    insetSeparation: 0.14,
    specFloor: 0.62,
  }),
});

function mixSpec(reflectance, floor) {
  const r = clamp01(reflectance);
  const f = clamp01(floor);
  const v = f + r * (1 - f) * 0.22;
  return Object.freeze([v, v * 0.995, v * 0.97]);
}

/**
 * @param {'workspaceRing'|'seatShell'} kind
 * @param {{ roughness?: number, reflectance?: number, grazingRimStrength?: number, shadowSeparationStrength?: number }} lighting
 */
export function mapHeroMaterialFamily(kind, lighting = {}) {
  const family = FAMILY[kind] || FAMILY.seatShell;
  const roughness = clamp01((lighting.roughness ?? 0.5) + family.roughnessBias);
  const reflectance = clamp01((lighting.reflectance ?? 0.5) + family.reflectanceBias);
  const grazing = clamp01((lighting.grazingRimStrength ?? 0.5) + family.grazingBias);
  const shadow = clamp01((lighting.shadowSeparationStrength ?? 0.5) + family.shadowBias);
  return Object.freeze({
    kind: FAMILY[kind] ? kind : 'seatShell',
    roughness,
    reflectance,
    grazing,
    shadow,
    insetSeparation: family.insetSeparation,
    spec: mixSpec(reflectance, family.specFloor),
  });
}

export const HERO_MATERIAL_FAMILY_KINDS = Object.freeze(['workspaceRing', 'seatShell']);
