import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createRemoteJWKSet, jwtVerify } from "npm:jose@6.0.10";
import { firestoreCreate, firestoreStringFields, getFirestoreAccessToken } from "../_shared/firestore.ts";

const FIREBASE_PROJECT_ID = "team-ai-official";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
);

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" },
});

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
    if (error instanceof Error && error.message === "firebase_token_missing_uid") throw error;
    throw new Error("invalid_firebase_id_token");
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  try {
    const uid = await verifyFirebaseUid(req);
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

    const indexResult = await firestoreCreate(indexPath, firestoreStringFields({
      correlationId,
      firebaseUid: uid,
      intentPath,
      createdAt,
      status: "pending",
    }), accessToken);
    if (indexResult === "exists") return json({ error: "commerce_correlation_collision" }, 409);

    return json({
      ok: true,
      provider: "paypal",
      correlationId,
      custom_id: correlationId,
      status: "pending",
    }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "commerce_intent_failed";
    const status = message === "missing_firebase_id_token" || message === "invalid_firebase_id_token" ? 401 :
      message === "unsupported_commerce_provider" ? 400 : 500;
    console.error("commerce_intent_error", message);
    return json({ error: message }, status);
  }
});
