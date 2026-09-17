import { createMachineTransition, makeMachinePart } from './machine-hero-scene.js';

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveMachinePartFromPayload({
  id, semanticId, kind = 'division', center = { x: 0, y: 0.5, z: 0 }, port = null,
  labels = [], controls = 0, density = 0, active = false,
} = {}) {
  const normalizedLabels = Array.isArray(labels) ? [...labels] : [];
  const controlCount = Math.max(0, finite(controls));
  const payloadDensity = Math.max(0, finite(density));
  const width = 1.1 + normalizedLabels.length * 0.16 + controlCount * 0.10 + payloadDensity * 0.08;
  const height = 0.72 + Math.min(0.9, normalizedLabels.length * 0.05 + controlCount * 0.04 + payloadDensity * 0.03);
  const depth = 0.95 + Math.min(0.85, payloadDensity * 0.07);
  return makeMachinePart({
    id,
    semanticId,
    kind,
    center,
    dimensions: { x: width, y: height, z: depth },
    port,
    active,
    payload: { labels: normalizedLabels, controls: controlCount, density: payloadDensity },
  });
}

export function deriveMachinePartsFromPayload(payload = {}) {
  return Object.freeze([
    deriveMachinePartFromPayload(payload.source || {}),
    deriveMachinePartFromPayload(payload.target || {}),
  ]);
}

export function createMachineTransitionFromPayload(payload = {}) {
  const parts = deriveMachinePartsFromPayload(payload);
  const [source, target] = parts;
  return createMachineTransition({
    seatIndex: finite(payload.seatIndex),
    source,
    target,
    expansion: payload.expansion || {},
    wiring: payload.wiring || null,
    clearance: Math.max(0, finite(payload.clearance, 0.16)),
  });
}
