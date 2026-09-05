import test from 'node:test';
import assert from 'node:assert/strict';
import { selectEligibleSeat } from '../dist/src/backend/scheduler.js';
import { assertStateIdentity, assertUidOwnership } from '../dist/src/backend/domain-state.js';

test('scheduler selects only an authorized capable and skilled seat', () => {
  const task = {
    id: 'task-1',
    projectId: 'project-1',
    priority: 1,
    status: 'ready',
    requirements: {
      taskType: 'implementation',
      field: 'backend',
      requiredSkills: ['typescript'],
      requiredCapabilities: ['execute'],
    },
  };

  const seats = [
    {
      id: 'seat-z', projectId: 'project-1', field: 'backend', skills: ['typescript'],
      capabilities: ['execute'], allowedTaskTypes: ['implementation'], status: 'active', authorization: 'authorized',
    },
    {
      id: 'seat-a', projectId: 'project-1', field: 'backend', skills: ['typescript'],
      capabilities: ['execute'], allowedTaskTypes: ['implementation'], status: 'active', authorization: 'authorized',
    },
  ];

  assert.deepEqual(selectEligibleSeat(task, seats), {
    taskId: 'task-1',
    eligibleSeatId: 'seat-a',
    reason: 'ELIGIBLE',
  });
});

test('scheduler never selects across projects', () => {
  const task = {
    id: 'task-2', projectId: 'project-2', priority: 1, status: 'ready',
    requirements: { taskType: 'implementation', field: 'backend', requiredSkills: [], requiredCapabilities: [] },
  };
  const seats = [{
    id: 'seat-1', projectId: 'project-1', field: 'backend', skills: [], capabilities: [],
    allowedTaskTypes: ['implementation'], status: 'active', authorization: 'authorized',
  }];

  assert.equal(selectEligibleSeat(task, seats).reason, 'NO_PROJECT_MATCH');
});

test('scheduler refuses non-ready work', () => {
  const task = {
    id: 'task-3', projectId: 'project-1', priority: 1, status: 'running',
    requirements: { taskType: 'implementation', field: 'backend', requiredSkills: [], requiredCapabilities: [] },
  };
  assert.equal(selectEligibleSeat(task, []).reason, 'TASK_NOT_READY');
});

test('UID ownership rejects cross-account state access', () => {
  assertUidOwnership('uid-1', 'uid-1');
  assert.throws(() => assertUidOwnership('uid-1', 'uid-2'), /not owned by the authenticated Firebase UID/);
});

test('state identity rejects empty entity ids', () => {
  assert.doesNotThrow(() => assertStateIdentity('uid-1', 'project-1', 'project'));
  assert.throws(() => assertStateIdentity('uid-1', '', 'project'), /project id is required/);
});
