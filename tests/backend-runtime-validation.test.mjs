import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ProviderInvocationError,
  ProviderRuntime,
  assertInvocationAllowed,
} from '../dist/src/backend/provider-runtime.js';

function invocation(overrides = {}) {
  return {
    taskId: 'task-42',
    projectId: 'project-1',
    seatId: 'seat-beta',
    provider: 'fixture',
    model: 'model-1',
    executionStatus: 'running',
    approved: true,
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

test('allows an approved running invocation with an active matching execute-capable connection', () => {
  assert.doesNotThrow(() => assertInvocationAllowed(invocation()));
});

test('blocks invocation when approval is missing', () => {
  assert.throws(
    () => assertInvocationAllowed(invocation({ approved: false })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'APPROVAL_REQUIRED',
  );
});

test('blocks invocation when connection is inactive', () => {
  assert.throws(
    () => assertInvocationAllowed(invocation({ connection: { ...invocation().connection, status: 'inactive' } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'CONNECTION_INACTIVE',
  );
});

test('blocks invocation when project or provider scope does not match the connection', () => {
  assert.throws(
    () => assertInvocationAllowed(invocation({ connection: { ...invocation().connection, projectId: 'project-other' } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'PROJECT_MISMATCH',
  );
  assert.throws(
    () => assertInvocationAllowed(invocation({ connection: { ...invocation().connection, providerCode: 'other' } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'PROVIDER_MISMATCH',
  );
});

test('blocks invocation when execute capability is absent', () => {
  assert.throws(
    () => assertInvocationAllowed(invocation({ connection: { ...invocation().connection, capabilities: [] } })),
    (error) => error instanceof ProviderInvocationError && error.reason === 'EXECUTE_CAPABILITY_MISSING',
  );
});

test('ProviderRuntime only reaches the registered provider after the gate passes', async () => {
  let calls = 0;
  const runtime = new ProviderRuntime(new Map([
    ['fixture', {
      provider: 'fixture',
      generate: async (request) => {
        calls += 1;
        return {
          provider: 'fixture',
          model: request.model,
          requestId: 'runtime-check',
          text: 'ok',
          usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 },
        };
      },
    }],
  ]));

  const result = await runtime.invoke(invocation());
  assert.equal(result.text, 'ok');
  assert.equal(calls, 1);
});
