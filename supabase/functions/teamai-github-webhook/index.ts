import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { firestoreGet, firestorePatch, firestoreStringFields, getFirestoreAccessToken } from "../_shared/firestore.ts";

/**
 * Conn-2 — GitHub App webhook receipt + UID lookup.
 * HMAC verify; 503 if secret missing; 200 unbound if unmapped.
 * Does not mint firebaseUid from the payload. Not a Hero live bind.
 * Webhook stays inactive on the App form until a real HTTPS URL exists.
 */

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function readEnv(primary: string, aliases: string[] = []): string | null {
  for (const name of [primary, ...aliases]) {
    const value = Deno.env.get(name);
    if (value?.trim()) return value.trim();
  }
  return null;
}

function stringField(fields: Record<string, unknown>, key: string): string | null {
  const value = fields[key];
  if (!value || typeof value !== "object") return null;
  const s = (value as { stringValue?: unknown }).stringValue;
  return typeof s === "string" && s.trim() ? s.trim() : null;
}

function extractInstallationId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const obj = payload as Record<string, unknown>;
  const installation = obj.installation;
  if (installation && typeof installation === "object") {
    const id = (installation as Record<string, unknown>).id;
    if (typeof id === "number" && Number.isFinite(id)) return String(Math.trunc(id));
    if (typeof id === "string" && id.trim()) return id.trim();
  }
  const top = obj.installation_id;
  if (typeof top === "number" && Number.isFinite(top)) return String(Math.trunc(top));
  if (typeof top === "string" && top.trim()) return top.trim();
  return null;
}

async function hmacSha256Hex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const secret = readEnv("GITHUB_WEBHOOK_SECRET", ["TEAMAI_GITHUB_WEBHOOK_SECRET"]);
  if (!secret) return json({ error: "webhook_secret_not_configured" }, 503);

  const bodyText = await req.text();
  const signatureHeader = req.headers.get("x-hub-signature-256");
  if (!signatureHeader?.startsWith("sha256=")) return json({ error: "missing_github_signature" }, 401);

  const expected = await hmacSha256Hex(secret, bodyText);
  const actual = signatureHeader.slice("sha256=".length);
  if (!timingSafeEqualHex(actual, expected)) return json({ error: "github_signature_mismatch" }, 401);

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const installationId = extractInstallationId(payload);
  const deliveryId = req.headers.get("x-github-delivery")?.trim() || null;
  const eventName = req.headers.get("x-github-event")?.trim() || "unknown";

  if (!installationId) {
    return json({ accepted: true, mapping: "unbound", installationId: null, reason: "missing_installation_id" }, 200);
  }

  let firestoreToken: string;
  try {
    firestoreToken = await getFirestoreAccessToken();
  } catch {
    return json({ error: "firestore_not_configured" }, 503);
  }

  const indexPath = `githubInstallationIndex/${installationId}`;
  const index = await firestoreGet(indexPath, firestoreToken);
  if (!index.exists) {
    return json({ accepted: true, mapping: "unbound", installationId, reason: "unknown_installation" }, 200);
  }

  const firebaseUid = stringField(index.fields, "firebaseUid");
  if (!firebaseUid) return json({ error: "github_installation_index_invalid" }, 500);

  const installationPath = `accounts/${firebaseUid}/githubInstallations/${installationId}`;
  const record = await firestoreGet(installationPath, firestoreToken);
  if (record.exists) {
    const lastDelivery = stringField(record.fields, "lastDeliveryId");
    if (deliveryId && lastDelivery === deliveryId) {
      return json({ accepted: true, mapping: "bound", installationId, firebaseUid, duplicate: true }, 200);
    }
  }

  const receivedAt = new Date().toISOString();
  const fields = firestoreStringFields({
    firebaseUid,
    installationId,
    lastEvent: eventName,
    lastDeliveryId: deliveryId ?? "",
    lastReceivedAt: receivedAt,
  });
  await firestorePatch(installationPath, fields, firestoreToken);
  await firestorePatch(
    indexPath,
    firestoreStringFields({
      firebaseUid,
      installationId,
      lastDeliveryId: deliveryId ?? "",
      lastReceivedAt: receivedAt,
    }),
    firestoreToken,
  );

  return json({ accepted: true, mapping: "bound", installationId, firebaseUid }, 200);
});
