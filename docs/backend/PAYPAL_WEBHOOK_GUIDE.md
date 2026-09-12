# TeamAi PayPal Webhook Guide

## Canonical role
PayPal is the external payment rail and event source. It is not a TeamAi database or application runtime.

## Canonical flow
`PayPal event → public HTTPS webhook endpoint → Supabase Edge Function → authenticity + idempotency/replay checks → server-owned TeamAi-to-Firebase UID correlation → Firestore commerce state/entitlement`

GitHub is never the webhook receiver and never the payment authority.

## Supabase deployment target
- Project: `TeamAi`
- Ref: `srpgzzretfyqdsfclnuo`
- Region: `ap-southeast-2`
- Canonical webhook: `teamai-paypal-webhook-v5c`
- Current live provider target: `https://srpgzzretfyqdsfclnuo.supabase.co/functions/v1/teamai-paypal-webhook-v5c`
- Environment: `live`

## Current active surface
The legacy `paypal-webhook` function has been removed from the connected Supabase deployment. `teamai-paypal-webhook-v5c` is the sole current TeamAi PayPal webhook surface.

The current live deployment inventory is frozen in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`.

## Current event-coverage boundary
The operator-reported PayPal configuration contains 67 subscribed event labels. The current v5c implementation maps 16 event types in source. Verified provider events outside those mappings are acknowledged as unsupported (`processed: false`) rather than silently treated as TeamAi commerce state.

Provider subscription is configuration evidence, not an implementation promise. Future event coverage must be derived from approved TeamAi payment semantics and then implemented, tested, and evidenced explicitly.

## Required configuration
1. Keep the canonical live webhook target registered in the PayPal provider configuration.
2. Record the PayPal Webhook ID as trusted deployment configuration.
3. Store PayPal Client ID/Secret only in trusted Supabase Edge Function secrets.
4. Keep Sandbox and Live configuration separate.
5. Verify signature authenticity, expected webhook identity, idempotency, replay handling, UID correlation, and Firestore entitlement mutation for each supported event class.
6. Preserve the distinction between provider configuration, source implementation, deployment, runtime proof, completion, and endorsement.

## Firebase credential boundary
No Firebase private credential belongs in chat, source, findings, logs, or commits. The trusted Edge runtime may use the configured `FIREBASE_SERVICE_ACCOUNT_JSON` Supabase secret to mint the Google OAuth token required for Firestore REST access.

## Commercial hypothesis
For the first qualifying subscription: month 1 is paid; months 2–3 are free; the three-month introductory grant is available once per Firebase UID. After the introductory period, succeeding months bill normally under the active plan. Exact Product/Plan/Button construction remains downstream of product UX and commercial validation.

## Evidence boundary
The current bounded PayPal evidence chain includes real Sandbox purchase/capture, webhook delivery/redelivery, and Firestore aggregate/event/entitlement verification. This evidence establishes the recorded bounded commerce gate; it does not establish production readiness for every configured event class or the broader 029 release.
