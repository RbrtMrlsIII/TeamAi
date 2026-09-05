import type { ProjectConnection } from '../connections.js';
import type { GenerateRequest, GenerateResult, AIProvider } from '../providers/types.js';
import type { ExecutionStatus } from '../execution-state.js';

export type ProviderInvocationBlockReason =
  | 'TASK_NOT_RUNNING'
  | 'APPROVAL_REQUIRED'
  | 'CONNECTION_INACTIVE'
  | 'PROJECT_MISMATCH'
  | 'PROVIDER_MISMATCH'
  | 'EXECUTE_CAPABILITY_MISSING'
  | 'PROVIDER_NOT_REGISTERED';

export interface ProviderInvocationRequest {
  taskId: string;
  projectId: string;
  seatId: string;
  provider: string;
  model: string;
  executionStatus: ExecutionStatus;
  approved: boolean;
  connection: ProjectConnection;
  request: Omit<GenerateRequest, 'model'>;
}

export class ProviderInvocationError extends Error {
  readonly reason: ProviderInvocationBlockReason;

  constructor(reason: ProviderInvocationBlockReason, message: string) {
    super(message);
    this.name = 'ProviderInvocationError';
    this.reason = reason;
  }
}

export class ProviderRuntime {
  constructor(private readonly providers: Map<string, AIProvider>) {}

  async invoke(input: ProviderInvocationRequest): Promise<GenerateResult> {
    assertInvocationAllowed(input);
    const provider = this.providers.get(input.provider);
    if (!provider) {
      throw new ProviderInvocationError(
        'PROVIDER_NOT_REGISTERED',
        `provider not registered: ${input.provider}`
      );
    }

    return provider.generate({
      ...input.request,
      model: input.model,
    });
  }
}

export function assertInvocationAllowed(input: ProviderInvocationRequest): void {
  if (!input.taskId.trim() || !input.seatId.trim()) {
    throw new ProviderInvocationError('TASK_NOT_RUNNING', 'task and seat identity are required');
  }
  if (input.executionStatus !== 'running') {
    throw new ProviderInvocationError(
      'TASK_NOT_RUNNING',
      `provider invocation requires a running task, got ${input.executionStatus}`
    );
  }
  if (!input.approved) {
    throw new ProviderInvocationError('APPROVAL_REQUIRED', 'provider invocation requires an approved execution');
  }
  if (input.connection.status !== 'active') {
    throw new ProviderInvocationError(
      'CONNECTION_INACTIVE',
      `connection ${input.connection.id} is ${input.connection.status}`
    );
  }
  if (input.connection.projectId !== input.projectId) {
    throw new ProviderInvocationError('PROJECT_MISMATCH', 'connection is not scoped to the requested project');
  }
  if (input.connection.providerCode !== input.provider) {
    throw new ProviderInvocationError('PROVIDER_MISMATCH', 'connection provider does not match invocation provider');
  }
  if (!input.connection.capabilities.includes('execute')) {
    throw new ProviderInvocationError(
      'EXECUTE_CAPABILITY_MISSING',
      'connection does not grant execute capability'
    );
  }
}
