import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  AGENT_ROLES,
  createAgentAssignmentBranch,
  createAgentAssignmentIntent,
  listTeamAgents,
  resolveAgentReadiness,
} from '../frontend/spatial/team-agents.js';

test('Team / Agents role and Seat assignment stays a responsibility presentation boundary', () => {
  const branch = createAgentAssignmentBranch({
    agentId: 'agent-beta',
    seatId: 'seat-04',
    role: 'tester-verifier',
  });
  assert.equal(branch.id, 'BRANCH-TEAM::agent/agent-beta/seat/seat-04/role/tester-verifier/configuration');
  assert.equal(branch.featureId, 'team-agents');
  assert.equal(branch.presentationOnly, true);
  assert.equal(branch.notAuthorization, true);
  assert.equal(branch.notEntitlement, true);
});

test('Agent role catalog uses the governed responsibility vocabulary', () => {
  assert.deepEqual(AGENT_ROLES.map((role) => role.id), [
    'planner',
    'coder',
    'researcher',
    'reviewer',
    'tester-verifier',
    'coordinator',
  ]);
  assert.equal(listTeamAgents().length, 3);
});

test('Agent assignment intent never becomes durable authorization or scheduler authority', () => {
  const intent = createAgentAssignmentIntent({
    agentId: 'agent-alpha',
    seatId: 'seat-02',
    role: 'coordinator',
  });
  assert.equal(intent.presentationOnly, true);
  assert.equal(intent.notAuthority, true);
  assert.equal(intent.notAuthorization, true);
  assert.equal(intent.notEntitlement, true);
  assert.equal(intent.notDurableState, true);
  assert.equal(intent.notSchedulerAuthority, true);
  assert.equal(intent.notExecution, true);
});

test('Agent readiness preserves independent authority dimensions', () => {
  const locked = resolveAgentReadiness({ authenticated: true });
  assert.equal(locked.state, 'BACKEND_STATE_REQUIRED');
  assert.equal(locked.usable, false);
  const ready = resolveAgentReadiness({
    authenticated: true,
    agentKnown: true,
    seatKnown: true,
    roleConfigured: true,
    authorized: true,
    entitled: true,
    healthy: true,
  });
  assert.equal(ready.state, 'READY');
  assert.equal(ready.usable, true);
});

test('Agent source and browser copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/team-agents.js', 'utf8'),
    readFileSync('public/team-agents.js', 'utf8'),
  );
});
