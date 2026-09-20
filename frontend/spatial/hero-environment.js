const TAU = Math.PI * 2;

export const DEEP_SPACE_ENVIRONMENT_MODE = 'machine';
export const DEEP_SPACE_ENVIRONMENT_SEED = 396;

export const DEEP_SPACE_NEBULA_ANCHORS = Object.freeze([
  Object.freeze({ position: [-15.5, 8.0, -24.0], scale: [12.0, 4.8, 3.0], alpha: 0.075 }),
  Object.freeze({ position: [17.0, -1.5, -26.5], scale: [10.5, 5.6, 3.4], alpha: 0.065 }),
  Object.freeze({ position: [-21.0, -3.0, 18.0], scale: [9.0, 4.0, 2.8], alpha: 0.05 }),
  Object.freeze({ position: [20.0, 9.5, 15.0], scale: [8.0, 3.8, 2.6], alpha: 0.045 }),
]);

function mulberry32(seed) {
  let state = seed >>> 0;
  return () => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createDeepSpaceField({
  seed = DEEP_SPACE_ENVIRONMENT_SEED,
  layers = [
    { radius: 30, count: 108, minSize: 0.034, maxSize: 0.065, alpha: 0.66 },
    { radius: 24, count: 72, minSize: 0.022, maxSize: 0.046, alpha: 0.42 },
    { radius: 19, count: 44, minSize: 0.014, maxSize: 0.032, alpha: 0.26 },
  ],
} = {}) {
  const random = mulberry32(seed);
  return layers.flatMap((layer, layerIndex) => Array.from({ length: layer.count }, (_, index) => {
    const y = (random() * 2) - 1;
    const angle = random() * TAU;
    const ring = Math.sqrt(Math.max(0, 1 - (y * y)));
    const radius = Number(layer.radius);
    const position = [
      radius * ring * Math.cos(angle),
      radius * y,
      radius * ring * Math.sin(angle),
    ];
    const size = layer.minSize + (random() * (layer.maxSize - layer.minSize));
    const variance = 0.82 + random() * 0.18;
    return Object.freeze({
      id: 'DEEP-STAR-' + (layerIndex + 1) + '-' + (index + 1),
      layer: layerIndex,
      position: Object.freeze(position),
      size,
      alpha: layer.alpha * variance,
    });
  }));
}

export function isMachineWorldLayer(shell) {
  return shell?.dataset?.heroLayer === DEEP_SPACE_ENVIRONMENT_MODE;
}

export function deriveDeepSpaceStagingRadius({ workspaceRadius, seatRadius, seatFootprintRadius, clearance = 0.1 }) {
  const workspace = Number(workspaceRadius) || 0;
  const seat = Number(seatRadius) || 0;
  const footprint = Number(seatFootprintRadius) || 0;
  return Math.max(workspace, seat + footprint + Number(clearance));
}
