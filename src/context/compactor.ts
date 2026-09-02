import type { Message } from '../domain.js';

export interface ContextWindow { maxMessages: number; }

export function buildBoundedContext(messages: Message[], window: ContextWindow): Message[] {
  if (window.maxMessages < 1) return [];
  return messages.slice(-window.maxMessages);
}
