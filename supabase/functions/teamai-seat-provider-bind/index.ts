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

async function materializeAesKey(): Promise<CryptoKey> {
  const raw = Deno.env.get("TEAMAI_SEAT_SECRET_KEY")?.trim();
  if (!raw) throw new Error("seat_secret_key_not_configured");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function toB64(bytes: ArrayBuffer | Uint8Array): string {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i]);
  return btoa(s);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function encryptApiKey(plain: string): Promise<{ ciphertextB64: string; ivB64: string }> {
  const key = await materializeAesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain),
  );
  return { ciphertextB64: toB64(ct), ivB64: toB64(iv) };
}

/** Exported pattern for connection-test sibling: decrypt stored binding. */
export async function decryptApiKey(ciphertextB64: string, ivB64: string): Promise<string> {
  const key = await materializeAesKey();
  const plain = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(ivB64) },
    key,
    fromB64(ciphertextB64),
  );
  return new TextDecoder().decode(plain);
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
    const apiKey = requireId(body.apiKey, "apiKey");
    const providerKind = normalizeProviderKind(body.providerKind ?? body.provider);
    const clear = body.clear === true;

    const accessToken = await getFirestoreAccessToken();
    const seatPath =
      `accounts/${uid}/workplaces/${workplaceId}/projects/${projectId}/seats/${seatId}`;
    const secretPath = `${seatPath}/secrets/providerApiKey`;
    const boundAt = new Date().toISOString();

    if (clear) {
      // Mark unbound; leave secret doc (overwrite with empty tombstone fields via patch metadata only)
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
      ).catch(async () => {
        await firestoreCreate(
          seatPath,
          firestoreStringFields({
            uid,
            workplaceId,
            projectId,
            seatId,
            providerKeyBound: "false",
            providerKind,
            updatedAt: boundAt,
          }),
          accessToken,
        );
      });
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

    const { ciphertextB64, ivB64 } = await encryptApiKey(apiKey);
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

    const existingSeat = await firestoreGet(seatPath, accessToken);
    if (existingSeat.exists) {
      await firestorePatch(seatPath, meta, accessToken);
    } else {
      await firestoreCreate(seatPath, meta, accessToken);
    }

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
    if (message.endsWith("_required") || message === "apiKey_too_short") {
      return json({ error: message }, 400);
    }
    if (message === "seat_secret_key_not_configured") {
      return json({ error: message }, 503);
    }
    console.error("teamai_seat_provider_bind_error", message);
    return json({ error: "seat_provider_bind_failed", diagnostic: message }, 500);
  }
});
