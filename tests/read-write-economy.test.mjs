import test from 'node:test';
import assert from 'node:assert/strict';
import { ConfigurationDraft } from '../dist/src/backend/configuration-draft.js';
import { assertConversationTurn } from '../dist/src/backend/conversation-turn.js';

test('configuration edits stay local until explicit save and one save commits the final state', async () => {
  const writes = [];
  const store = { async load() { return { theme: 'dark', density: 'default', motion: 'full' }; }, async save(value) { writes.push(value); } };
  const draft = new ConfigurationDraft(await store.load());

  draft.update({ theme: 'light' });
  draft.update({ density: 'compact' });
  draft.update({ motion: 'reduced' });
  assert.equal(writes.length, 0);
  assert.equal(draft.state.dirty, true);

  const saved = await draft.save(store);
  assert.equal(saved.saved, true);
  assert.deepEqual(writes, [{ theme: 'light', density: 'compact', motion: 'reduced' }]);
  assert.equal(draft.state.dirty, false);

  const noOp = await draft.save(store);
  assert.equal(noOp.saved, false);
  assert.equal(writes.length, 1);
});

test('conversation turns validate a single durable completed turn, not streaming drafts', () => {
  const turn = {
    conversationId: 'conversation-1',
    turnId: 'turn-7',
    sequence: 7,
    author: 'web_ai',
    seatId: 'seat-a',
    provider: 'fixture',
    modelId: 'model-1',
    role: 'assistant',
    content: 'The completed Web AI contribution is committed once.',
    status: 'committed',
    createdAt: '2026-09-05T00:00:00Z',
  };
  assert.doesNotThrow(() => assertConversationTurn(turn));
  assert.throws(() => assertConversationTurn({ ...turn, turnId: '' }));
});
