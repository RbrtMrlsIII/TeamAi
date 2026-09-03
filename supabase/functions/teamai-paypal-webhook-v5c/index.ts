import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { firestoreCreate, firestoreGet, firestorePatch, firestoreStringFields, getFirestoreAccessToken } from "../_shared/firestore.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function readEnv(primary: string, aliases: string[] = []): string | null {
  for (const name of [primary, ...aliases]) {
    const value = Deno.env.get(name);
    if (value?.trim()) return value.trim();
  }
  return null;
}

function readPayPalConfig(): { clientId: string | null; clientSecret: string | null; webhookId: string | null; environment: "sandbox" | "live" } {
  const clientId = readEnv("PAYPAL_CLIENT_ID", ["TeamAi_PayPayl_Client_ID"]);
  const clientSecret = readEnv("PAYPAL_CLIENT_SECRET", ["TeamAi_PayPal_Secret_ID"]);
  const webhookId = readEnv("PAYPAL_WEBHOOK_ID", ["TeamAi_PayPal_WebHook_ID"]);
  const explicitEnvironment = readEnv("PAYPAL_ENVIRONMENT");
  const environment = explicitEnvironment === "live"
    ? "live"
    : explicitEnvironment === "sandbox"
      ? "sandbox"
      : Deno.env.get("TeamAi_Environment_Live")?.trim() && !Deno.env.get("TeamAi_Environment_Sandbox")?.trim()
        ? "live"
        : "sandbox";
  return { clientId, clientSecret, webhookId, environment };
}

async function getPayPalAccessToken(baseUrl: string, clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: { authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) throw new Error(`paypal_token_request_failed:${response.status}`);
  const data = await response.json();
  if (typeof data.access_token !== "string") throw new Error("paypal_access_token_missing");
  return data.access_token;
}

function extractString(resource: unknown, key: string): string | null {
  if (!resource || typeof resource !== "object") return null;
  const value = (resource as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function extractOrderId(resource: unknown): string | null {
  if (!resource || typeof resource !== "object") return null;
  const supplementaryData = (resource as Record<string, unknown>).supplementary_data;
  if (!supplementaryData || typeof supplementaryData !== "object") return null;
  const relatedIds = (supplementaryData as Record<string, unknown>).related_ids;
  if (!relatedIds || typeof relatedIds !== "object") return null;
  const orderId = (relatedIds as Record<string, unknown>).order_id;
  return typeof orderId === "string" && orderId.trim() ? orderId.trim() : null;
}

function extractSubscriptionId(resource: unknown): string | null {
  if (!resource || typeof resource !== "object") return null;
  const object = resource as Record<string, unknown>;
  for (const candidate of [object.billing_agreement_id, object.subscription_id]) {
    if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
  }
  return null;
}

type EventMapping = { type: string; entitlementStatus: string | null; warning: string | null };
function mapCommerceEvent(eventType: string): EventMapping | null {
  switch (eventType) {
    case "PAYMENT.CAPTURE.COMPLETED": return { type: "payment_completed", entitlementStatus: "active", warning: null };
    case "PAYMENT.CAPTURE.DENIED": return { type: "payment_denied", entitlementStatus: null, warning: "Payment was denied. Toolkit access was not granted." };
    case "PAYMENT.CAPTURE.PENDING": return { type: "payment_pending", entitlementStatus: null, warning: "Payment is pending. Toolkit access remains unavailable until payment completes." };
    case "PAYMENT.REFUND.COMPLETED": return { type: "refund_warning", entitlementStatus: "revoked", warning: "A PayPal refund was completed. This entitlement has been revoked." };
    case "PAYMENT.REFUND.PENDING": return { type: "refund_warning", entitlementStatus: null, warning: "A PayPal refund is pending. Access may be affected if the refund completes." };
    case "PAYMENT.SALE.COMPLETED": return { type: "payment_completed", entitlementStatus: "active", warning: null };
    case "PAYMENT.SALE.DENIED": return { type: "payment_denied", entitlementStatus: null, warning: "Subscription payment was denied. No new entitlement was granted." };
    case "PAYMENT.SALE.REFUNDED":
    case "PAYMENT.SALE.REVERSED": return { type: "refund_warning", entitlementStatus: "revoked", warning: "A PayPal subscription payment was refunded or reversed. This entitlement has been revoked." };
    case "BILLING.SUBSCRIPTION.CREATED": return { type: "subscription_created", entitlementStatus: null, warning: null };
    case "BILLING.SUBSCRIPTION.ACTIVATED": return { type: "subscription_activated", entitlementStatus: "active", warning: null };
    case "BILLING.SUBSCRIPTION.UPDATED": return { type: "subscription_updated", entitlementStatus: null, warning: null };
    case "BILLING.SUBSCRIPTION.SUSPENDED": return { type: "subscription_suspended", entitlementStatus: "suspended", warning: "Subscription is suspended. Access is temporarily unavailable." };
    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED": return { type: "subscription_cancelled", entitlementStatus: "cancelled", warning: "Subscription is no longer active." };
    case "BILLING.SUBSCRIPTION.PAYMENT.FAILED": return { type: "subscription_payment_failed", entitlementStatus: null, warning: "A subscription payment failed. Please review your PayPal payment method." };
    default: return null;
  }
}

async function resolveCorrelationId(baseUrl: string, accessToken: string, eventType: string, resource: unknown): Promise<string | null> {
  const direct = extractString(resource, "custom_id");
  if (direct) return direct;

  if (eventType.startsWith("PAYMENT.CAPTURE.")) {
    const orderId = extractOrderId(resource);
    if (!orderId) return null;
    const response = await fetch(`${baseUrl}/v2/checkout/orders/${encodeURIComponent(orderId)}`, { headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } });
    if (!response.ok) throw new Error(`paypal_order_lookup_failed:${response.status}`);
    const order = await response.json();
    const units = Array.isArray(order?.purchase_units) ? order.purchase_units : [];
    for (const unit of units) {
      const customId = extractString(unit, "custom_id");
      if (customId) return customId;
    }
    return null;
  }

  if (eventType === "PAYMENT.SALE.COMPLETED" || eventType === "PAYMENT.SALE.DENIED") {
    const subscriptionId = extractSubscriptionId(resource);
    if (!subscriptionId) return null;
    const response = await fetch(`${baseUrl}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, { headers: { authorization: `Bearer ${accessToken}`, accept: "application/json" } });
    if (!response.ok) throw new Error(`paypal_subscription_lookup_failed:${response.status}`);
    const subscription = await response.json();
    return extractString(subscription, "custom_id");
  }

  return null;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  const { clientId, clientSecret, webhookId, environment } = readPayPalConfig();
  if (!clientId || !clientSecret || !webhookId) return json({ error: "paypal_webhook_not_configured" }, 503);

  const bodyText = await req.text();
  let webhookEvent: any;
  try { webhookEvent = JSON.parse(bodyText); } catch { return json({ error: "invalid_json" }, 400); }

  const transmissionId = req.headers.get("paypal-transmission-id");
  const transmissionTime = req.headers.get("paypal-transmission-time");
  const transmissionSig = req.headers.get("paypal-transmission-sig");
  const certUrl = req.headers.get("paypal-cert-url");
  const authAlgo = req.headers.get("paypal-auth-algo") ?? "SHA256withRSA";
  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl) return json({ error: "missing_paypal_signature_headers" }, 400);

  const baseUrl = environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

  try {
    const paypalAccessToken = await getPayPalAccessToken(baseUrl, clientId, clientSecret);
    const verificationResponse = await fetch(`${baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: "POST",
      headers: { authorization: `Bearer ${paypalAccessToken}`, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ auth_algo: authAlgo, cert_url: certUrl, transmission_id: transmissionId, transmission_sig: transmissionSig, transmission_time: transmissionTime, webhook_id: webhookId, webhook_event: webhookEvent }),
    });
    if (!verificationResponse.ok) return json({ error: "paypal_verification_request_failed" }, 502);
    const verification = await verificationResponse.json();
    if (verification.verification_status !== "SUCCESS") return json({ error: "paypal_signature_verification_failed" }, 400);

    const providerEventId = extractString(webhookEvent, "id");
    const eventType = extractString(webhookEvent, "event_type");
    if (!providerEventId || !eventType) return json({ error: "paypal_event_identity_missing" }, 400);

    const mapped = mapCommerceEvent(eventType);
    if (!mapped) return json({ ok: true, verified: true, processed: false, reason: "unsupported_event_type" }, 200);

    const correlationId = await resolveCorrelationId(baseUrl, paypalAccessToken, eventType, webhookEvent.resource);
    if (!correlationId) return json({ ok: true, verified: true, processed: false, reason: "missing_commerce_correlation", event_type: eventType }, 200);

    const firestoreToken = await getFirestoreAccessToken();
    const index = await firestoreGet(`commerceCorrelationIndex/${correlationId}`, firestoreToken);
    if (!index.exists) return json({ ok: true, verified: true, processed: false, reason: "unknown_commerce_correlation" }, 200);

    const indexedUid = (index.fields.firebaseUid as { stringValue?: unknown } | undefined)?.stringValue;
    if (typeof indexedUid !== "string" || !indexedUid) return json({ error: "commerce_correlation_index_invalid" }, 500);

    const intentPath = `accounts/${indexedUid}/commerce/intents/${correlationId}`;
    const intent = await firestoreGet(intentPath, firestoreToken);
    if (!intent.exists) return json({ ok: true, verified: true, processed: false, reason: "commerce_intent_missing" }, 200);

    const intentUid = (intent.fields.firebaseUid as { stringValue?: unknown } | undefined)?.stringValue;
    const intentCorrelation = (intent.fields.correlationId as { stringValue?: unknown } | undefined)?.stringValue;
    if (intentUid !== indexedUid || intentCorrelation !== correlationId) return json({ error: "commerce_correlation_mismatch" }, 500);

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
      warning: mapped.warning ?? "",
    }), firestoreToken);

    if (eventResult === "exists") return json({ ok: true, verified: true, processed: true, duplicate: true }, 200);

    if (mapped.entitlementStatus) {
      await firestorePatch(`accounts/${indexedUid}/commerce/entitlements/${correlationId}`, firestoreStringFields({
        firebaseUid: indexedUid,
        entitlementId: correlationId,
        sourceCommerceEventId: providerEventId,
        status: mapped.entitlementStatus,
        effectiveAt: extractString(webhookEvent, "create_time") ?? new Date().toISOString(),
        warning: mapped.warning ?? "",
      }), firestoreToken);
    } else if (mapped.warning) {
      const entitlementPath = `accounts/${indexedUid}/commerce/entitlements/${correlationId}`;
      const existing = await firestoreGet(entitlementPath, firestoreToken);
      if (existing.exists) await firestorePatch(entitlementPath, firestoreStringFields({
        firebaseUid: indexedUid,
        entitlementId: correlationId,
        sourceCommerceEventId: providerEventId,
        warning: mapped.warning,
      }), firestoreToken);
    }

    return json({ ok: true, verified: true, processed: true, event_id: providerEventId, event_type: eventType }, 200);
  } catch (error) {
    console.error("paypal_webhook_error", error instanceof Error ? error.message : "unknown_error");
    return json({ error: "paypal_webhook_processing_failed" }, 500);
  }
});
