import { createMachineTransition, makeMachinePart, deriveMachineSubject, deriveMachineWiring } from './machine-hero-scene.js';

export function createMachineGraph({ seatIndex = 0, divisions = [], edges = [] } = {}) {
  const parts = divisions.map((division) => makeMachinePart({ ...division, active: Boolean(division.active) }));
  const bySemanticId = new Map(parts.map((part) => [part.semanticId, part]));
  const transitions = edges.map((edge) => {
    const source = bySemanticId.get(edge.sourceDivisionId);
    const target = bySemanticId.get(edge.targetDivisionId);
    if (!source || !target) return null;
    const wiring = deriveMachineWiring(source, target, { id: edge.id, kind: edge.kind });
    return createMachineTransition({ seatIndex, source, target, expansion: edge.expansion || {}, wiring: edge.wiring || wiring });
  });
  const validTransitions = transitions.filter(Boolean);
  return Object.freeze({
    seatIndex: Number(seatIndex),
    parts: Object.freeze(parts),
    transitions: Object.freeze(validTransitions),
    subject: deriveMachineSubject(parts),
  });
}

export function findMachineGraphPart(graph, semanticId) {
  return graph?.parts?.find((part) => part.semanticId === semanticId) || null;
}
