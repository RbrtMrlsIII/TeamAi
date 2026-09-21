import test from 'node:test';
import assert from 'node:assert/strict';

import { ProviderRuntime } from '../dist/src/backend/provider-runtime.js';
import { TaskExecutionService } from '../dist/src/backend/task-execution.js';
import {
  TaskContinuationService,
  buildTaskContinuationCheckpoint,
} from '../dist/src/backend/task-continuation.js';

test('continuation chain runs from real handoff checkpoint to a fresh completed turn', async () => {
  const events = [];
  const results = [];
  const checkpoints = new Map();
  const requests = new Map();
  let providerCall = 0;

  const runtime = new ProviderRuntime(new Map([['fixture', {
    provider: 'fixture',
    async generate(request) {
      providerCall += 1;
      assert.ok(request.maxOutputTokens <= 400);
      if (providerCall === 1) {
        return {
          provider: 'fixture',
          model: 'model-4',
          requestId: 'provider-1',
          text: 'partial implementation: database path is complete; executor remains',
          usage: { inputTokens: 20, outputTokens: 380, totalTokens: 400 },
          termination: { state: 'incomplete', reason: 'length', providerReason: 'max_tokens' },
        };
      }
      assert.equal(request.messages.at(-2).role, 'assistant');
      assert.equal(request.messages.at(-2).content, 'partial implementation: database path is complete; executor remains');
      assert.equal(request.messages.at(-1).role, 'user');
      assert.equal(request.messages.at(-1).content, 'finish the executor and verify the task');
      return {
        provider: 'fixture',
        model: 'model-4',
        requestId: 'provider-2',
        text: 'executor completed and verified',
        usage: { inputTokens: 45, outputTokens: 120, totalTokens: 165 },
        termination: { state: 'completed', reason: 'stop', providerReason: 'stop' },
      };
    },
  }]]));

  const task = {
    id: 'task-chain-1',
    projectId: 'project-1',
    seatId: 'seat-coder',
    provider: 'fixture',
    model: 'model-4',
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
    request: {
      messages: [{ role: 'user', content: 'implement and verify the executor' }],
    },
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

  const execution = new TaskExecutionService(
    runtime,
    {
      async hasIdempotencyKey(key) {
        return events.some(event => event.idempotencyKey === key);
      },
      async append(event) {
        events.push(event);
      },
    },
    {
      async hasResult(identity) {
        return results.some(result => result.eventId === identity.eventId);
      },
      async getResult(identity) {
        return results.find(result => result.eventId === identity.eventId) ?? null;
      },
      async persist(result) {
        results.push(result);
      },
    },
    {
      async getCheckpoint(projectId, taskId, checkpointId) {
        return checkpoints.get(projectId + '/' + taskId + '/' + checkpointId) ?? null;
      },
      async persistCheckpoint(checkpoint) {
        checkpoints.set(checkpoint.projectId + '/' + checkpoint.taskId + '/' + checkpoint.checkpointId, checkpoint);
      },
    },
  );

  const first = await execution.execute(task, 'actor-1', 'exec-chain-1');
  assert.equal(first.status, 'handoff_required');
  assert.equal(task.status, 'handoff_required');
  assert.equal(events.map(event => event.type).join(','), 'START,HANDOFF_REQUIRED');

  const checkpointKey = 'project-1/task-chain-1/exec-chain-1:checkpoint';
  const checkpoint = checkpoints.get(checkpointKey);
  assert.ok(checkpoint);
  assert.equal(checkpoint.completionState, 'HANDOFF_REQUIRED');

  const continuation = new TaskContinuationService(
    {
      async getCheckpoint(projectId, taskId, checkpointId) {
        return checkpoints.get(projectId + '/' + taskId + '/' + checkpointId) ?? null;
      },
      async persistCheckpoint(value) {
        checkpoints.set(value.projectId + '/' + value.taskId + '/' + value.checkpointId, value);
      },
    },
    {
      async getRequest(projectId, taskId, requestId) {
        return requests.get(projectId + '/' + taskId + '/' + requestId) ?? null;
      },
      async persistRequest(request) {
        requests.set(request.projectId + '/' + request.taskId + '/' + request.continuationRequestId, request);
      },
    },
    {
      async assertCanContinue(input) {
        assert.equal(input.projectId, 'project-1');
        assert.equal(input.taskId, 'task-chain-1');
        assert.equal(input.targetSeatId, 'seat-coder');
      },
    },
    {
      async ensureWaitingForContinuation({ request }) {
        assert.equal(request.checkpointId, checkpoint.checkpointId);
        task.status = 'waiting_for_continuation';
      },
    },
  );

  const request = await continuation.request({
    taskId: task.id,
    projectId: task.projectId,
    checkpointId: checkpoint.checkpointId,
    continuationRequestId: 'continuation-chain-1',
    targetSeatId: task.seatId,
    actorId: 'actor-1',
    instruction: 'finish the executor and verify the task',
  });
  assert.equal(task.status, 'waiting_for_continuation');
  assert.equal(request.nextTurn, 'fresh-budgeted-turn');

  const final = await execution.executeContinuation(
    task,
    request,
    checkpoint,
    'actor-1',
    'exec-chain-2',
  );

  assert.equal(final.status, 'completed');
  assert.equal(task.status, 'completed');
  assert.equal(final.continuationRequestId, request.continuationRequestId);
  assert.equal(final.continuationOfCheckpointId, checkpoint.checkpointId);
  assert.equal(providerCall, 2);
  assert.deepEqual(events.map(event => event.type), [
    'START',
    'HANDOFF_REQUIRED',
    'CONTINUE_START',
    'COMPLETE',
  ]);

  const finalResult = results.find(result => result.eventId === 'exec-chain-2:complete:event');
  assert.ok(finalResult);
  assert.equal(finalResult.continuationRequestId, request.continuationRequestId);
  assert.equal(finalResult.continuationOfCheckpointId, checkpoint.checkpointId);
});
