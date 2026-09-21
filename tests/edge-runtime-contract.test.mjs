import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(path, 'utf8');
}

test('Edge executor no longer claims stub completion', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.doesNotMatch(source, /stub-edge-runtime/);
  assert.match(source, /OpenAIProvider/);
  assert.match(source, /AnthropicProvider/);
  assert.match(source, /loadSeatProviderCredential/);
});

test('Edge executor requires existing approved task and authorized Seat', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /task_not_found/);
  assert.match(source, /task_not_waiting_approval/);
  assert.match(source, /task_approval_required/);
  assert.match(source, /seat_not_found/);
  assert.match(source, /seat_not_active/);
  assert.match(source, /seat_authorization_required/);
  assert.match(source, /team_entitlement_required/);
  assert.match(source, /provider_entitlement_required/);
});

test('Edge executor binds provider selection and budget to the durable Seat', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /seat.provider/);
  assert.match(source, /normalizeEdgeTurnBudget\(seat\.turnBudget\)/);
  assert.match(source, /providerOutputCeiling\(budget\)/);
  assert.match(source, /loadSeatProviderCredential/);
});

test('Edge provider runtime mirror is synchronized from canonical providers', () => {
  const files = ['types.ts', 'http.ts', 'retry.ts', 'termination.ts', 'openai.ts', 'anthropic.ts'];
  for (const file of files) {
    const canonical = read('src/providers/' + file);
    const expected = canonical.replace(/(from\s+['"]\.\/[^'"]+)\.js(['"])/g, '$1.ts$2');
    const mirror = read('supabase/functions/_shared/providers/' + file);
    assert.equal(mirror, expected, file + ' drifted from canonical provider source');
  }
});

test('Seat provider binding and credential loading use canonical existing-Seat authority', () => {
  const bind = read('supabase/functions/teamai-seat-provider-bind/index.ts');
  const credentials = read('supabase/functions/_shared/provider-credentials.ts');
  const connection = read('supabase/functions/teamai-seat-connection-test/index.ts');
  assert.match(bind, /firestoreFindSeat/);
  assert.match(bind, /seat_not_found/);
  assert.match(bind, /const clear = body\.clear === true/);
  assert.match(bind, /const apiKey = clear \? "" : requireId/);
  assert.doesNotMatch(bind, /firestoreCreate\(\s*seatPath/);
  assert.match(credentials, /firestoreFindSeat/);
  assert.match(credentials, /providerKeyBound/);
  assert.match(connection, /firestoreFindSeat/);
  assert.match(connection, /seat_not_found/);
  assert.doesNotMatch(connection, /if \(existing\.exists\)[\s\S]*else \{/);
});

test('Seat secret resolver never exposes plaintext through a return field other than in-memory credential', () => {
  const source = read('supabase/functions/_shared/provider-credentials.ts');
  assert.doesNotMatch(source, /return\s+.*ciphertext/i);
  assert.match(source, /decryptSeatApiKey/);
  assert.match(source, /provider_key_not_bound/);
});


test('Edge executor persists a durable continuation checkpoint before recording handoff', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /persistContinuationCheckpoint/);
  assert.match(source, /continuation-checkpoints/);
  assert.match(source, /continuationCheckpointId/);
  assert.match(source, /sourceExecutionId/);
  assert.match(source, /sourceEventId/);
  assert.match(source, /authorized-continuation-turn/);
});
