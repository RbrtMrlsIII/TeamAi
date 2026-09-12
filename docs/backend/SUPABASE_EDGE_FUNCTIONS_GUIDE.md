# TeamAi Supabase Backend Guide

## Canonical role
Supabase provides the trusted server/runtime surface for TeamAi.

- Edge Functions: privileged server execution and webhook receivers.
- Optional Storage: user-content storage only when a product entitlement explicitly includes it.
- Supabase Postgres: platform infrastructure only; not the TeamAi domain system of record.

## TeamAi project
- Project: `TeamAi`
- Ref: `srpgzzretfyqdsfclnuo`
- Region: `ap-southeast-2`
- Status: `ACTIVE_HEALTHY` as last recorded connected inspection
- Public schema tables: none; Supabase Postgres remains free of TeamAi domain tables.

## Current active Edge Function surface
The precise current deployment inventory is `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`.

The current active TeamAi Edge Function set is exactly:

- `teamai-commerce-intent`
- `teamai-domain-bootstrap`
- `teamai-github-oauth-bind`
- `teamai-github-webhook`
- `teamai-paypal-webhook-v5c`
- `teamai-seat-connection-test`
- `teamai-seat-provider-bind`
- `teamai-task-execute`

The obsolete `paypal-webhook` function has been removed from the connected Supabase deployment and must not be reintroduced as a current endpoint.

## Security baseline
Use publishable keys for browser-facing access and secret keys only inside trusted backend code. Never place secret keys in client code, Git, chat, handoffs, or logs.

Webhook receivers use their own authenticity checks; they do not assume an end-user JWT is the right trust model.

The deployed `verify_jwt: false` setting on the TeamAi Edge Function surface is intentional where the function implements its own applicable Firebase ID-token, PayPal signature, or GitHub HMAC verification.

## Current commerce surface
`teamai-paypal-webhook-v5c` is the canonical PayPal webhook. It verifies PayPal webhook authenticity, resolves the server-owned commerce correlation, records mapped provider events in Firestore, and projects mapped aggregate/entitlement state according to the canonical commerce contract.

The live provider configuration may contain event types that are not currently mapped by TeamAi. Provider subscription does not itself establish semantic application support; unsupported verified events must remain distinguishable from processed commerce state.

## Current bootstrap
`teamai-domain-bootstrap` establishes the authenticated Firebase UID → Firestore domain persistence boundary. Its deployment is infrastructure evidence; claim level remains bounded by the corresponding runtime evidence.

## Hard boundary
Do not create TeamAi domain tables in Supabase Postgres. Domain state belongs in Firebase Firestore.
