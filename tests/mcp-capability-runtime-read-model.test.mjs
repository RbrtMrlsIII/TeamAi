import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  createEmptyMcpRuntimeReadModel,
  listMcpDiscoveryVocabulary,
  normalizeMcpRuntimeReadModel,
} from '../frontend/spatial/mcp-capability-runtime-read-model.js';

test('guest remains discoverable but receives no backend capability or target state', () => {
  const model = createEmptyMcpRuntimeReadModel();
  assert.equal(model.state, 'DISCOVERABLE_LOCKED');
  assert.equal(model.contextAvailable, false);
  assert.equal(model.capabilities.length, 0);
  assert.equal(model.targets.length, 0);
  assert.equal(model.credentialBoundary, 'MIXED_BY_CAPABILITY_KIND');
});

test('authenticated runtime state is fail-closed until authoritative context is complete', () => {
  const model = normalizeMcpRuntimeReadModel({
    authenticated: true,
    contextKnown: false,
    authorized: true,
    entitled: true,
    healthy: true,
    capabilities: [{ id: 'github', label: 'GitHub', installed: true }],
    targets: [{ type: 'SEAT', id: 'runtime-seat-7', label: 'Seat 7' }],
  });
  assert.equal(model.state, 'BACKEND_STATE_REQUIRED');
  assert.equal(model.contextAvailable, false);
  assert.equal(model.capabilities.length, 1);
  assert.equal(model.targets.length, 0);
  assert.equal(model.usable, false);
});

test('ready runtime state preserves distinct readiness dimensions and dynamic targets', () => {
  const model = normalizeMcpRuntimeReadModel({
    readiness: {
      authenticated: true,
      contextKnown: true,
      authorized: true,
      entitled: true,
      healthy: true,
    },
    capabilities: [{
      id: 'github',
      label: 'GitHub',
      kind: 'EXTERNAL_CONNECTION',
      source: 'external-provider',
      installed: true,
      teamAiEntitled: true,
      providerCompatible: true,
      authorized: true,
      permissionsConfigured: true,
      projectScoped: true,
      seatAllowed: true,
      connectionTestPassed: true,
      healthy: true,
      branchPaths: [['repository'], ['repository', 'pull-requests']],
      targets: [
        { type: 'SEAT', id: 'runtime-seat-7', label: 'Seat 7' },
        { type: 'WORKSPACE', id: 'runtime-workspace-3', label: 'Workspace 3' },
      ],
    }],
    targets: [{ type: 'SEAT', id: 'runtime-seat-7', label: 'Seat 7' }],
  });

  assert.equal(model.state, 'READY');
  assert.equal(model.contextAvailable, true);
  assert.equal(model.usable, true);
  assert.equal(model.capabilities[0].readiness.state, 'READY');
  assert.equal(model.capabilities[0].providerCredentialBoundary, 'EXTERNAL_PROVIDER');
  assert.deepEqual(model.capabilities[0].branchPaths, [
    ['repository'],
    ['repository', 'pull-requests'],
  ]);
  assert.deepEqual(model.targets, [
    { type: 'SEAT', id: 'runtime-seat-7', label: 'Seat 7', eligible: true },
  ]);
});

test('TeamAi-native capabilities do not inherit an external provider credential boundary', () => {
  const model = normalizeMcpRuntimeReadModel({
    readiness: {
      authenticated: true,
      contextKnown: true,
      authorized: true,
      entitled: true,
      healthy: true,
    },
    capabilities: [{
      id: 'workspace',
      label: 'Workspace',
      kind: 'TEAMAI_NATIVE',
      source: 'TeamAi',
      installed: true,
      teamAiEntitled: true,
      providerCompatible: true,
      authorized: true,
      permissionsConfigured: true,
      projectScoped: true,
      seatAllowed: true,
      connectionTestPassed: true,
      healthy: true,
    }],
  });
  assert.equal(model.capabilities[0].providerCredentialBoundary, 'NONE');
});


test('guest discovery vocabulary is intentionally presentation-only and target-free', () => {
  const entries = listMcpDiscoveryVocabulary();
  assert.deepEqual(entries.map((entry) => entry.id), ['workspace', 'human-approval', 'github', 'firebase']);
  assert.ok(entries.every((entry) => entry.discoveryOnly && entry.state === 'DISCOVERABLE_LOCKED' && !entry.usable));
  assert.ok(entries.every((entry) => !Object.hasOwn(entry, 'targets')));
});

test('source and browser runtime read-model copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/mcp-capability-runtime-read-model.js', 'utf8'),
    readFileSync('public/mcp-capability-runtime-read-model.js', 'utf8'),
  );
});
