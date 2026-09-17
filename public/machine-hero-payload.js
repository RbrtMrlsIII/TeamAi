import { createMachineTransition, makeMachinePart } from './machine-hero-scene.js';

const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;

const cloneDivision = (division) => ({
  ...division,
  labels: Array.isArray(division.labels) ? [...division.labels] : [],
});

const cloneEdge = (edge) => ({
  ...edge,
  expansion: { ...(edge.expansion || {}) },
});

export const MACHINE_HERO_RUNTIME_CASES = Object.freeze({
  balanced: Object.freeze({
    label: 'balanced semantic payload',
    seatIndex: 0,
    divisions: Object.freeze([
      { id: 'seat-0-connection', semanticId: 'SEAT_CONNECTION', kind: 'division', center: { x: -3.2, y: 0.55, z: 0 }, port: { x: -2.4, y: 0.7, z: 0 }, labels: ['Connection', 'Provider health'], controls: 2, density: 2 },
      { id: 'seat-0-behavior', semanticId: 'SEAT_BEHAVIOR', kind: 'division', center: { x: 0, y: 0.55, z: 0.1 }, port: { x: 0.7, y: 0.7, z: 0.1 }, labels: ['Behavior', 'Defaults'], controls: 3, density: 3 },
      { id: 'seat-0-toolkit', semanticId: 'SEAT_TOOLKIT', kind: 'division', center: { x: 3.2, y: 0.55, z: 0.35 }, port: { x: 3.9, y: 0.7, z: 0.35 }, labels: ['Toolkit', 'Skills'], controls: 4, density: 5 },
    ]),
    edges: Object.freeze([
      { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION→SEAT_BEHAVIOR', sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_BEHAVIOR', expansion: { sourceAmount: 0, targetAmount: 0 } },
      { id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR→SEAT_TOOLKIT', sourceDivisionId: 'SEAT_BEHAVIOR', targetDivisionId: 'SEAT_TOOLKIT', expansion: { sourceAmount: 0, targetAmount: 0 } },
    ]),
  }),
  dense: Object.freeze({
    label: 'dense semantic payload',
    seatIndex: 0,
    divisions: Object.freeze([
      { id: 'seat-0-connection', semanticId: 'SEAT_CONNECTION', kind: 'division', center: { x: -6, y: 0.55, z: -0.2 }, port: { x: -4.9, y: 0.72, z: -0.2 }, labels: ['Connection', 'Provider health', 'OAuth', 'Latency'], controls: 4, density: 4 },
      { id: 'seat-0-behavior', semanticId: 'SEAT_BEHAVIOR', kind: 'division', center: { x: -2, y: 0.55, z: 0.3 }, port: { x: -1.05, y: 0.72, z: 0.3 }, labels: ['Behavior', 'Defaults', 'Policies'], controls: 5, density: 6 },
      { id: 'seat-0-toolkit', semanticId: 'SEAT_TOOLKIT', kind: 'division', center: { x: 2, y: 0.55, z: 0 }, port: { x: 2.95, y: 0.72, z: 0 }, labels: ['Toolkit', 'Skills', 'Adapters', 'Checks'], controls: 6, density: 8 },
      { id: 'seat-0-capabilities', semanticId: 'SEAT_CAPABILITIES', kind: 'division', center: { x: 6, y: 0.55, z: 0.4 }, port: { x: 6.95, y: 0.72, z: 0.4 }, labels: ['Capabilities', 'Tools', 'Limits'], controls: 7, density: 10 },
    ]),
    edges: Object.freeze([
      { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION→SEAT_BEHAVIOR', sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_BEHAVIOR', expansion: { sourceAmount: 0, targetAmount: 0 } },
      { id: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR→SEAT_TOOLKIT', sourceDivisionId: 'SEAT_BEHAVIOR', targetDivisionId: 'SEAT_TOOLKIT', expansion: { sourceAmount: 0, targetAmount: 0 } },
      { id: 'TREE-HERO-SEAT#0:SEAT_TOOLKIT→SEAT_CAPABILITIES', sourceDivisionId: 'SEAT_TOOLKIT', targetDivisionId: 'SEAT_CAPABILITIES', expansion: { sourceAmount: 0, targetAmount: 0 } },
    ]),
  }),
  sparse: Object.freeze({
    label: 'sparse semantic payload',
    seatIndex: 0,
    divisions: Object.freeze([
      { id: 'seat-0-connection', semanticId: 'SEAT_CONNECTION', kind: 'division', center: { x: -3.4, y: 0.55, z: -0.2 }, port: { x: -2.85, y: 0.7, z: -0.2 }, labels: ['Connection'], controls: 1, density: 0 },
      { id: 'seat-0-toolkit', semanticId: 'SEAT_TOOLKIT', kind: 'division', center: { x: 0, y: 0.55, z: 0.55 }, port: { x: 0.6, y: 0.7, z: 0.55 }, labels: ['Toolkit'], controls: 1, density: 1 },
      { id: 'seat-0-capabilities', semanticId: 'SEAT_CAPABILITIES', kind: 'division', center: { x: 3.5, y: 0.55, z: -0.1 }, port: { x: 4.15, y: 0.7, z: -0.1 }, labels: ['Capabilities'], controls: 2, density: 1 },
    ]),
    edges: Object.freeze([
      { id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION→SEAT_TOOLKIT', sourceDivisionId: 'SEAT_CONNECTION', targetDivisionId: 'SEAT_TOOLKIT', expansion: { sourceAmount: 0, targetAmount: 0 } },
      { id: 'TREE-HERO-SEAT#0:SEAT_TOOLKIT→SEAT_CAPABILITIES', sourceDivisionId: 'SEAT_TOOLKIT', targetDivisionId: 'SEAT_CAPABILITIES', expansion: { sourceAmount: 0, targetAmount: 0 } },
    ]),
  }),
});

export const MACHINE_HERO_RUNTIME_CASE_IDS = Object.freeze(Object.keys(MACHINE_HERO_RUNTIME_CASES));

export function resolveMachineRuntimeCase(caseId = 'balanced') {
  const id = MACHINE_HERO_RUNTIME_CASES[caseId] ? caseId : 'balanced';
  const definition = MACHINE_HERO_RUNTIME_CASES[id];
  return Object.freeze({
    id,
    label: definition.label,
    seatIndex: definition.seatIndex,
    divisions: Object.freeze(definition.divisions.map(cloneDivision)),
    edges: Object.freeze(definition.edges.map(cloneEdge)),
  });
}

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
