/**
 * P1 vertical — SEAT_CONNECTION fixture payload, edges, expanded helpers.
 * Presentation only. Issue #278. Not live bind; not electricity complete.
 */
import {
  HIERARCHY_PART,
  HEALTH_STATUS,
  getConnectionBranchAmount,
} from './hero-hierarchy-runtime.js';

export const CONNECTION_PAYLOAD_V1 = Object.freeze({
  branchId: 'SEAT_CONNECTION',
  providerLabel: 'External integration (fixture)',
  bindPresentation: 'unbound',
  testCopy: 'Test connection is presentation-only; use normal UI (C) to configure.',
  healthStatuses: ['unknown', 'loading', 'unavailable'],
  durable: false,
  presentationOnly: true,
});

export const CONNECTION_EDGES_V1 = Object.freeze([
  Object.freeze({
    edgeId: 'edge:SEAT_CONNECTION→SEAT_SHELL',
    fromId: 'SEAT_CONNECTION',
    toId: 'SEAT_SHELL',
    kind: 'parent-child',
    reason: 'connection-face-belongs-to-shell',
    presentationOnly: true,
  }),
]);

export function isConnectionExpanded(state, threshold = 0.85) {
  const amt = getConnectionBranchAmount(state);
  return Boolean(
    state &&
      state.openParentId &&
      state.focusedChildId === HIERARCHY_PART.SEAT_CONNECTION &&
      amt >= threshold
  );
}

export function getConnectionPayload(state = null) {
  const health = state && state.healthStatus != null ? state.healthStatus : HEALTH_STATUS.UNKNOWN;
  return Object.assign({}, CONNECTION_PAYLOAD_V1, {
    healthStatus: health,
    branchAmount: getConnectionBranchAmount(state),
    expanded: isConnectionExpanded(state),
  });
}

export function getConnectionEdges() {
  return CONNECTION_EDGES_V1.slice();
}

export function enrichHierarchySnapshot(state) {
  const base = Object.assign({}, state);
  base.connectionExpanded = isConnectionExpanded(state);
  base.connectionPayload = getConnectionPayload(state);
  base.connectionEdges = getConnectionEdges();
  base.presentationOnly = true;
  base.durable = false;
  return base;
}
