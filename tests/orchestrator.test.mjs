import test from 'node:test';
import assert from 'node:assert/strict';
import { ConversationOrchestrator, InMemoryConversationStore } from '../dist/src/orchestrator.js';

class FakeProvider {
  provider = 'fake';
  async generate(request) {
    return {
      provider: this.provider,
      model: request.model,
      requestId: `req-${request.model}-${Date.now()}`,
      text: `response from ${request.model}`,
      usage: { inputTokens: 10, outputTokens: 5, totalTokens: 15 },
      costUsd: 0.001
    };
  }
}

test('runs speakers in configured order and stops at max turns', async () => {
  const store = new InMemoryConversationStore();
  const fake = new FakeProvider();
  const orchestrator = new ConversationOrchestrator(store, new Map([
    ['gpt', fake], ['claude', fake], ['grok', fake]
  ]));
  await orchestrator.createConversation({
    id: 'c1', projectId: 'p1', title: 'Council', maxTurns: 4, maxWords: 80,
    participants: [
      { modelId: 'gpt', role: 'engineer', order: 0 },
      { modelId: 'claude', role: 'architect', order: 1 },
      { modelId: 'grok', role: 'reviewer', order: 2 }
    ]
  });
  await orchestrator.addHumanMessage('c1', 'Build a secure app.');
  const result = await orchestrator.run('c1', 4);
  assert.equal(result.turnsCompleted, 4);
  assert.deepEqual(result.speakers, ['gpt', 'claude', 'grok', 'gpt']);
  assert.equal((await store.getMessages('c1')).filter(m => m.authorType === 'ai').length, 4);
});

test('human intervention is visible to the next speaker', async () => {
  const store = new InMemoryConversationStore();
  const seen = [];
  const provider = {
    provider: 'fake',
    async generate(request) {
      seen.push(request.messages.map(m => `${m.role}:${m.content}`).join('|'));
      return { provider: 'fake', model: request.model, requestId: 'r', text: 'ok', usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } };
    }
  };
  const orchestrator = new ConversationOrchestrator(store, new Map([['gpt', provider], ['claude', provider]]));
  await orchestrator.createConversation({
    id: 'c2', projectId: 'p1', title: 'Council', maxTurns: 2, maxWords: 40,
    participants: [{ modelId: 'gpt', role: 'engineer', order: 0 }, { modelId: 'claude', role: 'architect', order: 1 }]
  });
  await orchestrator.addHumanMessage('c2', 'Initial task');
  await orchestrator.run('c2', 1);
  await orchestrator.addHumanMessage('c2', 'Focus on Firebase security.');
  await orchestrator.run('c2', 1);
  assert.match(seen[1], /Focus on Firebase security/);
});


test('skipping an unavailable participant still advances to the next eligible AI', async () => {
  const store = new InMemoryConversationStore();
  const provider = {
    provider: 'fake',
    async generate(request) {
      return { provider: 'fake', model: request.model, requestId: `r-${request.model}`, text: `ok ${request.model}`, usage: { inputTokens: 1, outputTokens: 1, totalTokens: 2 } };
    }
  };
  const orchestrator = new ConversationOrchestrator(store, new Map([['gpt', provider], ['grok', provider]]));
  await orchestrator.createConversation({
    id: 'c3', projectId: 'p1', title: 'Team', maxTurns: 2,
    participants: [
      { modelId: 'missing', role: 'researcher', order: 0 },
      { modelId: 'gpt', role: 'architect', order: 1 },
      { modelId: 'grok', role: 'reviewer', order: 2 }
    ]
  });
  await orchestrator.addHumanMessage('c3', 'Continue even if someone is unavailable.');
  const result = await orchestrator.run('c3', 2);
  assert.deepEqual(result.speakers, ['gpt', 'grok']);
  assert.equal(result.skipped[0].modelId, 'missing');
  assert.equal(result.nextSpeakerModelId, 'gpt');
});

test('team leader supervises without becoming a worker turn', async () => {
  const store = new InMemoryConversationStore();
  const calls = [];
  const provider = {
    provider: 'fake',
    async generate(request) {
      calls.push(request.model);
      return { provider: 'fake', model: request.model, requestId: 'r', text: '- discrepancy: none\n- recommendation: continue', usage: { inputTokens: 1, outputTokens: 2, totalTokens: 3 } };
    }
  };
  const orchestrator = new ConversationOrchestrator(store, new Map([['worker', provider], ['leader', provider]]));
  await orchestrator.createConversation({
    id: 'c4', projectId: 'p1', title: 'Led team', maxTurns: 1, teamLeaderModelId: 'leader',
    participants: [{ modelId: 'worker', role: 'builder', order: 0 }]
  });
  await orchestrator.addHumanMessage('c4', 'Build it.');
  const result = await orchestrator.run('c4', 1);
  assert.deepEqual(result.speakers, ['worker']);
  assert.deepEqual(calls, ['worker', 'leader']);
  assert.equal(result.leaderReports.length, 1);
});
