# TeamAi Backend Documentation

This directory is the canonical backend implementation and authority documentation surface.

## Current phase
`TEAM-BACKEND-001 — IN IMPLEMENTATION`

## Read order
1. `BACKEND_SERVICE_BOUNDARY.md`
2. `FIREBASE_BACKEND_GUIDE.md`
3. `FIRESTORE_DOMAIN_MODEL.md`
4. `SUPABASE_EDGE_FUNCTIONS_GUIDE.md`
5. `PAYPAL_WEBHOOK_GUIDE.md`
6. `BACKEND_FOUNDATION_EXECUTION.md`
7. `BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md`
8. `BACKEND_LIVE_SERVICE_STATUS.md`

## Non-negotiable
Firestore `default` is the TeamAi application/domain system of record. Supabase Postgres is not the TeamAi domain database. PayPal is an external payment event authority. Trusted server execution belongs in Supabase Edge Functions. Firebase UID is the ownership root.

Source configuration, deployment, integration, and end-to-end completion are separate evidence states. Never infer one from another.
