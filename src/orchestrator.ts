// Updated: 2026-09-01 22:35:10 PHASE TEAM-FOUNDATION-001 by TeamArchitect
import type { Conversation, Message, Participant, SkipReason, TeamHealthSnapshot } from './domain.js';
import type { AIProvider, ChatMessage } from './providers/types.js';

export interface ConversationStore {
  getConversation(id: string): Promise<Conversation | undefined>;
  saveConversation(conversation: Conversation): Promise<void>;
  appendMessage(message: Message): Promise<void>;
  getMessages(conversationId: string): Promise<Message[]>;
}

export class InMemoryConversationStore implements ConversationStore {
  private conversations = new Map<string, Conversation>();
  private messages = new Map<string, Message[]>();
  async getConversation(id: string) { return this.conversations.get(id); }
  async saveConversation(conversation: Conversation) { this.conversations.set(conversation.id, structuredClone(conversation)); }
  async appendMessage(message: Message) { const current = this.messages.get(message.conversationId) ?? []; current.push(structuredClone(message)); this.messages.set(message.conversationId, current); }
  async getMessages(conversationId: string) { return structuredClone(this.messages.get(conversationId) ?? []); }
}

export interface CreateConversationInput {
  id: string;
  projectId: string;
  title: string;
  maxTurns: number;
  maxWords?: number;
  participants: Participant[];
  schedulingMode?: Conversation['schedulingMode'];
  teamLeaderModelId?: string;
  leaderCheckInterval?: number;
}

export interface RunResult {
  turnsCompleted: number;
  speakers: string[];
  skipped: Array<{ modelId: string; reason: SkipReason | 'provider_not_configured' }>;
  nextSpeakerModelId?: string;
  leaderReports: TeamHealthSnapshot[];
}

export class ConversationOrchestrator {
  constructor(private readonly store: ConversationStore, private readonly providers: Map<string, AIProvider>) {}

  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    if (input.maxTurns < 1) throw new Error('maxTurns must be at least 1');
    if (input.participants.length === 0) throw new Error('at least one participant is required');
    const participants = [...input.participants]
      .sort((a, b) => a.order - b.order)
      .map((participant) => ({ ...participant, enabled: participant.enabled ?? true, status: participant.status ?? 'active' }));
    const conversation: Conversation = {
      id: input.id,
      projectId: input.projectId,
      title: input.title,
      status: 'idle',
      maxTurns: input.maxTurns,
      maxWords: input.maxWords,
      currentTurn: 0,
      participants,
      schedulingMode: input.schedulingMode ?? 'task_driven',
      teamLeaderModelId: input.teamLeaderModelId,
      leaderCheckInterval: Math.max(1, input.leaderCheckInterval ?? 1),
      nextParticipantIndex: 0,
      health: {
        status: 'healthy', activeParticipants: participants.length, waitingParticipants: 0,
        skippedParticipants: 0, failedProviderCalls: 0, discrepancies: [], recommendations: [], checkedAt: new Date().toISOString()
      }
    };
    await this.store.saveConversation(conversation);
    return conversation;
  }

  async addHumanMessage(conversationId: string, content: string): Promise<Message> {
    const conversation = await this.requireConversation(conversationId);
    const message: Message = {
      id: crypto.randomUUID(), conversationId, authorType: 'human', authorId: 'current-user', role: 'user', content,
      turnNumber: conversation.currentTurn, createdAt: new Date().toISOString()
    };
    await this.store.appendMessage(message);
    return message;
  }

  async skipParticipant(conversationId: string, modelId: string, reason: SkipReason = 'user_skipped'): Promise<Participant> {
    const conversation = await this.requireConversation(conversationId);
    const participant = conversation.participants.find((candidate) => candidate.modelId === modelId);
    if (!participant) throw new Error(`participant not found: ${modelId}`);
    participant.enabled = false;
    participant.status = 'paused';
    participant.skipReason = reason;
    await this.store.appendMessage({
      id: crypto.randomUUID(), conversationId, authorType: 'system', role: 'system', modelId,
      content: `Participant ${modelId} skipped: ${reason}. Scheduler will continue with the next eligible participant.`,
      turnNumber: conversation.currentTurn, createdAt: new Date().toISOString()
    });
    await this.store.saveConversation(conversation);
    return structuredClone(participant);
  }

  async run(conversationId: string, requestedTurns: number): Promise<RunResult> {
    const conversation = await this.requireConversation(conversationId);
    if (conversation.status === 'cancelled' || conversation.status === 'completed') throw new Error(`conversation is ${conversation.status}`);
    const remaining = conversation.maxTurns - conversation.currentTurn;
    const targetResponses = Math.min(requestedTurns, remaining);
    if (targetResponses <= 0) {
      conversation.status = 'completed'; await this.store.saveConversation(conversation);
      return { turnsCompleted: 0, speakers: [], skipped: [], leaderReports: [] };
    }

    conversation.status = 'running';
    await this.store.saveConversation(conversation);
    const speakers: string[] = [];
    const skipped: RunResult['skipped'] = [];
    const leaderReports: TeamHealthSnapshot[] = [];
    let completedResponses = 0;
    let schedulingAttempts = 0;
    const maxSchedulingAttempts = Math.max(4, conversation.participants.length * (targetResponses + 2));

    while (completedResponses < targetResponses && schedulingAttempts < maxSchedulingAttempts) {
      schedulingAttempts += 1;
      const selection = this.selectNextParticipant(conversation);
      if (!selection) break;
      const participant = selection.participant;
      conversation.nextParticipantIndex = selection.nextIndex;

      const provider = (participant.provider && this.providers.get(participant.provider)) ?? this.providers.get(participant.modelId);
      if (!provider) {
        skipped.push({ modelId: participant.modelId, reason: 'provider_not_configured' });
        await this.recordSkip(conversation, participant, 'provider_unavailable');
        continue;
      }

      try {
        const messages = await this.buildContext(conversationId, participant);
        const result = await provider.generate({ model: participant.modelId, messages, maxOutputTokens: conversation.maxWords ? Math.max(16, conversation.maxWords * 2) : undefined });
        const content = enforceWordTarget(result.text, conversation.maxWords);
        conversation.currentTurn += 1;
        participant.status = 'active';
        await this.store.appendMessage({
          id: crypto.randomUUID(), conversationId, authorType: 'ai', modelId: participant.modelId, role: 'assistant', content,
          turnNumber: conversation.currentTurn, createdAt: new Date().toISOString()
        });
        speakers.push(participant.modelId);
        completedResponses += 1;

        if (conversation.teamLeaderModelId && conversation.currentTurn % (conversation.leaderCheckInterval ?? 1) === 0) {
          const report = await this.supervise(conversationId, conversation);
          if (report) leaderReports.push(report);
        }
      } catch (error) {
        skipped.push({ modelId: participant.modelId, reason: 'provider_error' });
        await this.recordSkip(conversation, participant, 'provider_error', error instanceof Error ? error.message : 'unknown provider error');
      }

      await this.store.saveConversation(conversation);
    }

    conversation.status = conversation.currentTurn >= conversation.maxTurns ? 'completed' : (completedResponses > 0 ? 'idle' : 'failed');
    await this.store.saveConversation(conversation);
    return {
      turnsCompleted: completedResponses,
      speakers,
      skipped,
      nextSpeakerModelId: this.peekNextParticipant(conversation)?.modelId,
      leaderReports
    };
  }

  async supervise(conversationId: string, conversationOverride?: Conversation): Promise<TeamHealthSnapshot | undefined> {
    const conversation = conversationOverride ?? await this.requireConversation(conversationId);
    if (!conversation.teamLeaderModelId) return undefined;
    const leader = this.providers.get(conversation.teamLeaderModelId);
    if (!leader) {
      const report = this.computeHealth(conversation, ['Team Leader unavailable; supervision degraded.'], ['Reconnect or replace Team Leader.']);
      conversation.health = report;
      await this.store.saveConversation(conversation);
      return report;
    }

    const recent = (await this.store.getMessages(conversationId)).slice(-12);
    const prompt: ChatMessage[] = [
      { role: 'system', content: 'You are the Team Leader. Monitor participation, contradictions, failures, stalled work, missing verification, and unhealthy team behavior. Return concise observations and recommendations. You are supervisory only; never assume permission to execute.' },
      { role: 'user', content: JSON.stringify({ participants: conversation.participants, currentTurn: conversation.currentTurn, recent }) }
    ];
    try {
      const result = await leader.generate({ model: conversation.teamLeaderModelId, messages: prompt, maxOutputTokens: 500 });
      const report = this.computeHealth(conversation, extractBullets(result.text), []);
      conversation.health = report;
      await this.store.appendMessage({
        id: crypto.randomUUID(), conversationId, authorType: 'system', authorId: conversation.teamLeaderModelId, role: 'system', modelId: conversation.teamLeaderModelId,
        content: `TEAM_LEADER_REPORT ${JSON.stringify(report)}`,
        turnNumber: conversation.currentTurn, createdAt: new Date().toISOString()
      });
      await this.store.saveConversation(conversation);
      return report;
    } catch {
      const report = this.computeHealth(conversation, ['Team Leader check failed; worker scheduling continues.'], ['Retry or replace the Team Leader.']);
      conversation.health = report;
      await this.store.saveConversation(conversation);
      return report;
    }
  }

  private selectNextParticipant(conversation: Conversation): { participant: Participant; nextIndex: number } | undefined {
    const participants = conversation.participants;
    if (participants.length === 0) return undefined;
    const start = conversation.nextParticipantIndex ?? 0;
    for (let offset = 0; offset < participants.length; offset += 1) {
      const index = (start + offset) % participants.length;
      const participant = participants[index];
      if (participant && participant.enabled !== false && participant.status === 'active') {
        return { participant, nextIndex: (index + 1) % participants.length };
      }
    }
    return undefined;
  }

  private peekNextParticipant(conversation: Conversation): Participant | undefined {
    const selection = this.selectNextParticipant(conversation);
    return selection?.participant;
  }

  private async recordSkip(conversation: Conversation, participant: Participant, reason: SkipReason, detail?: string): Promise<void> {
    participant.status = reason === 'provider_unavailable' ? 'disconnected' : 'performing_poorly';
    participant.skipReason = reason;
    await this.store.appendMessage({
      id: crypto.randomUUID(), conversationId: conversation.id, authorType: 'system', role: 'system', modelId: participant.modelId,
      content: `Participant ${participant.modelId} skipped after ${reason}.${detail ? ` ${detail}` : ''} Next eligible participant will continue.`,
      turnNumber: conversation.currentTurn, createdAt: new Date().toISOString()
    });
    const activeParticipants = conversation.participants.filter((candidate) => candidate.enabled !== false && candidate.status === 'active').length;
    if (activeParticipants === 0) conversation.health = this.computeHealth(conversation, ['No eligible worker remains.'], ['Re-enable, replace, or reconnect a worker.']);
  }

  private computeHealth(conversation: Conversation, discrepancies: string[], recommendations: string[]): TeamHealthSnapshot {
    return {
      status: conversation.participants.some((participant) => participant.status === 'performing_poorly' || participant.status === 'disconnected') ? 'attention' : 'healthy',
      activeParticipants: conversation.participants.filter((participant) => participant.enabled !== false && participant.status === 'active').length,
      waitingParticipants: conversation.participants.filter((participant) => participant.status === 'waiting').length,
      skippedParticipants: conversation.participants.filter((participant) => participant.enabled === false || participant.skipReason).length,
      failedProviderCalls: conversation.participants.filter((participant) => participant.status === 'performing_poorly').length,
      discrepancies,
      recommendations,
      checkedAt: new Date().toISOString()
    };
  }

  private async requireConversation(id: string): Promise<Conversation> {
    const conversation = await this.store.getConversation(id);
    if (!conversation) throw new Error(`conversation not found: ${id}`);
    return conversation;
  }

  private async buildContext(conversationId: string, participant: Participant): Promise<ChatMessage[]> {
    const messages = await this.store.getMessages(conversationId);
    const context: ChatMessage[] = [
      { role: 'system', content: `You are the ${participant.role} on a provider-federated AI team. Respond to the current task with a useful contribution, identify relevant disagreements, avoid needless repetition, and never assume another agent's permissions.` }
    ];
    for (const message of messages) context.push({ role: message.role, content: message.content });
    return context;
  }
}

function enforceWordTarget(text: string, maxWords?: number): string {
  if (!maxWords) return text.trim();
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.slice(0, maxWords).join(' ');
}

function extractBullets(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.replace(/^[-*•]\s*/, '').trim()).filter(Boolean).slice(0, 8);
}
