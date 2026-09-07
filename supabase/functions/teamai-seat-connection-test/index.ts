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
import { decryptSeatApiKey } from "../_shared/seat-secret.ts";

/**
 * TEAM-EXPERIENCE-029 — Seat connection Test (phase 4–7 + seat key)
 *
 * Credential order for HTTP probe:
 *   forceHealth / stub → free
 *   per-seat encrypted key → platform env → stub fallback
 * Browser never writes. No chat/tools. Commerce out of scope.
 */

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const PROBE_TIMEOUT_MS = 5_000;

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

type Health = "unknown" | "offline" | "degraded" | "healthy";

type ProbeResult = {
  connectionHealth: Health;
  probe: string;
  probeDetail: string;
  httpStatus?: number;
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

function normalizeHealth(raw: unknown): Health {
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

function resolveProviderKind(provider: string, explicit?: string | null): "openai" | "anthropic" | "generic" | "stub" {
  const e = String(explicit ?? "").trim().toLowerCase();
  if (e === "openai" || e === "anthropic" || e === "generic" || e === "stub") return e;
  const p = String(provider ?? "").trim().toLowerCase();
  if (!p) return "stub";
  if (p.includes("openai") || p.includes("gpt")) return "openai";
  if (p.includes("anthropic") || p.includes("claude")) return "anthropic";
  if (p.startsWith("http://") || p.startsWith("https://")) return "generic";
  return "stub";
}

function healthFromHttpStatus(status: number): Health {
  if (status >= 200 && status < 300) return "healthy";
  if (status === 401 || status === 403) return "degraded";
  if (status === 404 || status === 429) return "degraded";
  if (status >= 500) return "offline";
  return "degraded";
}

function readApiKey(kind: "openai" | "anthropic" | "generic"): string | null {
  const pick = (...names: string[]) => {
    for (const n of names) {
      const v = Deno.env.get(n)?.trim();
      if (v) return v;
    }
    return null;
  };
  if (kind === "openai") return pick("OPENAI_API_KEY", "TEAMAI_OPENAI_API_KEY");
  if (kind === "anthropic") return pick("ANTHROPIC_API_KEY", "TEAMAI_ANTHROPIC_API_KEY");
  return pick("TEAMAI_PROVIDER_API_KEY", "PROVIDER_API_KEY");
}

function buildProbeRequest(
  kind: "openai" | "anthropic" | "generic",
  apiKey: string | null,
  probeUrl?: string | null,
): { url: string; headers: Record<string, string>; probeLabel: string } | null {
  if (kind === "openai") {
    if (!apiKey) return null;
    return {
      url: "https://api.openai.com/v1/models",
      headers: { authorization: `Bearer ${apiKey}`, accept: "application/json" },
      probeLabel: "openai-models",
    };
  }
  if (kind === "anthropic") {
    if (!apiKey) return null;
    return {
      url: "https://api.anthropic.com/v1/models",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        accept: "application/json",
      },
      probeLabel: "anthropic-models",
    };
  }
  const url =
    (probeUrl && probeUrl.trim()) ||
    Deno.env.get("TEAMAI_PROVIDER_PROBE_URL")?.trim() ||
    null;
  if (!url || !/^https?:\/\//i.test(url)) return null;
  const headers: Record<string, string> = { accept: "application/json" };
  if (apiKey) headers.authorization = `Bearer ${apiKey}`;
  return { url, headers, probeLabel: "generic-http" };
}

async function httpProbe(
  req: { url: string; headers: Record<string, string>; probeLabel: string },
  fetchImpl: typeof fetch = fetch,
): Promise<ProbeResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  try {
    const response = await fetchImpl(req.url, {
      method: "GET",
      headers: req.headers,
      signal: controller.signal,
    });
    return {
      connectionHealth: healthFromHttpStatus(response.status),
      probe: `http:${req.probeLabel}`,
      probeDetail: `http:${response.status}:${req.probeLabel}`,
      httpStatus: response.status,
    };
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    const msg = err instanceof Error ? err.message : "probe_failed";
    const aborted = name === "AbortError" || /abort/i.test(msg);
    return {
      connectionHealth: "offline",
      probe: `http:${req.probeLabel}`,
      probeDetail: aborted ? `timeout:${PROBE_TIMEOUT_MS}ms` : `error:${msg.slice(0, 80)}`,
    };
  } finally {
    clearTimeout(timer);
  }
}

async function runConnectionProbe(input: {
  seatId: string;
  provider: string;
  model: string;
  baselineHealth: string;
  forceHealth?: string | null;
  providerKind?: string | null;
  probeMode?: string | null;
  probeUrl?: string | null;
  seatApiKey?: string | null;
  fetchImpl?: typeof fetch;
}): Promise<ProbeResult> {
  if (input.forceHealth) {
    return {
      connectionHealth: normalizeHealth(input.forceHealth),
      probe: "stub-edge-runtime",
      probeDetail: `forced:${normalizeHealth(input.forceHealth)}`,
    };
  }

  const mode = String(input.probeMode ?? "auto").trim().toLowerCase();
  if (mode === "stub") {
    return {
      connectionHealth: normalizeHealth(input.baselineHealth),
      probe: "stub-edge-runtime",
      probeDetail: `stub:${input.provider || "none"}:${input.model || "none"}`,
    };
  }

  const kind = resolveProviderKind(input.provider, input.providerKind);
  if (kind === "stub" && mode !== "http") {
    return {
      connectionHealth: normalizeHealth(input.baselineHealth),
      probe: "stub-edge-runtime",
      probeDetail: `stub:${input.provider || "none"}:${input.model || "none"}`,
    };
  }

  const effectiveKind = kind === "stub" ? "generic" : kind;
  const apiKey = (input.seatApiKey && input.seatApiKey.trim()) || readApiKey(effectiveKind);
  const built = buildProbeRequest(effectiveKind, apiKey, input.probeUrl);

  if (!built) {
    if (mode === "http") {
      return {
        connectionHealth: "degraded",
        probe: "http:unconfigured",
        probeDetail: "missing_api_key_or_probe_url",
      };
    }
    return {
      connectionHealth: normalizeHealth(input.baselineHealth),
      probe: "stub-edge-runtime",
      probeDetail: `stub-fallback:${input.provider || "none"}`,
    };
  }

  return httpProbe(built, input.fetchImpl ?? fetch);
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
    const persistRequested = body.persist !== false;
    const forceHealth =
      typeof body.forceHealth === "string" && body.forceHealth.trim()
        ? body.forceHealth.trim()
        : null;
    const providerKind =
      typeof body.providerKind === "string" && body.providerKind.trim()
        ? body.providerKind.trim()
        : null;
    const probeMode =
      typeof body.probeMode === "string" && body.probeMode.trim() ? body.probeMode.trim() : "auto";
    const probeUrl =
      typeof body.probeUrl === "string" && body.probeUrl.trim() ? body.probeUrl.trim() : null;

    let durable: Record<string, unknown> | null = null;
    let durablePath: string | null = null;

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

    let seatApiKey: string | null = null;
    let credentialSource: "seat" | "platform" | "none" = "none";
    if (workplaceId && projectId) {
      try {
        const accessTokenForSecret = await getFirestoreAccessToken();
        const secretPath =
          `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/seats/${seatId}/secrets/providerApiKey`;
        const secretDoc = await firestoreGet(secretPath, accessTokenForSecret);
        if (secretDoc.exists) {
          const sf = decodeFields(secretDoc.fields as Record<string, unknown>);
          if (typeof sf.ciphertext === "string" && typeof sf.iv === "string") {
            seatApiKey = await decryptSeatApiKey(sf.ciphertext, sf.iv);
          }
        }
      } catch (err) {
        console.error(
          "seat_connection_seat_key_load",
          err instanceof Error ? err.message : "load_failed",
        );
      }
    }

    const probeResult = await runConnectionProbe({
      seatId,
      provider,
      model,
      baselineHealth,
      forceHealth,
      providerKind,
      probeMode,
      probeUrl,
      seatApiKey,
    });
    if (probeResult.probe.startsWith("http:")) {
      credentialSource = seatApiKey ? "seat" : "platform";
    }

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
      httpStatus: probeResult.httpStatus ?? null,
      probeId,
      probedAt,
      durablePath,
      eventPath,
      eventStatus,
      durableWritten,
      credentialSource,
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
