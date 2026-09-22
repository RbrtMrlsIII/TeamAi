import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  firestoreBeginTransaction,
  firestoreCommitTransaction,
  firestoreFindSeat,
  firestoreGetInTransaction,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
  decodeFirestoreFields,
} from "../_shared/firestore.ts";
import { normalizeEdgeTurnBudget } from "../_shared/seat-turn-budget.ts";

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
    },
  });

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

type FirestoreValue =
  | { stringValue: string }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { mapValue: { fields: Record<string, FirestoreValue> } }
  | { arrayValue: { values: FirestoreValue[] } };

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
    if (
      error instanceof Error &&
      (error.message === "firebase_token_missing_uid" || error.message === "missing_firebase_id_token")
    ) throw error;
    throw new Error("invalid_firebase_id_token");
  }
}

function requireId(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(name + "_required");
  return value.trim();
}

function value(input: unknown): FirestoreValue {
  if (typeof input === "string") return { stringValue: input };
  if (typeof input === "boolean") return { booleanValue: input };
  if (typeof input === "number" && Number.isInteger(input)) return { integerValue: String(input) };
  if (typeof input === "number") return { doubleValue: input };
  if (Array.isArray(input)) return { arrayValue: { values: input.map(value) } };
  if (input && typeof input === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(input as Record<string, unknown>).map(([key, item]) => [key, value(item)]),
        ),
      },
    };
  }
  throw new Error("seat_budget_value_invalid");
}

function budgetFields(budget: ReturnType<typeof normalizeEdgeTurnBudget>): FirestoreValue {
  return value({
    turnBudgetTokens: budget.turnBudgetTokens,
    outputBudgetTokens: budget.outputBudgetTokens,
    reasoningBudgetTokens: budget.reasoningBudgetTokens,
    handoffReserveTokens: budget.handoffReserveTokens,
    hardStopPolicy: budget.hardStopPolicy,
    responsibilityProfile: budget.responsibilityProfile ?? "reviewer",
    warningThresholdPercent: budget.warningThresholdPercent,
    contextInputPolicy: (budget as Record<string, unknown>).contextInputPolicy ?? { retention: "minimal-durable-context" },
  });
}

function assertConfigurableSeat(fields: Record<string, unknown>, uid: string, workplaceId: string, projectId: string) {
  if (String(fields.uid ?? "") !== uid) throw new Error("seat_identity_mismatch");
  if (String(fields.workplaceId ?? "") !== workplaceId) throw new Error("seat_identity_mismatch");
  if (String(fields.projectId ?? "") !== projectId) throw new Error("seat_identity_mismatch");
  const authorization = fields.authorization && typeof fields.authorization === "object"
    ? fields.authorization as Record<string, unknown>
    : {};
  if (String(authorization.status ?? fields.authorizationStatus ?? "revoked") !== "authorized") {
    throw new Error("seat_authorization_required");
  }
}

function safeModelFields(fields: Record<string, unknown>) {
  return {
    provider: typeof fields.provider === "string" ? fields.provider : null,
    model: typeof fields.model === "string" ? fields.model : null,
  };
}

function toResponse({
  uid,
  workplaceId,
  projectId,
  seatId,
  teamId,
  fields,
  budget,
  action,
}: {
  uid: string;
  workplaceId: string;
  projectId: string;
  seatId: string;
  teamId: string;
  fields: Record<string, unknown>;
  budget: ReturnType<typeof normalizeEdgeTurnBudget>;
  action: "get" | "save";
}) {
  return {
    ok: true,
    action,
    uid,
    workplaceId,
    projectId,
    seatId,
    teamId,
    authorized: true,
    configurable: true,
    available: true,
    healthy: true,
    ...safeModelFields(fields),
    configured: budget,
    source: "firestore-canonical-seat",
    usage: null,
    completionState: null,
    continuationAvailable: false,
    reason: action === "save"
      ? "Seat budget configuration persisted to the canonical Seat. Active-turn usage remains a separate runtime read model."
      : "Seat budget configuration loaded from the canonical Seat. Active-turn usage is not reported by this settings boundary.",
  };
}

async function loadSeat(input: {
  uid: string;
  workplaceId: string;
  projectId: string;
  seatId: string;
  accessToken: string;
}) {
  const seat = await firestoreFindSeat(input);
  if (!seat) throw new Error("seat_not_found");
  assertConfigurableSeat(seat.fields, input.uid, input.workplaceId, input.projectId);
  return seat;
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
    const action = body.action === "save" ? "save" : "get";
    const accessToken = await getFirestoreAccessToken();
    const seat = await loadSeat({ uid, workplaceId, projectId, seatId, accessToken });

    if (action === "get") {
      if (!seat.fields.turnBudget) throw new Error("seat_budget_not_configured");
      const budget = normalizeEdgeTurnBudget(seat.fields.turnBudget);
      return json(toResponse({ uid, workplaceId, projectId, seatId, teamId: seat.teamId, fields: seat.fields, budget, action }), 200);
    }

    const transaction = await firestoreBeginTransaction(accessToken);
    const current = await firestoreGetInTransaction(seat.path, transaction, accessToken);
    if (!current.exists) throw new Error("seat_not_found");

    const currentFields = decodeFirestoreFields(current.fields);
    assertConfigurableSeat(currentFields, uid, workplaceId, projectId);

    const currentBudget = currentFields.turnBudget ?? undefined;
    const patch = body.patch && typeof body.patch === "object"
      ? body.patch as Record<string, unknown>
      : {};
    if (!currentBudget && patch.turnBudgetTokens === undefined) throw new Error("turnBudgetTokens_required");

    const nextBudget = normalizeEdgeTurnBudget({
      ...(currentBudget && typeof currentBudget === "object" ? currentBudget as Record<string, unknown> : {}),
      ...patch,
      responsibilityProfile:
        patch.responsibilityProfile
        ?? (currentBudget && typeof currentBudget === "object"
          ? (currentBudget as Record<string, unknown>).responsibilityProfile
          : undefined)
        ?? "reviewer",
    });
    const contextInputPolicy = patch.contextInputPolicy && typeof patch.contextInputPolicy === "object"
      ? patch.contextInputPolicy
      : currentBudget && typeof currentBudget === "object" && (currentBudget as Record<string, unknown>).contextInputPolicy
        ? (currentBudget as Record<string, unknown>).contextInputPolicy
        : { retention: "minimal-durable-context" };

    const now = new Date().toISOString();
    await firestoreCommitTransaction(transaction, [{
      update: {
        name: `projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${seat.path}`,
        fields: {
          turnBudget: value({ ...nextBudget, contextInputPolicy }),
          updatedAt: { stringValue: now },
        },
      },
      updateMask: { fieldPaths: ["turnBudget", "updatedAt"] },
      currentDocument: current.updateTime ? { updateTime: current.updateTime } : { exists: true },
    }]);

    return json(toResponse({
      uid,
      workplaceId,
      projectId,
      seatId,
      teamId: seat.teamId,
      fields: { ...currentFields, turnBudget: { ...nextBudget, contextInputPolicy } },
      budget: { ...nextBudget, contextInputPolicy },
      action,
    }), 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : "seat_budget_settings_failed";
    if (message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" || message === "firebase_token_missing_uid") {
      return json({ error: message }, 401);
    }
    if (message.endsWith("_required") || message === "seat_not_found" || message === "seat_authorization_required") {
      return json({ error: message }, message === "seat_not_found" ? 404 : 400);
    }
    if (message === "seat_identity_mismatch") return json({ error: message }, 403);
    console.error("seat_budget_settings_error", message);
    return json({ error: "seat_budget_settings_failed", diagnostic: message }, 500);
  }
});
