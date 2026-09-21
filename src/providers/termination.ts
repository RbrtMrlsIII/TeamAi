export type ProviderTerminationState = 'completed' | 'incomplete' | 'failed' | 'cancelled';

export type ProviderTerminationReason =
  | 'stop'
  | 'length'
  | 'tool_use'
  | 'content_filter'
  | 'stop_sequence'
  | 'pause_turn'
  | 'refusal'
  | 'model_context_window_exceeded'
  | 'failed'
  | 'cancelled'
  | 'unknown';

export type ProviderTermination = Readonly<{
  state: ProviderTerminationState;
  reason: ProviderTerminationReason;
  providerReason?: string;
}>;

function clean(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export function terminationFromOpenAI(status: unknown, incompleteReason?: unknown): ProviderTermination {
  const normalizedStatus = clean(status);
  const normalizedReason = clean(incompleteReason);
  if (normalizedStatus === 'completed') return Object.freeze({ state: 'completed', reason: 'stop', ...(normalizedReason ? { providerReason: normalizedReason } : {}) });
  if (normalizedStatus === 'incomplete') {
    const reason =
      normalizedReason === 'max_tokens' ? 'length' :
      normalizedReason === 'content_filter' ? 'content_filter' :
      normalizedReason === 'model_context_window_exceeded' ? 'model_context_window_exceeded' :
      'unknown';
    return Object.freeze({ state: 'incomplete', reason, ...(normalizedReason ? { providerReason: normalizedReason } : {}) });
  }
  if (normalizedStatus === 'cancelled') return Object.freeze({ state: 'cancelled', reason: 'cancelled' });
  if (normalizedStatus === 'failed') return Object.freeze({ state: 'failed', reason: 'failed' });
  return Object.freeze({ state: 'incomplete', reason: 'unknown', ...(normalizedStatus ? { providerReason: normalizedStatus } : {}) });
}

export function terminationFromAnthropic(stopReason: unknown): ProviderTermination {
  const reason = clean(stopReason);
  if (reason === 'end_turn' || reason === 'stop_sequence') {
    return Object.freeze({ state: 'completed', reason: reason === 'stop_sequence' ? 'stop_sequence' : 'stop', providerReason: reason });
  }
  if (reason === 'max_tokens') return Object.freeze({ state: 'incomplete', reason: 'length', providerReason: reason });
  if (reason === 'tool_use') return Object.freeze({ state: 'incomplete', reason: 'tool_use', providerReason: reason });
  if (reason === 'pause_turn') return Object.freeze({ state: 'incomplete', reason: 'pause_turn', providerReason: reason });
  if (reason === 'refusal') return Object.freeze({ state: 'incomplete', reason: 'refusal', providerReason: reason });
  if (reason === 'model_context_window_exceeded') return Object.freeze({ state: 'incomplete', reason: 'model_context_window_exceeded', providerReason: reason });
  return Object.freeze({ state: 'incomplete', reason: 'unknown', ...(reason ? { providerReason: reason } : {}) });
}

export function terminationFromMistral(finishReason: unknown): ProviderTermination {
  const reason = clean(finishReason);
  if (reason === 'stop') return Object.freeze({ state: 'completed', reason: 'stop', providerReason: reason });
  if (reason === 'length') return Object.freeze({ state: 'incomplete', reason: 'length', providerReason: reason });
  if (reason === 'tool_calls' || reason === 'function_call') {
    return Object.freeze({ state: 'incomplete', reason: 'tool_use', providerReason: reason });
  }
  if (reason === 'model_length') return Object.freeze({ state: 'incomplete', reason: 'length', providerReason: reason });
  if (reason === 'content_filter') return Object.freeze({ state: 'incomplete', reason: 'content_filter', providerReason: reason });
  return Object.freeze({ state: 'incomplete', reason: 'unknown', ...(reason ? { providerReason: reason } : {}) });
}

export function terminationFromGemini(finishReason: unknown): ProviderTermination {
  const reason = clean(finishReason);
  if (reason === 'stop') return Object.freeze({ state: 'completed', reason: 'stop', providerReason: reason });
  if (reason === 'max_tokens') return Object.freeze({ state: 'incomplete', reason: 'length', providerReason: reason });
  if (reason === 'safety') return Object.freeze({ state: 'incomplete', reason: 'content_filter', providerReason: reason });
  return Object.freeze({ state: 'incomplete', reason: 'unknown', ...(reason ? { providerReason: reason } : {}) });
}

export function requiresContinuation(termination: ProviderTermination): boolean {
  return termination.state === 'incomplete'
    && ['length', 'tool_use', 'pause_turn', 'model_context_window_exceeded'].includes(termination.reason);
}
