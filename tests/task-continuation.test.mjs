import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTaskContinuationCheckpoint, assertContinuationCheckpoint } from '../dist/src/backend/task-continuation.js';

function task() {
  return {
    id: 'task-1',
    projectId: 'project-1',
    seatId: 'seat-coder',
    provider: 'openai',
    model: 'gpt-test',
    status: 'running',
    approved: true,
    authorizationStatus: 'authorized',
    connection: { id: 'connection-1', projectId: 'project-1', providerCode: 'openai', environment: 'development', capabilities: ['execute'], status: 'active' },
    request: { messages: [{ role: 'user', content: 'continue the implementation' }] },
    turnBudget: {
      turnBudgetTokens: 10000,
      outputBudgetTokens: 4000,
      reasoningBudgetTokens: 4000,
      handoffReserveTokens: 2000,
      warningThresholdPercent: 0.8,
      hardStopPolicy: 'handoff-before-exhaustion',
      responsibilityProfile: 'coder',
      contextInputPolicy: { retention: 'minimal-durable-context' },
    },
  };
}

test('continuation checkpoint captures durable provenance without model-private reasoning', () => {
  const result = {
    provider: 'openai',
    model: 'gpt-test',
    requestId: 'req-1',
    text: 'implemented files A and B; C remains',
    usage: { inputTokens: 100, outputTokens: 500, totalTokens: 600, reasoningTokens: 300 },
    termination: { state: 'incomplete', reason: 'length', providerReason: 'max_tokens' },
  };
  const checkpoint = buildTaskContinuationCheckpoint({
    task: task(),
    actorId: 'actor-1',
    idempotencyKey: 'exec-1',
    result,
    budget: {
      configured: task().turnBudget,
      effectiveTurnBudgetTokens: 10000,
      workOutputBudgetTokens: 4000,
      handoffReserveTokens: 2000,
      usage: { reservedTokens: 0, consumedOutputTokens: 500, consumedInputTokens: 100, consumedTotalTokens: 600, remainingGenerationTokens: 9500, usableGenerationTokens: 7500 },
      state: 'HANDOFF',
      completionState: 'HANDOFF_REQUIRED',
      warningThresholdReached: false,
      providerOutputCeilingTokens: 4000,
    },
    occurredAt: '2026-09-22T00:00:00.000Z',
  });

  assert.equal(checkpoint.checkpointId, 'exec-1:checkpoint');
  assert.equal(checkpoint.sourceExecutionId, 'exec-1');
  assert.equal(checkpoint.sourceEventId, 'exec-1:handoff:event');
  assert.equal(checkpoint.status, 'awaiting_continuation');
  assert.equal(checkpoint.completionState, 'HANDOFF_REQUIRED');
  assert.equal(checkpoint.nextAction, 'authorized-continuation-turn');
  assert.equal(checkpoint.providerOutput, result.text);
  assert.equal(checkpoint.usage.reasoningTokens, 300);
  assertContinuationCheckpoint(checkpoint);
  assert.equal('reasoning' in checkpoint, false);
});

test('continuation checkpoint rejects completed provider termination', () => {
  assert.throws(() => buildTaskContinuationCheckpoint({
    task: task(),
    actorId: 'actor-1',
    idempotencyKey: 'exec-2',
    result: {
      provider: 'openai', model: 'gpt-test', requestId: 'req-2', text: 'done',
      usage: { inputTokens: 10, outputTokens: 10, totalTokens: 20 },
      termination: { state: 'completed', reason: 'stop' },
    },
  }), /incomplete provider termination/);
});


test('continuation request requires checkpoint authorization and creates a fresh-turn relationship', async () => {
  const events = [];
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint(projectId, taskId, checkpointId) {
        assert.deepEqual({ projectId, taskId, checkpointId }, {
          projectId: 'project-1',
          taskId: 'task-1',
          checkpointId: 'exec-1:checkpoint',
        });
        return buildTaskContinuationCheckpoint({
          task: task(),
          actorId: 'actor-1',
          idempotencyKey: 'exec-1',
          result: {
            provider: 'openai',
            model: 'gpt-test',
            requestId: 'req-1',
            text: 'partial work',
            usage: { inputTokens: 10, outputTokens: 20, totalTokens: 30 },
            termination: { state: 'incomplete', reason: 'length', providerReason: 'max_tokens' },
          },
          occurredAt: '2026-09-22T00:00:00.000Z',
        });
      },
      async persistCheckpoint() {},
    },
    {
      async getRequest() { return null; },
      async persistRequest(request) { events.push(request); },
    },
    {
      async assertCanContinue(input) {
        events.push({
          authorization: 'checked',
          targetSeatId: input.targetSeatId,
          actorId: input.actorId,
          checkpointId: input.checkpoint.checkpointId,
        });
      },
    },
  );

  const request = await service.request({
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: 'exec-1:checkpoint',
    continuationRequestId: 'cont-1',
    targetSeatId: 'seat-coder-2',
    actorId: 'actor-1',
    instruction: 'Continue from the saved checkpoint and finish the unresolved work.',
    requestedAt: '2026-09-22T00:01:00.000Z',
  });

  assert.equal(request.continuationRequestId, 'cont-1');
  assert.equal(request.checkpointId, 'exec-1:checkpoint');
  assert.equal(request.continuationOfCheckpointId, 'exec-1:checkpoint');
  assert.equal(request.sourceSeatId, 'seat-coder');
  assert.equal(request.targetSeatId, 'seat-coder-2');
  assert.equal(request.nextTurn, 'fresh-budgeted-turn');
  assert.equal(request.status, 'requested');
  assert.equal(events[0].authorization, 'checked');
  assert.equal(events[1].targetSeatId, 'seat-coder-2');
});

test('continuation request rejects a checkpoint outside the requested task/project scope', async () => {
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() {
        return {
          ...buildTaskContinuationCheckpoint({
            task: task(),
            actorId: 'actor-1',
            idempotencyKey: 'exec-1',
            result: {
              provider: 'openai',
              model: 'gpt-test',
              requestId: 'req-1',
              text: 'partial',
              usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
              termination: { state: 'incomplete', reason: 'length' },
            },
          }),
          projectId: 'other-project',
        };
      },
      async persistCheckpoint() {},
    },
    { async persistRequest() {}, async getRequest() { return null; } },
    { async assertCanContinue() { throw new Error('must not authorize'); } },
  );

  await assert.rejects(
    service.request({
      taskId: 'task-1',
      projectId: 'project-1',
      checkpointId: 'exec-1:checkpoint',
      continuationRequestId: 'cont-2',
      targetSeatId: 'seat-coder-2',
      actorId: 'actor-1',
      instruction: 'continue',
    }),
    /continuation_checkpoint_scope_mismatch/,
  );
});


test('continuation request retries with the same identity are idempotent', async () => {
  let writes = 0;
  const existingRequest = {
    continuationRequestId: 'cont-3',
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: 'exec-1:checkpoint',
    sourceSeatId: 'seat-coder',
    targetSeatId: 'seat-coder-2',
    requestedBy: 'actor-1',
    requestedAt: '2026-09-22T00:04:00.000Z',
    instruction: 'continue',
    status: 'requested',
    continuationOfCheckpointId: 'exec-1:checkpoint',
    nextTurn: 'fresh-budgeted-turn',
  };
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() {
        return {
          ...buildTaskContinuationCheckpoint({
            task: task(),
            actorId: 'actor-1',
            idempotencyKey: 'exec-1',
            result: {
              provider: 'openai',
              model: 'gpt-test',
              requestId: 'req-1',
              text: 'partial',
              usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
              termination: { state: 'incomplete', reason: 'length' },
            },
          }),
        };
      },
      async persistCheckpoint() {},
    },
    {
      async getRequest() { return writes ? existingRequest : null; },
      async persistRequest() { writes += 1; },
    },
    { async assertCanContinue() { throw new Error('authorization should not run after an existing idempotent request'); } },
  );

  // First request requires authorization and persistence.
  const firstService = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() {
        return buildTaskContinuationCheckpoint({
          task: task(),
          actorId: 'actor-1',
          idempotencyKey: 'exec-1',
          result: {
            provider: 'openai',
            model: 'gpt-test',
            requestId: 'req-1',
            text: 'partial',
            usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
            termination: { state: 'incomplete', reason: 'length' },
          },
        });
      },
      async persistCheckpoint() {},
    },
    {
      async getRequest() { return null; },
      async persistRequest() { writes += 1; },
    },
    { async assertCanContinue() {} },
  );
  await firstService.request({
    taskId: 'task-1', projectId: 'project-1', checkpointId: 'exec-1:checkpoint',
    continuationRequestId: 'cont-3', targetSeatId: 'seat-coder-2', actorId: 'actor-1',
    instruction: 'continue',
  });
  assert.equal(writes, 1);

  const retry = await service.request({
    taskId: 'task-1', projectId: 'project-1', checkpointId: 'exec-1:checkpoint',
    continuationRequestId: 'cont-3', targetSeatId: 'seat-coder-2', actorId: 'actor-1',
    instruction: 'continue',
  });
  assert.equal(retry.continuationRequestId, 'cont-3');
  assert.equal(writes, 1);
});

test('continuation request ID conflicts when a retry changes its relation or instruction', async () => {
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() {
        return buildTaskContinuationCheckpoint({
          task: task(),
          actorId: 'actor-1',
          idempotencyKey: 'exec-1',
          result: {
            provider: 'openai',
            model: 'gpt-test',
            requestId: 'req-1',
            text: 'partial',
            usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
            termination: { state: 'incomplete', reason: 'length' },
          },
        });
      },
      async persistCheckpoint() {},
    },
    {
      async getRequest() {
        return {
          continuationRequestId: 'cont-4',
          taskId: 'task-1',
          projectId: 'project-1',
          checkpointId: 'exec-1:checkpoint',
          sourceSeatId: 'seat-coder',
          targetSeatId: 'seat-coder-2',
          requestedBy: 'actor-1',
          requestedAt: '2026-09-22T00:05:00.000Z',
          instruction: 'continue existing',
          status: 'requested',
          continuationOfCheckpointId: 'exec-1:checkpoint',
          nextTurn: 'fresh-budgeted-turn',
        };
      },
      async persistRequest() { throw new Error('must not write on conflict'); },
    },
    { async assertCanContinue() { throw new Error('must not authorize on conflict'); } },
  );

  await assert.rejects(
    service.request({
      taskId: 'task-1', projectId: 'project-1', checkpointId: 'exec-1:checkpoint',
      continuationRequestId: 'cont-4', targetSeatId: 'seat-coder-2', actorId: 'actor-1',
      instruction: 'changed instruction',
    }),
    /continuation_request_id_conflict/,
  );
});

test('continuation request ensures handoff task enters waiting_for_continuation state', async () => {
  const calls = [];
  const checkpoint = buildTaskContinuationCheckpoint({
    task: task(),
    actorId: 'actor-1',
    idempotencyKey: 'exec-state-1',
    result: {
      provider: 'openai',
      model: 'gpt-test',
      requestId: 'req-state-1',
      text: 'partial',
      usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      termination: { state: 'incomplete', reason: 'length' },
    },
  });
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    { async getCheckpoint() { return checkpoint; }, async persistCheckpoint() {} },
    { async getRequest() { return null; }, async persistRequest(request) { calls.push('request:' + request.status); } },
    { async assertCanContinue() { calls.push('authorization'); } },
    { async ensureWaitingForContinuation({ request }) {
      calls.push('state:' + request.continuationRequestId);
    } },
  );

  const request = await service.request({
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: checkpoint.checkpointId,
    continuationRequestId: 'cont-state-1',
    targetSeatId: 'seat-coder',
    actorId: 'actor-1',
    instruction: 'continue',
  });

  assert.equal(request.nextTurn, 'fresh-budgeted-turn');
  assert.deepEqual(calls, ['authorization', 'request:requested', 'state:cont-state-1']);
});

test('idempotent continuation retry re-heals waiting_for_continuation state', async () => {
  const existingRequest = {
    continuationRequestId: 'cont-state-2',
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: 'exec-state-2:checkpoint',
    sourceSeatId: 'seat-coder',
    targetSeatId: 'seat-coder',
    requestedBy: 'actor-1',
    requestedAt: '2026-09-22T00:07:00.000Z',
    instruction: 'continue',
    status: 'requested',
    continuationOfCheckpointId: 'exec-state-2:checkpoint',
    nextTurn: 'fresh-budgeted-turn',
  };
  const calls = [];
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() {
        throw new Error('checkpoint should not be reread for an idempotent request');
      },
      async persistCheckpoint() {},
    },
    { async getRequest() { return existingRequest; }, async persistRequest() { throw new Error('must not persist'); } },
    { async assertCanContinue() { throw new Error('must not reauthorize'); } },
    { async ensureWaitingForContinuation({ request }) { calls.push(request.continuationRequestId); } },
  );

  const result = await service.request({
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: existingRequest.checkpointId,
    continuationRequestId: existingRequest.continuationRequestId,
    targetSeatId: existingRequest.targetSeatId,
    actorId: existingRequest.requestedBy,
    instruction: existingRequest.instruction,
  });

  assert.equal(result.continuationRequestId, existingRequest.continuationRequestId);
  assert.deepEqual(calls, ['cont-state-2']);
});



test('continuation request ID conflicts when the checkpoint relation changes', async () => {
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    {
      async getCheckpoint() { throw new Error('must not load checkpoint on request-id conflict'); },
      async persistCheckpoint() {},
    },
    {
      async getRequest() {
        return {
          continuationRequestId: 'cont-5',
          taskId: 'task-1',
          projectId: 'project-1',
          checkpointId: 'exec-old:checkpoint',
          sourceSeatId: 'seat-coder',
          targetSeatId: 'seat-coder',
          requestedBy: 'actor-1',
          requestedAt: '2026-09-22T00:06:00.000Z',
          instruction: 'continue',
          status: 'requested',
          continuationOfCheckpointId: 'exec-old:checkpoint',
          nextTurn: 'fresh-budgeted-turn',
        };
      },
      async persistRequest() { throw new Error('must not persist'); },
    },
    { async assertCanContinue() { throw new Error('must not authorize'); } },
  );

  await assert.rejects(
    service.request({
      taskId: 'task-1',
      projectId: 'project-1',
      checkpointId: 'exec-new:checkpoint',
      continuationRequestId: 'cont-5',
      targetSeatId: 'seat-coder',
      actorId: 'actor-1',
      instruction: 'continue',
    }),
    /continuation_request_id_conflict/,
  );
});


test('terminal continuation request retry remains idempotent without reopening task state', async () => {
  const existingRequest = {
    continuationRequestId: 'cont-terminal',
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: 'exec-terminal:checkpoint',
    sourceSeatId: 'seat-coder',
    targetSeatId: 'seat-coder',
    requestedBy: 'actor-1',
    requestedAt: '2026-09-22T00:40:00.000Z',
    instruction: 'finish',
    status: 'completed',
    continuationOfCheckpointId: 'exec-terminal:checkpoint',
    nextTurn: 'fresh-budgeted-turn',
    executionId: 'exec-terminal',
    completedAt: '2026-09-22T00:41:00.000Z',
  };
  let stateCalls = 0;
  const service = new (await import('../dist/src/backend/task-continuation.js')).TaskContinuationService(
    { async getCheckpoint() { throw new Error('checkpoint should not be loaded for a terminal idempotent request'); }, async persistCheckpoint() {} },
    { async getRequest() { return existingRequest; }, async persistRequest() { throw new Error('must not persist'); } },
    { async assertCanContinue() { throw new Error('must not authorize'); } },
    { async ensureWaitingForContinuation() { stateCalls += 1; } },
  );

  const result = await service.request({
    taskId: 'task-1',
    projectId: 'project-1',
    checkpointId: 'exec-terminal:checkpoint',
    continuationRequestId: 'cont-terminal',
    targetSeatId: 'seat-coder',
    actorId: 'actor-1',
    instruction: 'finish',
  });

  assert.equal(result.status, 'completed');
  assert.equal(stateCalls, 0);
});
