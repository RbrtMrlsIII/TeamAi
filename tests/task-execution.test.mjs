import test from 'node:test';
import assert from 'node:assert/strict';
import { ProviderRuntime } from '../dist/src/backend/provider-runtime.js';
import { TaskExecutionService } from '../dist/src/backend/task-execution.js';

function task(overrides = {}) {
  return {
    id: 'task-42',
    projectId: 'project-1',
    seatId: 'seat-beta',
    provider: 'fixture',
    model: 'model-1',
    status: 'waiting_approval',
    approved: true,
    authorizationStatus: 'authorized',
    connection: {
      id: 'connection-1',
      projectId: 'project-1',
      providerCode: 'fixture',
      environment: 'development',
      capabilities: ['execute'],
      status: 'active',
    },
    request: { messages: [{ role: 'user', content: 'run task' }], maxOutputTokens: 16, stream: false },
    ...overrides,
  };
}

function service(generate) {
  const events = [];
  const keys = new Set();
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', generate }]]));
  return {
    service: new TaskExecutionService(runtime, {
      async hasIdempotencyKey(key) { return keys.has(key); },
      async append(event) { keys.add(event.idempotencyKey); events.push(event); },
    }),
    events,
  };
}

test('executes an approved authorized task through ProviderRuntime and records START then COMPLETE', async () => {
  let calls = 0;
  const { service: execution, events } = service(async (request) => {
    calls += 1;
    assert.equal(request.model, 'model-1');
    return {
      provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    };
  });
  const input = task();
  const result = await execution.execute(input, 'scheduler-1', 'exec-42');
  assert.equal(result.status, 'completed');
  assert.equal(result.duplicate, false);
  assert.equal(input.status, 'completed');
  assert.equal(calls, 1);
  assert.deepEqual(events.map((event) => event.type), ['START', 'COMPLETE']);
  assert.equal(events[0].idempotencyKey, 'exec-42');
  assert.equal(events[1].idempotencyKey, 'exec-42:complete');
});

test('blocks unapproved task before recording execution events', async () => {
  const { service: execution, events } = service(async () => { throw new Error('must not run'); });
  await assert.rejects(execution.execute(task({ approved: false }), 'scheduler-1', 'exec-blocked'), /requires approval/);
  assert.equal(events.length, 0);
});

test('blocks unauthorized task before recording execution events', async () => {
  const { service: execution, events } = service(async () => { throw new Error('must not run'); });
  await assert.rejects(
    execution.execute(task({ authorizationStatus: 'suspended' }), 'scheduler-1', 'exec-auth-blocked'),
    /requires authorization/,
  );
  assert.equal(events.length, 0);
});

test('blocks a task that is not waiting for approval', async () => {
  const { service: execution, events } = service(async () => { throw new Error('must not run'); });
  await assert.rejects(execution.execute(task({ status: 'ready' }), 'scheduler-1', 'exec-state'), /requires waiting_approval state/);
  assert.equal(events.length, 0);
});

test('records FAIL and leaves the task failed when ProviderRuntime rejects execution', async () => {
  const { service: execution, events } = service(async () => { throw new Error('provider unavailable'); });
  const input = task();
  const result = await execution.execute(input, 'scheduler-1', 'exec-fail');
  assert.equal(result.status, 'failed');
  assert.equal(input.status, 'failed');
  assert.match(String(result.error), /provider unavailable/);
  assert.deepEqual(events.map((event) => event.type), ['START', 'FAIL']);
});

test('returns duplicate without invoking provider twice', async () => {
  let calls = 0;
  const { service: execution } = service(async () => {
    calls += 1;
    return {
      provider: 'fixture', model: 'model-1', requestId: 'request-1', text: 'done',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
    };
  });
  const input = task();
  const first = await execution.execute(input, 'scheduler-1', 'exec-dup');
  const second = await execution.execute(input, 'scheduler-1', 'exec-dup');
  assert.equal(first.duplicate, false);
  assert.equal(second.duplicate, true);
  assert.equal(calls, 1);
});
