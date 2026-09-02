import test from 'node:test';
import assert from 'node:assert/strict';
import { createApiServer } from '../dist/src/api/server.js';
import { ConversationOrchestrator, InMemoryConversationStore } from '../dist/src/orchestrator.js';
import { CatalogService } from '../dist/src/catalog-service.js';

const fakeProvider = {
  provider: 'gemini',
  async generate() { throw new Error('not used'); },
  async listModels() {
    return [{ id: 'gemini-3.7-flash', displayName: 'Gemini 3.7 Flash', contextWindowTokens: 1000, capabilities: { text: true } }];
  },
};

test('model catalog API returns provider-backed model catalog', async () => {
  const catalog = new CatalogService(new Map([['gemini', fakeProvider]]));
  const server = createApiServer({
    orchestrator: new ConversationOrchestrator(new InMemoryConversationStore(), new Map()),
    resolvePlan: async () => 'free',
    catalog,
  });
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  try {
    const res = await fetch(`http://127.0.0.1:${port}/v1/catalog/models?userId=u1&provider=gemini`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.plan, 'free');
    assert.equal(body.models[0].id, 'gemini-3.7-flash');
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
