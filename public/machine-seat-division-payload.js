const clone = (value) => Object.freeze(Array.isArray(value) ? [...value] : []);

export const SEAT_DIVISION_PAYLOADS = Object.freeze({
  SEAT_CONNECTION: Object.freeze({
    label: 'Connection',
    role: 'integration-boundary',
    cameraId: 'SEAT_CLOSE',
    branchAmountKey: 'connectionBranchAmount',
    labels: clone(['Connection', 'Health']),
    controls: clone(['configure', 'health']),
    presentationOnly: true,
  }),
  SEAT_BEHAVIOR: Object.freeze({
    label: 'Behavior',
    role: 'behavior-preview',
    cameraId: 'SEAT_CLOSE',
    branchAmountKey: 'behaviorBranchAmount',
    labels: clone(['Behavior', "Do/Don't"]),
    controls: clone(['configure', 'inspect']),
    presentationOnly: true,
    policyAuthority: false,
  }),
  SEAT_TOOLKIT: Object.freeze({
    label: 'Toolkit',
    role: 'optional-equip',
    cameraId: 'SEAT_CLOSE',
    branchAmountKey: 'toolkitBranchAmount',
    labels: clone(['Toolkit', 'Core skill bundle', 'Domain skill bundle', 'External assign slot']),
    controls: clone(['configure', 'equip']),
    presentationOnly: true,
    optional: true,
    entitlement: false,
  }),
  SEAT_CAPABILITIES: Object.freeze({
    label: 'Capabilities',
    role: 'capability-preview',
    cameraId: 'DETAIL_ANCHOR',
    branchAmountKey: 'capabilitiesBranchAmount',
    labels: clone(['Capabilities', 'Available actions']),
    controls: clone(['configure', 'inspect']),
    presentationOnly: true,
    authorization: false,
    entitlement: false,
  }),
  SEAT_AUTHORIZATION: Object.freeze({
    label: 'Authorization',
    role: 'authorization-preview',
    cameraId: 'DETAIL_ANCHOR',
    branchAmountKey: 'authorizationBranchAmount',
    labels: clone(['Authorization', 'Policy grant preview']),
    controls: clone(['configure', 'inspect']),
    presentationOnly: true,
    capability: false,
    entitlement: false,
  }),
  SEAT_WORKSPACE_SCOPE: Object.freeze({
    label: 'Workspace scope',
    role: 'workspace-scope-preview',
    cameraId: 'WORKSPACE_CLOSE',
    branchAmountKey: 'workspaceScopeBranchAmount',
    labels: clone(['Workspace scope', 'Current workspace']),
    controls: clone(['configure', 'scope']),
    presentationOnly: true,
    durableStore: false,
    entitlement: false,
  }),
  SEAT_TASK_EVIDENCE: Object.freeze({
    label: 'Task evidence',
    role: 'evidence-preview',
    cameraId: 'DETAIL_ANCHOR',
    branchAmountKey: 'taskEvidenceBranchAmount',
    labels: clone(['Task evidence', 'Trace']),
    controls: clone(['configure', 'inspect']),
    presentationOnly: true,
    authority: false,
    entitlement: false,
  }),
});

export const SEAT_DIVISION_ORDER = Object.freeze(Object.keys(SEAT_DIVISION_PAYLOADS));

export function resolveSeatDivisionPayload(childId) {
  const key = String(childId || '');
  const payload = SEAT_DIVISION_PAYLOADS[key];
  return payload ? payload : null;
}
