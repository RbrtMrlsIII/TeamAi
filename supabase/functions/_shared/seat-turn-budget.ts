export type EdgeTurnBudgetConfig = {
  turnBudgetTokens: number;
  hardStopPolicy: 'handoff-before-exhaustion' | 'stop-at-limit';
  responsibilityProfile?: string;
  outputBudgetTokens: number;
  reasoningBudgetTokens: number;
  handoffReserveTokens: number;
  warningThresholdPercent: number;
};

export type EdgeTurnBudgetUsage = {
  consumedInputTokens: number;
  consumedOutputTokens: number;
  consumedReasoningTokens: number;
  consumedWorkOutputTokens: number;
  consumedTotalTokens: number;
  remainingGenerationTokens: number;
  usableGenerationTokens: number;
};

function nonNegativeInteger(value: unknown, name: string): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) throw new Error(name + '_invalid');
  return n;
}

export function normalizeEdgeTurnBudget(value: unknown): EdgeTurnBudgetConfig {
  if (!value || typeof value !== 'object') throw new Error('seat_budget_not_configured');
  const input = value as Record<string, unknown>;
  const budget = {
    turnBudgetTokens: nonNegativeInteger(input.turnBudgetTokens, 'turnBudgetTokens'),
    outputBudgetTokens: nonNegativeInteger(input.outputBudgetTokens, 'outputBudgetTokens'),
    reasoningBudgetTokens: nonNegativeInteger(input.reasoningBudgetTokens, 'reasoningBudgetTokens'),
    handoffReserveTokens: nonNegativeInteger(input.handoffReserveTokens, 'handoffReserveTokens'),
    hardStopPolicy: input.hardStopPolicy === 'stop-at-limit' ? 'stop-at-limit' : 'handoff-before-exhaustion',
    responsibilityProfile: typeof input.responsibilityProfile === 'string' ? input.responsibilityProfile : undefined,
    warningThresholdPercent: Number.isFinite(Number(input.warningThresholdPercent))
      ? Math.max(0, Math.min(1, Number(input.warningThresholdPercent)))
      : 0.8,
  };
  if (budget.turnBudgetTokens <= 0) throw new Error('turnBudget_invalid');
  if (budget.outputBudgetTokens + budget.reasoningBudgetTokens + budget.handoffReserveTokens > budget.turnBudgetTokens) {
    throw new Error('seat_budget_allocation_invalid');
  }
  return Object.freeze(budget);
}

export function computeEdgeBudget(input: {
  config: EdgeTurnBudgetConfig;
  inputTokens: number;
  outputTokens: number;
  reasoningTokens?: number;
}): EdgeTurnBudgetUsage {
  const inputTokens = nonNegativeInteger(input.inputTokens, 'inputTokens');
  const outputTokens = nonNegativeInteger(input.outputTokens, 'outputTokens');
  const reasoningTokens = Math.min(
    outputTokens,
    nonNegativeInteger(input.reasoningTokens ?? 0, 'reasoningTokens'),
  );
  const consumedWorkOutputTokens = outputTokens - reasoningTokens;
  const consumedTotalTokens = inputTokens + outputTokens;
  const remainingGenerationTokens = Math.max(0, input.config.turnBudgetTokens - outputTokens);
  const usableGenerationTokens = Math.max(0, remainingGenerationTokens - input.config.handoffReserveTokens);

  return Object.freeze({
    consumedInputTokens: inputTokens,
    consumedOutputTokens: outputTokens,
    consumedReasoningTokens: reasoningTokens,
    consumedWorkOutputTokens,
    consumedTotalTokens,
    remainingGenerationTokens,
    usableGenerationTokens,
  });
}

export function providerOutputCeiling(config: EdgeTurnBudgetConfig): number {
  return Math.max(
    0,
    Math.min(config.outputBudgetTokens, Math.max(0, config.turnBudgetTokens - config.handoffReserveTokens)),
  );
}

export function shouldHandoff(
  config: EdgeTurnBudgetConfig,
  usage: EdgeTurnBudgetUsage,
  estimatedCompletionNeedTokens?: number,
): boolean {
  if (estimatedCompletionNeedTokens === undefined) return false;
  if (config.hardStopPolicy === 'stop-at-limit') return false;
  const estimated = nonNegativeInteger(estimatedCompletionNeedTokens, 'estimatedCompletionNeedTokens');
  return usage.usableGenerationTokens < estimated;
}
