export type WebAiTurnAuthor = 'human' | 'web_ai' | 'system';
export type WebAiTurnStatus = 'committed';

/**
 * One durable turn is the unit of conversation persistence.
 *
 * Draft typing, streaming chunks, cursor movement, and visual state stay
 * local. A turn becomes durable only when the human submits or the Web AI
 * response is complete.
 */
export type WebAiConversationTurn = {
  conversationId: string;
  turnId: string;
  sequence: number;
  author: WebAiTurnAuthor;
  seatId?: string;
  provider?: string;
  modelId?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  status: WebAiTurnStatus;
  createdAt: string;
};

export type ConversationTurnIdentity = Pick<WebAiConversationTurn, 'conversationId' | 'turnId'>;

export type ConversationTurnStore = {
  appendTurn(turn: WebAiConversationTurn): Promise<void>;
  getTurn(identity: ConversationTurnIdentity): Promise<WebAiConversationTurn | null>;
};

export function assertConversationTurn(turn: WebAiConversationTurn): void {
  for (const [name, value] of Object.entries({ conversationId: turn.conversationId, turnId: turn.turnId, content: turn.content })) {
    if (!value.trim()) throw new Error(`${name} is required`);
  }
  if (!Number.isInteger(turn.sequence) || turn.sequence < 0) throw new Error('sequence must be a non-negative integer');
}
