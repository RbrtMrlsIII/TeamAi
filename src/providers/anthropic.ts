import type { AIProvider, GenerateRequest, GenerateResult, StreamChunk } from './types.js';
import { fetchJson, parseSse, ProviderHttpError } from './http.js';
import { withRetry } from './retry.js';

export class AnthropicProvider implements AIProvider {
  readonly provider = 'anthropic';
  constructor(private readonly apiKey: string, private readonly baseUrl = 'https://api.anthropic.com/v1') {}

  async generate(request: GenerateRequest): Promise<GenerateResult> {
    return withRetry(async () => {
      const system = request.messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
      const messages = request.messages.filter(m => m.role !== 'system');
      const { data, requestId } = await fetchJson(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: request.model, max_tokens: request.maxOutputTokens ?? 1024, system: system || undefined, messages })
      });
      const text = (data?.content ?? []).filter((b: any) => b?.type === 'text').map((b: any) => b.text).join('');
      const inputTokens = Number(data?.usage?.input_tokens ?? 0);
      const outputTokens = Number(data?.usage?.output_tokens ?? 0);
      return { provider: this.provider, model: request.model, requestId: data?.id ?? requestId ?? 'unknown', text, usage: { inputTokens, outputTokens, totalTokens: inputTokens + outputTokens } };
    }, { shouldRetry: (e) => e instanceof ProviderHttpError && e.retryable });
  }

  async *stream(request: GenerateRequest): AsyncIterable<StreamChunk> {
    const system = request.messages.filter(m => m.role === 'system').map(m => m.content).join('\n');
    const messages = request.messages.filter(m => m.role !== 'system');
    const response = await fetch(`${this.baseUrl}/messages`, {
      method: 'POST',
      headers: { 'x-api-key': this.apiKey, 'anthropic-version': '2023-06-01', 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify({ model: request.model, max_tokens: request.maxOutputTokens ?? 1024, system: system || undefined, messages, stream: true })
    });
    if (!response.ok || !response.body) throw new Error(`Anthropic streaming request failed (${response.status})`);
    for await (const frame of parseSse(response.body)) {
      let payload: any; try { payload = JSON.parse(frame.data); } catch { continue; }
      if (payload?.type === 'content_block_delta' && payload.delta?.type === 'text_delta') yield { type: 'text_delta', text: payload.delta.text };
      if (payload?.type === 'message_stop') yield { type: 'completed' };
    }
  }
}
