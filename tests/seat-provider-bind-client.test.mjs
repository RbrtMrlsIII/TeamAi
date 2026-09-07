import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createProviderKeyDraft,
  updateProviderKeyDraft,
  discardProviderKeyDraft,
  saveProviderKeyBinding,
} from '../frontend/spatial/seat-provider-bind-client.js';

test('draft stays local and dirty only after edits', () => {
  let d = createProviderKeyDraft({ seatId: 'alpha', providerKind: 'openai' });
  assert.equal(d.dirty, false);
  assert.equal(d.apiKey, '');
  d = updateProviderKeyDraft(d, { apiKey: 'sk-test-12345678' });
  assert.equal(d.dirty, true);
  d = discardProviderKeyDraft(d);
  assert.equal(d.apiKey, '');
  assert.equal(d.dirty, false);
});

test('saveProviderKeyBinding posts once and clears local key', async () => {
  let posted = null;
  const fetchImpl = async (url, init) => {
    posted = { url, body: JSON.parse(init.body) };
    return {
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        providerKeyBound: true,
        providerKeyLastFour: '5678',
        providerKind: 'openai',
      }),
    };
  };
  const draft = updateProviderKeyDraft(
    createProviderKeyDraft({ seatId: 'alpha', providerKind: 'openai' }),
    { apiKey: 'sk-test-12345678' },
  );
  const result = await saveProviderKeyBinding({
    baseUrl: 'https://example.test/functions/v1',
    idToken: 'tok',
    workplaceId: 'wp',
    projectId: 'proj',
    draft,
    fetchImpl,
  });
  assert.match(posted.url, /teamai-seat-provider-bind$/);
  assert.equal(posted.body.apiKey, 'sk-test-12345678');
  assert.equal(result.draft.apiKey, '');
  assert.equal(result.response.providerKeyLastFour, '5678');
});

test('save without baseUrl fails closed', async () => {
  await assert.rejects(
    () =>
      saveProviderKeyBinding({
        baseUrl: '',
        idToken: 'tok',
        workplaceId: 'wp',
        projectId: 'proj',
        draft: createProviderKeyDraft({ seatId: 'a', apiKey: 'sk-12345678' }),
      }),
    /baseUrl_required/,
  );
});
