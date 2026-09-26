import test from 'node:test';
import assert from 'node:assert/strict';
import { STRUCTURAL_ROOT_SLICES, validateSpatialConstructionNode } from '../frontend/spatial/machine-spatial-root-contract.js';
import { createEmptyWorkspaceReadModel, normalizeWorkspaceReadModel } from '../frontend/spatial/workspace-runtime-read-model.js';
import { readFileSync } from 'node:fs';

test('S13 Workspace HQ inherits the complete S0-S10 structural root contract', async () => {
  const { WORKSPACE_FACILITY_SPATIAL_CONTEXT } = await import('../frontend/spatial/workspace-capability-facility.js');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.constructionSlice, 'S13');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.constructionOwner, 'frontend/spatial/workspace-capability-facility.js');
  assert.equal(WORKSPACE_FACILITY_SPATIAL_CONTEXT.semanticId, 'WORKSPACE_CENTER');
  assert.deepEqual(WORKSPACE_FACILITY_SPATIAL_CONTEXT.inheritedStructuralRoots, STRUCTURAL_ROOT_SLICES);
  assert.equal(validateSpatialConstructionNode(WORKSPACE_FACILITY_SPATIAL_CONTEXT).valid, true);
});

test('live Hero surface exposes Workspace HQ as a first-party capability facility', () => {
  const html = readFileSync('public/index.html', 'utf8');
  const facility = readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8');
  const css = readFileSync('frontend/spatial/workspace-capability.css', 'utf8');

  assert.match(html, /data-workspace-open/);
  assert.match(html, /workspace-capability-facility\.js/);
  assert.match(html, /workspace-capability\.css/);
  assert.match(facility, /WORKSPACE_CENTER_ID/);
  assert.match(facility, /teamai:workspace-capability-intent/);
  assert.match(facility, /TeamAiWorkspaceFacility/);
  assert.match(facility, /data-workspace-team-label/);
  assert.match(facility, /data-workspace-seat-summary/);
  assert.match(facility, /data-workspace-task/);
  assert.match(facility, /data-workspace-evidence/);
  assert.match(facility, /data-workspace-results/);
  assert.match(facility, /renderReadModelContext/);
  assert.match(css, /workspace-facility__read-model-grid/);
});

test('Workspace facility source/public copies remain exact', () => {
  assert.equal(readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8'), readFileSync('public/workspace-capability-facility.js', 'utf8'));
  assert.equal(readFileSync('frontend/spatial/workspace-capability.css', 'utf8'), readFileSync('public/workspace-capability.css', 'utf8'));
});

test('Workspace read-model fails closed without authoritative context', () => {
  const model = createEmptyWorkspaceReadModel();
  assert.equal(model.source, 'backend-read-model');
  assert.equal(model.state, 'DISCOVERABLE_LOCKED');
  assert.equal(model.contextAvailable, false);
  assert.equal(model.workplace, null);
  assert.equal(model.project, null);
  assert.equal(model.team, null);
  assert.deepEqual(model.seats, []);
  assert.equal(model.activeTask, null);
  assert.deepEqual(model.evidence, []);
  assert.deepEqual(model.results, []);
});

test('Workspace read-model strips runtime metadata when context is not usable', () => {
  const model = normalizeWorkspaceReadModel({
    readiness: {
      authenticated: true,
      workspaceKnown: false,
      projectKnown: false,
      authorized: false,
      entitled: false,
      schedulerEligible: false,
      healthy: false,
    },
    workplace: { id: 'private-workplace', label: 'Should not leak' },
    project: { id: 'private-project', label: 'Should not leak' },
    team: { id: 'private-team', label: 'Should not leak' },
    seats: [{ id: 'private-seat', label: 'Should not leak', state: 'READY', kind: 'seat' }],
    activeTask: { id: 'private-task', label: 'Should not leak' },
    evidence: [{ id: 'private-evidence', label: 'Should not leak', kind: 'evidence' }],
    results: [{ id: 'private-result', label: 'Should not leak', kind: 'result' }],
  });

  assert.equal(model.contextAvailable, false);
  assert.deepEqual(model.seats, []);
  assert.equal(model.activeTask, null);
  assert.deepEqual(model.evidence, []);
  assert.deepEqual(model.results, []);
});

test('Workspace read-model exposes normalized context only when all readiness gates are true', () => {
  const model = normalizeWorkspaceReadModel({
    readiness: {
      authenticated: true,
      workspaceKnown: true,
      projectKnown: true,
      authorized: true,
      entitled: true,
      schedulerEligible: true,
      healthy: true,
    },
    workplace: { id: 'workplace-real', name: 'Real Workplace' },
    project: { id: 'project-real', name: 'Real Project' },
    team: { id: 'team-real', label: 'Real Team' },
    seats: [{ id: 'seat-real', name: 'Seat 1', state: 'READY', kind: 'seat' }],
    activeTask: { id: 'task-real', name: 'Active Task' },
  });

  assert.equal(model.state, 'READY');
  assert.equal(model.usable, true);
  assert.equal(model.contextAvailable, true);
  assert.deepEqual(model.context, {
    workplace: { id: 'workplace-real', label: 'Real Workplace' },
    project: { id: 'project-real', label: 'Real Project' },
    team: { id: 'team-real', label: 'Real Team' },
  });
  assert.deepEqual(model.seats, [{ id: 'seat-real', label: 'Seat 1', state: 'READY', kind: 'seat' }]);
  assert.deepEqual(model.activeTask, { id: 'task-real', label: 'Active Task' });
  assert.deepEqual(model.evidence, []);
  assert.deepEqual(model.results, []);
});

test('Workspace read-model caps Seat projections at the canonical 10-seat presentation limit', () => {
  const model = normalizeWorkspaceReadModel({
    readiness: {
      authenticated: true,
      workspaceKnown: true,
      projectKnown: true,
      authorized: true,
      entitled: true,
      schedulerEligible: true,
      healthy: true,
    },
    workplace: { id: 'workplace-real', label: 'Real Workplace' },
    project: { id: 'project-real', label: 'Real Project' },
    team: { id: 'team-real', label: 'Real Team' },
    seats: Array.from({ length: 14 }, (_, index) => ({ id: 'seat-' + (index + 1), label: 'Seat ' + (index + 1) })),
  });
  assert.equal(model.contextAvailable, true);
  assert.equal(model.seats.length, 10);
});

test('Workspace facility never embeds invented Workplace or Project choices', () => {
  const facility = readFileSync('frontend/spatial/workspace-capability-facility.js', 'utf8');
  assert.doesNotMatch(facility, /Northstar Workplace|Command Deck|Atlas Migration|Recovery Lab/);
  assert.match(facility, /teamai:workspace-runtime-read-model/);
  assert.match(facility, /setWorkspaceReadModel/);
  assert.match(facility, /readModel\.workplace\.id/);
  assert.match(facility, /readModel\.project\.id/);
});

test('Workspace runtime read-model source/public copies remain exact', () => {
  assert.equal(
    readFileSync('frontend/spatial/workspace-runtime-read-model.js', 'utf8'),
    readFileSync('public/workspace-runtime-read-model.js', 'utf8'),
  );
});
