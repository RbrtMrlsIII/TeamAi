# TEAM-BACKEND-001 — Live Service Status

**Current observation:** 2026-09-12  
**Phase:** TEAM-BACKEND-001 / backend continuation  
**Status:** **ENDORSED for bounded recorded scope; residual boundaries remain explicit**

> **Current live-state reconciliation — 2026-09-12:** The connected Supabase project now reports exactly eight ACTIVE TeamAi Edge Functions after the operator removed the obsolete `paypal-webhook` deployment. The precise active deployment inventory is maintained in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`. Historical deployment snapshots remain evidence and are not current inventory.

## Current boundary state

| Boundary | Current evidence | Status | Do not infer |
|---|---|---|---|
| Firebase Auth | live Edge paths verify Firebase ID tokens and derive UID from verified claims | **RUNTIME-PROVEN for exercised slices** | every possible auth/failure case |
| Firestore `default` | Gate-3 authenticated persistence, independent reads, idempotency, lease contention/recovery, and durable results are recorded | **RUNTIME-PROVEN for bounded slices** | full scheduler/product integration |
| Supabase Edge Functions | TeamAi project `srpgzzretfyqdsfclnuo` reports exactly eight ACTIVE TeamAi functions | **DEPLOYED / current inventory recorded** | deployment alone = end-to-end completion |
| PayPal live webhook target | operator reports `teamai-paypal-webhook-v5c` at the live URL; Supabase reports v5c ACTIVE | **OPERATOR-CONFIRMED TARGET + DEPLOYED** | all configured PayPal events semantically handled |
| GitHub | `main` is the engineering/source authority | **PASS** | Hero live binding from install alone |
| Firebase Hosting | Product Law keeps Firebase Hosting as delivery authority | **PASS** | unrelated deployment paths |
| Vercel | policy cutoff remains non-authoritative | **PARKED / NOT A RELEASE BLOCKER** | resume without explicit approval |
| GitHub App installation | operator-confirmed successful install | **OPERATOR-CONFIRMED** | callback/browser return proof |
| Conn-3 callback | merged PR #246 changes terminal HTML GET to HTTP 303 TeamAi return | **IMPLEMENTED; live deployment/browser proof remains boundary-specific** | source merge = live proof |
| Seat connection/provider surfaces | deployed functions exist; no frontend exercise path yet | **DEFERRED / WAITING FOR FRONTEND PROOF** | product completion |
| Firebase Rules Gate 4 | reproducible harness exists, but no emulator PASS is recorded | **PARKED / NOT PROVEN** | configuration = emulator PASS |
| External provider runtime | `teamai-task-execute` remains `stub-edge-runtime` | **OPEN beyond stub** | real provider integration |

## Current live Supabase inventory — 2026-09-12

The connected Supabase project **TeamAi** (`srpgzzretfyqdsfclnuo`) reports exactly these eight ACTIVE TeamAi Edge Functions:

- `teamai-commerce-intent` v19
- `teamai-domain-bootstrap` v22
- `teamai-github-oauth-bind` v8
- `teamai-github-webhook` v7
- `teamai-paypal-webhook-v5c` v21
- `teamai-seat-connection-test` v7
- `teamai-seat-provider-bind` v7
- `teamai-task-execute` v12

The obsolete `paypal-webhook` deployment is absent from the connected Supabase inventory after operator deletion.

The precise current deployment census is recorded in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md`. This live-status document carries claim-level backend state; it does not replace the census.

Deployment metadata still shows inconsistent local checkout path shapes for several functions, including `TeamAi/TeamAi/`. That is deployment provenance evidence, not by itself proof of runtime failure.

`teamai-task-execute` remains explicitly `stub-edge-runtime` for the provider stage. Its authenticated task → lease → durable-result path is runtime-proven for the bounded exercised slice; real external provider invocation is a separate authorization/runtime boundary.

`teamai-github-oauth-bind` is live. Its authenticated POST writes the server-owned Firebase UID ↔ GitHub installation mapping. Its GET callback was changed in merged PR #246 to return HTTP 303 to the TeamAi Hero destination; current live deployment/browser proof remains separately bounded.

The Supabase public schema currently has no application tables. This remains consistent with TeamAi's authority model: Firestore `(default)` is the durable application/domain store and Supabase provides trusted Edge execution and webhook infrastructure.

## Recovered backend evidence

### PayPal bounded commerce evidence

Canonical evidence: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`.

The record proves a real Sandbox purchase/capture and provider webhook path, including the server-owned correlation ID, real PayPal Sandbox OAuth and capture, webhook delivery, v13 redelivery, and final read-only Firestore aggregate/event/entitlement verification.

This is **RUNTIME-PROVEN for the bounded recorded commerce gate** and is the basis of the 2026-09-07 TEAM-BACKEND-001 endorsement. It does not establish production readiness for every live provider event class.

### Authenticated task execution

`docs/evidence/TEAM-BACKEND-001_EDGE_RUNTIME_AUDIT_2026-09-06.md` records a real authenticated request returning HTTP `201`, `ok=true`, `phase=complete`, with task/lease/event identifiers and durable result. Provider stage remains `stub-edge-runtime`.

### Lease / recovery

The 2026-09-07 HandOver records two-worker lease contention, restart/recovery, and durable result retrieval as runtime-proven through Actions run #7.

## Security and Gate-4 distinction

The repository contains security-boundary contracts and live authenticated-path evidence. Gate-4 specifically requires emulator execution proving the intended rules boundary. No emulator PASS is currently recorded.

Therefore:

`security/auth contracts + exercised live boundaries = proven at those boundaries`

but

`Gate-4 emulator PASS = not proven by current repository evidence`.

Do not invent or infer a missing emulator run from later green CI that did not exercise the Firebase emulator.

## Operator / manual setup visibility

Some backend progress is completed through human-operated provider UI, credentials, external account authorization, live/sandbox interactions, or other boundaries that are not visible to every Agent.

`docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md` preserves the bridge between repository intent, operator state, connected runtime, and claim level. The current eight-function deployment inventory is now separately frozen in the active census file.

Before cleanup or refactor that could erase provenance, preserve the observed external state first.

## Frontend / spatial continuation boundary

Backend and 029 spatial work advance on separate clocks.

3D Hero work may continue through bounded presentation/read-model contracts or explicit stubs. Backend state must not be inferred from Hero appearance, and backend endpoints must not be promoted to Hero interaction proof without a bounded integration slice.

Seat connection/provider functions remain intentionally deferred until a real frontend exercise path exists.

No V-series/SP execution should reopen completed backend foundations merely because an older backend deployment snapshot is stale.

## Historical snapshot — preserved

Historical backend deployment inventories and earlier `IN IMPLEMENTATION` wording remain preserved in repository history and older evidence records. They are not the current live inventory. The active eight-function census and this 2026-09-12 reconciliation supersede older live inventory tables for recovery purposes.

## Required evidence distinction

`source implementation ≠ deployment ≠ integration ≠ runtime proof ≠ completion ≠ endorsement`

The distinction remains valid even after bounded gates are endorsed.

## Next backend continuation

The next backend actions remain bounded rather than a generic rewrite:

1. retain the eight-function active surface as the current deployment baseline;
2. keep Gate 4 parked unless an actual emulator PASS record is recovered;
3. keep real external provider runtime separate from the proven `stub-edge-runtime` path;
4. keep OAuth lifecycle/security and deploy-source reconciliation separately governed;
5. keep seat/provider surfaces deferred until frontend exercise exists.

For the broader 029 release hold, use the Masterplan and current evidence reconciliation rather than historical snapshots.

## Lease field-preservation fix — 2026-09-12 (#284/#287)

`teamai-task-execute`'s lease-commit path previously kept only string-typed fields from the in-memory task snapshot when writing the lease update, silently dropping any non-string Firestore field types on every lease. This is now fixed: the lease commit preserves the complete raw Firestore `fields` map and overlays only the lease-owned keys. Covered by `tests/backend-task-lease-preservation.test.mjs`. This is a repository-level bug fix and does not by itself change the broader backend release gates.
