export interface Price { inputUsdPerMtok: number; outputUsdPerMtok: number; }
export interface UsageCost { inputTokens: number; outputTokens: number; }
export function estimateProviderCost(usage: UsageCost, price: Price): number {
  return usage.inputTokens / 1_000_000 * price.inputUsdPerMtok + usage.outputTokens / 1_000_000 * price.outputUsdPerMtok;
}
