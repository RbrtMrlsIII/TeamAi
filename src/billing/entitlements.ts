export interface EntitlementContext {
  allowedModelIds: Set<string>;
  modelId: string;
}

export type EntitlementDecision =
  | { allowed: true; reason: 'ALLOWED' }
  | { allowed: false; reason: 'MODEL_NOT_ENTITLED' | 'MODEL_UNAVAILABLE' };

export function canUseModel(ctx: EntitlementContext): EntitlementDecision {
  if (ctx.allowedModelIds.has(ctx.modelId)) return { allowed: true, reason: 'ALLOWED' };
  return { allowed: false, reason: 'MODEL_NOT_ENTITLED' };
}
