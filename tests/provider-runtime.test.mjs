import test from 'node:test';
import assert from 'node:assert/strict';
import { ProviderRuntime, ProviderInvocationError } from '../dist/src/backend/provider-runtime.js';

function request(overrides = {}) {
  return {
    taskId: 'task-1',
    projectId: 'project-1',
    seatId: 'seat-beta',
    provider: 'fixture',
    model: 'model-1',
    executionStatus: 'running',
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
      messages: [{ role: 'user', content: 'hello' }],
      maxOutputTokens: 16,
      stream: false,
    },
    ...overrides,
  };
}

test('provider runtime invokes only an approved authorized running task with a scoped executable connection', async () => {
  let called = false;
  const provider = {
    provider: 'fixture',
    async generate(input) {
      called = true;
      assert.equal(input.model, 'model-1');
      return {
        provider: 'fixture',
        model: 'model-1',
        requestId: 'req-1',
        text: 'ok',
        usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
      };
    },
  };

  const runtime = new ProviderRuntime(new Map([['fixture', provider]]));
  const result = await runtime.invoke(request());

  assert.equal(called, true);
  assert.equal(result.text, 'ok');
});

test('provider runtime blocks unapproved execution before provider call', async () => {
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', async generate() { throw new Error('must not call'); } }]]));
  await assert.rejects(
    runtime.invoke(request({ approved: false })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'APPROVAL_REQUIRED'
  );
});

test('provider runtime blocks unauthorized execution before provider call', async () => {
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', async generate() { throw new Error('must not call'); } }]]));
  await assert.rejects(
    runtime.invoke(request({ authorizationStatus: 'suspended' })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'AUTHORIZATION_REQUIRED'
  );
});

test('provider runtime blocks inactive or mis-scoped connections', async () => {
  const runtime = new ProviderRuntime(new Map([['fixture', { provider: 'fixture', async generate() { throw new Error('must not call'); } }]]));

  await assert.rejects(
    runtime.invoke(request({ executionStatus: 'pending' })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'TASK_NOT_RUNNING'
  );
  await assert.rejects(
    runtime.invoke(request({ connection: { ...request().connection, status: 'revoked' } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'CONNECTION_INACTIVE'
  );
  await assert.rejects(
    runtime.invoke(request({ connection: { ...request().connection, projectId: 'other-project' } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'PROJECT_MISMATCH'
  );
  await assert.rejects(
    runtime.invoke(request({ connection: { ...request().connection, capabilities: ['read'] } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'EXECUTE_CAPABILITY_MISSING'
  );
});
