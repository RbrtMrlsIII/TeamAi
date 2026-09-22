import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  firestoreFindSeat,
  firestoreCreate,
  firestoreGet,
  firestorePatch,
  firestoreStringFields,
  getFirestoreAccessToken,
  readFirebaseServiceAccount,
} from "../_shared/firestore.ts";
import { encryptSeatApiKey } from "../_shared/seat-secret.ts";

/**
 * TEAM-EXPERIENCE-029 — Per-seat provider API key bind
 *
 * verified Firebase UID
 *   → require workplaceId + projectId + seatId + apiKey
 *   → encrypt apiKey with TEAMAI_SEAT_SECRET_KEY (server only)
 *   → write metadata on seat + secret doc (never returned in full)
 *
 * Browser sends key only at Save. Browser never becomes durable secret authority.
 * Does not run chat/tools. Commerce out of scope.
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

function requireId(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name}_required`);
  return value.trim();
}

function normalizeProviderKind(raw: unknown): "openai" | "anthropic" | "generic" {
  const v = String(raw ?? "").trim().toLowerCase();
  if (v === "openai" || v === "anthropic" || v === "generic") return v;
  if (v.includes("openai") || v.includes("gpt")) return "openai";
  if (v.includes("anthropic") || v.includes("claude")) return "anthropic";
  return "generic";
}

function lastFour(secret: string): string {
  const s = secret.trim();
  if (s.length <= 4) return "****";
  return s.slice(-4);
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

    const workplaceId = requireId(body.workplaceId, "workplaceId");
    const projectId = requireId(body.projectId, "projectId");
    const seatId = requireId(body.seatId, "seatId");
    const clear = body.clear === true;
    const apiKey = clear ? "" : requireId(body.apiKey, "apiKey");
    const providerKind = normalizeProviderKind(body.providerKind ?? body.provider);

    const accessToken = await getFirestoreAccessToken();
    const existingSeat = await firestoreFindSeat({
      uid,
      workplaceId,
      projectId,
      seatId,
      accessToken,
    });
    if (!existingSeat) throw new Error("seat_not_found");
    const seatPath = existingSeat.path;
    const secretPath = `${seatPath}/secrets/providerApiKey`;
    const boundAt = new Date().toISOString();

    if (clear) {
      await firestorePatch(
        seatPath,
        firestoreStringFields({
          providerKeyBound: "false",
          providerKind,
          providerKeyLastFour: "",
          providerKeyBoundAt: "",
          updatedAt: boundAt,
        }),
        accessToken,
      );
      return json({
        ok: true,
        phase: "seat_provider_unbind",
        uid,
        seatId,
        workplaceId,
        projectId,
        providerKind,
        providerKeyBound: false,
      });
    }

    if (apiKey.length < 8) throw new Error("apiKey_too_short");

    const { ciphertextB64, ivB64 } = await encryptSeatApiKey(apiKey);
    const suffix = lastFour(apiKey);

    const secretFields = firestoreStringFields({
      uid,
      workplaceId,
      projectId,
      seatId,
      providerKind,
      ciphertext: ciphertextB64,
      iv: ivB64,
      alg: "AES-GCM-256",
      boundAt,
      source: "teamai-seat-provider-bind",
    });

    const existingSecret = await firestoreGet(secretPath, accessToken);
    if (existingSecret.exists) {
      await firestorePatch(secretPath, secretFields, accessToken);
    } else {
      await firestoreCreate(secretPath, secretFields, accessToken);
    }

    const meta = firestoreStringFields({
      uid,
      workplaceId,
      projectId,
      seatId,
      providerKind,
      providerKeyBound: "true",
      providerKeyLastFour: suffix,
      providerKeyBoundAt: boundAt,
      updatedAt: boundAt,
    });

    await firestorePatch(seatPath, meta, accessToken);

    return json({
      ok: true,
      phase: "seat_provider_bind",
      uid,
      seatId,
      workplaceId,
      projectId,
      providerKind,
      providerKeyBound: true,
      providerKeyLastFour: suffix,
      boundAt,
      note: "API key stored server-side (encrypted). Full key is never returned.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "seat_provider_bind_failed";
    if (
      message === "missing_firebase_id_token" ||
      message === "invalid_firebase_id_token" ||
      message === "firebase_token_missing_uid"
    ) {
      return json({ error: message }, 401);
    }
    if (message.endsWith("_required") || message === "apiKey_too_short" || message === "seat_not_found") {
      return json({ error: message }, 400);
    }
    if (message === "seat_secret_key_not_configured") {
      return json({ error: message }, 503);
    }
    console.error("teamai_seat_provider_bind_error", message);
    return json({ error: "seat_provider_bind_failed", diagnostic: message }, 500);
  }
});
