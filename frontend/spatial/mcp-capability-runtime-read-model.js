import {
  MCP_TARGET_TYPES,
  listMcpCapabilities,
  resolveMcpCapabilityReadiness,
} from './mcp-capability.js';

const MAX_CAPABILITIES = 50;
const MAX_TARGETS = 20;
const MAX_PATH_SEGMENTS = 12;

function text(value, fallback = '') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizePath(value) {
  if (!Array.isArray(value)) return Object.freeze([]);
  return Object.freeze(value
    .map((part) => text(part))
    .filter(Boolean)
    .slice(0, MAX_PATH_SEGMENTS));
}

function normalizeCapability(value) {
  if (!value || typeof value !== 'object') return null;
  const id = text(value.id || value.capabilityId);
  const label = text(value.label || value.name);
  if (!id || !label) return null;

  const readiness = resolveMcpCapabilityReadiness(
    { ...value, id },
    {
      available: value.available,
      installed: value.installed,
      teamAiEntitled: value.teamAiEntitled,
      providerCompatible: value.providerCompatible,
      authorized: value.authorized,
      permissionsConfigured: value.permissionsConfigured,
      projectScoped: value.projectScoped,
      seatAllowed: value.seatAllowed,
      connectionTestPassed: value.connectionTestPassed,
      healthy: value.healthy,
    },
  );

  return Object.freeze({
    id,
    label,
    kind: text(value.kind, 'CAPABILITY'),
    source: text(value.source, 'backend'),
    custom: Boolean(value.custom),
    readiness,
    branchPaths: Object.freeze(
      (Array.isArray(value.branchPaths) ? value.branchPaths : [])
        .map(normalizePath)
        .filter((path) => path.length > 0)
        .slice(0, 25),
    ),
    targets: Object.freeze(
      Array.isArray(value.targets)
        ? value.targets.map(normalizeTarget).filter(Boolean).slice(0, MAX_TARGETS)
        : [],
    ),
    providerCredentialBoundary: 'EXTERNAL_PROVIDER',
  });
}

function normalizeTarget(value) {
  if (!value || typeof value !== 'object') return null;
  const type = text(value.type || value.ownerType).toUpperCase();
  const id = text(value.id || value.ownerId);
  const label = text(value.label || value.name, id);
  if (!MCP_TARGET_TYPES.includes(type) || !id || !label) return null;
  return Object.freeze({
    type,
    id,
    label,
    eligible: value.eligible === undefined ? true : Boolean(value.eligible),
  });
}

export function normalizeMcpRuntimeReadModel(input = {}) {
  const readiness = input.readiness && typeof input.readiness === 'object'
    ? input.readiness
    : input;
  const authenticated = Boolean(readiness.authenticated);
  const capabilities = authenticated && Array.isArray(input.capabilities)
    ? Object.freeze(input.capabilities
      .slice(0, MAX_CAPABILITIES)
      .map(normalizeCapability)
      .filter(Boolean))
    : Object.freeze([]);
  const targets = authenticated && Array.isArray(input.targets)
    ? Object.freeze(input.targets
      .slice(0, MAX_TARGETS)
      .map(normalizeTarget)
      .filter((target) => target?.eligible))
    : Object.freeze([]);

  const readyContext = authenticated &&
    Boolean(readiness.contextKnown) &&
    Boolean(readiness.authorized) &&
    Boolean(readiness.entitled) &&
    Boolean(readiness.healthy);

  return Object.freeze({
    source: 'backend-read-model',
    authenticated,
    contextKnown: Boolean(readiness.contextKnown),
    authorized: Boolean(readiness.authorized),
    entitled: Boolean(readiness.entitled),
    healthy: Boolean(readiness.healthy),
    contextAvailable: readyContext,
    state: readyContext ? 'READY' : authenticated ? 'BACKEND_STATE_REQUIRED' : 'DISCOVERABLE_LOCKED',
    usable: readyContext && capabilities.some((capability) => capability.readiness.usable),
    capabilities,
    targets,
    credentialBoundary: 'EXTERNAL_PROVIDER',
  });
}

export function createEmptyMcpRuntimeReadModel() {
  return normalizeMcpRuntimeReadModel({
    authenticated: false,
    contextKnown: false,
    authorized: false,
    entitled: false,
    healthy: false,
    capabilities: [],
    targets: [],
  });
}

export function listMcpDiscoveryVocabulary() {
  return listMcpCapabilities().map((entry) => Object.freeze({
    ...entry,
    discoveryOnly: true,
    state: 'DISCOVERABLE_LOCKED',
    usable: false,
  }));
}
