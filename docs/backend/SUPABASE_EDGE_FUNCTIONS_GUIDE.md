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

## Security baseline
Use publishable keys for browser-facing access and secret keys only inside trusted backend code. Never place secret keys in client code, Git, chat, handoffs, or logs.

Webhook receivers use their own authenticity checks; they do not assume an end-user JWT is the right trust model.

## Current bootstrap
The `paypal-webhook` Edge Function is deployed as a verification boundary only. It intentionally does not finalize TeamAi commerce state until the canonical Firestore commerce/event model is implemented.

## Hard boundary
Do not create TeamAi domain tables in Supabase Postgres. Domain state belongs in Firebase Firestore.
