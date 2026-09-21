import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  decodeFirestoreFields,
  firestoreBeginTransaction,
  firestoreCommitTransaction,
  firestoreFindSeat,
  firestoreGet,
  firestoreGetInTransaction,
  firestoreStringFields,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...CORS,
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

function taskPath(uid: string, workplaceId: string, projectId: string, taskId: string): string {
  return "accounts/" + uid + "/workplaces/" + workplaceId + "/projects/" + projectId + "/tasks/" + taskId;
}

function resourceName(path: string): string {
  return "projects/" + FIREBASE_PROJECT_ID + "/databases/(default)/documents/"
    + path.split("/").map(encodeURIComponent).join("/");
}

function validateCheckpoint(
  checkpoint: Record<string, unknown>,
  input: { taskId: string; projectId: string; checkpointId: string },
): void {
  if (
    String(checkpoint.taskId ?? "") !== input.taskId ||
    String(checkpoint.projectId ?? "") !== input.projectId ||
    String(checkpoint.checkpointId ?? "") !== input.checkpointId
  ) throw new Error("continuation_checkpoint_scope_mismatch");

  if (
    String(checkpoint.status ?? "") !== "awaiting_continuation" ||
    String(checkpoint.completionState ?? "") !== "HANDOFF_REQUIRED" ||
    String((checkpoint.termination as Record<string, unknown> | undefined)?.state ?? "") !== "incomplete"
  ) throw new Error("continuation_checkpoint_not_continuable");
}

function matchesRequest(
  request: Record<string, unknown>,
  input: {
    taskId: string;
    projectId: string;
    checkpointId: string;
    continuationRequestId: string;
    targetSeatId: string;
    instruction: string;
    requestedBy: string;
  },
): boolean {
  return (
    String(request.continuationRequestId ?? "") === input.continuationRequestId &&
    String(request.taskId ?? "") === input.taskId &&
    String(request.projectId ?? "") === input.projectId &&
    String(request.checkpointId ?? "") === input.checkpointId &&
    String(request.continuationOfCheckpointId ?? "") === input.checkpointId &&
    String(request.targetSeatId ?? "") === input.targetSeatId &&
    String(request.requestedBy ?? "") === input.requestedBy &&
    String(request.instruction ?? "") === input.instruction
  );
}

async function transitionTaskForContinuation(input: {
  uid: string;
  workplaceId: string;
  projectId: string;
  taskId: string;
  continuationRequestId: string;
  checkpointId: string;
  targetSeatId: string;
  requestedBy: string;
  requestedAt: string;
  instruction: string;
  accessToken: string;
}): Promise<"created" | "idempotent"> {
  const transaction = await firestoreBeginTransaction(input.accessToken);
  const path = taskPath(input.uid, input.workplaceId, input.projectId, input.taskId);
  const task = await firestoreGetInTransaction(path, transaction, input.accessToken);
  if (!task.exists) throw new Error("continuation_task_not_found");

  const current = decodeFirestoreFields(task.fields);
  const status = String(current.status ?? "");
  const currentCheckpoint = String(current.continuationCheckpointId ?? "");
  const currentRequest = String(current.continuationRequestId ?? "");

  const requestPath = path + "/continuation-requests/" + input.continuationRequestId;
  const eventId = input.continuationRequestId + ":continue-wait:event";
  const eventPath = "accounts/" + input.uid + "/workplaces/" + input.workplaceId
    + "/projects/" + input.projectId + "/events/" + eventId;
  const existingRequest = await firestoreGetInTransaction(requestPath, transaction, input.accessToken);
  const existingEvent = await firestoreGetInTransaction(eventPath, transaction, input.accessToken);

  if (existingRequest.exists) {
    const decodedRequest = decodeFirestoreFields(existingRequest.fields);
    if (!matchesRequest(decodedRequest, input)) throw new Error("continuation_request_id_conflict");
    if (status === "waiting_for_continuation") {
      if (currentCheckpoint !== input.checkpointId || currentRequest !== input.continuationRequestId) {
        throw new Error("continuation_request_state_conflict");
      }
      if (existingEvent.exists) return "idempotent";
    } else if (status !== "handoff_required") {
      throw new Error("continuation_request_state_conflict");
    }
  }

  if (status === "waiting_for_continuation") {
    if (currentCheckpoint !== input.checkpointId || currentRequest !== input.continuationRequestId) {
      throw new Error("continuation_request_state_conflict");
    }
    if (!existingRequest.exists) throw new Error("continuation_request_state_conflict");

    if (!existingEvent.exists) {
      await firestoreCommitTransaction(transaction, [{
        update: {
          name: resourceName(eventPath),
          fields: firestoreStringFields({
            uid: input.uid,
            projectId: input.projectId,
            taskId: input.taskId,
            eventId,
            idempotencyKey: input.continuationRequestId,
            type: "CONTINUE_WAIT",
            actorId: input.requestedBy,
            occurredAt: input.requestedAt,
          }),
        },
        currentDocument: { exists: false },
      }]);
    }
    return "idempotent";
  }

  if (status !== "handoff_required") {
    throw new Error("continuation_request_requires_handoff");
  }
  if (existingEvent.exists) throw new Error("continuation_request_state_conflict");

  const requestFields = firestoreStringFields({
    continuationRequestId: input.continuationRequestId,
    taskId: input.taskId,
    projectId: input.projectId,
    checkpointId: input.checkpointId,
    sourceSeatId: String(current.sourceSeatId ?? current.seatId ?? ""),
    targetSeatId: input.targetSeatId,
    requestedBy: input.requestedBy,
    requestedAt: input.requestedAt,
    instruction: input.instruction,
    status: "requested",
    continuationOfCheckpointId: input.checkpointId,
    nextTurn: "fresh-budgeted-turn",
  });

  const nextTaskFields = {
    ...task.fields,
    status: { stringValue: "waiting_for_continuation" },
    completionState: { stringValue: "WAITING_FOR_CONTINUATION" },
    approved: { booleanValue: false },
    approvedBy: { nullValue: null },
    approvedAt: { nullValue: null },
    leaseId: { nullValue: null },
    leasedBy: { nullValue: null },
    continuationCheckpointId: { stringValue: input.checkpointId },
    continuationRequestId: { stringValue: input.continuationRequestId },
    continuationTargetSeatId: { stringValue: input.targetSeatId },
    continuationRequestedBy: { stringValue: input.requestedBy },
    continuationRequestedAt: { stringValue: input.requestedAt },
    continuationInstruction: { stringValue: input.instruction },
    updatedAt: { stringValue: input.requestedAt },
  };

  await firestoreCommitTransaction(transaction, [
    {
      update: {
        name: resourceName(requestPath),
        fields: requestFields,
      },
      currentDocument: { exists: false },
    },
    {
      update: {
        name: resourceName(path),
        fields: nextTaskFields,
      },
      currentDocument: task.updateTime ? { updateTime: task.updateTime } : { exists: true },
    },
    {
      update: {
        name: resourceName(eventPath),
        fields: firestoreStringFields({
          uid: input.uid,
          projectId: input.projectId,
          taskId: input.taskId,
          eventId,
          idempotencyKey: input.continuationRequestId,
          type: "CONTINUE_WAIT",
          actorId: input.requestedBy,
          occurredAt: input.requestedAt,
        }),
      },
      currentDocument: { exists: false },
    },
  ], input.accessToken);

  return "created";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    readFirebaseServiceAccount();
    const uid = await verifyFirebaseUid(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const workplaceId = requireId(body.workplaceId, "workplaceId");
    const projectId = requireId(body.projectId, "projectId");
    const taskId = requireId(body.taskId, "taskId");
    const checkpointId = requireId(body.checkpointId, "checkpointId");
    const continuationRequestId = requireId(body.continuationRequestId, "continuationRequestId");
    const targetSeatId = requireId(body.targetSeatId, "targetSeatId");
    const instruction = requireId(body.instruction, "instruction");
    const requestedAt = new Date().toISOString();
    const input = {
      uid,
      workplaceId,
      projectId,
      taskId,
      checkpointId,
      continuationRequestId,
      targetSeatId,
      instruction: instruction.trim(),
      requestedBy: uid,
      requestedAt,
    };

    const accessToken = await getFirestoreAccessToken();

    const priorRequest = await firestoreGet(
      taskPath(uid, workplaceId, projectId, taskId) + "/continuation-requests/" + continuationRequestId,
      accessToken,
    );
    if (priorRequest.exists) {
      const existing = decodeFirestoreFields(priorRequest.fields);
      if (!matchesRequest(existing, input)) throw new Error("continuation_request_id_conflict");
      const existingStatus = String(existing.status ?? "requested");
      if (existingStatus !== "requested") {
        return json({
          ok: true,
          phase: "idempotent",
          duplicate: true,
          uid,
          workplaceId,
          projectId,
          taskId,
          continuationRequestId,
          checkpointId,
          targetSeatId,
          requestStatus: existingStatus,
          statePhase: "not_reopened",
        });
      }
      const phase = await transitionTaskForContinuation({ ...input, accessToken });
      return json({
        ok: true,
        phase: "idempotent",
        duplicate: true,
        uid,
        workplaceId,
        projectId,
        taskId,
        continuationRequestId,
        checkpointId,
        targetSeatId,
        statePhase: phase,
      });
    }

    const checkpointDoc = await firestoreGet(
      taskPath(uid, workplaceId, projectId, taskId) + "/continuation-checkpoints/" + checkpointId,
      accessToken,
    );
    if (!checkpointDoc.exists) throw new Error("continuation_checkpoint_not_found");
    const checkpoint = decodeFirestoreFields(checkpointDoc.fields);

    validateCheckpoint(checkpoint, { taskId, projectId, checkpointId });

    const seat = await firestoreFindSeat({
      uid,
      workplaceId,
      projectId,
      seatId: targetSeatId,
      accessToken,
    });
    if (!seat) throw new Error("target_seat_not_found");

    const seatStatus = String(seat.fields.status ?? "");
    const authorization = seat.fields.authorization;
    const authorizationStatus =
      authorization && typeof authorization === "object"
        ? String((authorization as Record<string, unknown>).status ?? "")
        : "";
    if (seatStatus !== "active") throw new Error("target_seat_not_active");
    if (authorizationStatus !== "authorized") throw new Error("target_seat_not_authorized");
    if (String(seat.fields.teamEntitlement ?? "") !== "allowed") {
      throw new Error("target_seat_team_entitlement_required");
    }
    if (String(seat.fields.providerEntitlement ?? "") !== "allowed") {
      throw new Error("target_seat_provider_entitlement_required");
    }

    const phase = await transitionTaskForContinuation({ ...input, accessToken });

    return json({
      ok: true,
      phase: phase === "created" ? "requested" : "idempotent",
      duplicate: phase === "idempotent",
      uid,
      workplaceId,
      projectId,
      taskId,
      continuationRequestId,
      checkpointId,
      sourceSeatId: String(checkpoint.seatId ?? ""),
      targetSeatId,
      nextTurn: "fresh-budgeted-turn",
      taskState: "waiting_for_continuation",
      completionState: "WAITING_FOR_CONTINUATION",
      note: "Continuation is requested and durably related to the handoff checkpoint. No provider execution occurs in this boundary.",
    }, phase === "created" ? 201 : 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "task_continuation_request_failed";
    if (message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" || message === "firebase_token_missing_uid") {
      return json({ error: message }, 401);
    }
    if (message.endsWith("_required")) return json({ error: message }, 400);
    if (
      message === "continuation_checkpoint_not_found" ||
      message === "continuation_task_not_found" ||
      message === "target_seat_not_found"
    ) return json({ error: message }, 404);
    if (message === "firestore_commit_transaction_failed:409" ||
      message.includes("firestore_commit_transaction_failed:409") ||
      message === "continuation_checkpoint_scope_mismatch" ||
      message === "continuation_checkpoint_not_continuable" ||
      message === "continuation_request_id_conflict" ||
      message === "continuation_request_state_conflict" ||
      message === "continuation_request_requires_handoff"
    ) return json({ error: message }, 409);
    if (
      message === "target_seat_not_active" ||
      message === "target_seat_not_authorized" ||
      message === "target_seat_team_entitlement_required" ||
      message === "target_seat_provider_entitlement_required"
    ) return json({ error: message }, 403);
    console.error("teamai_task_continuation_request_error", message);
    return json({ error: "task_continuation_request_failed", diagnostic: message.slice(0, 300) }, 500);
  }
});
