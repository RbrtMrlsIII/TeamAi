import type { Usage } from '../providers/types.js';

export type SeatResponsibilityProfile =
  | 'reviewer'
  | 'coder'
  | 'researcher'
  | 'planner'
  | 'tester-verifier'
  | 'coordinator';

export type HardStopPolicy = 'handoff-before-exhaustion' | 'stop-at-limit';

export type ContextInputPolicy = {
  maxInputTokens?: number;
  retention: 'minimal-durable-context' | 'full-turn-context';
};

export type SeatTurnBudgetConfig = {
  turnBudgetTokens: number;
  outputBudgetTokens: number;
  reasoningBudgetTokens: number;
  handoffReserveTokens: number;
  warningThresholdPercent: number;
  hardStopPolicy: HardStopPolicy;
  responsibilityProfile: SeatResponsibilityProfile;
  contextInputPolicy: ContextInputPolicy;
};

export type TurnBudgetUsage = {
  reservedTokens: number;
  consumedOutputTokens: number;
  consumedInputTokens: number;
  consumedTotalTokens: number;
  remainingGenerationTokens: number;
  usableGenerationTokens: number;
};

export type TurnBudgetState =
  | 'HEALTHY'
  | 'LOW'
  | 'HANDOFF'
  | 'EXHAUSTED'
  | 'COMPLETED'
  | 'BLOCKED'
  | 'PROVIDER_FAILED'
  | 'CANCELLED'
  | 'WAITING_FOR_CONTINUATION';

export type TurnCompletionState =
  | 'WORK_COMPLETE'
  | 'HANDOFF_REQUIRED'
  | 'WAITING_FOR_CONTINUATION'
  | 'BLOCKED'
  | 'PROVIDER_FAILED'
  | 'CANCELLED';

export type TurnBudgetAccounting = {
  configured: Readonly<SeatTurnBudgetConfig>;
  effectiveTurnBudgetTokens: number;
  workOutputBudgetTokens: number;
  handoffReserveTokens: number;
  usage: Readonly<TurnBudgetUsage>;
  state: TurnBudgetState;
  completionState: TurnCompletionState | null;
  warningThresholdReached: boolean;
  providerOutputCeilingTokens: number;
};

const RESPONSIBILITY_DEFAULTS: Record<SeatResponsibilityProfile, Pick<SeatTurnBudgetConfig, 'outputBudgetTokens' | 'reasoningBudgetTokens' | 'handoffReserveTokens'>> = {
  reviewer: { outputBudgetTokens: 2500, reasoningBudgetTokens: 4500, handoffReserveTokens: 1000 },
  coder: { outputBudgetTokens: 5000, reasoningBudgetTokens: 6000, handoffReserveTokens: 1500 },
  researcher: { outputBudgetTokens: 3500, reasoningBudgetTokens: 6500, handoffReserveTokens: 1500 },
  planner: { outputBudgetTokens: 3500, reasoningBudgetTokens: 4500, handoffReserveTokens: 1200 },
  'tester-verifier': { outputBudgetTokens: 3000, reasoningBudgetTokens: 5000, handoffReserveTokens: 1200 },
  coordinator: { outputBudgetTokens: 4000, reasoningBudgetTokens: 5500, handoffReserveTokens: 1800 },
};

function assertIntegerAtLeastZero(value: number, name: string): void {
  if (!Number.isInteger(value) || value < 0) throw new Error(name + ' must be a non-negative integer');
}

function assertFinitePercent(value: number, name: string): void {
  if (!Number.isFinite(value) || value < 0 || value > 1) throw new Error(name + ' must be between 0 and 1');
}

export function responsibilityDefaults(profile: SeatResponsibilityProfile) {
  return Object.freeze(RESPONSIBILITY_DEFAULTS[profile]);
}

export function createSeatTurnBudgetConfig(
  input: Partial<SeatTurnBudgetConfig> & Pick<SeatTurnBudgetConfig, 'turnBudgetTokens' | 'responsibilityProfile'>,
): SeatTurnBudgetConfig {
  const defaults = responsibilityDefaults(input.responsibilityProfile);
  const config: SeatTurnBudgetConfig = {
    turnBudgetTokens: input.turnBudgetTokens,
    outputBudgetTokens: input.outputBudgetTokens ?? defaults.outputBudgetTokens,
    reasoningBudgetTokens: input.reasoningBudgetTokens ?? defaults.reasoningBudgetTokens,
    handoffReserveTokens: input.handoffReserveTokens ?? defaults.handoffReserveTokens,
    warningThresholdPercent: input.warningThresholdPercent ?? 0.8,
    hardStopPolicy: input.hardStopPolicy ?? 'handoff-before-exhaustion',
    responsibilityProfile: input.responsibilityProfile,
    contextInputPolicy: input.contextInputPolicy ?? { retention: 'minimal-durable-context' },
  };

  assertIntegerAtLeastZero(config.turnBudgetTokens, 'turnBudgetTokens');
  assertIntegerAtLeastZero(config.outputBudgetTokens, 'outputBudgetTokens');
  assertIntegerAtLeastZero(config.reasoningBudgetTokens, 'reasoningBudgetTokens');
  assertIntegerAtLeastZero(config.handoffReserveTokens, 'handoffReserveTokens');
  assertFinitePercent(config.warningThresholdPercent, 'warningThresholdPercent');

  if (config.turnBudgetTokens === 0) throw new Error('turnBudgetTokens must be greater than zero');
  if (config.outputBudgetTokens + config.reasoningBudgetTokens + config.handoffReserveTokens > config.turnBudgetTokens) {
    throw new Error('budget allocations exceed turnBudgetTokens');
  }
  if (config.contextInputPolicy.maxInputTokens !== undefined) {
    assertIntegerAtLeastZero(config.contextInputPolicy.maxInputTokens, 'contextInputPolicy.maxInputTokens');
  }

  return Object.freeze(config);
}

export function resolveEffectiveTurnBudget(configured: SeatTurnBudgetConfig, executionCeilingTokens?: number): number {
  if (executionCeilingTokens === undefined) return configured.turnBudgetTokens;
  assertIntegerAtLeastZero(executionCeilingTokens, 'executionCeilingTokens');
  return Math.min(configured.turnBudgetTokens, executionCeilingTokens);
}

export function summarizeUsage(usage: Usage, reservedTokens: number): TurnBudgetUsage {
  assertIntegerAtLeastZero(reservedTokens, 'reservedTokens');
  assertIntegerAtLeastZero(usage.inputTokens, 'usage.inputTokens');
  assertIntegerAtLeastZero(usage.outputTokens, 'usage.outputTokens');
  assertIntegerAtLeastZero(usage.totalTokens, 'usage.totalTokens');

  const consumedTotalTokens = Math.max(usage.totalTokens, usage.inputTokens + usage.outputTokens);
  return Object.freeze({
    reservedTokens,
    consumedOutputTokens: usage.outputTokens,
    consumedInputTokens: usage.inputTokens,
    consumedTotalTokens,
    remainingGenerationTokens: 0,
    usableGenerationTokens: 0,
  });
}

export function accountTurnBudget(input: {
  config: SeatTurnBudgetConfig;
  usage: Usage;
  reservedTokens?: number;
  executionCeilingTokens?: number;
  estimatedCompletionNeedTokens?: number;
  completionState?: TurnCompletionState | null;
}): TurnBudgetAccounting {
  const effective = resolveEffectiveTurnBudget(input.config, input.executionCeilingTokens);
  const reservedTokens = input.reservedTokens ?? 0;
  const usage = summarizeUsage(input.usage, reservedTokens);

  if (reservedTokens > effective) throw new Error('reservedTokens exceed effective turn budget');

  const consumedGenerationTokens = usage.consumedOutputTokens;
  const remainingGenerationTokens = Math.max(0, effective - reservedTokens - consumedGenerationTokens);
  const warningThresholdReached =
    remainingGenerationTokens <= Math.ceil(effective * (1 - input.config.warningThresholdPercent));

  const usableGenerationTokens = Math.max(0, remainingGenerationTokens - input.config.handoffReserveTokens);
  const handoffTrigger =
    input.estimatedCompletionNeedTokens !== undefined
    && usableGenerationTokens < input.estimatedCompletionNeedTokens;

  let state: TurnBudgetState;
  let completionState: TurnCompletionState | null = input.completionState ?? null;

  if (completionState === 'WORK_COMPLETE') {
    state = 'COMPLETED';
  } else if (completionState === 'BLOCKED') {
    state = 'BLOCKED';
  } else if (completionState === 'PROVIDER_FAILED') {
    state = 'PROVIDER_FAILED';
  } else if (completionState === 'CANCELLED') {
    state = 'CANCELLED';
  } else if (usableGenerationTokens === 0) {
    completionState = 'WAITING_FOR_CONTINUATION';
    state = 'EXHAUSTED';
  } else if (handoffTrigger) {
    completionState = 'HANDOFF_REQUIRED';
    state = 'HANDOFF';
  } else if (warningThresholdReached) {
    state = 'LOW';
  } else {
    state = 'HEALTHY';
  }

  const providerOutputCeilingTokens = Math.max(
    0,
    Math.min(
      input.config.outputBudgetTokens,
      usableGenerationTokens,
    ),
  );

  return Object.freeze({
    configured: input.config,
    effectiveTurnBudgetTokens: effective,
    workOutputBudgetTokens: input.config.outputBudgetTokens,
    handoffReserveTokens: input.config.handoffReserveTokens,
    usage: Object.freeze({
      ...usage,
      remainingGenerationTokens,
    }),
    state,
    completionState,
    warningThresholdReached,
    providerOutputCeilingTokens,
  });
}
