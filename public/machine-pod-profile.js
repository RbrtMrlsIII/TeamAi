/**
 * TEAM-EXPERIENCE-029 / S3
 * Canonical authored Pod shell profile.
 *
 * Presentation-neutral geometry vocabulary owned by S3 and consumed by
 * renderer adapters. This prevents raw WebGL and Three.js from carrying
 * divergent copies of the same authored silhouette.
 */
export const MACHINE_POD_SHELL_PROFILE = 'authored-seat-pod-shell';

export const MACHINE_POD_SHELL_BEVEL_INSET = 0.82;
export const MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO = 0.58;
export const MACHINE_POD_SHELL_TOP_OPENING_SCALE = 0.68;
export const MACHINE_POD_SHELL_RENDER_GEOMETRY_VERSION = 'S3-OPEN-TOP-V1';

export const MACHINE_POD_SHELL_OUTLINE = Object.freeze([
  Object.freeze([-0.90, 0.00]),
  Object.freeze([-0.78, -0.35]),
  Object.freeze([-0.45, -0.55]),
  Object.freeze([0.00, -0.60]),
  Object.freeze([0.45, -0.55]),
  Object.freeze([0.78, -0.35]),
  Object.freeze([0.90, 0.00]),
  Object.freeze([0.78, 0.35]),
  Object.freeze([0.45, 0.55]),
  Object.freeze([0.00, 0.60]),
  Object.freeze([-0.45, 0.55]),
  Object.freeze([-0.78, 0.35]),
]);

export const MACHINE_POD_SHELL_OUTLINE_BOUNDS = Object.freeze({
  width: 1.80,
  depth: 1.20,
});

export function getMachinePodShellOutline() {
  return Object.freeze(
    MACHINE_POD_SHELL_OUTLINE.map(([x, z]) => Object.freeze([x, z])),
  );
}

const finiteProfileValue = (value, fallback = 0) =>
  Number.isFinite(Number(value)) ? Number(value) : fallback;
const clampProfileValue = (value, min, max) =>
  Math.max(min, Math.min(max, Number(value) || 0));

/**
 * One S3-owned normalized shell mesh consumed by the raw WebGL and Three.js
 * adapters. Coordinates use X/Z [-1, 1] and Y [0, 1]. The top aperture exposes
 * the already-authored inner chamber and payload; side/bottom shell ownership,
 * Pod envelope, ports, and Seat identity remain unchanged.
 */
export function createMachinePodShellVertices({
  outline = MACHINE_POD_SHELL_OUTLINE,
  bevelInset = MACHINE_POD_SHELL_BEVEL_INSET,
  bevelHeightRatio = MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO,
  topOpeningScale = MACHINE_POD_SHELL_TOP_OPENING_SCALE,
} = {}) {
  const points = Array.isArray(outline)
    ? outline.filter((point) =>
      Array.isArray(point)
      && point.length >= 2
      && Number.isFinite(Number(point[0]))
      && Number.isFinite(Number(point[1]))
    ).map((point) => [Number(point[0]), Number(point[1])])
    : [];
  if (points.length < 3) {
    throw new Error('Pod shell geometry requires at least three finite outline points');
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  for (const [x, z] of points) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }
  const width = Math.max(0.001, maxX - minX);
  const depth = Math.max(0.001, maxZ - minZ);
  const centerX = (minX + maxX) * 0.5;
  const centerZ = (minZ + maxZ) * 0.5;
  const inset = clampProfileValue(finiteProfileValue(bevelInset, MACHINE_POD_SHELL_BEVEL_INSET), 0.50, 0.95);
  const opening = Math.min(
    clampProfileValue(finiteProfileValue(topOpeningScale, MACHINE_POD_SHELL_TOP_OPENING_SCALE), 0.50, 0.78),
    Math.max(0.46, inset - 0.04),
  );
  const bevelRatio = clampProfileValue(
    finiteProfileValue(bevelHeightRatio, MACHINE_POD_SHELL_BEVEL_HEIGHT_RATIO),
    0.20,
    0.90,
  );
  const halfY = 0.5;
  const bevelY = halfY * bevelRatio;
  const vertices = [];
  const pushTri = (a, b, c) => vertices.push(...a, ...b, ...c);
  const point = ([x, z], y, scale = 1) => [
    ((x - centerX) * 2 / width) * scale,
    y,
    ((z - centerZ) * 2 / depth) * scale,
  ];

  const topOpening = points.map((value) => point(value, 1, opening));
  const topInner = points.map((value) => point(value, 1, inset));
  const topOuter = points.map((value) => point(value, halfY + bevelY));
  const bottomOuter = points.map((value) => point(value, halfY - bevelY));
  const bottomInner = points.map((value) => point(value, 0, inset));
  const bottomOpening = points.map((value) => point(value, 0, opening));
  const bottomCenter = [0, 0, 0];

  for (let index = 0; index < points.length; index += 1) {
    const next = (index + 1) % points.length;

    // A flat top lip surrounds an intentionally open central viewing aperture.
    pushTri(topInner[index], topOpening[next], topInner[next]);
    pushTri(topInner[index], topOpening[index], topOpening[next]);

    // Two-stage upper bevel, outer wall, and lower return bevel.
    pushTri(topInner[index], topOuter[index], topOuter[next]);
    pushTri(topInner[index], topOuter[next], topInner[next]);
    pushTri(topOuter[index], bottomOuter[index], bottomOuter[next]);
    pushTri(topOuter[index], bottomOuter[next], topOuter[next]);
    pushTri(bottomOuter[index], bottomInner[index], bottomInner[next]);
    pushTri(bottomOuter[index], bottomInner[next], bottomOuter[next]);

    // Interior wall descends from the aperture to the closed shell floor.
    pushTri(topOpening[index], bottomOpening[index], bottomOpening[next]);
    pushTri(topOpening[index], bottomOpening[next], topOpening[next]);
  }

  // The floor remains closed. Only the top is opened to reveal existing S3 parts.
  for (let index = 1; index < points.length - 1; index += 1) {
    pushTri(bottomCenter, bottomInner[index], bottomInner[index + 1]);
  }

  return new Float32Array(vertices);
}
