# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## TEAM-BACKEND-001 — Backend Foundation

**Status:** IN IMPLEMENTATION.

### Chronological execution checklist
1. [x] Architecture/authority reconciliation encoded in executable service assertions.
2. [x] Firebase UID ownership hierarchy encoded in Firestore path contracts.
3. [x] Deterministic Web AI effective-skill resolution encoded; skills do not grant authorization.
4. [x] Durable task lifecycle and event/idempotency contract encoded.
5. [x] Firestore source configuration baseline wired: `firebase.json`, `firestore.rules`, `firestore.indexes.json`.
6. [x] Canonical Product Law, AI assistant recovery guide, Masterplan and backend evidence updated together.
7. [ ] Local Firebase emulator/rules execution verified. **PARKED/BLOCKED by local environment.**
8. [x] Authorized Firebase project identity, live `(default)` Firestore database, Email/Password and Google Auth providers, and Firestore Rules deployment verified.
9. [x] Workplace → Project → Team/Solo → Seat persistence source slice implemented and live authenticated creation, independent Firestore verification, and repeat-call idempotency are evidenced.
10. [x] Trusted Supabase Edge runtime persistence slice implemented and deployed with canonical Firebase project-identity enforcement; live authenticated execution, independent Firestore verification, and idempotency are evidenced.
11. [x] Gate 5B: server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation contract implemented and direct source-contract validation passed.
12. [ ] Gate 5C: verified PayPal webhook authenticity, idempotency, replay protection, durable commerce event and entitlement projection implemented and evidenced.
13. [ ] Provider/runtime invocation connected only after authorization/task contracts.
14. [ ] Security, contract, integration, failure, timeout, cancellation and recovery verification complete.
15. [ ] Traceability audit reconciled from Product Law → plan → contract/skill → implementation → evidence → endorsement.
16. [ ] TEAM-BACKEND-001 completion endorsement recorded.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

### Gate 5B boundary — PASS
The server-owned commerce contract establishes a pending intent from the trusted Firebase UID and correlation ID. A later verified PayPal event binds its provider event ID to that existing intent and derives the stable idempotency key. The browser is never the source of payment ownership truth.

Direct validation passed with strict TypeScript compilation and behavioral assertions in a temporary local workspace:

`GATE5B_DIRECT_TEST=PASS`

Evidence: `docs/CHECKPOINT_TEAM-BACKEND-001_GATE5B_2026-09-03.md` and `docs/evidence/GATE5B_DIRECT_VALIDATION_2026-09-03.md`.

**Important:** Gate 5B is source-contract completion only. No webhook authenticity, replay handling, entitlement activation, or live payment-success claim is inferred from it.

### Gate 5C — ACTIVE
Gate 5C is the next implementation boundary: verify PayPal webhook authenticity, reject/reconcile replayed transmissions, durably record the commerce event under the Firebase UID, and project entitlement state only from authenticated provider events correlated to a server-owned commerce intent.

PayPal's current webhook guidance requires verification of received messages and a successful 2xx receipt; non-2xx deliveries can be retried up to 25 times over 3 days. The webhook registration supplies a webhook ID used during verification. citeturn888155search0turn888155search2

PayPal's current subscription model exposes subscription lifecycle/payment events and supports a `custom_id` field, but TeamAi must treat any provider-supplied commercial identifier as a correlation input only after webhook authenticity verification; Firebase UID ownership remains server-established. citeturn888155search4turn888155search6

### Current evidence boundary
Firebase persistence is independently evidenced. The PayPal webhook Edge Function currently serves as a verification bootstrap boundary and intentionally stops before TeamAi business processing. Gate 5C must connect verified provider events to the already-defined server-owned correlation and durable Firestore commerce state without creating a parallel authority path.

### Hard completion rule
An implementation claim is complete only when its governing Product Law and Masterplan item trace through the applicable contract/skill, actual implementation, verification evidence, and completion/endorsement record. Planning text, documentation presence, deployment presence, green unit tests, or endorsement alone do not establish implementation completion.

## Target-project handover rule
Every completed gate must surrender a target-project handover packet/ZIP in the same execution. The handover belongs to TeamAi; Universal ToolKit only provides reusable upstream process knowledge and does not own TeamAi project state.
