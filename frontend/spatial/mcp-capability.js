/**
 * TeamAi MCP / Capability facility contract.
 *
 * Presentation/read-model layer only. It models the TeamAi-facing lifecycle,
 * readiness dimensions, dynamic target-owned branch identity, and user
 * intents without owning provider credentials, entitlement authority,
 * authorization authority, or tool execution.
 */
import { resolveFeatureAccess } from './feature-access.js';

export const MCP_LIFECYCLE_STAGES = Object.freeze([
  'DISCOVER',
  'INSPECT',
  'INSTALL',
  'AUTH_HANDOFF',
  'CONFIGURE_PERMISSIONS',
  'HEALTH_TEST',
  'EQUIP',
  'MANAGE',
]);

export const MCP_TARGET_TYPES = Object.freeze(['SEAT', 'WORKSPACE']);

export const MCP_CAPABILITY_STATES = Object.freeze([
  'UNAVAILABLE',
  'INSTALLABLE',
  'ENTITLEMENT_REQUIRED',
  'INCOMPATIBLE',
  'AUTH_HANDOFF_REQUIRED',
  'PERMISSION_CONFIGURATION_REQUIRED',
  'HEALTH_TEST_REQUIRED',
  'PROJECT_SCOPE_REQUIRED',
  'TARGET_NOT_ALLOWED',
  'HEALTH_DEGRADED',
  'READY',
]);

export const MCP_CAPABILITY_INVENTORY_V1 = Object.freeze([
  Object.freeze({
    id: 'workspace',
    label: 'Workspace',
    kind: 'TEAMAI_NATIVE',
    source: 'TeamAi',
    custom: false,
  }),
  Object.freeze({
    id: 'human-approval',
    label: 'Human Approval',
    kind: 'TEAMAI_NATIVE',
    source: 'TeamAi',
    custom: false,
  }),
  Object.freeze({
    id: 'github',
    label: 'GitHub',
    kind: 'EXTERNAL_CONNECTION',
    source: 'external-provider',
    custom: false,
  }),
  Object.freeze({
    id: 'firebase',
    label: 'Firebase',
    kind: 'EXTERNAL_CONNECTION',
    source: 'external-provider',
    custom: false,
  }),
]);

function booleanOr(value, fallback) {
  return value === undefined ? fallback : Boolean(value);
}

function requiredText(value, field) {
  const text = String(value ?? '').trim();
  if (!text) throw new Error(`MCP ${field} is required`);
  return text;
}

function normalizeTargetType(value) {
  const targetType = String(value ?? '').toUpperCase();
  if (!MCP_TARGET_TYPES.includes(targetType)) {
    throw new Error(`unsupported MCP target type: ${targetType}`);
  }
  return targetType;
}

function semanticToken(value) {
  return encodeURIComponent(requiredText(value, 'identity'));
}

export function getMcpFacilityAccess({ authenticated = false } = {}) {
  return resolveFeatureAccess('mcp-capability', { authenticated });
}

export function listMcpLifecycleStages() {
  return MCP_LIFECYCLE_STAGES.slice();
}

export function listMcpCapabilities() {
  return MCP_CAPABILITY_INVENTORY_V1.slice();
}

/**
 * Resolve capability usability without collapsing its independent policy
 * dimensions into one boolean. The result is a presentation projection only.
 */
export function resolveMcpCapabilityReadiness(entry, context = {}) {
  if (!entry) return null;

  const available = booleanOr(context.available, booleanOr(entry.available, true));
  const installed = booleanOr(context.installed, Boolean(entry.installed));
  const teamAiEntitled = booleanOr(context.teamAiEntitled, Boolean(entry.teamAiEntitled));
  const providerCompatible = booleanOr(context.providerCompatible, Boolean(entry.providerCompatible));
  const authorized = booleanOr(context.authorized, Boolean(entry.authorized));
  const permissionsConfigured = booleanOr(context.permissionsConfigured, Boolean(entry.permissionsConfigured));
  const projectScoped = booleanOr(context.projectScoped, Boolean(entry.projectScoped));
  const seatAllowed = booleanOr(context.seatAllowed, Boolean(entry.seatAllowed ?? true));
  const connectionTestPassed = booleanOr(context.connectionTestPassed, Boolean(entry.connectionTestPassed));
  const healthy = booleanOr(context.healthy, Boolean(entry.healthy));

  let state = 'READY';
  let recoveryAction = 'NONE';

  if (!available) {
    state = 'UNAVAILABLE';
    recoveryAction = 'INSPECT';
  } else if (!installed) {
    state = 'INSTALLABLE';
    recoveryAction = 'INSTALL';
  } else if (!teamAiEntitled) {
    state = 'ENTITLEMENT_REQUIRED';
    recoveryAction = 'MARKETPLACE';
  } else if (!providerCompatible) {
    state = 'INCOMPATIBLE';
    recoveryAction = 'INSPECT';
  } else if (!authorized) {
    state = 'AUTH_HANDOFF_REQUIRED';
    recoveryAction = 'AUTH_HANDOFF';
  } else if (!permissionsConfigured) {
    state = 'PERMISSION_CONFIGURATION_REQUIRED';
    recoveryAction = 'CONFIGURE_PERMISSIONS';
  } else if (!connectionTestPassed) {
    state = 'HEALTH_TEST_REQUIRED';
    recoveryAction = 'HEALTH_TEST';
  } else if (!projectScoped) {
    state = 'PROJECT_SCOPE_REQUIRED';
    recoveryAction = 'CONFIGURE_PERMISSIONS';
  } else if (!seatAllowed) {
    state = 'TARGET_NOT_ALLOWED';
    recoveryAction = 'CONFIGURE_PERMISSIONS';
  } else if (!healthy) {
    state = 'HEALTH_DEGRADED';
    recoveryAction = 'HEALTH_TEST';
  }

  return Object.freeze({
    capabilityId: requiredText(entry.id, 'capability id'),
    state,
    recoveryAction,
    available,
    installed,
    teamAiEntitled,
    providerCompatible,
    authorized,
    permissionsConfigured,
    projectScoped,
    seatAllowed,
    connectionTestPassed,
    healthy,
    usable: state === 'READY',
    presentationOnly: true,
  });
}

/**
 * Build a deterministic candidate branch identity. The branch is a
 * presentation/read-model identity only. Actual equipping remains backend
 * authority and does not occur here.
 */
export function createMcpCapabilityBranch({
  capabilityId,
  ownerType,
  ownerId,
  path = [],
} = {}) {
  const targetType = normalizeTargetType(ownerType);
  const capability = requiredText(capabilityId, 'capability id');
  const owner = requiredText(ownerId, 'owner id');
  const semanticPath = Array.isArray(path) ? path.map((part) => requiredText(part, 'branch path segment')) : [];

  const key = [
    semanticToken(capability),
    semanticToken(targetType),
    semanticToken(owner),
    ...semanticPath.map(semanticToken),
  ].join('/');

  return Object.freeze({
    id: `BRANCH-MCP::${key}`,
    capabilityId: capability,
    owner: Object.freeze({
      type: targetType,
      id: owner,
    }),
    path: Object.freeze(semanticPath),
    recursive: true,
    depth: semanticPath.length,
    presentationOnly: true,
  });
}

/**
 * Return a user-intent proposal without asserting that the capability is
 * actually equipped. The authoritative runtime must re-check entitlement,
 * authorization, scope, target eligibility, and health.
 */
export function createMcpEquipIntent({
  capabilityId,
  ownerType,
  ownerId,
  path = [],
  readiness = null,
} = {}) {
  const branch = createMcpCapabilityBranch({ capabilityId, ownerType, ownerId, path });
  const ready = readiness?.usable === true;

  return Object.freeze({
    action: 'EQUIP',
    capabilityId: branch.capabilityId,
    target: branch.owner,
    branch,
    presentationState: ready ? 'READY' : 'BLOCKED',
    authoritativeConfirmationRequired: true,
    presentationOnly: true,
  });
}

export function createMcpLifecycleIntent({ capabilityId, stage, ownerType, ownerId, path = [] } = {}) {
  const lifecycleStage = String(stage ?? '').toUpperCase();
  if (!MCP_LIFECYCLE_STAGES.includes(lifecycleStage)) {
    throw new Error(`unsupported MCP lifecycle stage: ${lifecycleStage}`);
  }

  return Object.freeze({
    action: lifecycleStage,
    capabilityId: requiredText(capabilityId, 'capability id'),
    target: ownerType && ownerId
      ? Object.freeze({ type: normalizeTargetType(ownerType), id: requiredText(ownerId, 'owner id') })
      : null,
    branch: ownerType && ownerId
      ? createMcpCapabilityBranch({ capabilityId, ownerType, ownerId, path })
      : null,
    authoritativeConfirmationRequired: true,
    presentationOnly: true,
  });
}
