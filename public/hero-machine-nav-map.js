/**
 * V2.1 — Machine parts / trees nav map data (Vision).
 * Owner: shell-nav / seat-stack / hierarchy face ids — pure data only.
 * V2.2 will bind this map to the right-side dropdown (existing chrome).
 * Presentation only · no 029-released claim · Issue #214
 */
import { HIERARCHY_PART, SEAT_SHELL_V1_CHILDREN } from './hero-hierarchy-runtime.js';
import { WORLD_BASELINE_DOCK_ID } from './hero-cam2-tree-follow.js';

/** Stable product map for the right-side parts list (Vision §3.1). */
export const MACHINE_NAV_MAP = Object.freeze([
  {
    id: 'world-baseline',
    label: 'Machine home',
    kind: 'world',
    cameraId: WORLD_BASELINE_DOCK_ID,
  },
  {
    id: 'ring-r0-zipskills',
    label: 'Workspace ZipSkills (R0)',
    kind: 'ring',
    cameraId: 'WORKSPACE_CLOSE',
    optional: true,
  },
  {
    id: 'ring-r1-backend',
    label: 'Backend display (R1)',
    kind: 'ring',
    cameraId: 'WORKSPACE_CLOSE',
  },
  {
    id: 'ring-r2-setup',
    label: 'Setup / config (R2)',
    kind: 'ring',
    cameraId: 'DETAIL_ANCHOR',
  },
  {
    id: 'seat-shell',
    label: 'Web AI Seat shell',
    kind: 'seat-branch',
    cameraId: 'SEAT_CLOSE',
    hierarchyChildId: HIERARCHY_PART.SEAT_CONNECTION,
  },
  ...SEAT_SHELL_V1_CHILDREN.map((childId) => ({
    id: `seat-branch:${childId}`,
    label: seatBranchLabel(childId),
    kind: 'seat-branch',
    cameraId: 'SEAT_CLOSE',
    hierarchyChildId: childId,
  })),
]);

function seatBranchLabel(childId) {
  const map = {
    [HIERARCHY_PART.SEAT_CONNECTION]: 'Seat · Connection',
    [HIERARCHY_PART.SEAT_BEHAVIOR]: 'Seat · Behavior',
    [HIERARCHY_PART.SEAT_TOOLKIT]: 'Seat · Toolkit',
    [HIERARCHY_PART.SEAT_CAPABILITIES]: 'Seat · Capabilities',
    [HIERARCHY_PART.SEAT_AUTHORIZATION]: 'Seat · Authorization',
    [HIERARCHY_PART.SEAT_WORKSPACE_SCOPE]: 'Seat · Workspace scope',
    [HIERARCHY_PART.SEAT_TASK_EVIDENCE]: 'Seat · Task evidence',
  };
  return map[childId] || childId;
}

export function machineNavById(id) {
  return MACHINE_NAV_MAP.find((e) => e.id === id) || null;
}

export function machineNavSeatBranches() {
  return MACHINE_NAV_MAP.filter((e) => e.kind === 'seat-branch' && e.hierarchyChildId);
}

export function machineNavWorldHome() {
  return machineNavById('world-baseline');
}

/** Entries that request a camera dock without requiring hierarchy open. */
export function machineNavClosedHierarchyEntries() {
  return MACHINE_NAV_MAP.filter((e) => e.kind === 'world' || e.kind === 'ring');
}
