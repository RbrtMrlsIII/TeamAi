import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  decodeFirestoreFields,
  firestoreDocumentUrl,
  firestoreFindSeat,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";
import { normalizeEdgeTurnBudget } from "../_shared/seat-turn-budget.ts";

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

function parseRunQueryDocuments(body: string): Array<{ name?: string; fields?: Record<string, unknown> }> {
  const trimmed = body.trim();
  if (!trimmed) return [];
  const parsed = JSON.parse(trimmed);
  const rows = Array.isArray(parsed) ? parsed : [parsed];
  return rows
    .filter((row): row is { document?: { name?: string; fields?: Record<string, unknown> } } => Boolean(row && typeof row === "object"))
    .map((row) => row.document)
    .filter((document): document is { name?: string; fields?: Record<string, unknown> } => Boolean(document));
}

async function findLatestResult(input: {
  uid: string;
  workplaceId: string;
  projectId: string;
  seatId: string;
  accessToken: string;
}) {
  const parentPath =
    "accounts/" + input.uid +
    "/workplaces/" + input.workplaceId +
    "/projects/" + input.projectId;
  const response = await fetch(firestoreDocumentUrl(parentPath) + ":runQuery", {
    method: "POST",
    headers: {
      authorization: "Bearer " + input.accessToken,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId: "execution-results", allDescendants: true }],
        // The parent path scopes the query to uid/workplace/project.
        // Keep the collection-group predicate to Seat identity so the declared
        // composite index is exactly (seatId ASC, recordedAt DESC).
        where: {
          fieldFilter: {
            field: { fieldPath: "seatId" },
            op: "EQUAL",
            value: { stringValue: input.seatId },
          },
        },
        orderBy: [{
          field: { fieldPath: "recordedAt" },
          direction: "DESCENDING",
        }],
        limit: 1,
      },
    }),
  });
  if (!response.ok) throw new Error("firestore_execution_result_query_failed:" + response.status);

  const documents = parseRunQueryDocuments(await response.text());
  const matches = documents.map((document) => {
    const name = String(document.name || "");
    const marker = "/documents/";
    const markerIndex = name.indexOf(marker);
    if (markerIndex < 0) return null;
    const path = name.slice(markerIndex + marker.length);
    const segments = path.split("/");
    const canonical =
      segments.length === 10 &&
      segments[0] === "accounts" &&
      segments[1] === input.uid &&
      segments[2] === "workplaces" &&
      segments[3] === input.workplaceId &&
      segments[4] === "projects" &&
      segments[5] === input.projectId &&
      segments[6] === "tasks" &&
      Boolean(segments[7]) &&
      segments[8] === "execution-results" &&
      Boolean(segments[9]);
    if (!canonical) return null;

    const fields = decodeFirestoreFields(document.fields);
    if (
      String(fields.uid ?? input.uid) !== input.uid ||
      String(fields.projectId ?? "") !== input.projectId ||
      String(fields.seatId ?? "") !== input.seatId
    ) return null;

    return {
      path,
      taskId: String(fields.taskId ?? segments[7]),
      executionId: String(fields.executionId ?? fields.idempotencyKey ?? segments[9]),
      fields,
    };
  }).filter((value): value is { path: string; taskId: string; executionId: string; fields: Record<string, unknown> } => Boolean(value));

  if (matches.length > 1) throw new Error("seat_execution_result_ambiguous");
  return matches[0] ?? null;
}

function numberOrNull(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function mapUsage(result: Record<string, unknown> | null) {
  if (!result) return { reported: false, usage: null, accountingSource: null };

  const budget = result.budget && typeof result.budget === "object"
    ? result.budget as Record<string, unknown>
    : null;
  const rawUsage = result.usage && typeof result.usage === "object"
    ? result.usage as Record<string, unknown>
    : result.result && typeof result.result === "object" && (result.result as Record<string, unknown>).usage && typeof (result.result as Record<string, unknown>).usage === "object"
      ? (result.result as Record<string, unknown>).usage as Record<string, unknown>
      : null;

  if (budget && rawUsage) {
    return {
      reported: true,
      accountingSource: "durable-execution-budget",
      usage: {
        consumedInputTokens: numberOrNull(budget.consumedInputTokens ?? rawUsage.inputTokens),
        consumedOutputTokens: numberOrNull(budget.consumedOutputTokens ?? rawUsage.outputTokens),
        consumedReasoningTokens: numberOrNull(budget.consumedReasoningTokens ?? rawUsage.reasoningTokens),
        consumedWorkOutputTokens: numberOrNull(budget.consumedWorkOutputTokens),
        consumedTotalTokens: numberOrNull(budget.consumedTotalTokens ?? rawUsage.totalTokens),
        remainingGenerationTokens: numberOrNull(budget.remainingGenerationTokens),
        usableGenerationTokens: numberOrNull(budget.usableGenerationTokens),
      },
    };
  }

  return {
    reported: false,
    accountingSource: "durable-execution-result-raw-usage",
    usage: rawUsage ? {
      consumedInputTokens: numberOrNull(rawUsage.inputTokens),
      consumedOutputTokens: numberOrNull(rawUsage.outputTokens),
      consumedReasoningTokens: numberOrNull(rawUsage.reasoningTokens),
      consumedWorkOutputTokens: null,
      consumedTotalTokens: numberOrNull(rawUsage.totalTokens),
      remainingGenerationTokens: null,
      usableGenerationTokens: null,
    } : null,
  };
}

function runtimeState(completionState: unknown, status: unknown) {
  const completion = String(completionState ?? "").toUpperCase();
  const normalizedStatus = String(status ?? "").toLowerCase();
  if (completion === "HANDOFF_REQUIRED" || normalizedStatus === "handoff_required") return "HANDOFF";
  if (completion === "WORK_COMPLETE" || normalizedStatus === "completed") return "COMPLETED";
  if (completion === "PROVIDER_FAILED" || normalizedStatus === "failed") return "BLOCKED";
  if (completion === "CANCELLED" || normalizedStatus === "cancelled") return "BLOCKED";
  return "READY";
}

function assertAuthorizedSeat(fields: Record<string, unknown>, uid: string, workplaceId: string, projectId: string, seatId: string) {
  if (
    String(fields.uid ?? "") !== uid ||
    String(fields.workplaceId ?? "") !== workplaceId ||
    String(fields.projectId ?? "") !== projectId ||
    String(fields.seatId ?? "") !== seatId
  ) throw new Error("seat_identity_mismatch");

  const authorization = fields.authorization && typeof fields.authorization === "object"
    ? fields.authorization as Record<string, unknown>
    : {};
  if (String(fields.status ?? "inactive") !== "active") throw new Error("seat_not_active");
  if (String(authorization.status ?? fields.authorizationStatus ?? "revoked") !== "authorized") {
    throw new Error("seat_authorization_required");
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    readFirebaseServiceAccount();
    const uid = await verifyFirebaseUid(req);
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const workplaceId = requireId(body.workplaceId, "workplaceId");
    const projectId = requireId(body.projectId, "projectId");
    const seatId = requireId(body.seatId, "seatId");

    const accessToken = await getFirestoreAccessToken();
    const seat = await firestoreFindSeat({ uid, workplaceId, projectId, seatId, accessToken });
    if (!seat) return json({ error: "seat_not_found" }, 404);
    assertAuthorizedSeat(seat.fields, uid, workplaceId, projectId, seatId);

    let configured;
    try {
      configured = normalizeEdgeTurnBudget(seat.fields.turnBudget);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "seat_budget_not_configured");
    }

    const latest = await findLatestResult({ uid, workplaceId, projectId, seatId, accessToken });
    if (!latest) {
      return json({
        ok: true,
        available: true,
        authorized: true,
        configurable: true,
        healthy: true,
        seatId,
        provider: typeof seat.fields.provider === "string" ? seat.fields.provider : null,
        model: typeof seat.fields.model === "string" ? seat.fields.model : null,
        configured,
        usageReported: false,
        usage: null,
        state: "READY",
        completionState: null,
        continuationAvailable: false,
        latest: null,
        reason: "Seat budget is configured, but no durable execution result exists for this Seat yet.",
        source: "firestore-canonical-seat",
      });
    }

    const fields = latest.fields;
    const nestedResult = fields.result && typeof fields.result === "object"
      ? fields.result as Record<string, unknown>
      : null;
    const provider = typeof fields.provider === "string"
      ? fields.provider
      : nestedResult && typeof nestedResult.provider === "string"
        ? nestedResult.provider
        : null;
    const model = typeof fields.model === "string"
      ? fields.model
      : nestedResult && typeof nestedResult.model === "string"
        ? nestedResult.model
        : null;

    const completionState = fields.completionState ?? (
      String(fields.status ?? "").toLowerCase() === "completed" ? "WORK_COMPLETE" : null
    );
    const usageResult = mapUsage(fields);
    const budget = fields.budget && typeof fields.budget === "object"
      ? fields.budget as Record<string, unknown>
      : null;

    return json({
      ok: true,
      available: true,
      authorized: true,
      configurable: true,
      healthy: true,
      seatId,
      provider: provider || (typeof seat.fields.provider === "string" ? seat.fields.provider : null),
      model: model || (typeof seat.fields.model === "string" ? seat.fields.model : null),
      configured,
      usageReported: usageResult.reported,
      usage: usageResult.usage,
      accountingSource: usageResult.accountingSource,
      state: runtimeState(completionState, fields.status),
      completionState,
      continuationAvailable: completionState === "HANDOFF_REQUIRED" || Boolean(fields.continuationCheckpointId || fields.continuationRequestId),
      latest: {
        taskId: latest.taskId,
        executionId: latest.executionId,
        recordedAt: typeof fields.recordedAt === "string" ? fields.recordedAt : null,
        status: typeof fields.status === "string" ? fields.status : null,
        providerRuntime: provider === "stub-edge-runtime" ? "stub-edge-runtime" : "provider-runtime",
        continuationCheckpointId: typeof fields.continuationCheckpointId === "string" ? fields.continuationCheckpointId : null,
        continuationRequestId: typeof fields.continuationRequestId === "string" ? fields.continuationRequestId : null,
        budgetRecorded: Boolean(budget),
      },
      reason: usageResult.reported
        ? "Latest durable execution result includes server-side budget accounting."
        : usageResult.usage
          ? "Latest durable execution result contains raw provider/runtime usage, but no server-side remaining-capacity accounting. This is not inferred."
          : "Latest durable execution result contains no usage payload.",
      source: "firestore-execution-result",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "seat_budget_runtime_failed";
    if (message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" || message === "firebase_token_missing_uid") {
      return json({ error: message }, 401);
    }
    if (message === "seat_not_found") return json({ error: message }, 404);
    if (message === "seat_identity_mismatch") return json({ error: message }, 403);
    if (message === "seat_not_active" || message === "seat_authorization_required") {
      return json({ error: message }, 403);
    }
    if (message.endsWith("_required") || message === "seat_budget_not_configured" || message === "turnBudget_invalid" || message === "seat_budget_allocation_invalid") {
      return json({ error: message }, 400);
    }
    console.error("seat_budget_runtime_error", message);
    return json({ error: "seat_budget_runtime_failed", diagnostic: message }, 500);
  }
});
