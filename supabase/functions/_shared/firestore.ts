import { SignJWT, importPKCS8 } from "npm:jose@6.0.10";

type FirebaseServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

const FIREBASE_PROJECT_ID = "team-ai-official";
const DATASTORE_SCOPE = "https://www.googleapis.com/auth/datastore";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function jsonError(message: string): Error {
  return new Error(message);
}

export function readFirebaseServiceAccount(): FirebaseServiceAccount {
  const raw = Deno.env.get("FIREBASE_SERVICE_ACCOUNT_JSON");
  if (!raw) throw jsonError("firebase_service_account_not_configured");
  let parsed: Partial<FirebaseServiceAccount>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw jsonError("firebase_service_account_invalid_json");
  }
  if (parsed.project_id !== FIREBASE_PROJECT_ID) throw jsonError("firebase_project_id_mismatch");
  if (!parsed.client_email || !parsed.private_key) throw jsonError("firebase_service_account_incomplete");
  return {
    project_id: parsed.project_id,
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

export async function getFirestoreAccessToken(serviceAccount = readFirebaseServiceAccount()): Promise<string> {
  const key = await importPKCS8(serviceAccount.private_key, "RS256");
  const assertion = await new SignJWT({ scope: DATASTORE_SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(serviceAccount.client_email)
    .setAudience(TOKEN_URL)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) throw jsonError(`google_oauth_failed:${response.status}`);
  const data = await response.json();
  if (typeof data.access_token !== "string") throw jsonError("google_oauth_missing_access_token");
  return data.access_token;
}

function encodeSegment(value: string): string {
  return value.split("/").map(encodeURIComponent).join("/");
}

export function firestoreDocumentUrl(documentPath: string): string {
  return `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${encodeSegment(documentPath)}`;
}

export function firestoreStringFields(values: Record<string, string>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [key, { stringValue: value }]));
}

export async function firestoreGet(documentPath: string, accessToken: string): Promise<{ exists: boolean; fields: Record<string, unknown> }> {
  const response = await fetch(firestoreDocumentUrl(documentPath), {
    headers: { authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 404) return { exists: false, fields: {} };
  if (!response.ok) throw jsonError(`firestore_get_failed:${response.status}`);
  const data = await response.json();
  return { exists: true, fields: (data.fields ?? {}) as Record<string, unknown> };
}

export async function firestoreCreate(documentPath: string, fields: Record<string, unknown>, accessToken: string): Promise<"created" | "exists"> {
  const slash = documentPath.lastIndexOf("/");
  const parent = slash >= 0 ? documentPath.slice(0, slash) : "";
  const documentId = slash >= 0 ? documentPath.slice(slash + 1) : documentPath;
  const baseUrl = parent
    ? `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/${encodeSegment(parent)}`
    : `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
  const response = await fetch(`${baseUrl}?documentId=${encodeURIComponent(documentId)}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (response.status === 409) return "exists";
  if (!response.ok) throw jsonError(`firestore_create_failed:${response.status}`);
  return "created";
}

export async function firestorePatch(documentPath: string, fields: Record<string, unknown>, accessToken: string): Promise<void> {
  const response = await fetch(`${firestoreDocumentUrl(documentPath)}?updateMask.fieldPaths=${Object.keys(fields).map(encodeURIComponent).join("&updateMask.fieldPaths=")}`, {
    method: "PATCH",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (!response.ok) throw jsonError(`firestore_patch_failed:${response.status}`);
}

type FirestoreDecodedValue =
  | string
  | boolean
  | number
  | null
  | FirestoreDecodedValue[]
  | { [key: string]: FirestoreDecodedValue };

export function decodeFirestoreValue(value: Record<string, unknown> | undefined): FirestoreDecodedValue | undefined {
  if (!value) return undefined;
  if (typeof value.stringValue === "string") return value.stringValue;
  if (typeof value.booleanValue === "boolean") return value.booleanValue;
  if (typeof value.integerValue === "string") return Number(value.integerValue);
  if (typeof value.doubleValue === "number") return value.doubleValue;
  if (typeof value.timestampValue === "string") return value.timestampValue;
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue && typeof value.arrayValue === "object") {
    const values = (value.arrayValue as { values?: Record<string, unknown>[] }).values ?? [];
    return values.map(decodeFirestoreValue).filter((item): item is FirestoreDecodedValue => item !== undefined);
  }
  if (value.mapValue && typeof value.mapValue === "object") {
    const fields = (value.mapValue as { fields?: Record<string, Record<string, unknown>> }).fields ?? {};
    return Object.fromEntries(Object.entries(fields)
      .map(([key, child]) => [key, decodeFirestoreValue(child)])
      .filter(([, child]) => child !== undefined));
  }
  return undefined;
}

export function decodeFirestoreFields(fields: Record<string, unknown> | undefined): Record<string, FirestoreDecodedValue> {
  return Object.fromEntries(Object.entries(fields ?? {})
    .map(([key, value]) => [key, decodeFirestoreValue(value as Record<string, unknown>)])
    .filter(([, value]) => value !== undefined)) as Record<string, FirestoreDecodedValue>;
}

export async function firestoreBeginTransaction(accessToken: string): Promise<string> {
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:beginTransaction`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ options: { readWrite: {} } }),
  });
  if (!response.ok) throw jsonError(`firestore_begin_transaction_failed:${response.status}`);
  const data = await response.json() as { transaction?: string };
  if (typeof data.transaction !== "string" || !data.transaction) {
    throw jsonError("firestore_begin_transaction_missing_id");
  }
  return data.transaction;
}

export async function firestoreGetInTransaction(
  documentPath: string,
  transaction: string,
  accessToken: string,
): Promise<{ exists: boolean; updateTime?: string; fields: Record<string, unknown> }> {
  const url = new URL(firestoreDocumentUrl(documentPath));
  url.searchParams.set("transaction", transaction);
  const response = await fetch(url, { headers: { authorization: `Bearer ${accessToken}` } });
  if (response.status === 404) return { exists: false, fields: {} };
  if (!response.ok) throw jsonError(`firestore_transactional_get_failed:${response.status}`);
  const data = await response.json() as { updateTime?: string; fields?: Record<string, unknown> };
  return { exists: true, updateTime: data.updateTime, fields: data.fields ?? {} };
}

export async function firestoreCommitTransaction(
  transaction: string,
  writes: Array<Record<string, unknown>>,
  accessToken: string,
): Promise<void> {
  const response = await fetch(`https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:commit`, {
    method: "POST",
    headers: { authorization: `Bearer ${accessToken}`, "content-type": "application/json" },
    body: JSON.stringify({ transaction, writes }),
  });
  if (!response.ok) throw jsonError(`firestore_commit_transaction_failed:${response.status}`);
}
