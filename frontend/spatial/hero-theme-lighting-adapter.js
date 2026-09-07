/* TEAM-EXPERIENCE-029 — pure theme → spatial presentation adapter.
 * Canonical semantic source: frontend/spatial/theme-root.css.
 * This module maps already-resolved semantic values into bounded WebGL parameters.
 * It owns no theme state and has no runtime/business side effects.
 */

const clamp = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

const MODE_PROFILE = Object.freeze({
  light: Object.freeze({
    fill: 0.72, key: 0.86, grazing: 0.62, contribution: 0.54,
    roughness: 0.48, reflectance: 0.72, shadow: 0.56, emissive: 0.08,
    direction: Object.freeze([-0.52, 0.82, 0.28]),
  }),
  dark: Object.freeze({
    fill: 0.34, key: 0.48, grazing: 0.44, contribution: 0.38,
    roughness: 0.62, reflectance: 0.54, shadow: 0.72, emissive: 0.16,
    direction: Object.freeze([-0.58, 0.72, 0.36]),
  }),
});

const normalizeVector = (vector) => {
  const x = Number(vector?.[0]) || 0;
  const y = Number(vector?.[1]) || 0;
  const z = Number(vector?.[2]) || 0;
  const length = Math.hypot(x, y, z) || 1;
  return Object.freeze([x / length, y / length, z / length]);
};

/**
 * Pure, deterministic mapping from canonical semantic theme values to 3D presentation parameters.
 * @param {object} semantic
 * @param {'light'|'dark'} [semantic.themeMode]
 * @param {'user'|'system'|'default'} [semantic.themeSource]
 * @param {number} [semantic.atmosphere]
 * @param {number} [semantic.surface]
 * @param {number} [semantic.focus]
 * @param {number} [semantic.signal]
 * @param {number} [semantic.status]
 * @param {boolean} [semantic.reducedMotion]
 */
export function mapHeroThemeLighting(semantic = {}) {
  const profile = MODE_PROFILE[semantic.themeMode === 'dark' ? 'dark' : 'light'];
  const atmosphere = clamp(semantic.atmosphere ?? 0.5, 0, 1);
  const surface = clamp(semantic.surface ?? 0.5, 0, 1);
  const focus = clamp(semantic.focus ?? 0, 0, 1);
  const signal = clamp(semantic.signal ?? 0, 0, 1);
  const status = clamp(semantic.status ?? 0, 0, 1);
  const bounded = (value) => clamp(value, 0, 1);
  const reducedMotion = Boolean(semantic.reducedMotion);

  return Object.freeze({
    themeMode: semantic.themeMode === 'dark' ? 'dark' : 'light',
    themeSource: String(semantic.themeSource || 'default'),
    environmentalFillIntensity: bounded(profile.fill * (0.72 + atmosphere * 0.28)),
    keyLight: Object.freeze({
      intensity: bounded(profile.key * (0.82 + surface * 0.18)),
      direction: normalizeVector(profile.direction),
    }),
    grazingRimStrength: bounded(profile.grazing + focus * 0.18),
    contributionLightBaseIntensity: bounded(profile.contribution + signal * 0.28),
    roughness: bounded(profile.roughness - surface * 0.12),
    reflectance: bounded(profile.reflectance + focus * 0.16),
    shadowSeparationStrength: bounded(profile.shadow + status * 0.12),
    emissiveCeilingFloor: bounded(profile.emissive + signal * 0.12),
    reducedMotionChoreography: !reducedMotion,
  });
}

export const HERO_THEME_LIGHTING_LIMITS = Object.freeze({
  intensity: Object.freeze([0, 1]),
  roughness: Object.freeze([0, 1]),
  reflectance: Object.freeze([0, 1]),
  shadowSeparation: Object.freeze([0, 1]),
  emissive: Object.freeze([0, 1]),
});
