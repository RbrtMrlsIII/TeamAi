import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TaskQueueRepository,
  allDependenciesCompleted,
  isValidTaskTransition,
} from '../dist/src/task-scheduler.js';

function createFakeDb() {
  const state = {
    queries: [],
    task: {
      id: 'task-1',
      execution_run_id: 'run-1',
      sequence_no: 1,
      title: 'A',
      status: 'pending',
      attempt_count: 0,
      priority: 2,
      available_at: new Date().toISOString(),
      claimed_by: null,
      claimed_at: null,
      started_at: null,
      finished_at: null,
    },
  };

  return {
    get queries() {
      return state.queries;
    },
    async query(sql, params = []) {
      state.queries.push({ sql, params });
      if (sql.includes('INSERT INTO execution_tasks')) {
        return { rows: [{ ...state.task }], rowCount: 1 };
      }
      if (sql.includes('INSERT INTO execution_task_dependencies') && !sql.includes('SELECT')) {
        return { rows: [{ task_id: params[0], depends_on_task_id: params[1] }], rowCount: 1 };
      }
      if (sql.includes('SELECT task_id,depends_on_task_id')) {
        return { rows: [{ task_id: params[0], depends_on_task_id: params[1] }], rowCount: 1 };
      }
      if (sql.includes('WITH candidate AS')) {
        state.task = {
          ...state.task,
          status: 'running',
          attempt_count: 1,
          claimed_by: params[1],
          claimed_at: params[2],
          started_at: params[2],
        };
        return { rows: [{ ...state.task }], rowCount: 1 };
      }
      if (sql.startsWith('SELECT * FROM execution_tasks')) {
        return { rows: [{ ...state.task }], rowCount: 1 };
      }
      if (sql.includes('UPDATE execution_tasks')) {
        state.task = {
          ...state.task,
          status: params[2],
          result_json: params[3] ? JSON.parse(params[4] ?? '{}') : state.task.result_json,
        };
        return { rows: [{ ...state.task }], rowCount: 1 };
      }
      if (sql.includes('SELECT * FROM execution_task_events')) {
        return { rows: [], rowCount: 0 };
      }
      return { rows: [], rowCount: 0 };
    },
  };
}

test('eligible work requires every dependency to be completed', () => {
  assert.equal(
    allDependenciesCompleted(
      { status: 'pending' },
      [{ status: 'completed' }, { status: 'completed' }],
    ),
    true,
  );
  assert.equal(
    allDependenciesCompleted(
      { status: 'pending' },
      [{ status: 'completed' }, { status: 'running' }],
    ),
    false,
  );
  assert.equal(allDependenciesCompleted({ status: 'running' }, []), false);
});

test('task transition table prevents invalid durable states', () => {
  assert.equal(isValidTaskTransition('pending', 'running'), true);
  assert.equal(isValidTaskTransition('completed', 'running'), false);
  assert.equal(isValidTaskTransition('running', 'completed'), true);
});

test('task repository emits durable claim and transition events', async () => {
  const db = createFakeDb();
  const repo = new TaskQueueRepository(db);
  const task = await repo.createTask({
    executionRunId: 'run-1',
    sequenceNo: 1,
    title: 'A',
    priority: 2,
  });
  assert.equal(task.id, 'task-1');

  const dependency = await repo.addDependency('task-2', 'task-1');
  assert.deepEqual(dependency, {
    task_id: 'task-2',
    depends_on_task_id: 'task-1',
  });

  const claimed = await repo.claimNextEligibleTask(
    'run-1',
    'worker-1',
    '2026-09-02T07:00:00.000Z',
  );
  assert.equal(claimed.status, 'running');
  assert.equal(claimed.attempt_count, 1);

  const completed = await repo.transitionTask(
    'task-1',
    'completed',
    { ok: true },
    'task_completed',
  );
  assert.equal(completed.status, 'completed');
  assert.ok(
    db.queries.filter((query) => query.sql.includes('execution_task_events')).length >= 2,
  );
});

test('task repository rejects self-dependencies before persistence', async () => {
  const repo = new TaskQueueRepository(createFakeDb());
  await assert.rejects(
    () => repo.addDependency('task-1', 'task-1'),
    /cannot depend on itself/,
  );
});
