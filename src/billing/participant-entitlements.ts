import { PLAN_LIMITS, assertParticipantLimit, type PlanCode } from './tiers.js';

export function participantLimit(plan: PlanCode): number {
  return PLAN_LIMITS[plan].maxAiParticipants;
}

export function assertParticipantCount(plan: PlanCode, count: number): void {
  assertParticipantLimit(plan, count);
}
