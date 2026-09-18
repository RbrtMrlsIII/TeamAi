const TREE_HERO_SEAT = 'TREE-HERO-SEAT';

const SEAT_BRANCHES = Object.freeze([
  Object.freeze({ semanticId: 'SEAT_SHELL', parentId: null, status: 'IMPLEMENTED_PARTIAL', purpose: 'Seat identity/overview and lifecycle presentation', renderedInCore: true }),
  Object.freeze({ semanticId: 'SEAT_CONNECTION', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Provider connection, bind, health, and connection-test presentation', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_BEHAVIOR', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Seat-local behavior, defaults, and constraints', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_TOOLKIT', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Resolved TeamAi/common skill and toolkit presentation', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_CAPABILITIES', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Capability, tool, plugin, MCP, and runtime inventory presentation', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_AUTHORIZATION', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Reason-bearing authorization and approval presentation', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_WORKSPACE_SCOPE', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Workplace, project, repository, path, and workstation scope presentation', renderedInCore: false }),
  Object.freeze({ semanticId: 'SEAT_TASK_EVIDENCE', parentId: 'SEAT_SHELL', status: 'IMPLEMENTED_PARTIAL', purpose: 'Task, result, event, and evidence presentation', renderedInCore: false }),
]);

const BY_ID = new Map(SEAT_BRANCHES.map((definition) => [definition.semanticId, definition]));
const SEAT_SHELL_CHILDREN = Object.freeze(
  SEAT_BRANCHES.filter((definition) => definition.parentId === 'SEAT_SHELL').map((definition) => definition.semanticId),
);

export function getSeatSemanticDefinition(semanticId) {
  return BY_ID.get(semanticId) || null;
}

export function bindSeatSemantic({ seatIndex = 0, semanticId = 'SEAT_SHELL' } = {}) {
  const definition = getSeatSemanticDefinition(semanticId);
  if (!definition) throw new Error(`Unknown TREE-HERO-SEAT semantic id: ${semanticId}`);
  const index = Number.isInteger(Number(seatIndex)) ? Number(seatIndex) : 0;
  return Object.freeze({
    treeId: TREE_HERO_SEAT,
    semanticId: definition.semanticId,
    semanticKey: `${TREE_HERO_SEAT}#${index}:${definition.semanticId}`,
    semanticStatus: definition.status,
    semanticPurpose: definition.purpose,
    renderedInCore: definition.renderedInCore,
    childSemanticIds: definition.semanticId === 'SEAT_SHELL' ? SEAT_SHELL_CHILDREN : Object.freeze([]),
  });
}

export const SEAT_SEMANTIC_REGISTRY = Object.freeze(
  SEAT_BRANCHES.map((definition) => Object.freeze({ ...definition })),
);
