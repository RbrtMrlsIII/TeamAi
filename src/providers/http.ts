export class ProviderHttpError extends Error {
  readonly status: number;
  readonly requestId?: string;
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean, requestId?: string) {
    super(message);
    this.name = 'ProviderHttpError';
    this.status = status;
    this.retryable = retryable;
    this.requestId = requestId;
  }
}

export async function fetchJson(url: string, init: RequestInit): Promise<{ data: any; requestId?: string }> {
  const response = await fetch(url, init);
  const requestId = response.headers.get('x-request-id') ?? response.headers.get('request-id') ?? undefined;
  const text = await response.text();
  let data: any = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
  if (!response.ok) {
    const retryable = response.status === 408 || response.status === 409 || response.status === 429 || response.status >= 500;
    throw new ProviderHttpError(data?.error?.message ?? data?.message ?? `Provider request failed (${response.status})`, response.status, retryable, requestId);
  }
  return { data, requestId };
}

export async function* parseSse(body: ReadableStream<Uint8Array>): AsyncGenerator<{ event?: string; data: string }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split(/\n\n|\r\n\r\n/);
    buffer = frames.pop() ?? '';
    for (const frame of frames) {
      const dataLines: string[] = [];
      let event: string | undefined;
      for (const line of frame.split(/\r?\n/)) {
        if (line.startsWith('event:')) event = line.slice(6).trim();
        if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
      }
      if (dataLines.length) yield { event, data: dataLines.join('\n') };
    }
  }
  buffer += decoder.decode();
  if (buffer.trim()) {
    const dataLines: string[] = [];
    let event: string | undefined;
    for (const line of buffer.split(/\r?\n/)) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      if (line.startsWith('data:')) dataLines.push(line.slice(5).trimStart());
    }
    if (dataLines.length) yield { event, data: dataLines.join('\n') };
  }
}
