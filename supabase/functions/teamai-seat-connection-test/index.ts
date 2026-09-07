import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  firestoreCreate,
  firestoreGet,
  firestorePatch,
  firestoreStringFields,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";

/**
 * TEAM-EXPERIENCE-029 — Seat connection Test (phase 4–6)
 *
 * verified Firebase UID
 *   → optional Firestore seat read
 *   → connection probe (stub provider runtime in this slice)
 *   → optional durable write when workplaceId + projectId present:
 *       create-only connection-tests/{probeId}
 *       patch-or-create seats/{seatId} connectionHealth
 *   → JSON projection for browser (presentation only)
 *
 * Browser never writes. Commerce / PayPal out of scope.
 * Real external provider HTTP probe remains a later upgrade of runConnectionProbe().
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

/**
 * Connection probe seam. This slice uses stub-edge-runtime only.
 * Later: replace body with real provider health HTTP under the same return shape.
 */
function runConnectionProbe(input: {
  seatId: string;
  provider: string;
  model: string;
  baselineHealth: string;
  forceHealth?: string | null;
}): {
  connectionHealth: "unknown" | "offline" | "degraded" | "healthy";
  probe: string;
  probeDetail: string;
} {
  if (input.forceHealth) {
    return {
      connectionHealth: normalizeHealth(input.forceHealth),
      probe: "stub-edge-runtime",
      probeDetail: `forced:${normalizeHealth(input.forceHealth)}`,
    };
  }
  // Stub: trust baseline catalog/durable health; no external HTTP yet.
  return {
    connectionHealth: normalizeHealth(input.baselineHealth),
    probe: "stub-edge-runtime",
    probeDetail: `stub:${input.provider || "none"}:${input.model || "none"}`,
  };
}

async function persistConnectionProbe(input: {
  uid: string;
  workplaceId: string;
  projectId: string;
  seatId: string;
  probeId: string;
  probedAt: string;
  connectionHealth: string;
  probe: string;
  probeDetail: string;
  name: string;
  role: string;
  provider: string;
  model: string;
  teamEntitlement: string;
  providerEntitlement: string;
  capability: string;
}): Promise<{ durableWritten: boolean; eventStatus: "created" | "exists"; seatPath: string; eventPath: string }> {
  const accessToken = await getFirestoreAccessToken();
  const seatPath =
    `accounts/${input.uid}/workplaces/${input.workplaceId}/projects/${input.projectId}/seats/${input.seatId}`;
  const eventPath = `${seatPath}/connection-tests/${input.probeId}`;

  const eventFields = firestoreStringFields({
    uid: input.uid,
    workplaceId: input.workplaceId,
    projectId: input.projectId,
    seatId: input.seatId,
    probeId: input.probeId,
    connectionHealth: input.connectionHealth,
    probe: input.probe,
    probeDetail: input.probeDetail,
    probedAt: input.probedAt,
    source: "teamai-seat-connection-test",
  });

  const eventStatus = await firestoreCreate(eventPath, eventFields, accessToken);

  const healthFields = firestoreStringFields({
    connectionHealth: input.connectionHealth,
    lastProbedAt: input.probedAt,
    lastProbeId: input.probeId,
    lastProbe: input.probe,
    lastProbeDetail: input.probeDetail,
    updatedAt: input.probedAt,
  });

  const existing = await firestoreGet(seatPath, accessToken);
  if (existing.exists) {
    await firestorePatch(seatPath, healthFields, accessToken);
  } else {
    await firestoreCreate(
      seatPath,
      {
        ...firestoreStringFields({
          uid: input.uid,
          workplaceId: input.workplaceId,
          projectId: input.projectId,
          seatId: input.seatId,
          name: input.name,
          role: input.role,
          provider: input.provider,
          model: input.model,
          teamEntitlement: input.teamEntitlement,
          providerEntitlement: input.providerEntitlement,
          capability: input.capability,
          createdAt: input.probedAt,
        }),
        ...healthFields,
      },
      accessToken,
    );
  }

  return { durableWritten: true, eventStatus, seatPath, eventPath };
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
    const persistRequested = body.persist !== false; // default true when path is complete
    const forceHealth =
      typeof body.forceHealth === "string" && body.forceHealth.trim()
        ? body.forceHealth.trim()
        : null;

    let durable: Record<string, unknown> | null = null;
    let durablePath: string | null = null;
    let accessToken: string | null = null;

    if (workplaceId && projectId) {
      durablePath =
        `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/seats/${seatId}`;
      try {
        accessToken = await getFirestoreAccessToken();
        const doc = await firestoreGet(durablePath, accessToken);
        if (doc.exists) durable = decodeFields(doc.fields as Record<string, unknown>);
      } catch (err) {
        console.error(
          "seat_connection_firestore_read",
          err instanceof Error ? err.message : "read_failed",
        );
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

    const name = String(durable?.name ?? stub.name);
    const role = String(durable?.role ?? stub.role);
    const provider = String(durable?.provider ?? stub.provider);
    const model = String(durable?.model ?? stub.model);
    const teamEntitlement = String(durable?.teamEntitlement ?? stub.teamEntitlement ?? "unknown");
    const providerEntitlement = String(
      durable?.providerEntitlement ?? stub.providerEntitlement ?? "unknown",
    );
    const capability = String(durable?.capability ?? stub.capability ?? "");

    const baselineHealth = String(
      durable?.connectionHealth ?? durable?.health ?? durable?.connection ?? stub.connectionHealth,
    );

    const probeResult = runConnectionProbe({
      seatId,
      provider,
      model,
      baselineHealth,
      forceHealth,
    });

    const probedAt = new Date().toISOString();
    const probeId = `probe-${crypto.randomUUID().slice(0, 12)}`;

    let durableWritten = false;
    let eventStatus: "created" | "exists" | null = null;
    let eventPath: string | null = null;

    if (persistRequested && workplaceId && projectId) {
      try {
        const persisted = await persistConnectionProbe({
          uid,
          workplaceId,
          projectId,
          seatId,
          probeId,
          probedAt,
          connectionHealth: probeResult.connectionHealth,
          probe: probeResult.probe,
          probeDetail: probeResult.probeDetail,
          name,
          role,
          provider,
          model,
          teamEntitlement,
          providerEntitlement,
          capability,
        });
        durableWritten = persisted.durableWritten;
        eventStatus = persisted.eventStatus;
        eventPath = persisted.eventPath;
        durablePath = persisted.seatPath;
      } catch (err) {
        const message = err instanceof Error ? err.message : "persist_failed";
        console.error("seat_connection_persist_error", message);
        return json(
          {
            error: "seat_connection_persist_failed",
            diagnostic: message,
            connectionHealth: probeResult.connectionHealth,
            probe: probeResult.probe,
          },
          500,
        );
      }
    }

    return json({
      ok: true,
      phase: "seat_connection_test",
      uid,
      seatId,
      workplaceId,
      projectId,
      name,
      role,
      provider,
      model,
      connectionHealth: probeResult.connectionHealth,
      teamEntitlement,
      providerEntitlement,
      capability,
      teamQuality: String(durable?.teamQuality ?? ""),
      toolQuality: String(durable?.toolQuality ?? ""),
      limits: String(durable?.limits ?? ""),
      source: durableWritten ? "domain-durable" : durable ? "domain-read" : "domain-stub",
      probe: probeResult.probe,
      probeDetail: probeResult.probeDetail,
      probeId,
      probedAt,
      durablePath,
      eventPath,
      eventStatus,
      durableWritten,
      note: durableWritten
        ? "Probe recorded server-side (create-only event + seat health). Browser did not write."
        : "Projection only — durable write requires workplaceId + projectId (and persist !== false).",
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
