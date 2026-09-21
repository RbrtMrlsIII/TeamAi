const clamp01 = (value) => Math.max(0, Math.min(1, Number(value) || 0));
const smoothstep = (value) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export const MACHINE_CHOREOGRAPHY_PHASE = Object.freeze({
  STOWED: 'STOWED',
  SHELL_DEPLOYING: 'SHELL_DEPLOYING',
  DIVISION_DEPLOYING: 'DIVISION_DEPLOYING',
  TOPOLOGY_LINKING: 'TOPOLOGY_LINKING',
  ELECTRICAL_TRANSFER: 'ELECTRICAL_TRANSFER',
  WORKSPACE_RECEIVING: 'WORKSPACE_RECEIVING',
  SETTLED: 'SETTLED',
});

export function deriveMachineTransformationChoreography({
  shellAmount = 0,
  divisionAmount = 0,
  connectionAmount = 0,
  hierarchyOpen = false,
  focusedChildId = null,
  reducedMotion = false,
} = {}) {
  const shell = clamp01(shellAmount);
  const division = hierarchyOpen ? clamp01(divisionAmount) : 0;
  const connection = hierarchyOpen ? clamp01(connectionAmount) : 0;
  const topology = Math.min(shell, division);
  const electrical = focusedChildId === 'SEAT_CONNECTION'
    ? Math.min(connection, topology)
    : 0;
  const workspaceReception = focusedChildId === 'SEAT_CONNECTION'
    ? smoothstep((connection - 0.72) / 0.28) * topology
    : 0;
  const transformation = Math.max(shell, division);

  let phase = MACHINE_CHOREOGRAPHY_PHASE.STOWED;
  if (transformation > 0.02 && shell < 0.98) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.SHELL_DEPLOYING;
  } else if (division > 0.02 && division < 0.98) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.DIVISION_DEPLOYING;
  } else if (hierarchyOpen && topology > 0.02 && electrical < 0.65) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.TOPOLOGY_LINKING;
  } else if (electrical > 0.02 && electrical < 1) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.ELECTRICAL_TRANSFER;
  } else if (workspaceReception > 0.02 && workspaceReception < 0.98) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.WORKSPACE_RECEIVING;
  } else if (transformation >= 0.98) {
    phase = MACHINE_CHOREOGRAPHY_PHASE.SETTLED;
  }

  return Object.freeze({
    shell,
    division,
    topology,
    electrical,
    workspaceReception,
    transformation,
    phase,
    reducedMotion: Boolean(reducedMotion),
    presentationOnly: true,
  });
}
