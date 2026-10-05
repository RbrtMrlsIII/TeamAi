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

export function deriveStructuralPreviewChoreography(stageIndex = 0) {
  const index = ((Math.trunc(Number(stageIndex) || 0) % STAGES.length) + STAGES.length) % STAGES.length;
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
