# TeamAi PayPal Webhook Guide

## Canonical role
PayPal is an external payment rail and event source. It is not a TeamAi database or application runtime.

## Canonical flow
PayPal event → public HTTPS webhook endpoint → Supabase Edge Function → authenticity and idempotency checks → TeamAi commerce event/state in Firestore.

GitHub is never the webhook receiver and never the payment authority.

## Setup sequence
1. Create/configure a PayPal Developer application in Sandbox first.
2. Create a webhook for the application and record its Webhook ID.
3. Configure the public HTTPS webhook URL to the TeamAi Supabase Edge Function endpoint.
4. Store PayPal Client Secret and related credentials only in Supabase Edge Function secrets.
5. Keep Sandbox and Live credentials/configuration separate.
6. Test signature verification and duplicate-event behavior before enabling business mutations.

## Security requirements
The receiver must accept POST only, validate PayPal's webhook signature, require the expected webhook identity, enforce idempotent event handling, acknowledge already-seen valid events safely, and avoid leaking credentials in logs or responses.

## Current implementation status
The TeamAi Supabase `paypal-webhook` function is deployed as a bootstrap verification boundary. Commerce mutation is intentionally deferred until the Firestore transaction/event model is canonical.

## Operational rule
A successful webhook HTTP response is not proof that subscription, payment, refund, credit, or entitlement state is complete. Durable business-state confirmation comes from Firestore-backed reconciliation.
