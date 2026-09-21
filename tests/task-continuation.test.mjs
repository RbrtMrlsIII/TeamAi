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
