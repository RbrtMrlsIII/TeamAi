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


test('applies backend-owned Seat turn budget to provider request and returns authoritative accounting', async () => {
  const { createSeatTurnBudgetConfig } = await import('../dist/src/backend/seat-turn-budget.js');
  let observedMaxOutputTokens = null;
  const budget = createSeatTurnBudgetConfig({
    turnBudgetTokens: 12000,
    responsibilityProfile: 'coder',
    outputBudgetTokens: 4000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
    warningThresholdPercent: 0.8,
  });
  const { service: execution } = service(async (request) => {
    observedMaxOutputTokens = request.maxOutputTokens;
    return {
      provider: 'fixture', model: 'model-1', requestId: 'request-budget-1', text: 'bounded',
      usage: { inputTokens: 1200, outputTokens: 3800, totalTokens: 5000 },
    };
  });

  const result = await execution.execute(
    task({
      request: { messages: [{ role: 'user', content: 'budgeted task' }], maxOutputTokens: 9000, stream: false },
      turnBudget: budget,
      estimatedCompletionNeedTokens: 500,
    }),
    'scheduler-1',
    'exec-budget',
  );

  assert.equal(observedMaxOutputTokens, 4000);
  assert.equal(result.status, 'completed');
  assert.equal(result.budget?.configured.responsibilityProfile, 'coder');
  assert.equal(result.budget?.usage.consumedOutputTokens, 3800);
  assert.equal(result.budget?.usage.consumedInputTokens, 1200);
  assert.equal(result.budget?.usage.remainingGenerationTokens, 8200);
  assert.equal(result.budget?.completionState, null);
});

test('budget accounting can request handoff before exhaustion without changing legacy completion semantics', async () => {
  const { createSeatTurnBudgetConfig } = await import('../dist/src/backend/seat-turn-budget.js');
  const budget = createSeatTurnBudgetConfig({
    turnBudgetTokens: 12000,
    responsibilityProfile: 'coder',
    outputBudgetTokens: 4000,
    reasoningBudgetTokens: 5000,
    handoffReserveTokens: 1000,
  });
  const { service: execution } = service(async () => ({
    provider: 'fixture', model: 'model-1', requestId: 'request-budget-2', text: 'handoff candidate',
    usage: { inputTokens: 2000, outputTokens: 10000, totalTokens: 12000 },
  }));

  const result = await execution.execute(
    task({
      request: { messages: [{ role: 'user', content: 'needs continuation' }], maxOutputTokens: 12000, stream: false },
      turnBudget: budget,
      estimatedCompletionNeedTokens: 1500,
    }),
    'scheduler-1',
    'exec-budget-handoff',
  );

  assert.equal(result.status, 'completed');
  assert.equal(result.budget?.state, 'HANDOFF');
  assert.equal(result.budget?.completionState, 'HANDOFF_REQUIRED');
  assert.equal(result.budget?.usage.remainingGenerationTokens, 2000);
});


test('preserves explicit provider completion evidence for a normal completed turn', async () => {
  const { terminationFromOpenAI } = await import('../dist/src/providers/termination.js');
  const { service: execution } = service(async () => ({
    provider: 'fixture', model: 'model-1', requestId: 'request-stop', text: 'done',
    usage: { inputTokens: 2, outputTokens: 2, totalTokens: 4 },
    termination: terminationFromOpenAI('completed'),
  }));
  const result = await execution.execute(task(), 'scheduler-1', 'exec-stop-evidence');
  assert.equal(result.status, 'completed');
  assert.equal(result.result?.termination?.state, 'completed');
  assert.equal(result.result?.termination?.reason, 'stop');
  assert.deepEqual(result.result?.termination?.providerReason, undefined);
});

test('provider max-token termination becomes HANDOFF_REQUIRED instead of completed', async () => {
  const { terminationFromOpenAI } = await import('../dist/src/providers/termination.js');
  const { service: execution, events } = service(async () => ({
    provider: 'fixture', model: 'model-1', requestId: 'request-length', text: 'partial',
    usage: { inputTokens: 3, outputTokens: 16, totalTokens: 19 },
    termination: terminationFromOpenAI('incomplete', 'max_tokens'),
  }));
  const input = task({
    request: { messages: [{ role: 'user', content: 'long task' }], maxOutputTokens: 16, stream: false },
  });
  const result = await execution.execute(input, 'scheduler-1', 'exec-length');
  assert.equal(result.status, 'handoff_required');
  assert.equal(input.status, 'handoff_required');
  assert.equal(result.result?.termination?.reason, 'length');
  assert.deepEqual(events.map((event) => event.type), ['START', 'HANDOFF_REQUIRED']);
});

test('idempotent retry preserves handoff outcome', async () => {
  const { terminationFromAnthropic } = await import('../dist/src/providers/termination.js');
  const { service: execution } = service(async () => ({
    provider: 'fixture', model: 'model-1', requestId: 'request-tool', text: 'tool pending',
    usage: { inputTokens: 4, outputTokens: 4, totalTokens: 8 },
    termination: terminationFromAnthropic('tool_use'),
  }));
  const input = task();
  const first = await execution.execute(input, 'scheduler-1', 'exec-handoff-duplicate');
  const second = await execution.execute(input, 'scheduler-1', 'exec-handoff-duplicate');
  assert.equal(first.status, 'handoff_required');
  assert.equal(second.status, 'handoff_required');
  assert.equal(second.duplicate, true);
});


test('continuation execution starts a fresh budgeted turn from the durable checkpoint', async () => {
  const events = [];
  const calls = [];
  const runtime = new ProviderRuntime(new Map([['fixture', {
    provider: 'fixture',
    async generate(request) {
      calls.push(request);
      return {
        provider: 'fixture',
        model: 'model-2',
        requestId: 'request-cont-1',
        text: 'final implementation',
        usage: { inputTokens: 12, outputTokens: 18, totalTokens: 30 },
        termination: { state: 'completed', reason: 'stop', providerReason: 'stop' },
      };
    },
  }]]));
  const execution = new TaskExecutionService(runtime, {
    async hasIdempotencyKey() { return false; },
    async append(event) { events.push(event); },
  }, {
    async hasResult() { return false; },
    async getResult() { return null; },
    async persist(result) { calls.push({ persisted: result }); },
  });
  const task = {
    id: 'task-cont-1',
    projectId: 'project-1',
    seatId: 'seat-coder',
    provider: 'fixture',
    model: 'model-2',
    status: 'waiting_for_continuation',
    approved: false,
    authorizationStatus: 'authorized',
    connection: { id: 'connection-1', projectId: 'project-1', providerCode: 'fixture', environment: 'development', capabilities: ['execute'], status: 'active' },
    request: { messages: [{ role: 'user', content: 'implement the task' }] },
    turnBudget: {
      turnBudgetTokens: 1000,
      outputBudgetTokens: 400,
      reasoningBudgetTokens: 400,
      handoffReserveTokens: 200,
      warningThresholdPercent: 0.8,
      hardStopPolicy: 'handoff-before-exhaustion',
      responsibilityProfile: 'coder',
      contextInputPolicy: { retention: 'minimal-durable-context' },
    },
  };
  const checkpoint = {
    checkpointId: 'exec-old:checkpoint',
    taskId: task.id,
    projectId: task.projectId,
    seatId: task.seatId,
    actorId: 'actor-1',
    sourceExecutionId: 'exec-old',
    sourceEventId: 'exec-old:handoff:event',
    createdAt: '2026-09-22T00:20:00Z',
    status: 'awaiting_continuation',
    completionState: 'HANDOFF_REQUIRED',
    provider: 'fixture',
    model: 'model-2',
    termination: { state: 'incomplete', reason: 'length' },
    providerOutput: 'partial implementation from the first turn',
    usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
    nextAction: 'authorized-continuation-turn',
  };
  const request = {
    continuationRequestId: 'cont-1',
    taskId: task.id,
    projectId: task.projectId,
    checkpointId: checkpoint.checkpointId,
    sourceSeatId: task.seatId,
    targetSeatId: task.seatId,
    requestedBy: 'actor-1',
    requestedAt: '2026-09-22T00:21:00Z',
    instruction: 'finish the remaining implementation',
    status: 'requested',
    continuationOfCheckpointId: checkpoint.checkpointId,
    nextTurn: 'fresh-budgeted-turn',
  };

  const result = await execution.executeContinuation(task, request, checkpoint, 'actor-1', 'exec-new');
  assert.equal(result.status, 'completed');
  assert.equal(result.continuationRequestId, 'cont-1');
  assert.equal(result.continuationOfCheckpointId, checkpoint.checkpointId);
  assert.equal(task.status, 'completed');
  assert.equal(events[0].type, 'CONTINUE_START');
  assert.equal(events[0].idempotencyKey, 'exec-new');
  assert.equal(calls[0].messages.at(-2).role, 'assistant');
  assert.equal(calls[0].messages.at(-2).content, checkpoint.providerOutput);
  assert.equal(calls[0].messages.at(-1).role, 'user');
  assert.equal(calls[0].messages.at(-1).content, request.instruction);
  assert.ok(calls[0].maxOutputTokens <= 400);
  assert.equal(calls.at(-1).persisted.continuationOfCheckpointId, checkpoint.checkpointId);
});
