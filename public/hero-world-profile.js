const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));

export const MACHINE_WORLD_PROFILE = Object.freeze({
  workspaceFootprint: Object.freeze({ min: 4.35, max: 5.95 }),
  seatShellRadius: Object.freeze({ min: 4.05, max: 4.55 }),
  outerHousingRadius: Object.freeze({ min: 6.45, max: 7.15 }),
  cameraDistance: Object.freeze({ min: 9.6, max: 12.2 }),
  seatScale: Object.freeze({ min: 1, max: 0.78 }),
});

// Reserved radial envelope for the four outer facility housings. This is a structural
// world-profile constraint so S5 can enforce clearance without redesigning S4 geometry.
export const MACHINE_OUTER_HOUSING_SAFETY_BUFFER = 1.7;

export function seatPopulationDensity(seatCount) {
  return clamp01((Math.max(1, Number(seatCount) || 1) - 1) / 9);
}

export function deriveMachineWorldProfile(seatCount) {
  const density = seatPopulationDensity(seatCount);
  const outerHousingRadius = lerp(
    MACHINE_WORLD_PROFILE.outerHousingRadius.min,
    MACHINE_WORLD_PROFILE.outerHousingRadius.max,
    density,
  ) + MACHINE_OUTER_HOUSING_SAFETY_BUFFER;
  return Object.freeze({
    density,
    workspaceFootprint: lerp(
      MACHINE_WORLD_PROFILE.workspaceFootprint.min,
      MACHINE_WORLD_PROFILE.workspaceFootprint.max,
      density,
    ),
    seatShellRadius: lerp(
      MACHINE_WORLD_PROFILE.seatShellRadius.min,
      MACHINE_WORLD_PROFILE.seatShellRadius.max,
      density,
    ),
    outerHousingRadius,
    cameraDistance: lerp(
      MACHINE_WORLD_PROFILE.cameraDistance.min,
      MACHINE_WORLD_PROFILE.cameraDistance.max,
      density,
    ),
    seatScale: lerp(
      MACHINE_WORLD_PROFILE.seatScale.min,
      MACHINE_WORLD_PROFILE.seatScale.max,
      density,
    ),
  });
}

export function deriveExpandedMachineCoreRadii(seatCount, expansionAmount = 0) {
  const density = seatPopulationDensity(seatCount);
  const amount = clamp01(expansionAmount);
  const baseOuterHousingRadius = lerp(
    MACHINE_WORLD_PROFILE.outerHousingRadius.min,
    MACHINE_WORLD_PROFILE.outerHousingRadius.max,
    density,
  ) + MACHINE_OUTER_HOUSING_SAFETY_BUFFER;
  const expandedOuterHousingRadius = baseOuterHousingRadius + 0.7;
  return Object.freeze({
    density,
    expansionAmount: amount,
    seatShellRadius: lerp(
      lerp(MACHINE_WORLD_PROFILE.seatShellRadius.min, MACHINE_WORLD_PROFILE.seatShellRadius.max, density),
      lerp(MACHINE_WORLD_PROFILE.seatShellRadius.min + 0.5, MACHINE_WORLD_PROFILE.seatShellRadius.max + 0.5, density),
      amount,
    ),
    outerHousingRadius: lerp(
      baseOuterHousingRadius,
      expandedOuterHousingRadius,
      amount,
    ),
  });
}
