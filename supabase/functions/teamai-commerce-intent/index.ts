import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { firestoreCreate, getFirestoreAccessToken, firestoreStringFields } from "../_shared/firestore.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" },
});

function getBearerToken(req: Request): string | null {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

async function establishFirebaseUid(req: Request): Promise<string> {
  const token = getBearerToken(req);
  if (!token) throw new Error("missing_firebase_id_token");

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) throw new Error("supabase_url_not_configured");

  const response = await fetch(`${supabaseUrl}/functions/v1/teamai-domain-bootstrap`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      workplaceId: "commerce-intent",
      projectId: "commerce-intent",
      teamId: "commerce-intent",
      seatId: "commerce-intent",
      teamMode: "solo",
      seatRole: "owner",
    }),
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("invalid_firebase_id_token");
    throw new Error(`firebase_identity_boundary_failed:${response.status}`);
  }
  const data = await response.json();
  if (typeof data?.uid !== "string" || !data.uid) throw new Error("firebase_uid_missing");
  return data.uid;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const uid = await establishFirebaseUid(req);
    const body = await req.json().catch(() => ({}));
    const provider = body?.provider ?? "paypal";
    if (provider !== "paypal") return json({ error: "unsupported_commerce_provider" }, 400);

    const correlationId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const intentPath = `accounts/${uid}/commerce/intents/${correlationId}`;
    const indexPath = `commerceCorrelationIndex/${correlationId}`;
    const accessToken = await getFirestoreAccessToken();

    const intentResult = await firestoreCreate(intentPath, firestoreStringFields({
      firebaseUid: uid,
      correlationId,
      provider: "paypal",
      createdAt,
      status: "pending",
    }), accessToken);

    if (intentResult === "exists") return json({ error: "commerce_intent_collision" }, 409);

    await firestoreCreate(indexPath, firestoreStringFields({
      correlationId,
      firebaseUid: uid,
      intentPath,
      createdAt,
      status: "pending",
    }), accessToken);

    return json({
      ok: true,
      provider: "paypal",
      correlationId,
      custom_id: correlationId,
      firebaseUid: uid,
      status: "pending",
    }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "commerce_intent_failed";
    const status = message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" ? 401 :
      message.startsWith("unsupported_") ? 400 : 500;
    console.error("commerce_intent_error", message);
    return json({ error: message }, status);
  }
});
