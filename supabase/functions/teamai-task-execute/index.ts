import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  firestoreCreate,
  firestoreGet,
  firestoreStringFields,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";

/**
 * TEAM-BACKEND-001 authenticated task path (commerce / PayPal out of scope).
 *
 * verified Firebase UID
 *   → create or accept READY task under uid/workplace/project
 *   → transactional lease (single winner semantics)
 *   → stub ProviderRuntime (no external provider call in this slice)
 *   → durable execution-result (create-only)
 *   → task status completed
 */

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const ROOT = "https://firestore.googleapis.com/v1";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

function requireId(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name}_required`);
  return value.trim();
}

async function verifyFirebaseUid(req: Request): Promise<string> {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("missing_firebase_id_token");
  const idToken = authorization.slice("Bearer ".length).trim();
  if (!idToken) throw new Error("missing_firebase_id_token");

  try {
    const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    });
    if (typeof payload.sub !== "string" || !payload.sub) throw new Error("firebase_token_missing_uid");
    return payload.sub;
  } catch (error) {
    if (error instanceof Error && (error.message === "firebase_token_missing_uid" || error.message === "missing_firebase_id_token")) {
      throw error;
    }
    throw new Error("invalid_firebase_id_token");
  }
}

function resourceName(documentPath: string): string {
  const encoded = documentPath.split("/").map((s) => encodeURIComponent(s)).join("/");
  return `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${encoded}`;
}

function documentsRoot(): string {
  return `${ROOT}/projects/${encodeURIComponent(FIREBASE_PROJECT_ID)}/databases/(default)/documents`;
}

function decodeFields(fields: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== "object") continue;
    const v = value as Record<string, unknown>;
    if ("stringValue" in v) out[key] = v.stringValue;
    else if ("booleanValue" in v) out[key] = v.booleanValue;
    else if ("integerValue" in v) out[key] = Number(v.integerValue);
    else if ("doubleValue" in v) out[key] = v.doubleValue;
    else if ("timestampValue" in v) out[key] = v.timestampValue;
    else out[key] = null;
  }
  return out;
}

function stringFields(values: Record<string, string>): Record<string, unknown> {
  return firestoreStringFields(values);
}

async function beginTransaction(accessToken: string): Promise<string> {
  const response = await fetch(`${documentsRoot()}:beginTransaction`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ options: { readWrite: {} } }),
  });
  if (!response.ok) throw new Error(`begin_transaction_failed:${response.status}`);
  const body = await response.json() as { transaction?: string };
  if (!body.transaction) throw new Error("begin_transaction_missing_id");
  return body.transaction;
}

async function transactionalGet(
  documentPath: string,
  transaction: string,
  accessToken: string,
): Promise<{ exists: boolean; updateTime?: string; fields: Record<string, unknown> }> {
  const url = new URL(`${documentsRoot()}/${documentPath.split("/").map(encodeURIComponent).join("/")}`);
  url.searchParams.set("transaction", transaction);
  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (response.status === 404) return { exists: false, fields: {} };
  if (!response.ok) throw new Error(`transactional_read_failed:${response.status}`);
  const data = await response.json() as { updateTime?: string; fields?: Record<string, unknown> };
  return { exists: true, updateTime: data.updateTime, fields: data.fields ?? {} };
}

type LeaseOutcome =
  | { acquired: true; leaseId: string; seatId: string }
  | { acquired: false; reason: "NOT_FOUND" | "NOT_READY" | "CONFLICT" };

async function leaseReadyTask(input: {
  taskPath: string;
  leaseId: string;
  seatId: string;
  actorId: string;
  uid: string;
  taskId: string;
  accessToken: string;
}): Promise<LeaseOutcome> {
  const transaction = await beginTransaction(input.accessToken);
  const task = await transactionalGet(input.taskPath, transaction, input.accessToken);
  if (!task.exists) return { acquired: false, reason: "NOT_FOUND" };
  const current = decodeFields(task.fields);
  if (current.status !== "ready") return { acquired: false, reason: "NOT_READY" };

  const now = new Date().toISOString();
  const leasePath = `${input.taskPath}/leases/${input.leaseId}`;
  const leaseFields = stringFields({
    uid: input.uid,
    taskId: input.taskId,
    seatId: input.seatId,
    leaseId: input.leaseId,
    actorId: input.actorId,
    status: "leased",
    leasedAt: now,
  });
  const taskFields = stringFields({
    ...(Object.fromEntries(
      Object.entries(current).filter(([, v]) => typeof v === "string").map(([k, v]) => [k, String(v)]),
    ) as Record<string, string>),
    status: "leased",
    leaseId: input.leaseId,
    leasedBy: input.actorId,
    updatedAt: now,
  });

  const commitResponse = await fetch(`${documentsRoot()}:commit`, {
    method: "POST",
    headers: { authorization: `Bearer ${input.accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({
      transaction,
      writes: [
        {
          update: { name: resourceName(leasePath), fields: leaseFields },
          currentDocument: { exists: false },
        },
        {
          update: { name: resourceName(input.taskPath), fields: taskFields },
          currentDocument: task.updateTime ? { updateTime: task.updateTime } : { exists: true },
        },
      ],
    }),
  });

  if (!commitResponse.ok) {
    if ([409, 412].includes(commitResponse.status)) {
      return { acquired: false, reason: "CONFLICT" };
    }
    const body = await commitResponse.text();
    throw new Error(`lease_commit_failed:${commitResponse.status}:${body.slice(0, 200)}`);
  }
  return { acquired: true, leaseId: input.leaseId, seatId: input.seatId };
}

async function markTaskCompleted(
  taskPath: string,
  accessToken: string,
  extra: Record<string, string>,
): Promise<void> {
  const now = new Date().toISOString();
  const fields = stringFields({ status: "completed", updatedAt: now, ...extra });
  const response = await fetch(`${documentsRoot()}:commit`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({
      writes: [{ update: { name: resourceName(taskPath), fields }, currentDocument: { exists: true } }],
    }),
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`task_complete_failed:${response.status}:${body.slice(0, 200)}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "authorization, content-type",
        "access-control-allow-methods": "POST, OPTIONS",
      },
    });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    // Ensure service account is present early (same secret as bootstrap / shared helpers).
    readFirebaseServiceAccount();
    const uid = await verifyFirebaseUid(req);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;

    const workplaceId = requireId(body.workplaceId, "workplaceId");
    const projectId = requireId(body.projectId, "projectId");
    const seatId = typeof body.seatId === "string" && body.seatId.trim()
      ? body.seatId.trim()
      : "seat-default";
    const actorId = typeof body.actorId === "string" && body.actorId.trim()
      ? body.actorId.trim()
      : "edge-task-execute";

    const runId = crypto.randomUUID().slice(0, 12);
    const taskId = typeof body.taskId === "string" && body.taskId.trim()
      ? body.taskId.trim()
      : `exec-${runId}`;
    const leaseId = `lease-${runId}`;
    const eventId = `complete-${runId}`;

    const taskPath = `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/tasks/${taskId}`;
    const resultPath =
      `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/tasks/${taskId}/execution-results/${eventId}`;

    const accessToken = await getFirestoreAccessToken();

    // Create READY task if caller did not supply an existing one (create-only).
    if (!(typeof body.taskId === "string" && body.taskId.trim())) {
      const created = await firestoreCreate(
        taskPath,
        stringFields({
          uid,
          workplaceId,
          projectId,
          taskId,
          status: "ready",
          createdAt: new Date().toISOString(),
          source: "teamai-task-execute",
        }),
        accessToken,
      );
      if (created === "exists") {
        return json({ error: "task_id_collision", taskId }, 409);
      }
    } else {
      const existing = await firestoreGet(taskPath, accessToken);
      if (!existing.exists) return json({ error: "task_not_found", taskId }, 404);
    }

    const lease = await leaseReadyTask({
      taskPath,
      leaseId,
      seatId,
      actorId,
      uid,
      taskId,
      accessToken,
    });

    if (!lease.acquired) {
      return json({
        ok: false,
        phase: "lease",
        acquired: false,
        reason: lease.reason,
        taskId,
        uid,
      }, 409);
    }

    // Stub ProviderRuntime — no external provider; durable shape matches Node result store.
    const recordedAt = new Date().toISOString();
    const resultText = typeof body.prompt === "string" && body.prompt.trim()
      ? `stub:${body.prompt.trim().slice(0, 200)}`
      : `stub-complete-${runId}`;

    const resultFields: Record<string, unknown> = {
      taskId: { stringValue: taskId },
      projectId: { stringValue: projectId },
      seatId: { stringValue: seatId },
      eventId: { stringValue: eventId },
      idempotencyKey: { stringValue: `${runId}-complete` },
      status: { stringValue: "completed" },
      recordedAt: { stringValue: recordedAt },
      result: {
        mapValue: {
          fields: {
            provider: { stringValue: "stub-edge-runtime" },
            model: { stringValue: "teamai-task-execute-v1" },
            requestId: { stringValue: runId },
            text: { stringValue: resultText },
            usage: {
              mapValue: {
                fields: {
                  inputTokens: { integerValue: "1" },
                  outputTokens: { integerValue: "1" },
                  totalTokens: { integerValue: "2" },
                },
              },
            },
          },
        },
      },
    };

    const persist = await firestoreCreate(resultPath, resultFields, accessToken);
    if (persist === "exists") {
      return json({ error: "result_already_exists", taskId, eventId }, 409);
    }

    await markTaskCompleted(taskPath, accessToken, {
      completedEventId: eventId,
      completedAt: recordedAt,
    });

    return json({
      ok: true,
      phase: "complete",
      uid,
      workplaceId,
      projectId,
      taskId,
      leaseId: lease.leaseId,
      seatId: lease.seatId,
      eventId,
      resultPath,
      provider: "stub-edge-runtime",
      text: resultText,
      note: "PayPal/commerce is out of scope for this function",
    }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "task_execute_failed";
    if (
      message === "missing_firebase_id_token" ||
      message === "invalid_firebase_id_token" ||
      message === "firebase_token_missing_uid"
    ) {
      return json({ error: message }, 401);
    }
    if (message.endsWith("_required")) {
      return json({ error: message }, 400);
    }
    console.error("teamai_task_execute_error", message);
    return json({ error: "task_execute_failed", diagnostic: message }, 500);
  }
});
