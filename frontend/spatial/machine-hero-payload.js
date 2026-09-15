import { makeMachinePart } from './machine-hero-scene.js';

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function deriveMachinePartFromPayload({
  id,
  semanticId,
  kind = 'division',
  center = { x: 0, y: 0.5, z: 0 },
  port = null,
  labels = [],
  controls = 0,
  density = 0,
  active = false,
} = {}) {
  const labelCount = Array.isArray(labels) ? labels.length : 0;
  const controlCount = Math.max(0, finite(controls));
  const payloadDensity = Math.max(0, finite(density));
  const width = 1.1 + labelCount * 0.16 + controlCount * 0.10 + payloadDensity * 0.08;
  const height = 0.72 + Math.min(0.9, labelCount * 0.05 + controlCount * 0.04 + payloadDensity * 0.03);
  const depth = 0.95 + Math.min(0.85, payloadDensity * 0.07);

  return makeMachinePart({
    id,
    semanticId,
    kind,
    center,
    dimensions: {
      x: width,
      y: height,
      z: depth,
    },
    port,
    active,
  });
}

export function deriveMachinePartsFromPayload(payload = {}) {
  const source = payload.source || {};
  const target = payload.target || {};
  return Object.freeze([
    deriveMachinePartFromPayload(source),
    deriveMachinePartFromPayload(target),
  ]);
}
