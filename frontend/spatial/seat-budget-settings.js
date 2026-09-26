export const SEAT_BUDGET_SETTINGS_ID = 'seat-budget-settings';

export const SEAT_BUDGET_STATES = Object.freeze([
  'UNAVAILABLE',
  'LOCKED',
  'READY',
  'HANDOFF',
  'EXHAUSTED',
  'COMPLETED',
  'BLOCKED',
  'PROVIDER_FAILED',
  'CANCELLED',
  'WAITING_FOR_CONTINUATION',
]);

function optionalString(value) {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized || null;
}

function nonNegative(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function nonNegativeOrNull(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function normalizeSeatBudgetReadModel(value = {}) {
  if (!value || typeof value !== 'object') throw new Error('seat budget read model must be an object');
  const input = value;
  const configured = input.configured && typeof input.configured === 'object' ? input.configured : {};
  const usage = input.usage && typeof input.usage === 'object' ? input.usage : {};

  return Object.freeze({
    available: input.available === true,
    authorized: input.authorized === true,
    configurable: input.configurable === true,
    healthy: input.healthy !== false,
    seatId: optionalString(input.seatId),
    responsibilityProfile: optionalString(configured.responsibilityProfile),
    hardStopPolicy: configured.hardStopPolicy === 'stop-at-limit' ? 'stop-at-limit' : 'handoff-before-exhaustion',
    provider: optionalString(input.provider),
    model: optionalString(input.model),
    turnBudgetTokens: nonNegative(configured.turnBudgetTokens),
    effectiveTurnBudgetTokens: nonNegative(input.effectiveTurnBudgetTokens ?? configured.turnBudgetTokens),
    outputBudgetTokens: nonNegative(configured.outputBudgetTokens),
    reasoningBudgetTokens: nonNegative(configured.reasoningBudgetTokens),
    handoffReserveTokens: nonNegative(configured.handoffReserveTokens),
    warningThresholdPercent: Number.isFinite(Number(configured.warningThresholdPercent))
      ? Math.max(0, Math.min(1, Number(configured.warningThresholdPercent)))
      : 0.8,
    contextInputPolicy: configured.contextInputPolicy && typeof configured.contextInputPolicy === 'object'
      ? Object.freeze({ ...configured.contextInputPolicy })
      : Object.freeze({ retention: 'minimal-durable-context' }),
    usageReported: input.usageReported === true || Boolean(input.usage && typeof input.usage === 'object' && usage.remainingGenerationTokens !== null && usage.remainingGenerationTokens !== undefined),
    accountingSource: optionalString(input.accountingSource),
    reservedTokens: nonNegativeOrNull(usage.reservedTokens) ?? 0,
    consumedInputTokens: nonNegativeOrNull(usage.consumedInputTokens) ?? 0,
    consumedTokens: nonNegativeOrNull(usage.consumedTotalTokens) ?? 0,
    remainingTokens: nonNegativeOrNull(usage.remainingGenerationTokens),
    usableTokens: nonNegativeOrNull(usage.usableGenerationTokens),
    reasoningUsedTokens: nonNegativeOrNull(usage.consumedReasoningTokens) ?? 0,
    workOutputUsedTokens: nonNegativeOrNull(usage.consumedWorkOutputTokens),
    latestExecutionId: optionalString(input.latest?.executionId),
    latestTaskId: optionalString(input.latest?.taskId),
    latestRecordedAt: optionalString(input.latest?.recordedAt),
    providerRuntime: optionalString(input.latest?.providerRuntime),
    state: SEAT_BUDGET_STATES.includes(String(input.state)) ? String(input.state) : 'UNAVAILABLE',
    completionState: optionalString(input.completionState),
    continuationAvailable: input.continuationAvailable === true,
    reason: optionalString(input.reason),
    updatedAt: optionalString(input.updatedAt),
    presentationOnly: true,
  });
}

export function seatBudgetEnergySegments(model) {
  if (!model.usageReported) return Object.freeze({ consumedFraction: 0, handoffReserveFraction: 0, remainingFraction: 0 });
  const total = Math.max(1, model.turnBudgetTokens);
  const consumed = Math.min(total, model.consumedTokens);
  const reserve = Math.min(total - consumed, model.handoffReserveTokens);
  const remaining = Math.max(0, total - consumed - reserve);

  return Object.freeze({
    consumedFraction: consumed / total,
    handoffReserveFraction: reserve / total,
    remainingFraction: remaining / total,
  });
}

export function createSeatBudgetSaveIntent({ seatId, patch = {} } = {}) {
  if (!optionalString(seatId)) throw new Error('seatId is required');
  return Object.freeze({
    intent: 'save-seat-turn-budget',
    seatId: String(seatId).trim(),
    patch: Object.freeze({ ...patch }),
    presentationOnly: true,
    authoritative: false,
  });
}


export const SEAT_BUDGET_CONTROL_ACTIONS = Object.freeze([
  'CONTINUE',
  'RECONFIGURE',
  'CLOSE',
  'NEW_COMMAND',
]);

export function createSeatBudgetControlIntent({ seatId, action } = {}) {
  const normalizedSeatId = optionalString(seatId);
  const normalizedAction = String(action || '').toUpperCase();
  if (!normalizedSeatId) throw new Error('seatId is required');
  if (!SEAT_BUDGET_CONTROL_ACTIONS.includes(normalizedAction)) {
    throw new Error('unsupported Seat Budget control action: ' + normalizedAction);
  }

  return Object.freeze({
    intent: 'seat-budget-control',
    action: normalizedAction,
    seatId: normalizedSeatId,
    presentationOnly: true,
    authoritative: false,
  });
}
