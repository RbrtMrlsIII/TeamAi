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
    mode === 'dark' ? [0.10, 0.23, 0.33] : [0.70, 0.80, 0.90];
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
    mode === 'dark' ? [0.17, 0.38, 0.56] : [0.86, 0.93, 0.98];
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
      ? [0.02, 0.05, 0.08]
      : [0.05, 0.09, 0.14];
  return Object.freeze({
    role: 'seatShellInset',
    color: Object.freeze(color.map((c) => clamp(c))),
    rough: clamp(0.58 + shadow * 0.12),
    spec: Object.freeze([0.28, 0.3, 0.28]),
    emit: 0,
  });
}


const mixColor = (a, b, amount) => Object.freeze(a.map((value, index) =>
  clamp(value + (b[index] - value) * amount)
));

const authoredPresentationMaterial = (role, color, rough, spec, emit) => Object.freeze({
  role,
  color: Object.freeze(color),
  rough: clamp(rough),
  spec: Object.freeze(spec.map((value) => clamp(value))),
  emit: clamp(emit),
});

/**
 * Complete renderer-facing authored material family.
 * Theme meaning enters only through mapHeroThemeLighting output.
 */
export function authoredHeroMaterialSet(L = {}) {
  const ring = authoredRingMaterial(L);
  const shell = authoredSeatShellMaterial(L);
  const inset = authoredSeatInsetMaterial(L);
  const mode = L.themeMode === 'dark' ? 'dark' : 'light';
  const signalFloor = clamp(L.emissiveCeilingFloor ?? 0.08);
  const shadow = clamp(L.shadowSeparationStrength ?? 0.56);

  const energyColor = mode === 'dark'
    ? [0.02, 0.80, 1.00]
    : [0.08, 0.64, 1.00];
  const traceColor = mode === 'dark'
    ? [0.08, 0.48, 0.68]
    : [0.16, 0.54, 0.76];

  const accentColor = mode === 'dark' ? [1.00, 0.34, 0.06] : [1.00, 0.48, 0.10];

  const glassColor = mixColor(
    shell.color,
    energyColor,
    mode === 'dark' ? 0.30 : 0.20,
  );
  const secondaryColor = mixColor(ring.color, inset.color, 0.34);

  return Object.freeze({
    metal: ring,
    metal2: authoredPresentationMaterial(
      'secondaryStructure',
      secondaryColor,
      ring.rough + 0.16,
      mixColor(ring.spec, inset.spec, 0.34),
      Math.min(ring.emit + signalFloor * 0.02, 1),
    ),
    glass: authoredPresentationMaterial(
      'glassSurface',
      glassColor,
      shell.rough * 0.72,
      mixColor(shell.spec, ring.spec, 0.45),
      Math.max(signalFloor * 0.82, 0.07),
    ),
    energy: authoredPresentationMaterial(
      'energySignal',
      energyColor,
      0.22 + ring.rough * 0.08,
      mode === 'dark' ? [0.92, 0.98, 1.00] : [0.78, 0.90, 1.00],
      Math.max(signalFloor * 1.15, 0.18),
    ),
    trace: authoredPresentationMaterial(
      'signalTrace',
      traceColor,
      0.24 + shadow * 0.06,
      mode === 'dark' ? [0.42, 0.68, 0.84] : [0.48, 0.74, 0.90],
      Math.max(signalFloor * 0.42, 0.04),
    ),
    accent: authoredPresentationMaterial(
      'statusAccent',
      mode === 'dark' ? [1.00, 0.34, 0.06] : [1.00, 0.48, 0.10],
      0.30 + shadow * 0.06,
      mode === 'dark' ? [1.00, 0.52, 0.18] : [1.00, 0.66, 0.24],
      Math.max(signalFloor * 0.58, 0.12),
    ),
    divisionConnection: authoredPresentationMaterial(
      'divisionConnection',
      energyColor,
      0.24,
      mode === 'dark' ? [0.92, 0.98, 1.00] : [0.78, 0.90, 1.00],
      Math.max(signalFloor * 0.92, 0.14),
    ),
    divisionBehavior: authoredPresentationMaterial(
      'divisionBehavior',
      mixColor(energyColor, traceColor, 0.42),
      0.32,
      mixColor([0.70, 0.84, 1.00], [0.48, 0.74, 0.90], 0.42),
      Math.max(signalFloor * 0.48, 0.06),
    ),
    divisionToolkit: authoredPresentationMaterial(
      'divisionToolkit',
      mixColor(accentColorPlaceholder, ring.color, 0.28),
      0.34,
      mixColor([1.00, 0.66, 0.24], ring.spec, 0.32),
      Math.max(signalFloor * 0.34, 0.04),
    ),
    divisionCapabilities: authoredPresentationMaterial(
      'divisionCapabilities',
      mixColor(energyColor, glassColor, 0.36),
      0.26,
      mixColor([0.78, 0.90, 1.00], shell.spec, 0.40),
      Math.max(signalFloor * 0.60, 0.08),
    ),
    divisionAuthorization: authoredPresentationMaterial(
      'divisionAuthorization',
      mode === 'dark'
        ? [0.78, 0.34, 0.22]
        : [0.92, 0.42, 0.18],
      0.38,
      mode === 'dark' ? [1.00, 0.56, 0.34] : [1.00, 0.64, 0.36],
      Math.max(signalFloor * 0.34, 0.04),
    ),
    divisionScope: authoredPresentationMaterial(
      'divisionScope',
      mixColor(energyColor, ring.color, 0.48),
      0.30,
      mixColor([0.78, 0.90, 1.00], ring.spec, 0.48),
      Math.max(signalFloor * 0.50, 0.06),
    ),
    divisionEvidence: authoredPresentationMaterial(
      'divisionEvidence',
      mixColor(traceColor, mode === 'dark' ? [0.18, 0.72, 0.48] : [0.18, 0.62, 0.42], 0.34),
      0.30,
      mode === 'dark' ? [0.44, 0.88, 0.66] : [0.46, 0.78, 0.62],
      Math.max(signalFloor * 0.34, 0.04),
    ),
    workspaceRing: ring,
    seatShell: shell,
    seatShellInset: inset,
  });
}

export const HERO_AUTHORED_MATERIAL_ROLES = Object.freeze([
  'workspaceRing',
  'seatShell',
  'seatShellInset',
]);

export const HERO_PRESENTATION_MATERIAL_ROLES = Object.freeze([
  'metal',
  'metal2',
  'glass',
  'energy',
  'trace',
  'accent',
  'divisionConnection',
  'divisionBehavior',
  'divisionToolkit',
  'divisionCapabilities',
  'divisionAuthorization',
  'divisionScope',
  'divisionEvidence',
]);
