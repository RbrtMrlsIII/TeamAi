import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { firestoreCreate, firestoreGet, firestorePatch, firestoreStringFields, getFirestoreAccessToken } from "../_shared/firestore.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" },
});

async function getPayPalAccessToken(baseUrl: string, clientId: string, clientSecret: string) {
  const credentials = btoa(`${clientId}:${clientSecret}`);
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: `Basic ${credentials}`,
      "content-type": "application/x-www-form-urlencoded",
      accept: "application/json",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`paypal_token_request_failed:${response.status}`);
  const data = await response.json();
  if (typeof data.access_token !== "string") throw new Error("paypal_access_token_missing");
  return data.access_token as string;
}

function extractString(resource: unknown, key: string): string | null {
  if (!resource || typeof resource !== "object") return null;
  const value = (resource as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function mapCommerceEvent(eventType: string): { type: string; entitlementStatus: string } | null {
  switch (eventType) {
    case "PAYMENT.SALE.COMPLETED":
      return { type: "payment_completed", entitlementStatus: "active" };
    case "PAYMENT.SALE.REFUNDED":
      return { type: "refund_issued", entitlementStatus: "revoked" };
    case "PAYMENT.SALE.REVERSED":
      return { type: "refund_issued", entitlementStatus: "revoked" };
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      return { type: "subscription_activated", entitlementStatus: "active" };
    case "BILLING.SUBSCRIPTION.SUSPENDED":
      return { type: "subscription_suspended", entitlementStatus: "suspended" };
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
      return { type: "subscription_cancelled", entitlementStatus: "cancelled" };
    default:
      return null;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const clientId = Deno.env.get("PAYPAL_CLIENT_ID");
  const clientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  const webhookId = Deno.env.get("PAYPAL_WEBHOOK_ID");
  const environment = Deno.env.get("PAYPAL_ENVIRONMENT") ?? "sandbox";

  if (!clientId || !clientSecret || !webhookId) {
    return json({ error: "paypal_webhook_not_configured" }, 503);
  }

  const bodyText = await req.text();
  let webhookEvent: any;
  try {
    webhookEvent = JSON.parse(bodyText);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const transmissionId = req.headers.get("paypal-transmission-id");
  const transmissionTime = req.headers.get("paypal-transmission-time");
  const transmissionSig = req.headers.get("paypal-transmission-sig");
  const certUrl = req.headers.get("paypal-cert-url");
  const authAlgo = req.headers.get("paypal-auth-algo") ?? "SHA256withRSA";

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl) {
    return json({ error: "missing_paypal_signature_headers" }, 400);
  }

  const baseUrl = environment === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  try {
    const accessToken = await getPayPalAccessToken(baseUrl, clientId, clientSecret);
    const verificationResponse = await fetch(
      `${baseUrl}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: webhookEvent,
        }),
      },
    );

    if (!verificationResponse.ok) {
      return json({ error: "paypal_verification_request_failed" }, 502);
    }

    const verification = await verificationResponse.json();
    if (verification.verification_status !== "SUCCESS") {
      return json({ error: "paypal_signature_verification_failed" }, 400);
    }

    const providerEventId = extractString(webhookEvent, "id");
    const eventType = extractString(webhookEvent, "event_type");
    if (!providerEventId || !eventType) return json({ error: "paypal_event_identity_missing" }, 400);

    const mapped = mapCommerceEvent(eventType);
    if (!mapped) {
      // The message is authenticated, but this event is outside the current
      // TeamAi entitlement projection contract. Acknowledge it to avoid
      // pointless PayPal retries while preserving the authority boundary.
      return json({ ok: true, verified: true, processed: false, reason: "unsupported_event_type" }, 200);
    }

    const correlationId = extractString(webhookEvent.resource, "custom_id");
    if (!correlationId) {
      return json({ ok: true, verified: true, processed: false, reason: "missing_commerce_correlation" }, 200);
    }

    const accessToken = await getFirestoreAccessToken();
    const index = await firestoreGet(`commerceCorrelationIndex/${correlationId}`, accessToken);
    if (!index.exists) {
      return json({ ok: true, verified: true, processed: false, reason: "unknown_commerce_correlation" }, 200);
    }

    const indexedUid = (index.fields.firebaseUid as { stringValue?: unknown } | undefined)?.stringValue;
    if (typeof indexedUid !== "string" || !indexedUid) {
      console.error("paypal_webhook_invalid_correlation_index", correlationId);
      return json({ error: "commerce_correlation_index_invalid" }, 500);
    }

    const intentPath = `accounts/${indexedUid}/commerce/intents/${correlationId}`;
    const intent = await firestoreGet(intentPath, accessToken);
    if (!intent.exists) {
      console.error("paypal_webhook_missing_commerce_intent", correlationId);
      return json({ ok: true, verified: true, processed: false, reason: "commerce_intent_missing" }, 200);
    }

    const intentUid = (intent.fields.firebaseUid as { stringValue?: unknown } | undefined)?.stringValue;
    const intentCorrelation = (intent.fields.correlationId as { stringValue?: unknown } | undefined)?.stringValue;
    if (intentUid !== indexedUid || intentCorrelation !== correlationId) {
      console.error("paypal_webhook_correlation_mismatch", correlationId);
      return json({ error: "commerce_correlation_mismatch" }, 500);
    }

    const eventPath = `accounts/${indexedUid}/commerce/events/${providerEventId}`;
    const eventResult = await firestoreCreate(eventPath, firestoreStringFields({
      firebaseUid: indexedUid,
      provider: "paypal",
      providerEventId,
      idempotencyKey: `paypal:event:${providerEventId}`,
      correlationId,
      commerceEventId: providerEventId,
      type: mapped.type,
      occurredAt: extractString(webhookEvent, "create_time") ?? new Date().toISOString(),
      receivedAt: new Date().toISOString(),
    }), accessToken);

    if (eventResult === "exists") {
      return json({ ok: true, verified: true, processed: true, duplicate: true }, 200);
    }

    const entitlementPath = `accounts/${indexedUid}/commerce/entitlements/${correlationId}`;
    await firestorePatch(entitlementPath, firestoreStringFields({
      firebaseUid: indexedUid,
      entitlementId: correlationId,
      sourceCommerceEventId: providerEventId,
      status: mapped.entitlementStatus,
      effectiveAt: extractString(webhookEvent, "create_time") ?? new Date().toISOString(),
    }), accessToken);

    return json({ ok: true, verified: true, processed: true, event_id: providerEventId }, 200);
  } catch (error) {
    console.error("paypal_webhook_error", error instanceof Error ? error.message : "unknown_error");
    return json({ error: "paypal_webhook_processing_failed" }, 500);
  }
});
