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
  const expandedPartMap = new Map(parts.map((part) => [part.semanticId, part]));
  for (const transition of validTransitions) {
    expandedPartMap.set(transition.sourceDivisionId, transition.sourceGeometry);
    expandedPartMap.set(transition.targetDivisionId, transition.targetGeometry);
  }
  const expandedParts = [...expandedPartMap.values()];
  return Object.freeze({
    seatIndex: Number(seatIndex),
    parts: Object.freeze(parts),
    renderedParts: Object.freeze(expandedParts),
    transitions: Object.freeze(validTransitions),
    subject: deriveMachineSubject(expandedParts),
  });
}

export function findMachineGraphPart(graph, semanticId) {
  return graph?.parts?.find((part) => part.semanticId === semanticId) || null;
}
