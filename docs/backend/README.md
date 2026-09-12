# TeamAi Backend Documentation

This directory is the canonical backend implementation and authority documentation surface.

## Current backend state
`TEAM-BACKEND-001 — ENDORSED / BOUNDED RECORDED SCOPE`

This status does **not** mean the entire backend or product path is complete. The bounded recorded gates are endorsed; remaining evidence boundaries stay explicit. Firebase emulator/rules execution remains parked/not proven in the available evidence, `teamai-task-execute` remains bounded to `stub-edge-runtime`, broader external provider invocation remains unproven, and broader scheduler/approval integration remains open.

## Read order
1. `BACKEND_SERVICE_BOUNDARY.md`
2. `FIREBASE_BACKEND_GUIDE.md`
3. `FIRESTORE_DOMAIN_MODEL.md`
4. `SUPABASE_EDGE_FUNCTIONS_GUIDE.md`
5. `PAYPAL_WEBHOOK_GUIDE.md`
6. `BACKEND_FOUNDATION_EXECUTION.md`
7. `BACKEND_FOUNDATION_IMPLEMENTATION_SLICE_2026-09-03.md` (historical implementation snapshot; read its reconciliation note)
8. `BACKEND_LIVE_SERVICE_STATUS.md`
9. `../TEAMAI_029_CURRENT_STATE_MAP.md` for the cross-field current frontier

## Non-negotiable
Firestore `default` is the TeamAi application/domain system of record. Supabase Postgres is not the TeamAi domain database. PayPal is an external payment event authority. Trusted server execution belongs in Supabase Edge Functions. Firebase UID is the ownership root.

Source configuration, deployment, integration, runtime proof, completion, and endorsement are separate evidence states. Never infer one from another.

Historical backend checkpoints and handovers preserve what was true at the time of execution. When their status wording differs from this current entry point, follow the current canonical status and use the historical record as evidence rather than as today's frontier.
