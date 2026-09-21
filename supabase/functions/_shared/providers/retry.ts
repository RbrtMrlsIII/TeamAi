export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  shouldRetry?: (error: unknown) => boolean;
  sleep?: (ms: number) => Promise<void>;
}

export async function withRetry<T>(fn: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxRetries = options.maxRetries ?? 2;
  const baseDelayMs = options.baseDelayMs ?? 250;
  const shouldRetry = options.shouldRetry ?? (() => true);
  const sleep = options.sleep ?? ((ms) => new Promise<void>(resolve => setTimeout(resolve, ms)));

  let attempt = 0;
  while (true) {
    try { return await fn(); }
    catch (error) {
      if (attempt >= maxRetries || !shouldRetry(error)) throw error;
      const delay = baseDelayMs * 2 ** attempt;
      await sleep(delay);
      attempt += 1;
    }
  }
}
