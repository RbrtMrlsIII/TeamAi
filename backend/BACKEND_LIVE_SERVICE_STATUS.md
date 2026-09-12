# TEAM-BACKEND-001 — Live Service Status

**Date:** 2026-09-10  
**Phase:** TEAM-BACKEND-001  
**Status:** **ENDORSED for bounded recorded scope; residual boundaries remain explicit**

> **2026-09-10 evidence reconciliation:** The earlier `IN IMPLEMENTATION` wording below is a historical snapshot and is superseded by the 2026-09-07 bounded TEAM-BACKEND-001 HandOver/Endorsement plus the recorded PayPal, Firestore recovery, and authenticated Edge runtime evidence. See `docs/CHECKPOINT_BACKEND_EVIDENCE_RECONCILIATION_2026-09-10.md` for the current classification. Historical entries are preserved below rather than rewritten away.

## Current boundary state

| Boundary | Current evidence | Status | Do not infer |
|---|---|---|---|
| Firebase Auth | live Edge paths verify Firebase ID tokens and derive UID from verified claims | **RUNTIME-PROVEN for exercised slices** | every possible auth/failure case |
| Firestore `default` | Gate-3 authenticated persistence, independent reads, idempotency, lease contention/recovery, and durable results are recorded | **RUNTIME-PROVEN for bounded slices** | full scheduler/product integration |
| Supabase Edge Functions | TeamAi project `srpgzzretfyqdsfclnuo` is ACTIVE_HEALTHY with deployed TeamAi functions | **DEPLOYED / function-specific evidence** | deployment alone = end-to-end completion |
| PayPal Sandbox | real Sandbox OAuth, order, approval, capture, webhook delivery, v13 redelivery, and final Firestore re-read are recorded | **RUNTIME-PROVEN for bounded commerce gate** | production/live-mode readiness or canonical webhook cutover |
| GitHub | `main` is the engineering/source authority | **PASS** | Hero live binding from install alone |
| Firebase Hosting | Product Law keeps Firebase Hosting as delivery authority | **PASS** | unrelated deployment paths |
| Vercel | policy cutoff remains non-authoritative | **PARKED / NOT A RELEASE BLOCKER** | resume without explicit approval |
| GitHub App installation | operator-confirmed successful real install, including another-user install | **OPERATOR-CONFIRMED SUCCESS** | callback/browser return proof |
| Conn-3 callback | merged PR #246 changes terminal HTML GET to HTTP 303 TeamAi return | **IMPLEMENTED; live deployment/browser proof pending** | source merge = live proof |
| Seat connection/provider surfaces | deployed functions exist; no frontend exercise path yet | **DEFERRED / WAITING FOR FRONTEND PROOF** | broken or product-complete |
| Firebase Rules Gate 4 | reproducible harness exists, but no emulator PASS was found in repository evidence | **PARKED / NOT PROVEN** | configuration = emulator PASS |
| External provider runtime | live task execution uses `stub-edge-runtime` | **OPEN beyond stub** | real provider integration |

## Live Supabase cross-check — 2026-09-10

The connected Supabase project **TeamAi** (`srpgzzretfyqdsfclnuo`) is `ACTIVE_HEALTHY`.

Currently deployed Edge Functions include:

- `teamai-domain-bootstrap` v18
- `teamai-commerce-intent` v15
- `paypal-webhook` v15
- `teamai-paypal-webhook-v5c` v17
- `teamai-task-execute` v8
- `teamai-github-webhook` v3
- `teamai-github-oauth-bind` v4
- `teamai-seat-connection-test` v3
- `teamai-seat-provider-bind` v3

Deployment inventory is live infrastructure evidence. It is not, by itself, proof of end-to-end product behavior.

`teamai-task-execute` remains explicitly `stub-edge-runtime` for the provider stage. Its authenticated task → lease → durable-result route is runtime-proven, but real external provider invocation is a separate authorization/runtime boundary.

`teamai-github-oauth-bind` is live. Its authenticated POST writes the server-owned Firebase UID ↔ GitHub installation mapping. Its GET callback was changed in merged PR #246 to return HTTP 303 to the TeamAi Hero destination. The revised GET still needs live deployment and browser proof.

The Supabase public schema currently has no application tables. This is consistent with TeamAi's authority model: Firestore `(default)` is the durable application/domain store and Supabase is the trusted Edge/webhook infrastructure.

## Recovered backend evidence

### PayPal Sandbox

Canonical evidence: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`.

The record proves a real Sandbox purchase/capture and provider webhook path, including:

- TeamAi server-owned `correlationId` propagated to PayPal `purchase_units[].custom_id`;
- real PayPal Sandbox OAuth and completed capture;
- real `PAYMENT.CAPTURE.COMPLETED` event;
- v12 PayPal-originated HTTP 200 delivery;
- a real aggregate-state defect discovered after v12;
- v13 correction;
- real redelivery to v13 with HTTP 200;
- final read-only Firestore verification showing `aggregateStatus=completed`, one event, active entitlement, and source correlation match.

This is **RUNTIME-PROVEN for the bounded recorded commerce gate** and is the basis of the 2026-09-07 TEAM-BACKEND-001 endorsement.

### Authenticated task execution

`docs/evidence/TEAM-BACKEND-001_EDGE_RUNTIME_AUDIT_2026-09-06.md` records a real Cloud Shell request returning HTTP `201`, `ok=true`, `phase=complete`, with task/lease/event identifiers and a durable result path. Provider stage is `stub-edge-runtime`.

### Lease / recovery

The 2026-09-07 HandOver records two-worker lease contention, restart/recovery, and durable result retrieval as runtime-proven through Actions run #7.

## Security and Gate-4 distinction

The repository contains security-boundary contracts and live authenticated-path evidence. Gate-4 specifically requires emulator execution proving the intended rules boundary. The durable Gate-4 checkpoint still states that emulator execution was unavailable and no PASS was claimed.

Therefore:

`security/auth contracts + exercised live boundaries = proven at those boundaries`

but

`Gate-4 emulator PASS = not proven by current repository evidence`.

Do not invent or infer a missing emulator run from later green CI that did not exercise the Firebase emulator.

## Operator / manual setup visibility

Some backend progress is intentionally completed through human-operated external UI, credentials, provider accounts, or sandbox interactions. Those actions may not be visible to a repository-only Agent.

`docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md` and `docs/CHECKPOINT_BACKEND_EVIDENCE_RECONCILIATION_2026-09-10.md` preserve the bridge between operator state, connected runtime state, repository evidence, and claim level.

Before any cleanup or refactor that could erase provenance, preserve the observed external state first.

## Frontend / spatial continuation boundary

Backend and 029 spatial work advance on separate clocks.

3D Hero work may continue through V-series and SP gates using presentation/read-model contracts or explicit stubs. Backend state must not be inferred from Hero appearance, and backend endpoints must not be promoted to Hero interaction proof without a bounded integration slice.

Seat connection/provider functions remain intentionally deferred until a real frontend exercise path exists.

No V-series/SP execution should reopen completed backend foundations merely because older backend wording was stale.

## Historical snapshot — preserved

The following sections preserve the pre-reconciliation wording for forensic continuity. They are not the current status.

## Why backend stopped — historical 2026-09-10 snapshot

The earlier repository wording described the backend as stopped at a verification / live-external / final-governance frontier. Subsequent repository evidence now establishes a bounded TEAM-BACKEND-001 endorsement, so the older wording must be read as historical rather than current.

## Required evidence distinction

`source implementation ≠ deployment ≠ integration ≠ runtime proof ≠ completion ≠ endorsement`

The distinction remains valid even after the bounded gate was endorsed.

## Next backend continuation

The next bounded backend action is **not** a generic backend rewrite:

1. deploy and browser-verify the already-merged Conn-3 callback fix;
2. keep Gate 4 parked unless an actual emulator PASS record is recovered;
3. keep real external provider runtime separate from the proven `stub-edge-runtime` path;
4. keep seat/provider surfaces deferred until frontend exercise exists.

For the broader 029 release hold, use the Masterplan and current evidence reconciliation rather than this historical snapshot.


## Lease field-preservation fix — 2026-09-12 (#284/#287)

`teamai-task-execute`'s lease-commit path previously kept only string-typed fields from the in-memory task snapshot when writing the lease update, silently dropping any non-string Firestore field types on every lease. This is now fixed: the lease commit spreads the complete raw Firestore `fields` map and overlays only the lease-owned keys. Covered by `tests/backend-task-lease-preservation.test.mjs`. This is a repository-level bug fix; it does not change the endorsed/bounded classification above.
