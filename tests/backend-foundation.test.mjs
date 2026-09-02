import test from 'node:test';
import assert from 'node:assert/strict';
import { authorityFor, assertAuthority } from '../dist/src/backend/authority.js';
import { accountPath, projectPath, taskPath } from '../dist/src/backend/firestore-paths.js';
import { resolveEffectiveSkills } from '../dist/src/backend/skill-resolution.js';
import { assertDurableEvent, transitionTask } from '../dist/src/backend/task-state.js';

test('backend authority map has canonical owners', () => {
  assert.equal(authorityFor('identity'), 'firebase-auth');
  assert.equal(authorityFor('application'), 'firestore-default');
  assert.equal(authorityFor('execution'), 'supabase-edge-functions');
  assert.equal(authorityFor('payment'), 'paypal');
  assert.doesNotThrow(() => assertAuthority('application', 'firestore-default'));
  assert.throws(() => assertAuthority('application', 'supabase-edge-functions'), /authority violation/);
});

test('Firestore paths preserve account ownership hierarchy', () => {
  assert.equal(accountPath('u1'), 'accounts/u1');
  assert.equal(projectPath('u1', 'w1', 'p1'), 'accounts/u1/workplaces/w1/projects/p1');
  assert.equal(taskPath('u1', 'w1', 'p1', 't1'), 'accounts/u1/workplaces/w1/projects/p1/tasks/t1');
});

test('effective skills resolve deterministically', () => {
  const skills = resolveEffectiveSkills({
    projectType: 'web', field: 'frontend', taskType: 'routing', provider: 'openai', runtime: 'direct-api',
    tools: ['browser', 'github'], baseSkills: ['least-privilege'], projectSkills: ['responsive-ui'],
  });
  assert.deepEqual(skills, [...skills].sort());
  assert.ok(skills.includes('field:frontend'));
  assert.ok(skills.includes('tool:browser'));
});

test('durable task transitions reject invalid terminal mutations', () => {
  assert.equal(transitionTask('pending', 'READY'), 'ready');
  assert.equal(transitionTask('ready', 'LEASE'), 'leased');
  assert.equal(transitionTask('running', 'COMPLETE'), 'completed');
  assert.throws(() => transitionTask('completed', 'START'), /invalid task transition/);
  assert.doesNotThrow(() => assertDurableEvent({
    eventId: 'evt-1', idempotencyKey: 'idem-1', type: 'COMPLETE', actorId: 'system', occurredAt: new Date().toISOString()
  }));
});
