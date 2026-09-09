import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import {
  firestoreCreate,
  firestoreGet,
  firestorePatch,
  firestoreStringFields,
  getFirestoreAccessToken,
} from "../_shared/firestore.ts";

/**
 * Conn-3 — GitHub App OAuth / install bind: mint firebaseUid ↔ installation_id.
 *
 * POST + Firebase Bearer ID token + body { installationId }
 *   → server writes githubInstallationIndex/{installationId}
 *   → and accounts/{uid}/githubInstallations/{installationId}
 *
 * Does not mint UID from webhook payload.
 * Not a Hero live bind. Keyboard C is normal-UI handoff only.
 * Full GitHub user-to-server code exchange is optional when client secrets exist.
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

function readEnv(primary: string, aliases: string[] = []): string | null {
  for (const name of [primary, ...aliases]) {
    const value = Deno.env.get(name);
    if (value?.trim()) return value.trim();
  }
  return null;
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
    if (
      error instanceof Error &&
      (error.message === "firebase_token_missing_uid" || error.message === "missing_firebase_id_token")
    ) {
      throw error;
    }
    throw new Error("invalid_firebase_id_token");
  }
}

function requireInstallationId(raw: unknown): string {
  if (typeof raw === "number" && Number.isFinite(raw)) return String(Math.trunc(raw));
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  throw new Error("installation_id_required");
}

function indexPath(installationId: string): string {
  return `githubInstallationIndex/${installationId}`;
}

function accountPath(uid: string, installationId: string): string {
  return `accounts/${uid}/githubInstallations/${installationId}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let firebaseUid: string;
  try {
    firebaseUid = await verifyFirebaseUid(req);
  } catch (error) {
    const message = error instanceof Error ? error.message : "invalid_firebase_id_token";
    return json({ error: message }, 401);
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  let installationId: string;
  try {
    installationId = requireInstallationId(body.installationId ?? body.installation_id);
  } catch {
    return json({ error: "installation_id_required" }, 400);
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const clientId = readEnv("GITHUB_APP_CLIENT_ID", ["TEAMAI_GITHUB_APP_CLIENT_ID"]);
  const clientSecret = readEnv("GITHUB_APP_CLIENT_SECRET", ["TEAMAI_GITHUB_APP_CLIENT_SECRET"]);
  let oauthExchanged = false;
  if (code && clientId && clientSecret) {
    try {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });
      if (tokenRes.ok) {
        const tokenJson = await tokenRes.json();
        oauthExchanged = typeof tokenJson.access_token === "string";
      }
    } catch {
      // Bind may still proceed from install redirect installation_id + Firebase UID.
    }
  }

  const createdAt = new Date().toISOString();
  const fields = firestoreStringFields({
    installationId,
    firebaseUid,
    status: "bound",
    createdAt,
    source: "conn3_oauth_bind",
    appSlug: "teamai-devtools",
  });

  try {
    const accessToken = await getFirestoreAccessToken();
    const index = indexPath(installationId);
    const account = accountPath(firebaseUid, installationId);

    const existing = await firestoreGet(index, accessToken);
    if (existing.exists) {
      const existingUid = (existing.fields.firebaseUid as { stringValue?: string } | undefined)?.stringValue;
      if (existingUid && existingUid !== firebaseUid) {
        return json({ error: "installation_bound_to_other_uid" }, 409);
      }
      await firestorePatch(index, fields, accessToken);
    } else {
      const created = await firestoreCreate(index, fields, accessToken);
      if (created === "exists") await firestorePatch(index, fields, accessToken);
    }

    const accountExisting = await firestoreGet(account, accessToken);
    if (accountExisting.exists) {
      await firestorePatch(account, fields, accessToken);
    } else {
      const created = await firestoreCreate(account, fields, accessToken);
      if (created === "exists") await firestorePatch(account, fields, accessToken);
    }

    return json({
      ok: true,
      mapping: "bound",
      firebaseUid,
      installationId,
      oauthExchanged,
      paths: { index, account },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "bind_failed";
    return json({ error: message }, 500);
  }
});
