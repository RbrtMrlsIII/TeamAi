import test from 'node:test';
import assert from 'node:assert/strict';
import { ProviderRuntime } from '../dist/src/backend/provider-runtime.js';
import { TaskRuntimeBridge } from '../dist/src/backend/task-runtime-bridge.js';

function makeFixture() {
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

  const seat = {
    id: 'seat-a',
    projectId: 'project-1',
    field: 'backend',
    skills: ['typescript'],
    capabilities: ['execute'],
    allowedTaskTypes: ['implementation'],
    status: 'active',
    authorization: 'authorized',
  };

  const executable = {
    id: 'task-1',
    projectId: 'project-1',
    seatId: 'seat-a',
    provider: 'fixture',
    model: 'model-1',
    status: 'waiting_approval',
    approved: true,
    authorizationStatus: 'authorized',
    connection: {
      id: 'connection-1', projectId: 'project-1', providerCode: 'fixture',
      environment: 'development', capabilities: ['execute'], status: 'active',
    },
    request: { messages: [{ role: 'user', content: 'run' }], maxOutputTokens: 8, stream: false },
  };

  let leased = false;
  const events = [];
  const keys = new Set();
  const bridge = new TaskRuntimeBridge(
    new ProviderRuntime(new Map([['fixture', {
      provider: 'fixture',
      async generate() {
        return {
          provider: 'fixture', model: 'model-1', requestId: 'req-1', text: 'done',
          usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        };
      },
    }]])),
    {
      async getSchedulerTask() { return { ...task, status: leased ? 'ready' : task.status }; },
      async listSchedulerSeats() { return [seat]; },
      async getExecutableTask() { return executable; },
    },
    {
      async leaseReadyTask({ taskId, seatId, leaseId }) {
        if (leased) return { acquired: false, taskId, reason: 'ALREADY_LEASED' };
        leased = true;
        return { acquired: true, taskId, seatId, leaseId, status: 'leased' };
      },
    },
    {
      async approveLeasedTask() { return { approved: true }; },
    },
    {
      async hasIdempotencyKey(key) { return keys.has(key); },
      async append(event) { keys.add(event.idempotencyKey); events.push(event); },
    },
  );

  return { bridge, events };
}

test('runtime bridge preserves schedule → lease → approval → trusted execution ordering', async () => {
  const { bridge, events } = makeFixture();
  const result = await bridge.executeApproved('task-1', 'scheduler-1', 'lease-1');
  assert.equal(result.stage, 'executed');
  assert.equal(result.result.status, 'completed');
  assert.deepEqual(events.map((event) => event.type), ['START', 'COMPLETE']);
});

test('runtime bridge does not execute when an atomic lease is already taken', async () => {
  const { bridge } = makeFixture();
  const first = await bridge.lease('task-1', 'worker-a', 'lease-1');
  assert.equal(first.stage, 'leased');
  const second = await bridge.lease('task-1', 'worker-b', 'lease-2');
  assert.equal(second.stage, 'scheduled');
  assert.equal(second.decision.eligibleSeatId, null);
  assert.equal(second.decision.reason, 'TASK_NOT_READY');
});
