import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import { firestoreGet, getFirestoreAccessToken, readFirebaseServiceAccount } from "../_shared/firestore.ts";

/**
 * TEAM-EXPERIENCE-029 — Seat connection Test (phase 4)
 *
 * verified Firebase UID
 *   → optional Firestore seat read (if document exists)
 *   → stub connection probe (no external provider call)
 *   → JSON projection matching seat-connection-client mapServerSeatPayload
 *
 * Does not write durable health, lease, or provider runtime state.
 * Commerce / PayPal out of scope.
 */

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
    ) {
      throw error;
    }
    throw new Error("invalid_firebase_id_token");
  }
}

function decodeFields(fields: Record<string, unknown> | undefined): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (!fields) return out;
  for (const [key, value] of Object.entries(fields)) {
    if (!value || typeof value !== "object") continue;
    const v = value as Record<string, unknown>;
    if ("stringValue" in v) out[key] = v.stringValue;
    else if ("booleanValue" in v) out[key] = v.booleanValue;
    else if ("integerValue" in v) out[key] = Number(v.integerValue);
    else if ("doubleValue" in v) out[key] = v.doubleValue;
    else if ("timestampValue" in v) out[key] = v.timestampValue;
  }
  return out;
}

function normalizeHealth(raw: unknown): "unknown" | "offline" | "degraded" | "healthy" {
  const v = String(raw ?? "").trim().toLowerCase();
  if (["healthy", "ok", "ready", "pass", "passed"].includes(v)) return "healthy";
  if (["degraded", "warn", "warning", "partial"].includes(v)) return "degraded";
  if (["offline", "down", "fail", "failed", "error"].includes(v)) return "offline";
  return "unknown";
}

/** Stub seats when no durable seat document exists yet. */
function stubSeatCatalog(): Record<string, Record<string, string>> {
  return {
    alpha: {
      name: "Alpha",
      role: "planning",
      provider: "Provider One",
      model: "Model A",
      connectionHealth: "healthy",
      teamEntitlement: "allowed",
      providerEntitlement: "allowed",
      capability: "Planning + review",
    },
    beta: {
      name: "Beta",
      role: "worker",
      provider: "Provider Two",
      model: "Model B",
      connectionHealth: "healthy",
      teamEntitlement: "allowed",
      providerEntitlement: "allowed",
      capability: "Working + tool use",
    },
    gamma: {
      name: "Gamma",
      role: "reviewer",
      provider: "Provider Three",
      model: "Model C",
      connectionHealth: "degraded",
      teamEntitlement: "allowed",
      providerEntitlement: "review",
      capability: "Review only",
    },
  };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    readFirebaseServiceAccount();
    const uid = await verifyFirebaseUid(req);
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const seatId =
      typeof body.seatId === "string" && body.seatId.trim() ? body.seatId.trim() : "alpha";
    const workplaceId =
      typeof body.workplaceId === "string" && body.workplaceId.trim()
        ? body.workplaceId.trim()
        : null;
    const projectId =
      typeof body.projectId === "string" && body.projectId.trim() ? body.projectId.trim() : null;

    let durable: Record<string, unknown> | null = null;
    let durablePath: string | null = null;

    // Prefer durable seat when workplace/project + document exist; otherwise stub catalog.
    if (workplaceId && projectId) {
      durablePath =
        `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/seats/${seatId}`;
      try {
        const accessToken = await getFirestoreAccessToken();
        const doc = await firestoreGet(durablePath, accessToken);
        if (doc.exists) durable = decodeFields(doc.fields as Record<string, unknown>);
      } catch (err) {
        console.error(
          "seat_connection_firestore_read",
          err instanceof Error ? err.message : "read_failed",
        );
        // Continue with stub — read failure must not block presentation probe response shape.
      }
    }

    const catalog = stubSeatCatalog();
    const stub = catalog[seatId] ?? {
      name: seatId,
      role: "",
      provider: "",
      model: "",
      connectionHealth: "unknown",
      teamEntitlement: "unknown",
      providerEntitlement: "unknown",
      capability: "",
    };

    const connectionHealth = normalizeHealth(
      durable?.connectionHealth ?? durable?.health ?? durable?.connection ?? stub.connectionHealth,
    );

    const teamEntitlement = String(
      durable?.teamEntitlement ?? stub.teamEntitlement ?? "unknown",
    );
    const providerEntitlement = String(
      durable?.providerEntitlement ?? stub.providerEntitlement ?? "unknown",
    );

    // Stub probe: no external provider. Marks that authority path was authenticated.
    const probedAt = new Date().toISOString();

    return json({
      ok: true,
      phase: "seat_connection_test",
      uid,
      seatId,
      workplaceId,
      projectId,
      name: String(durable?.name ?? stub.name),
      role: String(durable?.role ?? stub.role),
      provider: String(durable?.provider ?? stub.provider),
      model: String(durable?.model ?? stub.model),
      connectionHealth,
      teamEntitlement,
      providerEntitlement,
      capability: String(durable?.capability ?? stub.capability ?? ""),
      teamQuality: String(durable?.teamQuality ?? ""),
      toolQuality: String(durable?.toolQuality ?? ""),
      limits: String(durable?.limits ?? ""),
      source: durable ? "domain-durable" : "domain-stub",
      probe: "stub-edge-runtime",
      probedAt,
      durablePath,
      note:
        "Presentation projection only. No provider runtime call and no durable health write in this slice.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "seat_connection_test_failed";
    if (
      message === "missing_firebase_id_token" ||
      message === "invalid_firebase_id_token" ||
      message === "firebase_token_missing_uid"
    ) {
      return json({ error: message }, 401);
    }
    console.error("teamai_seat_connection_test_error", message);
    return json({ error: "seat_connection_test_failed", diagnostic: message }, 500);
  }
});
