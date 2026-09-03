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
- Status: `ACTIVE_HEALTHY` (verified 2026-09-03)
- Public schema tables: none; Supabase Postgres remains free of TeamAi domain tables.

## Security baseline
Use publishable keys for browser-facing access and secret keys only inside trusted backend code. Never place secret keys in client code, Git, chat, handoffs, or logs.

Webhook receivers use their own authenticity checks; they do not assume an end-user JWT is the right trust model.

## Current bootstrap
The `paypal-webhook` Edge Function is deployed as a verification boundary only. It intentionally does not finalize TeamAi commerce state until the canonical Firestore commerce/event model is implemented.

A `teamai-domain-bootstrap` source slice has now been added to establish the authenticated Firebase UID → Firestore domain persistence boundary. It is source implementation evidence only until its Firebase service-account secret is configured, deployed, and exercised against the live Firebase project.

## Hard boundary
Do not create TeamAi domain tables in Supabase Postgres. Domain state belongs in Firebase Firestore.
