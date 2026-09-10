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
 * GET  — GitHub browser redirect after install/OAuth. Redirects the browser back
 *        to the canonical TeamAi destination. Does NOT mint UID.
 * POST — Firebase Bearer + { installationId } → Firestore bind write.
 *
 * Not a Hero live bind. Keyboard C is normal-UI handoff only.
 */

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const HERO_HOME = "https://rbrtmrlsiii.github.io/TeamAi/hero/";

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
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

function readEnv(primary: string, aliases: string[] = []): string | null {
  for (const name of [primary, ...aliases]) {
    const value = Deno.env.get(name);
    if (value?.trim()) return value.trim();
  }
  return null;
}

/** Browser redirect from GitHub (GET). Never writes Firestore or exposes OAuth code. */
function redirectToTeamAi(input: {
  installationId: string | null;
  setupAction: string | null;
  error: string | null;
}): Response {
  const target = new URL(HERO_HOME);
  target.searchParams.set("github", "installed");
  if (input.installationId) target.searchParams.set("installation_id", input.installationId);
  if (input.setupAction) target.searchParams.set("setup_action", input.setupAction);
  if (input.error) target.searchParams.set("github_error", input.error);

  return new Response(null, {
    status: 303,
    headers: {
      "location": target.toString(),
      "cache-control": "no-store",
    },
  });
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

  // GitHub App redirect URI hits GET with query params — never mint UID here.
  if (req.method === "GET") {
    const url = new URL(req.url);
    const installationId =
      url.searchParams.get("installation_id") || url.searchParams.get("installationId");
    const setupAction = url.searchParams.get("setup_action");
    const error = url.searchParams.get("error") || url.searchParams.get("error_description");
    return redirectToTeamAi({
      installationId: installationId?.trim() || null,
      setupAction: setupAction?.trim() || null,
      error: error?.trim() || null,
    });
  }

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
      // Bind may still proceed from installation_id + Firebase UID.
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
