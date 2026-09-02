import type { AIProvider, ModelInfo } from './providers/types.js';

export class CatalogService {
  constructor(private readonly providers: Map<string, AIProvider>) {}

  async listModels(input: { userPlan?: string; provider?: string; capability?: string }): Promise<ModelInfo[]> {
    const providers = input.provider
      ? [this.providers.get(input.provider)].filter((value): value is AIProvider => Boolean(value))
      : [...this.providers.values()];
    const results: ModelInfo[] = [];
    for (const provider of providers) {
      if (!provider.listModels) continue;
      results.push(...await provider.listModels());
    }
    if (!input.capability) return results;
    return results.filter((model) => model.capabilities?.[input.capability!] === true);
  }

  async refreshProvider(providerCode: string): Promise<ModelInfo[]> {
    const provider = this.providers.get(providerCode);
    if (!provider?.listModels) throw new Error(`catalog sync unsupported for provider ${providerCode}`);
    return provider.listModels();
  }
}
