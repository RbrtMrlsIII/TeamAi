import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

function read(path) {
  return readFileSync(path, 'utf8');
}

test('Seat Budget runtime read boundary queries only the selected Seat latest durable execution result', () => {
  const source = read('supabase/functions/teamai-seat-budget-runtime/index.ts');
  assert.match(source, /collectionId: "execution-results"/);
  assert.match(source, /fieldPath: "seatId"/);
  assert.doesNotMatch(source, /fieldPath: "projectId"/);
  assert.match(source, /orderBy: \[\{[\s\S]*fieldPath: "recordedAt"[\s\S]*DESCENDING/);
  assert.match(source, /limit: 1/);
  assert.match(source, /execution_result_query_failed/);
  assert.match(source, /seat_execution_result_ambiguous/);
  assert.match(source, /seat_authorization_required/);
  assert.doesNotMatch(source, /providerOutput/);
  assert.doesNotMatch(source, /fields\.text[^\n]*return/);
});


test('Seat Budget runtime read boundary refuses unauthenticated requests and missing Seat state', () => {
  const source = read('supabase/functions/teamai-seat-budget-runtime/index.ts');
  assert.match(source, /missing_firebase_id_token/);
  assert.match(source, /seat_not_found/);
  assert.match(source, /seat_not_active/);
  assert.match(source, /seat_budget_not_configured/);
});

test('Seat Budget settings Edge boundary requires Firebase identity and persists only canonical Seat budget fields', () => {
  const source = read('supabase/functions/teamai-seat-budget-settings/index.ts');
  assert.match(source, /verifyFirebaseUid/);
  assert.match(source, /firestoreFindSeat/);
  assert.match(source, /firestoreBeginTransaction/);
  assert.match(source, /firestoreGetInTransaction/);
  assert.match(source, /firestoreCommitTransaction/);
  assert.match(source, /normalizeEdgeTurnBudget/);
  assert.match(source, /seat_authorization_required/);
  assert.match(source, /seat_identity_mismatch/);
  assert.match(source, /updateMask: \{ fieldPaths: \["turnBudget", "updatedAt"\] \}/);
  assert.doesNotMatch(source, /providerApiKey|decryptSeatApiKey|TEAMAI_SEAT_SECRET_KEY/);
});

test('Seat Budget settings Edge boundary never creates a missing Seat', () => {
  const source = read('supabase/functions/teamai-seat-budget-settings/index.ts');
  assert.match(source, /seat_not_found/);
  assert.doesNotMatch(source, /firestoreCreate/);
});

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


test('Normal Edge execution resolves an authoritative active connection from the canonical Seat scope', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  const executeStart = source.lastIndexOf('const taskProvider = String(task.provider');
  const budgetStart = source.indexOf('const budget = normalizeEdgeTurnBudget', executeStart);
  assert.ok(executeStart >= 0);
  assert.ok(budgetStart > executeStart);
  const connectionSection = source.slice(executeStart, budgetStart);
  assert.match(connectionSection, /firestoreFindSeatConnection\(\{[\s\S]*seatId,[\s\S]*accessToken,[\s\S]*\}\)/);
  assert.match(connectionSection, /connection_not_found/);
  assert.match(connectionSection, /connection_provider_not_configured/);
  assert.match(connectionSection, /connection_provider_seat_mismatch/);
  assert.match(connectionSection, /connection_execute_capability_required/);
  assert.doesNotMatch(connectionSection, /task\.connection/);
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


test('Edge handoff writes the checkpoint before the durable handoff result', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  const checkpointIndex = source.indexOf('await persistContinuationCheckpoint({');
  const resultIndex = source.lastIndexOf('await firestoreCreate(resultPath');
  assert.ok(checkpointIndex >= 0);
  assert.ok(resultIndex >= 0);
  assert.ok(checkpointIndex < resultIndex);
});


test('Trusted continuation request boundary stays user-authorized, checkpoint-scoped, and provider-free', () => {
  const source = read('supabase/functions/teamai-task-continuation-request/index.ts');
  assert.match(source, /verifyFirebaseUid/);
  assert.match(source, /firestoreFindSeat/);
  assert.match(source, /continuation-checkpoints/);
  assert.match(source, /continuation-requests/);
  assert.match(source, /continuation_checkpoint_scope_mismatch/);
  assert.match(source, /target_seat_not_authorized/);
  assert.match(source, /nextTurn: "fresh-budgeted-turn"/);
  assert.match(source, /type: "CONTINUE_WAIT"/);
  assert.match(source, /No provider execution occurs in this boundary/);
  assert.doesNotMatch(source, /OpenAIProvider/);
  assert.doesNotMatch(source, /AnthropicProvider/);
});

test('Trusted continuation request boundary atomically creates the request, state transition, and CONTINUE_WAIT event', () => {
  const source = read('supabase/functions/teamai-task-continuation-request/index.ts');
  const requestSectionIndex = source.indexOf('const requestPath = path + "/continuation-requests/"');
  const commitIndex = source.indexOf('await firestoreCommitTransaction(transaction, [');
  assert.ok(requestSectionIndex >= 0);
  assert.ok(commitIndex > requestSectionIndex);
  const transactionSection = source.slice(requestSectionIndex, source.indexOf('  return "created";', requestSectionIndex));
  assert.match(transactionSection, /continuation-requests/);
  assert.match(transactionSection, /status: \{ stringValue: "waiting_for_continuation" \}/);
  assert.match(transactionSection, /type: "CONTINUE_WAIT"/);
  assert.match(transactionSection, /currentDocument: \{ exists: false \}/);
});


test('Edge continuation execution requires the target Seat-owned connection', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /firestoreFindSeatConnection/);
  assert.match(source, /continuation_target_connection_not_found/);
  assert.match(source, /connectionProvider/);
  assert.match(source, /seatId: targetSeatId/);
});

test('Edge executor durably terminalizes provider results that omit normalized termination metadata', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  const helperStart = source.indexOf('async function persistProviderTerminationFailure');
  const continuationStart = source.indexOf('async function executeContinuationTurn');
  const serveStart = source.indexOf('Deno.serve', continuationStart);
  const normalTerminationStart = source.lastIndexOf('const terminal = result.termination;');
  assert.ok(helperStart >= 0);
  assert.ok(continuationStart >= 0);
  assert.ok(serveStart > continuationStart);
  assert.ok(normalTerminationStart > serveStart);

  const helper = source.slice(helperStart, continuationStart);
  assert.match(helper, /completionState: "PROVIDER_TERMINATION_INVALID"/);
  assert.match(helper, /reason: "provider_termination_missing"/);
  assert.match(helper, /termination: null/);
  assert.match(helper, /await recordEvent\(/);
  assert.match(helper, /await firestoreCreate\(input\.resultPath/);
  assert.match(helper, /finally/);
  assert.match(helper, /status: "failed"/);
  assert.match(helper, /await patchTask\(input\.taskPath/);

  const normalSection = source.slice(
    source.lastIndexOf('const budgetUsage = computeEdgeBudget', normalTerminationStart),
    source.indexOf('const recordedAt = new Date().toISOString();', normalTerminationStart),
  );
  assert.match(normalSection, /if \(!terminal\)/);
  assert.match(normalSection, /persistProviderTerminationFailure/);
  assert.match(normalSection, /provider_termination_invalid/);

  const continuationSection = source.slice(continuationStart, serveStart);
  assert.match(continuationSection, /if \(!result\.termination\)/);
  assert.match(continuationSection, /persistProviderTerminationFailure/);
  assert.match(continuationSection, /requestPath/);
});


test('Edge continuation execution creates a new checkpoint linked to the previous checkpoint', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /nextCheckpointId = executionId \+ ':checkpoint'/);
  assert.match(source, /continuationOfCheckpointId: checkpointId/);
  assert.match(source, /continuationRequestId, continuationOfCheckpointId/);
});


test('Continuation setup validates Seat budget and credential before the durable running transition', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  const continuationStart = source.indexOf('async function executeContinuationTurn');
  const budgetIndex = source.indexOf('const budget = normalizeEdgeTurnBudget(seat.turnBudget);', continuationStart);
  const credentialIndex = source.indexOf('loadSeatProviderCredential', continuationStart);
  const transactionIndex = source.indexOf('const transaction = await firestoreBeginTransaction(accessToken);', continuationStart);
  assert.ok(continuationStart >= 0);
  assert.ok(budgetIndex > continuationStart);
  assert.ok(credentialIndex > budgetIndex);
  assert.ok(transactionIndex > credentialIndex);
});


test('Continuation request endpoint does not reopen terminal request state', () => {
  const source = read('supabase/functions/teamai-task-continuation-request/index.ts');
  assert.match(source, /existingStatus/);
  assert.match(source, /existingStatus !== "requested"/);
  assert.match(source, /statePhase: "not_reopened"/);
});

test('Continuation executor resolves an active connection from the target Seat', () => {
  const source = read('supabase/functions/teamai-task-execute/index.ts');
  assert.match(source, /firestoreFindSeatConnection/);
  assert.match(source, /continuation_target_connection_not_found/);
  assert.match(source, /connectionProvider/);
});
