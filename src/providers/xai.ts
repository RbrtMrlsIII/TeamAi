import type { AIProvider, GenerateRequest, GenerateResult, StreamChunk } from './types.js';
import { fetchJson, parseSse, ProviderHttpError } from './http.js';
import { withRetry } from './retry.js';

function usageFrom(u: any) {
  const inputTokens = Number(u?.input_tokens ?? u?.prompt_tokens ?? 0);
  const outputTokens = Number(u?.output_tokens ?? u?.completion_tokens ?? 0);
  const totalTokens = Number(u?.total_tokens ?? inputTokens + outputTokens);
  return { inputTokens, outputTokens, totalTokens, cachedInputTokens: Number(u?.prompt_tokens_details?.cached_tokens ?? 0) || undefined };
}

export class XAIProvider implements AIProvider {
  readonly provider = 'xai';
  constructor(private readonly apiKey: string, private readonly baseUrl = 'https://api.x.ai/v1') {}

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    return withRetry(async () => {
      const { data, requestId } = await fetchJson(`${this.baseUrl}/responses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: request.model, input: request.messages, max_output_tokens: request.maxOutputTokens, stream: false })
      });
      const text = typeof data?.output_text === 'string'
        ? data.output_text
        : (data?.output ?? []).flatMap((item: any) => item?.content ?? []).map((c: any) => c?.text ?? '').join('');
      const usage = usageFrom(data?.usage);
      const costUsd = Number.isFinite(Number(data?.usage?.cost_in_usd_ticks)) ? Number(data.usage.cost_in_usd_ticks) / 10_000_000_000 : undefined;
      return { provider: this.provider, model: request.model, requestId: data?.id ?? requestId ?? 'unknown', text, usage, costUsd };
    }, { shouldRetry: (e) => e instanceof ProviderHttpError && e.retryable });
  }

  async *stream(request: GenerateRequest): AsyncIterable<StreamChunk> {
    const response = await fetch(`${this.baseUrl}/responses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ model: request.model, input: request.messages, max_output_tokens: request.maxOutputTokens, stream: true })
    });
    if (!response.ok || !response.body) throw new Error(`xAI streaming request failed (${response.status})`);
    for await (const frame of parseSse(response.body)) {
      if (frame.data === '[DONE]') continue;
      let payload: any; try { payload = JSON.parse(frame.data); } catch { continue; }
      if (payload?.type === 'response.output_text.delta') yield { type: 'text_delta', text: payload.delta };
      if (payload?.type === 'response.completed') {
        const usage = usageFrom(payload.response?.usage);
        yield { type: 'completed', requestId: payload.response?.id, usage };
      }
    }
  }
}
