import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  MCP_CAPABILITY_INVENTORY_V1,
  MCP_CAPABILITY_STATES,
  MCP_LIFECYCLE_STAGES,
  createMcpCapabilityBranch,
  createMcpEquipIntent,
  createMcpLifecycleIntent,
  getMcpFacilityAccess,
  resolveMcpCapabilityReadiness,
} from '../frontend/spatial/mcp-capability.js';

test('MCP facility is discoverable but guest-locked and authenticated context delegates authority', () => {
  assert.deepEqual(getMcpFacilityAccess(), {
    featureId: 'mcp-capability',
    visibility: 'DISCOVERABLE',
    interaction: 'DISCOVERABLE_LOCKED',
    mutation: 'BLOCKED_UNTIL_AUTHENTICATED',
    activationAllowed: false,
    presentationOnly: true,
  });

  assert.deepEqual(getMcpFacilityAccess({ authenticated: true }), {
    featureId: 'mcp-capability',
    visibility: 'DISCOVERABLE',
    interaction: 'AUTHENTICATED_CONTEXT',
    mutation: 'BACKEND_AUTHORITY_REQUIRED',
    activationAllowed: true,
    presentationOnly: true,
  });
});

test('readiness preserves each MCP policy dimension and only reaches READY when all are satisfied', () => {
  const entry = { id: 'github' };

  const installable = resolveMcpCapabilityReadiness(entry);
  assert.equal(installable?.state, 'INSTALLABLE');

  const authRequired = resolveMcpCapabilityReadiness(entry, {
    installed: true,
    teamAiEntitled: true,
    providerCompatible: true,
  });
  assert.equal(authRequired?.state, 'AUTH_HANDOFF_REQUIRED');

  const permissionRequired = resolveMcpCapabilityReadiness(entry, {
    installed: true,
    teamAiEntitled: true,
    providerCompatible: true,
    authorized: true,
  });
  assert.equal(permissionRequired?.state, 'PERMISSION_CONFIGURATION_REQUIRED');

  const healthTestRequired = resolveMcpCapabilityReadiness(entry, {
    installed: true,
    teamAiEntitled: true,
    providerCompatible: true,
    authorized: true,
    permissionsConfigured: true,
  });
  assert.equal(healthTestRequired?.state, 'HEALTH_TEST_REQUIRED');

  const ready = resolveMcpCapabilityReadiness(entry, {
    installed: true,
    teamAiEntitled: true,
    providerCompatible: true,
    authorized: true,
    permissionsConfigured: true,
    connectionTestPassed: true,
    projectScoped: true,
    seatAllowed: true,
    healthy: true,
  });
  assert.equal(ready?.state, 'READY');
  assert.equal(ready?.usable, true);
  assert.equal(ready?.presentationOnly, true);
});

test('degraded health remains distinct from usable', () => {
  const state = resolveMcpCapabilityReadiness({ id: 'firebase' }, {
    installed: true,
    teamAiEntitled: true,
    providerCompatible: true,
    authorized: true,
    permissionsConfigured: true,
    connectionTestPassed: true,
    projectScoped: true,
    seatAllowed: true,
    healthy: false,
  });
  assert.equal(state?.state, 'HEALTH_DEGRADED');
  assert.equal(state?.usable, false);
});

test('equip branch identity is dynamic and target-owned', () => {
  const seatBranch = createMcpCapabilityBranch({
    capabilityId: 'github',
    ownerType: 'SEAT',
    ownerId: 'seat-01',
    path: ['repository', 'pull-requests'],
  });
  const workspaceBranch = createMcpCapabilityBranch({
    capabilityId: 'github',
    ownerType: 'WORKSPACE',
    ownerId: 'workspace-main',
    path: ['repository', 'pull-requests'],
  });

  assert.notEqual(seatBranch.id, workspaceBranch.id);
  assert.deepEqual(seatBranch.owner, { type: 'SEAT', id: 'seat-01' });
  assert.deepEqual(seatBranch.path, ['repository', 'pull-requests']);
  assert.equal(seatBranch.recursive, true);
  assert.equal(seatBranch.presentationOnly, true);
});

test('equip and lifecycle actions remain intents, never authority claims', () => {
  const ready = { usable: true };
  const equip = createMcpEquipIntent({
    capabilityId: 'github',
    ownerType: 'SEAT',
    ownerId: 'seat-01',
    readiness: ready,
  });
  assert.equal(equip.action, 'EQUIP');
  assert.equal(equip.presentationState, 'READY');
  assert.equal(equip.authoritativeConfirmationRequired, true);
  assert.equal(equip.presentationOnly, true);

  const handoff = createMcpLifecycleIntent({
    capabilityId: 'github',
    stage: 'AUTH_HANDOFF',
    ownerType: 'SEAT',
    ownerId: 'seat-01',
    path: ['authorization'],
  });
  assert.equal(handoff.action, 'AUTH_HANDOFF');
  assert.equal(handoff.branch?.recursive, true);
  assert.equal(handoff.presentationOnly, true);
});

test('inventory and lifecycle vocabulary are stable', () => {
  assert.deepEqual(
    MCP_CAPABILITY_INVENTORY_V1.map((entry) => entry.id),
    ['workspace', 'human-approval', 'github', 'firebase'],
  );
  assert.deepEqual(MCP_LIFECYCLE_STAGES, [
    'DISCOVER',
    'INSPECT',
    'INSTALL',
    'AUTH_HANDOFF',
    'CONFIGURE_PERMISSIONS',
    'HEALTH_TEST',
    'EQUIP',
    'MANAGE',
  ]);
  assert.deepEqual(MCP_CAPABILITY_STATES, [
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
});

test('source and browser MCP capability modules remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/mcp-capability.js', 'utf8'),
    readFileSync('public/mcp-capability.js', 'utf8'),
  );
});
