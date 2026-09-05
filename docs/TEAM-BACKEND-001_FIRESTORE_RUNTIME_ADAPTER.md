# TEAM-BACKEND-001 — Firestore Runtime Adapter Contract

**State:** IMPLEMENTED source contract
**Field:** Backend & Runtime

This contract materializes the scheduler/runtime bridge against Firebase `(default)` Firestore without moving durable execution authority into the browser.

`Firebase UID → durable state → scheduler → transactional lease → approval → ProviderRuntime → durable evidence → recovery`

The server-side adapter uses runtime-only Firebase service-account configuration, transactional Firestore read/write for task leasing, optimistic update-time protection, separate approval transition, and durable execution-event writes.

These source-level tests prove transaction construction and conflict handling; they do not claim live Firebase concurrency/restart evidence.

Remaining completion evidence: live Firebase lease concurrency/restart, durable result/artifact persistence, authenticated end-to-end execution wiring, and live PayPal transaction/webhook evidence.
