export const SEAT_BUDGET_SETTINGS_ID = 'seat-budget-settings';

export const SEAT_BUDGET_STATES = Object.freeze([
  'UNAVAILABLE',
  'LOCKED',
  'READY',
  'HANDOFF',
  'EXHAUSTED',
  'COMPLETED',
  'BLOCKED',
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
    provider: optionalString(input.provider),
    model: optionalString(input.model),
    turnBudgetTokens: nonNegative(configured.turnBudgetTokens),
    outputBudgetTokens: nonNegative(configured.outputBudgetTokens),
    reasoningBudgetTokens: nonNegative(configured.reasoningBudgetTokens),
    handoffReserveTokens: nonNegative(configured.handoffReserveTokens),
    warningThresholdPercent: Number.isFinite(Number(configured.warningThresholdPercent))
      ? Math.max(0, Math.min(1, Number(configured.warningThresholdPercent)))
      : 0.8,
    contextInputPolicy: configured.contextInputPolicy && typeof configured.contextInputPolicy === 'object'
      ? Object.freeze({ ...configured.contextInputPolicy })
      : Object.freeze({ retention: 'minimal-durable-context' }),
    usageReported: Boolean(input.usage && typeof input.usage === 'object'),
    consumedTokens: nonNegative(usage.consumedTotalTokens),
    remainingTokens: nonNegative(usage.remainingGenerationTokens),
    usableTokens: nonNegative(usage.usableGenerationTokens),
    reasoningUsedTokens: nonNegative(usage.consumedReasoningTokens),
    workOutputUsedTokens: nonNegative(usage.consumedWorkOutputTokens),
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
