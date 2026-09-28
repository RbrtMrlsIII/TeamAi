/**
 * Canonical responsive presentation contract for the spatial machine.
 *
 * This module owns viewport/pointer classification only. It must never become
 * an authority for product meaning, authorization, entitlement, or domain
 * state, and it intentionally does not write the theme-root data-density
 * attribute because that value remains user-controlled.
 */
export const MACHINE_RESPONSIVE_TIER = Object.freeze({
  DESKTOP: 'desktop',
  COMPACT: 'compact',
  PHONE: 'phone',
});

export const MACHINE_RESPONSIVE_LIMITS = Object.freeze({
  PHONE_MAX_WIDTH: 599,
  COMPACT_MAX_WIDTH: 899,
  NARROW_ASPECT: 0.8,
  COMPACT_ASPECT: 1.1,
});

export const MACHINE_RESPONSIVE_DENSITY = Object.freeze({
  desktop: Object.freeze({
    mode: 'balanced',
    minProjectedSeatSpacingPx: 56,
    minProjectedFeaturePx: 20,
  }),
  compact: Object.freeze({
    mode: 'compressed',
    minProjectedSeatSpacingPx: 48,
    minProjectedFeaturePx: 18,
  }),
  phone: Object.freeze({
    mode: 'compact',
    minProjectedSeatSpacingPx: 32,
    minProjectedFeaturePx: 14,
    facilityFeatureScale: 1.13,
  }),
});

export function resolveMachineResponsiveDensity(tier) {
  return MACHINE_RESPONSIVE_DENSITY[tier] || MACHINE_RESPONSIVE_DENSITY.desktop;
}

const normalizeFinite = (value, fallback = 1) => {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : fallback;
};

function mediaMatches(query) {
  try {
    return typeof globalThis.matchMedia === 'function' && globalThis.matchMedia(query).matches === true;
  } catch (_) {
    return false;
  }
}

function normalizePointer(value) {
  return value === 'coarse' || value === 'fine' || value === 'unknown' ? value : 'unknown';
}

function normalizeHover(value) {
  return value === 'hover' || value === 'none' || value === 'unknown' ? value : 'unknown';
}

function resolvePointerCapability(pointerType, explicitPointer) {
  if (explicitPointer) return normalizePointer(explicitPointer);
  if (pointerType === 'touch') return 'coarse';
  if (pointerType === 'mouse') return 'fine';
  if (mediaMatches('(pointer: coarse)')) return 'coarse';
  if (mediaMatches('(pointer: fine)')) return 'fine';
  return 'unknown';
}

function resolveHoverCapability(explicitHover) {
  if (explicitHover) return normalizeHover(explicitHover);
  if (mediaMatches('(hover: hover)')) return 'hover';
  if (mediaMatches('(hover: none)')) return 'none';
  return 'unknown';
}

export function getMachineResponsiveViewport() {
  const viewport = globalThis.visualViewport;
  const width = normalizeFinite(viewport?.width || globalThis.innerWidth, 1);
  const height = normalizeFinite(viewport?.height || globalThis.innerHeight, 1);
  return Object.freeze({ width, height });
}

export function resolveMachineResponsive({
  width = 1,
  height = 1,
  pointerType = null,
  pointer = 'unknown',
  hover = 'unknown',
} = {}) {
  const resolvedWidth = normalizeFinite(width);
  const resolvedHeight = normalizeFinite(height);
  const aspect = resolvedWidth / resolvedHeight;
  const tier = resolvedWidth <= MACHINE_RESPONSIVE_LIMITS.PHONE_MAX_WIDTH
    ? MACHINE_RESPONSIVE_TIER.PHONE
    : resolvedWidth <= MACHINE_RESPONSIVE_LIMITS.COMPACT_MAX_WIDTH
      ? MACHINE_RESPONSIVE_TIER.COMPACT
      : MACHINE_RESPONSIVE_TIER.DESKTOP;
  const isNarrowAspect = aspect < MACHINE_RESPONSIVE_LIMITS.NARROW_ASPECT;
  const isCompactAspect = aspect < MACHINE_RESPONSIVE_LIMITS.COMPACT_ASPECT;
  const cameraDistanceMultiplier = isNarrowAspect ? 1.25 : isCompactAspect ? 1.10 : 1;
  const densityPolicy = resolveMachineResponsiveDensity(tier);
  const cameraFov = isNarrowAspect ? 48 : 44;

  return Object.freeze({
    width: resolvedWidth,
    height: resolvedHeight,
    aspect,
    tier,
    orientation: resolvedHeight >= resolvedWidth ? 'portrait' : 'landscape',
    pointer: pointerType ? resolvePointerCapability(pointerType, null) : normalizePointer(pointer),
    hover: normalizeHover(hover),
    isNarrowAspect,
    isCompactAspect,
    cameraDistanceMultiplier,
    cameraFov,
    presentationDensity: densityPolicy.mode,
    facilityFeatureScale: densityPolicy.facilityFeatureScale,
    minProjectedSeatSpacingPx: densityPolicy.minProjectedSeatSpacingPx,
    minProjectedFeaturePx: densityPolicy.minProjectedFeaturePx,
    presentationOnly: true,
  });
}

export function applyMachineResponsiveState(
  root = globalThis.document?.documentElement,
  viewport = getMachineResponsiveViewport(),
) {
  const state = resolveMachineResponsive({
    ...viewport,
    pointer: resolvePointerCapability(),
    hover: resolveHoverCapability(),
  });
  if (root?.setAttribute) {
    root.setAttribute('data-spatial-responsive', state.tier);
    root.setAttribute('data-spatial-pointer', state.pointer);
    root.setAttribute('data-spatial-hover', state.hover);
    root.setAttribute('data-spatial-orientation', state.orientation);
    root.setAttribute('data-spatial-density', state.presentationDensity);
  }
  return state;
}

let currentResponsiveState = null;

export function syncMachineResponsiveState(
  viewport = getMachineResponsiveViewport(),
  root = globalThis.document?.documentElement,
) {
  currentResponsiveState = applyMachineResponsiveState(root, viewport);
  return currentResponsiveState;
}

export function getMachineResponsiveState() {
  return currentResponsiveState ? { ...currentResponsiveState } : null;
}

if (typeof document !== 'undefined') {
  const boot = () => syncMachineResponsiveState();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
  window.addEventListener('resize', boot, { passive: true });
  globalThis.visualViewport?.addEventListener?.('resize', boot, { passive: true });
  globalThis.TeamAiResponsive = Object.freeze({
    getState: getMachineResponsiveState,
    sync: syncMachineResponsiveState,
  });
}
