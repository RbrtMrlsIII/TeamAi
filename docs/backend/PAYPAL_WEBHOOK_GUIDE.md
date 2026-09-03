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

## Required later configuration
1. Create/configure the PayPal Sandbox application.
2. Create the PayPal Product and Plan after the UI/commercial experience is validated.
3. Register the exact Supabase Edge Function HTTPS webhook URL.
4. Record the PayPal Webhook ID as deployment configuration.
5. Store PayPal Client ID/Secret only in trusted Supabase Edge Function secrets.
6. Keep Sandbox and Live configuration separate.
7. Verify signature authenticity, expected webhook identity, idempotency, replay handling, UID correlation, and Firestore entitlement mutation before enabling commerce activation.

## Firebase credential boundary
No Firebase private credential is required for the current planning/rebaseline checkpoint. Do not place Firebase secrets or service-account material in chat, source, findings, logs, or commits.

## Commercial hypothesis
For the first qualifying subscription: month 1 is paid; months 2–3 are free; the three-month introductory grant is available once per Firebase UID. After the introductory period, succeeding months bill normally under the active plan. Exact Product/Plan/Button construction remains downstream of product UX and commercial validation.

## Current status
The TeamAi Supabase `paypal-webhook` function is a bootstrap verification boundary. A separate `teamai-domain-bootstrap` source slice now prepares the Firebase UID → Firestore domain persistence boundary that must be verified before PayPal UID correlation and durable commerce mutation. No live or sandbox subscription transaction has been exercised, and no Firestore commerce mutation is claimed complete.
