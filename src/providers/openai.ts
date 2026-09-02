import type { AIProvider, GenerateRequest, GenerateResult, StreamChunk } from './types.js';
import { fetchJson, parseSse, ProviderHttpError } from './http.js';
import { withRetry } from './retry.js';

function usageFrom(u: any) {
  const inputTokens = Number(u?.input_tokens ?? 0);
  const outputTokens = Number(u?.output_tokens ?? 0);
  const cached = Number(u?.input_tokens_details?.cached_tokens ?? 0);
  const reasoning = Number(u?.output_tokens_details?.reasoning_tokens ?? 0);
  return { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens, cachedInputTokens: cached || undefined, reasoningTokens: reasoning || undefined };
}

export class OpenAIProvider implements AIProvider {
  readonly provider = 'openai';
  constructor(private readonly apiKey: string, private readonly baseUrl = 'https://api.openai.com/v1') {}

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    return withRetry(async () => {
      const { data, requestId } = await fetchJson(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: request.model,
          input: request.messages,
          max_output_tokens: request.maxOutputTokens,
          temperature: request.temperature,
          stream: false
        })
      });
      const text = typeof data?.output_text === 'string'
        ? data.output_text
        : (data?.output ?? []).flatMap((item: any) => item?.content ?? []).map((c: any) => c?.text ?? '').join('');
      return { provider: this.provider, model: request.model, requestId: data?.id ?? requestId ?? 'unknown', text, usage: usageFrom(data?.usage), costUsd: undefined };
    }, { shouldRetry: (e) => e instanceof ProviderHttpError && e.retryable });
  }

  async *stream(request: GenerateRequest): AsyncIterable<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ model: request.model, input: request.messages, max_output_tokens: request.maxOutputTokens, temperature: request.temperature, stream: true })
    });
    if (!response.ok || !response.body) throw new Error(`OpenAI streaming request failed (${response.status})`);
    for await (const frame of parseSse(response.body)) {
      if (frame.data === '[DONE]') continue;
      let payload: any; try { payload = JSON.parse(frame.data); } catch { continue; }
      if (payload?.type === 'response.output_text.delta') yield { type: 'text_delta', text: payload.delta };
      if (payload?.type === 'response.completed') {
        yield { type: 'completed', requestId: payload.response?.id, usage: usageFrom(payload.response?.usage) };
      }
    }
  }
}
