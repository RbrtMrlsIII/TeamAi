// Updated: 2026-09-01 22:35:10 PHASE TEAM-FOUNDATION-001 by TeamArchitect
export type AuthorType = 'human' | 'ai' | 'system';
export type AgentLifecycleStatus = 'active' | 'paused' | 'waiting' | 'budget_exhausted' | 'disconnected' | 'performing_poorly' | 'replaced' | 'vacant' | 'retired';
export type SchedulingMode = 'round_robin' | 'task_driven' | 'leader_directed';
export type SkipReason = 'user_skipped' | 'provider_unavailable' | 'provider_timeout' | 'provider_error' | 'budget_exhausted' | 'disconnected' | 'seat_paused' | 'task_not_ready' | 'permission_missing';

export interface Message {
  id: string;
  conversationId: string;
  authorType: AuthorType;
  authorId?: string;
  modelId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  turnNumber: number;
  createdAt: string;
}

export interface Participant {
  modelId: string;
  provider?: string;
  role: string;
  order: number;
  enabled?: boolean;
  status?: AgentLifecycleStatus;
  skipReason?: SkipReason;
}

export interface TeamHealthSnapshot {
  status: 'healthy' | 'attention' | 'blocked' | 'critical';
  activeParticipants: number;
  waitingParticipants: number;
  skippedParticipants: number;
  failedProviderCalls: number;
  discrepancies: string[];
  recommendations: string[];
  checkedAt: string;
}

export interface Conversation {
  id: string;
  projectId: string;
  title: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'cancelled' | 'failed';
  maxTurns: number;
  maxWords?: number;
  currentTurn: number;
  participants: Participant[];
  schedulingMode?: SchedulingMode;
  teamLeaderModelId?: string;
  leaderCheckInterval?: number;
  nextParticipantIndex?: number;
  health?: TeamHealthSnapshot;
}
