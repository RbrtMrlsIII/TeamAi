import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  decodeFirestoreFields,
  firestoreBeginTransaction,
  firestoreCommitTransaction,
  firestoreCreate,
  firestoreFindSeat,
  firestoreFindSeatConnection,
  firestoreGet,
  firestoreGetInTransaction,
  firestorePatch,
  firestoreStringFields,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";
import { loadSeatProviderCredential } from "../_shared/provider-credentials.ts";
import { normalizeEdgeTurnBudget, computeEdgeBudget, providerOutputCeiling } from "../_shared/seat-turn-budget.ts";
import { OpenAIProvider } from "../_shared/providers/openai.ts";
import { AnthropicProvider } from "../_shared/providers/anthropic.ts";
import { requiresContinuation } from "../_shared/providers/termination.ts";
import type { GenerateRequest, GenerateResult } from "../_shared/providers/types.ts";

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    },
  });

function requireId(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(name + "_required");
  return value.trim();
}

async function verifyFirebaseUid(req: Request): Promise<string> {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("missing_firebase_id_token");
  const token = authorization.slice("Bearer ".length).trim();
  if (!token) throw new Error("missing_firebase_id_token");

  try {
    const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: "https://securetoken.google.com/" + FIREBASE_PROJECT_ID,
      audience: FIREBASE_PROJECT_ID,
    });
    if (typeof payload.sub !== "string" || !payload.sub) throw new Error("firebase_token_missing_uid");
    return payload.sub;
  } catch (error) {
    if (error instanceof Error && error.message === "firebase_token_missing_uid") throw error;
    throw new Error("invalid_firebase_id_token");
  }
}

function decodedRecord(fields: Record<string, unknown> | undefined): Record<string, any> {
  return decodeFirestoreFields(fields) as Record<string, any>;
}

function finiteNonNegative(value: unknown, name: string, fallback = 0): number {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) throw new Error(name + "_invalid");
  return n;
}

function normalizeMessages(value: unknown): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  if (!Array.isArray(value) || value.length === 0) throw new Error("task_messages_required");
  const out = value.map((item) => {
    if (!item || typeof item !== "object") throw new Error("task_message_invalid");
    const message = item as Record<string, unknown>;
    const role = String(message.role ?? "").trim().toLowerCase();
    if (role !== "system" && role !== "user" && role !== "assistant") throw new Error("task_message_role_invalid");
    if (typeof message.content !== "string") throw new Error("task_message_content_invalid");
    return { role: role as "system" | "user" | "assistant", content: message.content };
  });
  return out;
}

function normalizeProviderKind(value: unknown): "openai" | "anthropic" {
  const kind = String(value ?? "").trim().toLowerCase();
  if (kind === "openai" || kind.includes("gpt")) return "openai";
  if (kind === "anthropic" || kind.includes("claude")) return "anthropic";
  throw new Error("unsupported_provider");
}

function firestoreValue(value: unknown): Record<string, unknown> {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") return Number.isInteger(value)
    ? { integerValue: String(value) }
    : { doubleValue: value };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(firestoreValue) } };
  }
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>).map(([key, child]) => [key, firestoreValue(child)]),
        ),
      },
    };
  }
  throw new Error("unsupported_firestore_value");
}

function firestoreFields(value: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, firestoreValue(child)]));
}

async function recordEvent(
  taskPath: string,
  eventId: string,
  type: "START" | "CONTINUE_START" | "COMPLETE" | "HANDOFF_REQUIRED" | "FAIL",
  uid: string,
  seatId: string,
  projectId: string,
  accessToken: string,
  detail: Record<string, unknown> = {},
): Promise<void> {
  await firestoreCreate(
    taskPath + "/execution-events/" + eventId,
    firestoreFields({
      uid,
      projectId,
      seatId,
      taskId: taskPath.split("/").at(-1) ?? "",
      eventId,
      type,
      occurredAt: new Date().toISOString(),
      source: "teamai-task-execute",
      ...detail,
    }),
    accessToken,
  );
}

async function patchTask(taskPath: string, accessToken: string, fields: Record<string, string>): Promise<void> {
  await firestorePatch(taskPath, firestoreStringFields(fields), accessToken);
}

async function leaseWaitingApprovalTask(input: {
  taskPath: string;
  leaseId: string;
  seatId: string;
  actorId: string;
  uid: string;
  taskId: string;
  accessToken: string;
}): Promise<"acquired" | "not_ready" | "conflict"> {
  const transaction = await firestoreBeginTransaction(input.accessToken);
  const task = await firestoreGetInTransaction(input.taskPath, transaction, input.accessToken);
  if (!task.exists) throw new Error("task_not_found");
  const current = decodedRecord(task.fields);
  if (String(current.status ?? "") !== "waiting_approval") return "not_ready";
  if (current.seatId && String(current.seatId) !== input.seatId) throw new Error("task_seat_mismatch");

  const now = new Date().toISOString();
  const leasePath = input.taskPath + "/leases/" + input.leaseId;
  const leaseFields = firestoreFields({
    uid: input.uid,
    taskId: input.taskId,
    seatId: input.seatId,
    leaseId: input.leaseId,
    actorId: input.actorId,
    status: "leased",
    leasedAt: now,
  });
  const taskFields: Record<string, unknown> = {
    ...task.fields,
    status: { stringValue: "leased" },
    leaseId: { stringValue: input.leaseId },
    leasedBy: { stringValue: input.actorId },
    updatedAt: { stringValue: now },
  };

  try {
    await firestoreCommitTransaction(
      transaction,
      [
        {
          update: { name: "projects/" + FIREBASE_PROJECT_ID + "/databases/(default)/documents/" + leasePath, fields: leaseFields },
          currentDocument: { exists: false },
        },
        {
          update: { name: "projects/" + FIREBASE_PROJECT_ID + "/databases/(default)/documents/" + input.taskPath, fields: taskFields },
          currentDocument: task.updateTime ? { updateTime: task.updateTime } : { exists: true },
        },
      ],
      input.accessToken,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (/409|412|conflict|aborted/i.test(message)) return "conflict";
    throw error;
  }

  return "acquired";
}

async function persistContinuationCheckpoint(input: {
  taskPath: string;
  checkpointId: string;
  taskId: string;
  projectId: string;
  seatId: string;
  actorId: string;
  sourceExecutionId: string;
  sourceEventId: string;
  provider: string;
  model: string;
  result: GenerateResult;
  budget: Record<string, unknown>;
  accessToken: string;
  continuationRequestId?: string;
  continuationOfCheckpointId?: string;
}): Promise<void> {
  await firestoreCreate(
    input.taskPath + "/continuation-checkpoints/" + input.checkpointId,
    firestoreFields({
      checkpointId: input.checkpointId,
      taskId: input.taskId,
      projectId: input.projectId,
      seatId: input.seatId,
      actorId: input.actorId,
      sourceExecutionId: input.sourceExecutionId,
      sourceEventId: input.sourceEventId,
      createdAt: new Date().toISOString(),
      status: "awaiting_continuation",
      completionState: "HANDOFF_REQUIRED",
      provider: input.provider,
      model: input.model,
      providerOutput: input.result.text,
      usage: input.result.usage,
      termination: input.result.termination,
      remainingGenerationTokens: input.budget.remainingGenerationTokens,
      usableGenerationTokens: input.budget.usableGenerationTokens,
      handoffReserveTokens: input.budget.handoffReserveTokens,
      nextAction: "authorized-continuation-turn",
      ...(input.continuationRequestId ? { continuationRequestId: input.continuationRequestId } : {}),
      ...(input.continuationOfCheckpointId ? { continuationOfCheckpointId: input.continuationOfCheckpointId } : {}),
    }),
    input.accessToken,
  );
}

async function executeProvider(providerKind: "openai" | "anthropic", apiKey: string, request: GenerateRequest): Promise<GenerateResult> {
  if (providerKind === "openai") return new OpenAIProvider(apiKey).generate(request);
  return new AnthropicProvider(apiKey).generate(request);
}

function matchesContinuationRequest(
  request: Record<string, any>,
  input: { taskId: string; projectId: string; checkpointId: string; continuationRequestId: string; targetSeatId: string; requestedBy: string; instruction: string },
): boolean {
  return String(request.continuationRequestId ?? '') === input.continuationRequestId
    && String(request.taskId ?? '') === input.taskId
    && String(request.projectId ?? '') === input.projectId
    && String(request.checkpointId ?? '') === input.checkpointId
    && String(request.continuationOfCheckpointId ?? '') === input.checkpointId
    && String(request.targetSeatId ?? '') === input.targetSeatId
    && String(request.requestedBy ?? '') === input.requestedBy
    && String(request.instruction ?? '') === input.instruction;
}

async function executeContinuationTurn(input: {
  uid: string; workplaceId: string; projectId: string; taskId: string; checkpointId: string;
  continuationRequestId: string; actorId: string; executionId: string; taskPath: string; accessToken: string;
}): Promise<Response> {
  const { uid, workplaceId, projectId, taskId, checkpointId, continuationRequestId, actorId, executionId, taskPath, accessToken } = input;
  const resultPath = taskPath + '/execution-results/' + executionId;
  const requestPath = taskPath + '/continuation-requests/' + continuationRequestId;
  const checkpointPath = taskPath + '/continuation-checkpoints/' + checkpointId;

  const priorResult = await firestoreGet(resultPath, accessToken);
  if (priorResult.exists) {
    const prior = decodedRecord(priorResult.fields);
    return json({ ok: true, phase: 'idempotent-result', duplicate: true, uid, taskId, executionId, status: prior.status ?? 'unknown', continuationRequestId: prior.continuationRequestId ?? continuationRequestId, continuationOfCheckpointId: prior.continuationOfCheckpointId ?? checkpointId, termination: prior.termination ?? null });
  }

  const requestDocument = await firestoreGet(requestPath, accessToken);
  if (!requestDocument.exists) return json({ error: 'continuation_request_not_found' }, 404);
  const continuationRequest = decodedRecord(requestDocument.fields);
  const targetSeatId = requireId(continuationRequest.targetSeatId, 'targetSeatId');
  const instruction = requireId(continuationRequest.instruction, 'continuationInstruction');
  if (!matchesContinuationRequest(continuationRequest, { taskId, projectId, checkpointId, continuationRequestId, targetSeatId, requestedBy: uid, instruction })) return json({ error: 'continuation_request_id_conflict' }, 409);

  const checkpointDocument = await firestoreGet(checkpointPath, accessToken);
  if (!checkpointDocument.exists) return json({ error: 'continuation_checkpoint_not_found' }, 404);
  const checkpoint = decodedRecord(checkpointDocument.fields);
  if (String(checkpoint.checkpointId ?? '') !== checkpointId || String(checkpoint.taskId ?? '') !== taskId || String(checkpoint.projectId ?? '') !== projectId || String(checkpoint.status ?? '') !== 'awaiting_continuation' || String(checkpoint.completionState ?? '') !== 'HANDOFF_REQUIRED' || String((checkpoint.termination as Record<string, unknown> | undefined)?.state ?? '') !== 'incomplete') return json({ error: 'continuation_checkpoint_not_continuable' }, 409);

  const taskDocument = await firestoreGet(taskPath, accessToken);
  if (!taskDocument.exists) return json({ error: 'task_not_found', taskId }, 404);
  const task = decodedRecord(taskDocument.fields);
  if (String(task.status ?? '') !== 'waiting_for_continuation') return json({ error: 'task_not_waiting_for_continuation', status: task.status ?? null }, 409);
  if (String(task.continuationRequestId ?? '') !== continuationRequestId || String(task.continuationCheckpointId ?? '') !== checkpointId) return json({ error: 'continuation_request_state_conflict' }, 409);

  const seatDocument = await firestoreFindSeat({ uid, workplaceId, projectId, seatId: targetSeatId, accessToken });
  if (!seatDocument) return json({ error: 'target_seat_not_found' }, 404);
  const seat = seatDocument.fields;
  if (String(seat.status ?? '') !== 'active') return json({ error: 'target_seat_not_active' }, 403);
  const authorization = seat.authorization && typeof seat.authorization === 'object' ? seat.authorization : {};
  if (String((authorization as Record<string, unknown>).status ?? '') !== 'authorized') return json({ error: 'target_seat_not_authorized' }, 403);
  if (String(seat.teamEntitlement ?? '') !== 'allowed') return json({ error: 'target_seat_team_entitlement_required' }, 403);
  if (String(seat.providerEntitlement ?? '') !== 'allowed') return json({ error: 'target_seat_provider_entitlement_required' }, 403);

  const seatProvider = String(seat.provider ?? '').trim();
  const taskProvider = String(task.provider ?? '').trim();
  if (!seatProvider || (taskProvider && taskProvider.toLowerCase() !== seatProvider.toLowerCase())) return json({ error: 'continuation_provider_seat_mismatch' }, 409);
  const connectionDocument = await firestoreFindSeatConnection({ uid, workplaceId, projectId, seatId: targetSeatId, accessToken });
  if (!connectionDocument) return json({ error: 'continuation_target_connection_not_found' }, 409);
  const connection = connectionDocument.fields;
  const connectionProvider = String(connection.provider ?? connection.providerCode ?? '').trim();
  if (connectionProvider && connectionProvider.toLowerCase() !== seatProvider.toLowerCase()) return json({ error: 'continuation_connection_provider_mismatch' }, 409);
  const capabilities = Array.isArray(connection.capabilities) ? connection.capabilities.map(String) : [];
  if (!capabilities.includes('execute')) return json({ error: 'connection_execute_capability_required' }, 403);

  const budget = normalizeEdgeTurnBudget(seat.turnBudget);
  const outputCeiling = providerOutputCeiling(budget);
  if (outputCeiling <= 0) return json({ error: 'seat_budget_exhausted' }, 409);
  const requestRecord = task.request && typeof task.request === 'object' ? task.request as Record<string, unknown> : {};
  const messages = normalizeMessages(requestRecord.messages);
  const continuationMessages = [...messages, ...(String(checkpoint.providerOutput ?? '') ? [{ role: 'assistant' as const, content: String(checkpoint.providerOutput) }] : []), { role: 'user' as const, content: instruction }];
  const requestedOutput = requestRecord.maxOutputTokens === undefined ? outputCeiling : finiteNonNegative(requestRecord.maxOutputTokens, 'maxOutputTokens', outputCeiling);
  const maxOutputTokens = Math.min(outputCeiling, requestedOutput);
  if (maxOutputTokens <= 0) return json({ error: 'provider_output_ceiling_zero' }, 409);
  const model = requireId(task.model, 'task_model');
  const providerKind = normalizeProviderKind(seat.providerKind ?? seatProvider);
  const credential = await loadSeatProviderCredential({ uid, workplaceId, projectId, seatId: targetSeatId, providerKind });
  if (credential.providerKind !== providerKind) return json({ error: 'provider_key_provider_mismatch' }, 409);
  const transaction = await firestoreBeginTransaction(accessToken);
  const transactionalTask = await firestoreGetInTransaction(taskPath, transaction, accessToken);
  const transactionalRequest = await firestoreGetInTransaction(requestPath, transaction, accessToken);
  if (!transactionalTask.exists || !transactionalRequest.exists) return json({ error: 'continuation_request_state_conflict' }, 409);
  const currentTask = decodeFirestoreFields(transactionalTask.fields);
  const currentRequest = decodeFirestoreFields(transactionalRequest.fields);
  if (String(currentTask.status ?? '') !== 'waiting_for_continuation' || String(currentRequest.status ?? 'requested') !== 'requested') return json({ error: 'continuation_request_state_conflict' }, 409);
  if (!matchesContinuationRequest(currentRequest, { taskId, projectId, checkpointId, continuationRequestId, targetSeatId, requestedBy: uid, instruction: String(currentRequest.instruction ?? '') })) return json({ error: 'continuation_request_state_conflict' }, 409);

  const startedAt = new Date().toISOString();
  const startEventId = 'continue-start-' + executionId;
  await firestoreCommitTransaction(transaction, [
    { update: { name: 'projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/' + taskPath, fields: { ...transactionalTask.fields, status: { stringValue: 'running' }, completionState: { stringValue: 'CONTINUATION_RUNNING' }, executionId: { stringValue: executionId }, actorId: { stringValue: actorId }, startedAt: { stringValue: startedAt }, continuationExecutionId: { stringValue: executionId }, continuationRequestId: { stringValue: continuationRequestId }, continuationCheckpointId: { stringValue: checkpointId } } }, currentDocument: transactionalTask.updateTime ? { updateTime: transactionalTask.updateTime } : { exists: true } },
    { update: { name: 'projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/' + requestPath, fields: { ...transactionalRequest.fields, status: { stringValue: 'executing' }, executionId: { stringValue: executionId }, startedAt: { stringValue: startedAt } } }, currentDocument: transactionalRequest.updateTime ? { updateTime: transactionalRequest.updateTime } : { exists: true } },
    { update: { name: 'projects/' + FIREBASE_PROJECT_ID + '/databases/(default)/documents/' + taskPath + '/execution-events/' + startEventId, fields: firestoreFields({ uid, projectId, taskId, seatId: targetSeatId, eventId: startEventId, type: 'CONTINUE_START', occurredAt: startedAt, source: 'teamai-task-execute', actorId, continuationRequestId, continuationOfCheckpointId: checkpointId }) }, currentDocument: { exists: false } },
  ], accessToken);


  let result: GenerateResult;
  try {
    result = await executeProvider(providerKind, credential.apiKey, { model, messages: continuationMessages, maxOutputTokens, temperature: typeof requestRecord.temperature === 'number' ? requestRecord.temperature : undefined, stream: false });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'provider_execution_failed';
    const recordedAt = new Date().toISOString();
    await recordEvent(taskPath, 'fail-' + executionId, 'FAIL', uid, targetSeatId, projectId, accessToken, { executionId, continuationRequestId, continuationOfCheckpointId: checkpointId, reason: 'provider_error', diagnostic: message.slice(0, 300) });
    await firestoreCreate(resultPath, firestoreFields({ taskId, projectId, seatId: targetSeatId, eventId: 'fail-' + executionId, idempotencyKey: executionId, status: 'failed', recordedAt, continuationRequestId, continuationOfCheckpointId: checkpointId, error: { name: error instanceof Error ? error.name : 'Error', message: message.slice(0, 300) } }), accessToken);
    await patchTask(taskPath, accessToken, { status: 'failed', completionState: 'PROVIDER_FAILED', completedAt: recordedAt, executionId });
    await patchTask(requestPath, accessToken, { status: 'failed', completedAt: recordedAt, executionId });
    return json({ error: 'provider_execution_failed', taskId, executionId }, 502);
  }

  const budgetUsage = computeEdgeBudget({ config: budget, inputTokens: finiteNonNegative(result.usage.inputTokens, 'usage.inputTokens'), outputTokens: finiteNonNegative(result.usage.outputTokens, 'usage.outputTokens'), reasoningTokens: finiteNonNegative(result.usage.reasoningTokens, 'usage.reasoningTokens') });
  if (!result.termination) throw new Error('provider_termination_missing');
  const terminal = result.termination;
  const recordedAt = new Date().toISOString();
  const continuation = terminal.state === 'incomplete' && requiresContinuation(terminal);
  const status = terminal.state === 'completed' ? 'completed' : continuation ? 'handoff_required' : 'failed';
  const completionState = terminal.state === 'completed' ? 'WORK_COMPLETE' : continuation ? 'HANDOFF_REQUIRED' : terminal.state === 'cancelled' ? 'CANCELLED' : 'PROVIDER_FAILED';
  const eventType = status === 'completed' ? 'COMPLETE' : status === 'handoff_required' ? 'HANDOFF_REQUIRED' : 'FAIL';
  const eventId = eventType.toLowerCase() + '-' + executionId;
  await recordEvent(taskPath, eventId, eventType, uid, targetSeatId, projectId, accessToken, { executionId, continuationRequestId, continuationOfCheckpointId: checkpointId, completionState, terminationReason: terminal.reason, providerReason: terminal.providerReason ?? '', consumedTotalTokens: String(budgetUsage.consumedTotalTokens), remainingGenerationTokens: String(budgetUsage.remainingGenerationTokens), usableGenerationTokens: String(budgetUsage.usableGenerationTokens) });
  let nextCheckpointId: string | undefined;
  if (continuation) {
    nextCheckpointId = executionId + ':checkpoint';
    await persistContinuationCheckpoint({ taskPath, checkpointId: nextCheckpointId, taskId, projectId, seatId: targetSeatId, actorId, sourceExecutionId: executionId, sourceEventId: eventId, provider: result.provider, model: result.model, result, budget: budgetUsage, accessToken, continuationRequestId, continuationOfCheckpointId: checkpointId });
  }
  await firestoreCreate(resultPath, firestoreFields({ taskId, projectId, seatId: targetSeatId, eventId, idempotencyKey: executionId, status, completionState, recordedAt, provider: result.provider, model: result.model, requestId: result.requestId, text: result.text, usage: { inputTokens: result.usage.inputTokens, outputTokens: result.usage.outputTokens, totalTokens: result.usage.totalTokens, reasoningTokens: result.usage.reasoningTokens ?? 0 }, termination: result.termination, budget: budgetUsage, configuredBudget: budget, continuationRequestId, continuationOfCheckpointId: checkpointId, ...(nextCheckpointId ? { continuationCheckpointId: nextCheckpointId } : {}) }), accessToken);
  await patchTask(taskPath, accessToken, { status, completionState, completedAt: recordedAt, executionId, continuationRequestId, continuationOfCheckpointId: checkpointId, ...(nextCheckpointId ? { continuationCheckpointId: nextCheckpointId } : {}), provider: result.provider, model: result.model, terminationReason: terminal.reason, remainingGenerationTokens: String(budgetUsage.remainingGenerationTokens), usableGenerationTokens: String(budgetUsage.usableGenerationTokens) });
  await patchTask(requestPath, accessToken, { status: status === 'completed' ? 'completed' : status, completedAt: recordedAt, executionId, ...(nextCheckpointId ? { continuationCheckpointId: nextCheckpointId } : {}) });
  return json({ ok: true, phase: status === 'completed' ? 'complete' : status, uid, workplaceId, projectId, taskId, seatId: targetSeatId, executionId, continuationRequestId, continuationOfCheckpointId: checkpointId, continuationCheckpointId: nextCheckpointId ?? null, provider: result.provider, model: result.model, requestId: result.requestId, completionState, termination: result.termination, usage: budgetUsage, text: result.text }, status === 'completed' ? 201 : 200);
}
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: {
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "authorization, content-type",
    "access-control-allow-methods": "POST, OPTIONS",
  }});
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let taskPath = "";
  let executionId = "";

  try {
    readFirebaseServiceAccount();
    const uid = await verifyFirebaseUid(req);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;

    const workplaceId = requireId(body.workplaceId, "workplaceId");
    const projectId = requireId(body.projectId, "projectId");
    const taskId = requireId(body.taskId, "taskId");
    const continuationRequestId = typeof body.continuationRequestId === "string" && body.continuationRequestId.trim() ? body.continuationRequestId.trim() : "";
    if (continuationRequestId) {
      const checkpointId = requireId(body.checkpointId, "checkpointId");
      const executionId = typeof body.executionId === "string" && body.executionId.trim() ? body.executionId.trim() : crypto.randomUUID();
      const actorId = typeof body.actorId === "string" && body.actorId.trim() ? body.actorId.trim() : uid;
      if (actorId !== uid) return json({ error: "continuation_actor_mismatch" }, 403);
      const taskPath = "accounts/" + uid + "/workplaces/" + workplaceId + "/projects/" + projectId + "/tasks/" + taskId;
      const accessToken = await getFirestoreAccessToken();
      return executeContinuationTurn({ uid, workplaceId, projectId, taskId, checkpointId, continuationRequestId, actorId, executionId, taskPath, accessToken });
    }
    const seatId = requireId(body.seatId, "seatId");
    const actorId = typeof body.actorId === "string" && body.actorId.trim() ? body.actorId.trim() : uid;
    executionId = typeof body.executionId === "string" && body.executionId.trim()
      ? body.executionId.trim()
      : crypto.randomUUID();

    taskPath = "accounts/" + uid + "/workplaces/" + workplaceId + "/projects/" + projectId + "/tasks/" + taskId;
    const resultPath = taskPath + "/execution-results/" + executionId;
    const accessToken = await getFirestoreAccessToken();

    const priorResult = await firestoreGet(resultPath, accessToken);
    if (priorResult.exists) {
      const prior = decodedRecord(priorResult.fields);
      return json({
        ok: true,
        phase: "idempotent-result",
        duplicate: true,
        uid,
        taskId,
        seatId,
        executionId,
        status: prior.status ?? "unknown",
        termination: prior.termination ?? null,
      });
    }

    const taskDocument = await firestoreGet(taskPath, accessToken);
    if (!taskDocument.exists) return json({ error: "task_not_found", taskId }, 404);
    const task = decodedRecord(taskDocument.fields);

    const seatDocument = await firestoreFindSeat({
      uid,
      workplaceId,
      projectId,
      seatId,
      accessToken,
    });
    if (!seatDocument) return json({ error: "seat_not_found", seatId }, 404);
    const seatPath = seatDocument.path;
    const seat = seatDocument.fields;

    if (task.seatId && String(task.seatId) !== seatId) return json({ error: "task_seat_mismatch" }, 409);
    if (String(task.projectId ?? projectId) !== projectId) return json({ error: "task_project_mismatch" }, 409);
    if (String(task.status ?? "") !== "waiting_approval") return json({ error: "task_not_waiting_approval", status: task.status ?? null }, 409);
    if (task.approved !== true) return json({ error: "task_approval_required" }, 403);

    if (String(seat.status ?? "") !== "active") return json({ error: "seat_not_active" }, 403);
    const authorization = seat.authorization && typeof seat.authorization === "object" ? seat.authorization : {};
    if (String((authorization as Record<string, unknown>).status ?? "") !== "authorized") {
      return json({ error: "seat_authorization_required" }, 403);
    }
    if (String(seat.teamEntitlement ?? "") !== "allowed") return json({ error: "team_entitlement_required" }, 403);
    if (String(seat.providerEntitlement ?? "") !== "allowed") return json({ error: "provider_entitlement_required" }, 403);

    const taskProvider = String(task.provider ?? "").trim();
    const seatProvider = String(seat.provider ?? "").trim();
    if (!seatProvider) return json({ error: "seat_provider_not_configured" }, 409);
    if (taskProvider && taskProvider.toLowerCase() !== seatProvider.toLowerCase()) {
      return json({ error: "task_provider_seat_mismatch" }, 409);
    }

    const connection = task.connection && typeof task.connection === "object" ? task.connection as Record<string, unknown> : null;
    if (!connection || String(connection.status ?? "") !== "active") return json({ error: "connection_not_active" }, 409);
    if (String(connection.projectId ?? "") !== projectId) return json({ error: "connection_project_mismatch" }, 409);
    const capabilities = Array.isArray(connection.capabilities) ? connection.capabilities.map(String) : [];
    if (!capabilities.includes("execute")) return json({ error: "connection_execute_capability_required" }, 403);

    const budget = normalizeEdgeTurnBudget(seat.turnBudget);
    const outputCeiling = providerOutputCeiling(budget);
    if (outputCeiling <= 0) return json({
      error: "seat_budget_exhausted",
      completionState: "WAITING_FOR_CONTINUATION",
      remainingGenerationTokens: 0,
      handoffReserveTokens: budget.handoffReserveTokens,
    }, 409);

    const requestRecord = task.request && typeof task.request === "object"
      ? task.request as Record<string, unknown>
      : {};
    const messages = normalizeMessages(requestRecord.messages);
    const requestedOutput = requestRecord.maxOutputTokens === undefined
      ? outputCeiling
      : finiteNonNegative(requestRecord.maxOutputTokens, "maxOutputTokens", outputCeiling);
    const maxOutputTokens = Math.min(outputCeiling, requestedOutput);
    if (maxOutputTokens <= 0) return json({ error: "provider_output_ceiling_zero" }, 409);

    const model = requireId(task.model, "task_model");
    const providerKind = normalizeProviderKind(seat.providerKind ?? seatProvider);
    const credential = await loadSeatProviderCredential({
      uid,
      workplaceId,
      projectId,
      seatId,
      providerKind,
    });

    if (credential.providerKind !== providerKind) return json({ error: "provider_key_provider_mismatch" }, 409);

    const lease = await leaseWaitingApprovalTask({
      taskPath,
      leaseId: executionId,
      seatId,
      actorId,
      uid,
      taskId,
      accessToken,
    });
    if (lease === "not_ready") return json({ error: "task_not_waiting_approval", status: task.status ?? null }, 409);
    if (lease === "conflict") return json({ error: "task_lease_conflict" }, 409);

    await patchTask(taskPath, accessToken, {
      status: "running",
      executionId,
      actorId,
      startedAt: new Date().toISOString(),
    });
    await recordEvent(taskPath, "start-" + executionId, "START", uid, seatId, projectId, accessToken, {
      executionId,
      responsibilityProfile: String(budget.responsibilityProfile ?? ""),
      configuredTurnBudget: String(budget.turnBudgetTokens),
      effectiveTurnBudget: String(budget.turnBudgetTokens),
      requestedOutputBudget: String(budget.outputBudgetTokens),
      providerOutputCeiling: String(maxOutputTokens),
    });

    let result: GenerateResult;
    try {
      result = await executeProvider(providerKind, credential.apiKey, {
        model,
        messages,
        maxOutputTokens,
        temperature: typeof requestRecord.temperature === "number" ? requestRecord.temperature : undefined,
        stream: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "provider_execution_failed";
      const recordedAt = new Date().toISOString();
      await recordEvent(taskPath, "fail-" + executionId, "FAIL", uid, seatId, projectId, accessToken, {
        executionId,
        reason: "provider_error",
        diagnostic: message.slice(0, 300),
      });
      await firestoreCreate(resultPath, firestoreFields({
        taskId,
        projectId,
        seatId,
        eventId: "fail-" + executionId,
        idempotencyKey: executionId,
        status: "failed",
        recordedAt,
        error: { name: error instanceof Error ? error.name : "Error", message: message.slice(0, 300) },
      }), accessToken);
      await patchTask(taskPath, accessToken, {
        status: "failed",
        completionState: "PROVIDER_FAILED",
        completedAt: recordedAt,
        executionId,
      });
      return json({ error: "provider_execution_failed", taskId, executionId }, 502);
    }

    const budgetUsage = computeEdgeBudget({
      config: budget,
      inputTokens: finiteNonNegative(result.usage.inputTokens, "usage.inputTokens"),
      outputTokens: finiteNonNegative(result.usage.outputTokens, "usage.outputTokens"),
      reasoningTokens: finiteNonNegative(result.usage.reasoningTokens, "usage.reasoningTokens"),
    });

    const terminal = result.termination;
    if (!terminal) throw new Error("provider_termination_missing");

    const recordedAt = new Date().toISOString();
    const continuation = terminal.state === "incomplete" && requiresContinuation(terminal);
    const status = terminal.state === "completed"
      ? "completed"
      : continuation
        ? "handoff_required"
        : "failed";
    const completionState = terminal.state === "completed"
      ? "WORK_COMPLETE"
      : continuation
        ? "HANDOFF_REQUIRED"
        : terminal.state === "cancelled"
          ? "CANCELLED"
          : "PROVIDER_FAILED";

    const eventType = status === "completed" ? "COMPLETE" : status === "handoff_required" ? "HANDOFF_REQUIRED" : "FAIL";
    const eventId = eventType.toLowerCase() + "-" + executionId;
    await recordEvent(taskPath, eventId, eventType, uid, seatId, projectId, accessToken, {
      executionId,
      completionState,
      terminationReason: terminal.reason,
      providerReason: terminal.providerReason ?? "",
      consumedTotalTokens: String(budgetUsage.consumedTotalTokens),
      remainingGenerationTokens: String(budgetUsage.remainingGenerationTokens),
      usableGenerationTokens: String(budgetUsage.usableGenerationTokens),
    });

    const continuationCheckpointId = continuation ? executionId + ":checkpoint" : undefined;
    if (continuation) {
      await persistContinuationCheckpoint({
        taskPath,
        checkpointId: continuationCheckpointId!,
        taskId,
        projectId,
        seatId,
        actorId,
        sourceExecutionId: executionId,
        sourceEventId: eventId,
        provider: result.provider,
        model: result.model,
        result,
        budget: budgetUsage,
        accessToken,
      });
    }

    await firestoreCreate(resultPath, firestoreFields({
      taskId,
      projectId,
      seatId,
      eventId,
      idempotencyKey: executionId,
      status,
      completionState,
      recordedAt,
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
      text: result.text,
      usage: {
        inputTokens: result.usage.inputTokens,
        outputTokens: result.usage.outputTokens,
        totalTokens: result.usage.totalTokens,
        reasoningTokens: result.usage.reasoningTokens ?? 0,
      },
      termination: result.termination,
      budget: budgetUsage,
      configuredBudget: budget,
      ...(continuationCheckpointId ? { continuationCheckpointId } : {}),
    }), accessToken);

    await patchTask(taskPath, accessToken, {
      status,
      completionState,
      completedAt: recordedAt,
      executionId,
      ...(continuationCheckpointId ? { continuationCheckpointId } : {}),
      provider: result.provider,
      model: result.model,
      terminationReason: terminal.reason,
      remainingGenerationTokens: String(budgetUsage.remainingGenerationTokens),
      usableGenerationTokens: String(budgetUsage.usableGenerationTokens),
      ...(continuationCheckpointId ? { continuationCheckpointId } : {}),
    });

    return json({
      ok: true,
      phase: status === "completed" ? "complete" : status,
      uid,
      workplaceId,
      projectId,
      taskId,
      seatId,
      executionId,
      provider: result.provider,
      model: result.model,
      requestId: result.requestId,
      completionState,
      termination: result.termination,
      usage: budgetUsage,
      text: result.text,
      note: status === "completed"
        ? "Real provider execution completed through the Seat-owned encrypted credential path."
        : "Provider returned an incomplete or terminal non-completion state; TeamAi did not claim completed work.",
    }, status === "completed" ? 201 : 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "task_execute_failed";
    if (message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" || message === "firebase_token_missing_uid") {
      return json({ error: message }, 401);
    }
    if (message.endsWith("_required") || message.includes("_invalid")) return json({ error: message }, 400);
    if (message === "seat_budget_not_configured" || message === "turnBudget_invalid" || message === "seat_budget_allocation_invalid") {
      return json({ error: message }, 409);
    }
    if (message === "seat_not_found") return json({ error: "seat_not_found" }, 404);
    if (message === "seat_ambiguous") return json({ error: "seat_ambiguous" }, 409);
    if (message === "provider_key_not_bound" || message === "provider_key_corrupt" || message === "provider_key_empty") {
      return json({ error: message }, 409);
    }
    console.error("teamai_task_execute_error", message, taskPath, executionId);
    return json({ error: "task_execute_failed", diagnostic: message.slice(0, 300) }, 500);
  }
});
