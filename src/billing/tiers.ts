export type PlanCode = 'free' | 'starter' | 'pro' | 'team';

export interface PlanLimits {
  maxAiParticipants: number;
  maxTurnsPerDiscussion: number;
  monthlyAiCredits: number;
  maxProjectConnections: number;
  pluginsEnabled: boolean;
}

// Canonical product decision: Free tier allows exactly 1 AI participant.
// The second AI is the first paid multi-AI capability.
export const PLAN_LIMITS: Record<PlanCode, PlanLimits> = {
  free: { maxAiParticipants: 1, maxTurnsPerDiscussion: 10, monthlyAiCredits: 1_000, maxProjectConnections: 1, pluginsEnabled: false },
  starter: { maxAiParticipants: 2, maxTurnsPerDiscussion: 30, monthlyAiCredits: 8_000, maxProjectConnections: 3, pluginsEnabled: true },
  pro: { maxAiParticipants: 4, maxTurnsPerDiscussion: 75, monthlyAiCredits: 30_000, maxProjectConnections: 10, pluginsEnabled: true },
  team: { maxAiParticipants: 8, maxTurnsPerDiscussion: 150, monthlyAiCredits: 100_000, maxProjectConnections: 50, pluginsEnabled: true },
};

export function assertParticipantLimit(plan: PlanCode, count: number): void {
  if (count < 1 || count > PLAN_LIMITS[plan].maxAiParticipants) {
    throw new Error(`plan ${plan} allows at most ${PLAN_LIMITS[plan].maxAiParticipants} AI participants`);
  }
}

export function assertTurnLimit(plan: PlanCode, turns: number): void {
  if (turns < 1 || turns > PLAN_LIMITS[plan].maxTurnsPerDiscussion) {
    throw new Error(`plan ${plan} allows at most ${PLAN_LIMITS[plan].maxTurnsPerDiscussion} turns`);
  }
}
