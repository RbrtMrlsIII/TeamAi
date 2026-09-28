import { STRUCTURAL_ROOT_SLICES, validateSpatialConstructionNode } from '../frontend/spatial/machine-spatial-root-contract.js';
import { createEmptyTeamAgentsReadModel, normalizeTeamAgentsReadModel } from '../frontend/spatial/team-agents-runtime-read-model.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Hero exposes Team / Agents as a discoverable product facility', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/team-agents-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/team-agents-facility.css', 'utf8');
  assert.match(html, /data-team-agents-open/);
  assert.match(html, /team-agents-facility\.js/);
  assert.match(html, /team-agents-facility\.css/);
  assert.match(facility, /teamai:agent-assignment-intent/);
  assert.match(facility, /TeamAiTeamAgentsFacility/);
  assert.match(css, /team-agents-facility/);
});

test('Team / Agents facility source/public copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/team-agents-facility.js', 'utf8'), readFileSync('public/team-agents-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/team-agents-facility.css', 'utf8'), readFileSync('public/team-agents-facility.css', 'utf8'));
});

test('S14 Team / Agents facility inherits the complete S0-S10 structural root contract', async () => {
  const { TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT } = await import('../frontend/spatial/team-agents-facility.js');
  assert.equal(TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT.constructionSlice, 'S14');
  assert.equal(TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT.constructionOwner, 'frontend/spatial/team-agents-facility.js');
  assert.equal(TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT.semanticId, 'TEAM_AGENTS');
  assert.deepEqual(TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT.inheritedStructuralRoots, STRUCTURAL_ROOT_SLICES);
  assert.equal(validateSpatialConstructionNode(TEAM_AGENTS_FACILITY_SPATIAL_CONTEXT).valid, true);
});

test('Team / Agents read model fails closed without authorized runtime context', () => {
  const model = createEmptyTeamAgentsReadModel();
  assert.equal(model.state, 'DISCOVERABLE_LOCKED');
  assert.equal(model.contextAvailable, false);
  assert.equal(model.usable, false);
  assert.deepEqual(model.agents, []);
  assert.deepEqual(model.seats, []);
});

test('Team / Agents read model normalizes only authorized ready Agent assignments', () => {
  const model = normalizeTeamAgentsReadModel({
    readiness: {
      authenticated: true,
      workspaceKnown: true,
      authorized: true,
      entitled: true,
      healthy: true,
    },
    team: { id: 'team-real', name: 'Real Team' },
    seats: [
      { id: 'seat-real', name: 'Seat Real', state: 'READY' },
      { id: 'seat-other', name: 'Seat Other', state: 'IDLE' },
    ],
    agents: [
      {
        id: 'agent-real',
        name: 'Real Agent',
        role: 'coder',
        seatId: 'seat-real',
        capabilityProfile: 'Coding + tool use',
        skillBundle: ['Common Skill A', 'Common Skill B'],
        authorized: true,
        entitled: true,
        healthy: true,
      },
      {
        id: 'agent-blocked',
        name: 'Blocked Agent',
        role: 'reviewer',
        seatId: 'seat-other',
        capabilityProfile: 'Review',
        authorized: true,
        entitled: true,
        healthy: false,
      },
    ],
  });

  assert.equal(model.state, 'READY');
  assert.equal(model.contextAvailable, true);
  assert.equal(model.usable, true);
  assert.deepEqual(model.team, { id: 'team-real', label: 'Real Team' });
  assert.deepEqual(model.seats, [
    { id: 'seat-real', label: 'Seat Real', state: 'READY' },
    { id: 'seat-other', label: 'Seat Other', state: 'IDLE' },
  ]);
  assert.equal(model.agents.length, 1);
  assert.equal(model.agents[0].id, 'agent-real');
  assert.equal(model.agents[0].seatId, 'seat-real');
  assert.deepEqual(model.agents[0].skillBundle, ['Common Skill A', 'Common Skill B']);
});

test('Team / Agents facility contains no sample Agent or Seat identities', () => {
  const facility = readFileSync('frontend/spatial/team-agents-facility.js', 'utf8');
  assert.doesNotMatch(facility, /agent-alpha|agent-beta|agent-gamma|seat-01|seat-02|seat-03/);
  assert.match(facility, /teamai:team-agents-runtime-read-model/);
  assert.match(facility, /setTeamAgentsReadModel/);
});

test('Team / Agents read-model source/public copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/team-agents-runtime-read-model.js', 'utf8'),
    readFileSync('public/team-agents-runtime-read-model.js', 'utf8'),
  );
});
