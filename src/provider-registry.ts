import type { AIProvider } from './providers/types.js';

export class ProviderRegistry {
  constructor(private readonly providers: Map<string, AIProvider>) {}
  get(provider: string): AIProvider | undefined { return this.providers.get(provider); }
  set(provider: string, adapter: AIProvider): void { this.providers.set(provider, adapter); }
}
