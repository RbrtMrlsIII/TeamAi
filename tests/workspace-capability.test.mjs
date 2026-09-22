import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  WORKSPACE_CENTER_ID,
  WORKSPACE_HQ_FEATURE_ID,
  createWorkspaceCapabilityBranch,
  createWorkspaceCapabilityIntent,
  listWorkspaceCapabilities,
  resolveWorkspaceCapabilityReadiness,
} from '../frontend/spatial/workspace-capability.js';

test('Workspace capability contract stays separate from Seat hierarchy and points to WORKSPACE_CENTER', () => {
  const branch = createWorkspaceCapabilityBranch({
    capabilityId: 'workspace-context',
    workspaceId: 'workspace-main',
    projectId: 'command-deck',
    path: ['context', 'team'],
  });
  assert.equal(branch.featureId, WORKSPACE_HQ_FEATURE_ID);
  assert.equal(branch.semanticTarget, WORKSPACE_CENTER_ID);
  assert.equal(branch.id, 'BRANCH-WORKSPACE::workspace-main/workspace-context/command-deck/context/team');
  assert.equal(branch.presentationOnly, true);
  assert.equal(branch.notDurableAuthority, true);
  assert.equal(branch.id.includes('SEAT_'), false);
});

test('Workspace capability inventory is stable and target-owned', () => {
  assert.deepEqual(listWorkspaceCapabilities().map((item) => item.id), [
    'workspace-context',
    'workspace-projects',
    'workspace-team',
    'workspace-evidence',
  ]);
});

test('Workspace capability intent never becomes backend authority', () => {
  const intent = createWorkspaceCapabilityIntent({
    capabilityId: 'workspace-projects',
    workspaceId: 'workspace-main',
    projectId: 'atlas',
    action: 'inspect',
  });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthority, true);
  assert.equal(intent.notDurableState, true);
  assert.equal(intent.notSchedulerAuthority, true);
  assert.equal(intent.notExecution, true);
});

test('Workspace readiness keeps authentication, authorization, entitlement, scope, scheduler, and health distinct', () => {
  const locked = resolveWorkspaceCapabilityReadiness({ authenticated: true });
  assert.equal(locked.state, 'BACKEND_STATE_REQUIRED');
  assert.equal(locked.usable, false);
  const ready = resolveWorkspaceCapabilityReadiness({
    authenticated: true,
    workspaceKnown: true,
    projectKnown: true,
    authorized: true,
    entitled: true,
    schedulerEligible: true,
    healthy: true,
  });
  assert.equal(ready.state, 'READY');
  assert.equal(ready.usable, true);
});

test('Workspace contract and browser delivery copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/workspace-capability.js', 'utf8'),
    readFileSync('public/workspace-capability.js', 'utf8'),
  );
});
