import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type DomainInput = {
  workplaceId: string;
  projectId: string;
  teamId: string;
  seatId: string;
  teamMode: "team" | "solo";
  seatRole: string;
};

const TEAMAI_FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function requireId(value: unknown, name: string): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function parseServiceAccount(): ServiceAccount {
  const raw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw new Error("firebase_service_account_missing");
  let parsed: Partial<ServiceAccount>;
  try {
    parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  } catch {
    throw new Error("firebase_service_account_invalid_json");
  }
  if (!parsed.project_id || !parsed.client_email || !parsed.private_key) {
    throw new Error("firebase_service_account_incomplete");
  }
  if (parsed.project_id !== TEAMAI_FIREBASE_PROJECT_ID) {
    throw new Error("firebase_project_identity_mismatch");
  }
  return parsed as ServiceAccount;
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlText(text: string): string {
  return base64Url(new TextEncoder().encode(text));
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const normalized = pem
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  try {
    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
    return bytes.buffer;
  } catch {
    throw new Error("firebase_service_account_private_key_invalid");
  }
}

async function googleAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const tokenUrl = "https://oauth2.googleapis.com/token";
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlText(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64UrlText(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: tokenUrl,
    iat: now,
    exp: now + 3600,
  }));
  const signingInput = `${header}.${payload}`;

  let signature: ArrayBuffer;
  try {
    const key = await crypto.subtle.importKey(
      "pkcs8",
      pemToArrayBuffer(serviceAccount.private_key),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      key,
      new TextEncoder().encode(signingInput),
    );
  } catch {
    throw new Error("firebase_service_account_signing_failed");
  }

  const assertion = `${signingInput}.${base64Url(new Uint8Array(signature))}`;
  let response: Response;
  try {
    response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${encodeURIComponent(assertion)}`,
    });
  } catch {
    throw new Error("firebase_google_token_exchange_network_failed");
  }

  if (!response.ok) throw new Error(`firebase_google_token_exchange_failed:${response.status}`);

  let body: { access_token?: unknown };
  try {
    body = await response.json() as { access_token?: unknown };
  } catch {
    throw new Error("firebase_google_token_exchange_invalid_response");
  }
  if (typeof body.access_token !== "string") {
    throw new Error("firebase_google_token_exchange_missing_access_token");
  }
  return body.access_token;
}

function firestoreValue(value: unknown): unknown {
  if (value === null) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Firestore does not accept non-finite numbers");
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(firestoreValue) } };
  if (typeof value === "object") {
    const fields: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      fields[key] = firestoreValue(child);
    }
    return { mapValue: { fields } };
  }
  throw new Error(`Unsupported Firestore value: ${typeof value}`);
}

function firestoreUrl(projectId: string, path: string): string {
  const encodedPath = path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents/${encodedPath}`;
}

function safeFirestoreDiagnostic(status: number, bodyText: string): string {
  try {
    const parsed = JSON.parse(bodyText) as { error?: { status?: unknown; message?: unknown } };
    const errorStatus = typeof parsed.error?.status === "string" ? parsed.error.status : "UNKNOWN";
    const rawMessage = typeof parsed.error?.message === "string" ? parsed.error.message : "unknown firestore error";
    const message = rawMessage.replace(/\s+/g, " ").slice(0, 240);
    return `firestore_write_failed:${status}:${errorStatus}:${message}`;
  } catch {
    return `firestore_write_failed:${status}:UNPARSEABLE_RESPONSE`;
  }
}

async function createIfAbsent(
  serviceAccount: ServiceAccount,
  path: string,
  data: Record<string, unknown>,
): Promise<"created" | "exists"> {
  const token = await googleAccessToken(serviceAccount);
  const fields: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) fields[key] = firestoreValue(value);

  const url = new URL(firestoreUrl(TEAMAI_FIREBASE_PROJECT_ID, path));
  url.searchParams.set("currentDocument.exists", "false");

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ fields }),
    });
  } catch {
    throw new Error("firestore_write_network_failed");
  }

  if (response.ok) return "created";

  const bodyText = await response.text();
  if (response.status === 400) {
    try {
      const parsed = JSON.parse(bodyText) as { error?: { status?: unknown; message?: unknown } };
      const errorStatus = typeof parsed.error?.status === "string" ? parsed.error.status : "";
      const errorMessage = typeof parsed.error?.message === "string" ? parsed.error.message : "";
      if (errorStatus === "FAILED_PRECONDITION" || /already exists|must not exist/i.test(errorMessage)) {
        return "exists";
      }
    } catch {
      // Fall through to the safe diagnostic.
    }
  }

  throw new Error(safeFirestoreDiagnostic(response.status, bodyText));
}

async function verifyFirebaseUser(req: Request): Promise<string> {
  const authorization = req.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) throw new Error("missing_firebase_id_token");
  const idToken = authorization.slice("Bearer ".length).trim();
  if (!idToken) throw new Error("missing_firebase_id_token");

  const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${TEAMAI_FIREBASE_PROJECT_ID}`,
    audience: TEAMAI_FIREBASE_PROJECT_ID,
  });

  if (typeof payload.sub !== "string" || !payload.sub) throw new Error("firebase_token_missing_uid");
  return payload.sub;
}

function parseInput(value: unknown): DomainInput {
  if (!value || typeof value !== "object") throw new Error("invalid_request");
  const body = value as Record<string, unknown>;
  const teamMode = requireId(body.teamMode, "teamMode");
  if (teamMode !== "team" && teamMode !== "solo") throw new Error("teamMode must be team or solo");
  return {
    workplaceId: requireId(body.workplaceId, "workplaceId"),
    projectId: requireId(body.projectId, "projectId"),
    teamId: requireId(body.teamId, "teamId"),
    seatId: requireId(body.seatId, "seatId"),
    teamMode,
    seatRole: requireId(body.seatRole, "seatRole"),
  };
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const uid = await verifyFirebaseUser(req);
    const serviceAccount = parseServiceAccount();
    const input = parseInput(await req.json());
    const now = new Date().toISOString();

    const root = `accounts/${uid}`;
    const workplace = `${root}/workplaces/${input.workplaceId}`;
    const project = `${workplace}/projects/${input.projectId}`;
    const team = `${project}/teams/${input.teamId}`;
    const seat = `${team}/seats/${input.seatId}`;

    const results = {
      account: await createIfAbsent(serviceAccount, root, { uid, createdAt: now, updatedAt: now }),
      workplace: await createIfAbsent(serviceAccount, workplace, {
        uid, workplaceId: input.workplaceId, createdAt: now, updatedAt: now,
      }),
      project: await createIfAbsent(serviceAccount, project, {
        uid, workplaceId: input.workplaceId, projectId: input.projectId, createdAt: now, updatedAt: now,
      }),
      team: await createIfAbsent(serviceAccount, team, {
        uid, workplaceId: input.workplaceId, projectId: input.projectId, teamId: input.teamId,
        mode: input.teamMode, createdAt: now, updatedAt: now,
      }),
      seat: await createIfAbsent(serviceAccount, seat, {
        uid, workplaceId: input.workplaceId, projectId: input.projectId, teamId: input.teamId,
        seatId: input.seatId, role: input.seatRole, createdAt: now, updatedAt: now,
      }),
    };

    return json({ ok: true, uid, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown_error";
    if (message === "missing_firebase_id_token" || message === "firebase_token_missing_uid") {
      return json({ error: message }, 401);
    }
    if (message === "invalid_request" || message.includes(" is required") || message.startsWith("teamMode must")) {
      return json({ error: message }, 400);
    }

    const safeDiagnosticPatterns = [
      "firebase_project_identity_mismatch",
      "firebase_service_account_missing",
      "firebase_service_account_invalid_json",
      "firebase_service_account_incomplete",
      "firebase_service_account_private_key_invalid",
      "firebase_service_account_signing_failed",
      "firebase_google_token_exchange_network_failed",
      "firebase_google_token_exchange_invalid_response",
      "firebase_google_token_exchange_missing_access_token",
      "firebase_google_token_exchange_failed:",
      "firestore_write_network_failed",
      "firestore_write_failed:",
    ];
    const safeDiagnostic = safeDiagnosticPatterns.find((pattern) => message === pattern || message.startsWith(pattern));
    if (safeDiagnostic) {
      console.error("teamai_domain_bootstrap_diagnostic", message);
      return json({ error: "domain_persistence_failed", diagnostic: message }, 500);
    }

    console.error("teamai_domain_bootstrap_error", message);
    return json({ error: "domain_persistence_failed" }, 500);
  }
});
