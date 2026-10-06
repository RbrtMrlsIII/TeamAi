/**
 * TEAM-EXPERIENCE-029 / Structural preview choreography sequence.
 *
 * This is only a deterministic interaction wrapper for the preview. Canonical
 * phase semantics remain owned by machine-choreography.js.
 */
import {
  deriveMachineTransformationChoreography,
  MACHINE_CHOREOGRAPHY_PHASE,
} from './machine-choreography.js';

const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const lerp = (a, b, t) => Number(a) + (Number(b) - Number(a)) * t;

const STAGES = Object.freeze([
  Object.freeze({
    label: 'STOWED',
    view: 'world',
    inputs: Object.freeze({
      shellAmount: 0,
      divisionAmount: 0,
      connectionAmount: 0,
      hierarchyOpen: false,
    }),
  }),
  Object.freeze({
    label: 'SHELL_DEPLOYING',
    view: 'world',
    inputs: Object.freeze({
      shellAmount: 0.55,
      divisionAmount: 0,
      connectionAmount: 0,
      hierarchyOpen: false,
    }),
  }),
  Object.freeze({
    label: 'DIVISION_DEPLOYING',
    view: 'seat',
    inputs: Object.freeze({
      shellAmount: 1,
      divisionAmount: 0.4,
      connectionAmount: 0,
      hierarchyOpen: true,
      focusedChildId: 'SEAT_CONNECTION',
    }),
  }),
  Object.freeze({
    label: 'TOPOLOGY_LINKING',
    view: 'seat',
    inputs: Object.freeze({
      shellAmount: 1,
      divisionAmount: 1,
      connectionAmount: 0.45,
      hierarchyOpen: true,
      focusedChildId: 'SEAT_CONNECTION',
    }),
  }),
  Object.freeze({
    label: 'ELECTRICAL_TRANSFER',
    view: 'seat',
    inputs: Object.freeze({
      shellAmount: 1,
      divisionAmount: 1,
      connectionAmount: 0.82,
      hierarchyOpen: true,
      focusedChildId: 'SEAT_CONNECTION',
    }),
  }),
  Object.freeze({
    label: 'SETTLED',
    view: 'seat',
    inputs: Object.freeze({
      shellAmount: 1,
      divisionAmount: 1,
      connectionAmount: 1,
      hierarchyOpen: true,
      focusedChildId: 'SEAT_CONNECTION',
    }),
  }),
]);

export const STRUCTURAL_PREVIEW_CHOREOGRAPHY_STAGE_COUNT = STAGES.length;

function normalizeStageIndex(stageIndex = 0) {
  return ((Math.trunc(Number(stageIndex) || 0) % STAGES.length) + STAGES.length) % STAGES.length;
}

export function deriveStructuralPreviewChoreography(stageIndex = 0) {
  const index = normalizeStageIndex(stageIndex);
  const stage = STAGES[index];
  const choreography = deriveMachineTransformationChoreography({
    ...stage.inputs,
    reducedMotion: true,
  });
  return Object.freeze({
    stageIndex: index,
    label: stage.label,
    view: stage.view,
    hierarchyOpen: Boolean(stage.inputs.hierarchyOpen),
    focusedChildId: stage.inputs.focusedChildId || null,
    connectionAmount: clamp01(stage.inputs.connectionAmount),
    choreography,
  });
}

export function deriveStructuralPreviewChoreographySample(
  fromStageIndex = 0,
  toStageIndex = fromStageIndex,
  progress = 1,
) {
  const from = deriveStructuralPreviewChoreography(fromStageIndex);
  const to = deriveStructuralPreviewChoreography(toStageIndex);
  const t = clamp01(progress);
  const eased = t * t * (3 - 2 * t);
  const targetHierarchyOpen = to.hierarchyOpen;
  const hierarchyOpen = targetHierarchyOpen
    ? (from.hierarchyOpen || eased >= 0.5)
    : (from.hierarchyOpen && eased < 0.999);
  const focusedChildId = hierarchyOpen
    ? (to.focusedChildId || from.focusedChildId || null)
    : null;
  const choreography = deriveMachineTransformationChoreography({
    shellAmount: lerp(from.choreography.shell, to.choreography.shell, eased),
    divisionAmount: lerp(from.choreography.division, to.choreography.division, eased),
    connectionAmount: lerp(from.connectionAmount, to.connectionAmount, eased),
    hierarchyOpen,
    focusedChildId,
    reducedMotion: true,
  });
  return Object.freeze({
    stageIndex: to.stageIndex,
    fromStageIndex: from.stageIndex,
    toStageIndex: to.stageIndex,
    progress: t,
    label: t >= 0.999 ? to.label : from.label,
    view: t < 0.5 ? from.view : to.view,
    hierarchyOpen,
    focusedChildId,
    connectionAmount,
    returningToWorld: from.stageIndex === 5 && to.stageIndex === 0 && t > 0,
    choreography,
  });
}

export function expectedStructuralPreviewChoreographyPhases() {
  return Object.freeze(
    STAGES.map((_, index) => deriveStructuralPreviewChoreography(index).choreography.phase),
  );
}

export const STRUCTURAL_PREVIEW_CHOREOGRAPHY_PHASES = Object.freeze([
  MACHINE_CHOREOGRAPHY_PHASE.STOWED,
  MACHINE_CHOREOGRAPHY_PHASE.SHELL_DEPLOYING,
  MACHINE_CHOREOGRAPHY_PHASE.DIVISION_DEPLOYING,
  MACHINE_CHOREOGRAPHY_PHASE.TOPOLOGY_LINKING,
  MACHINE_CHOREOGRAPHY_PHASE.ELECTRICAL_TRANSFER,
  MACHINE_CHOREOGRAPHY_PHASE.SETTLED,
]);
