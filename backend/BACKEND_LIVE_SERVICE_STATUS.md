# TEAM-BACKEND-001 — Live Service Status

**Current observation:** 2026-09-22  
**Phase:** TEAM-BACKEND-001 / backend continuation  
**Status:** **ENDORSED for bounded recorded scope; residual boundaries remain explicit**

> **Current live-state reconciliation — 2026-09-22:** The active inventory has moved beyond the dated 2026-09-12 census: the trusted `teamai-task-continuation-request` boundary is now deployed as v2. The dated census remains historical evidence; this active status record is the current claim-level inventory and must be re-read before relying on versions.

## Current boundary state

| Boundary | Current evidence | Status | Do not infer |
|---|---|---|---|
| Firebase Auth | live Edge paths verify Firebase ID tokens and derive UID from verified claims | **RUNTIME-PROVEN for exercised slices** | every possible auth/failure case |
| Firestore `default` | Gate-3 authenticated persistence, independent reads, idempotency, lease contention/recovery, and durable results are recorded | **RUNTIME-PROVEN for bounded slices** | full scheduler/product integration |
| Supabase Edge Functions | TeamAi project `srpgzzretfyqdsfclnuo` reports 10 ACTIVE TeamAi functions, including `teamai-seat-budget-settings` v1 | **DEPLOYED / current inventory recorded** | deployment alone = end-to-end completion |
| PayPal live webhook target | operator reports `teamai-paypal-webhook-v5c` at the live URL; Supabase reports v5c ACTIVE | **OPERATOR-CONFIRMED TARGET + DEPLOYED** | all configured PayPal events semantically handled |
| GitHub | `main` is the engineering/source authority | **PASS** | Hero live binding from install alone |
| Firebase Hosting | Product Law keeps Firebase Hosting as delivery authority | **PASS** | unrelated deployment paths |
| Vercel | policy cutoff remains non-authoritative | **PARKED / NOT A RELEASE BLOCKER** | resume without explicit approval |
| GitHub App installation | operator-confirmed successful install | **OPERATOR-CONFIRMED** | callback/browser return proof |
| Conn-3 callback | merged PR #246 changes terminal HTML GET to HTTP 303 TeamAi return | **IMPLEMENTED; live deployment/browser proof remains boundary-specific** | source merge = live proof |
| Seat connection/provider surfaces | deployed functions exist; no frontend exercise path yet | **DEFERRED / WAITING FOR FRONTEND PROOF** | product completion |
| Firebase Rules Gate 4 | reproducible harness exists, but no emulator PASS is recorded | **PARKED / NOT PROVEN** | configuration = emulator PASS |
| External provider runtime | `teamai-task-execute` remains `stub-edge-runtime` | **OPEN beyond stub** | real provider integration |

## Current live Supabase inventory — 2026-09-22

The connected Supabase project **TeamAi** (`srpgzzretfyqdsfclnuo`) reports these ACTIVE TeamAi Edge Functions:

- `teamai-domain-bootstrap` v22
- `teamai-commerce-intent` v19
- `teamai-paypal-webhook-v5c` v21
- `teamai-task-execute` v12
- `teamai-github-webhook` v7
- `teamai-github-oauth-bind` v9
- `teamai-seat-connection-test` v8
- `teamai-seat-provider-bind` v8
- `teamai-task-continuation-request` v2
- `teamai-seat-budget-settings` v1

The new `teamai-seat-budget-runtime` read-model function is repository-complete and exact-head verified, but is **not yet deployed** because its Firestore collection-group composite index must first exist in the live Firebase project.

The checked-in `firestore.indexes.json` now declares the required `execution-results` collection-group index on `seatId ASC, recordedAt DESC`. The manual workflow `.github/workflows/firestore-index-deploy.yml` is intentionally `workflow_dispatch` only and performs an indexes-only Firebase deployment.

`teamai-task-execute` remains v12 and is still the historical stub-edge-runtime production boundary. The newer real-provider executor is separately gated by the production Seat diagnostic and must not be promoted by this feature slice.

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

`docs/TEAMAI_BACKEND_LIVE_REALITY_LEDGER.md` preserves the bridge between repository intent, operator state, connected runtime, and claim level. The current ten-function deployment inventory is now separately recorded in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-22.md`.

Before cleanup or refactor that could erase provenance, preserve the observed external state first.

## Frontend / spatial continuation boundary

Backend and 029 spatial work advance on separate clocks.

3D Hero work may continue through bounded presentation/read-model contracts or explicit stubs. Backend state must not be inferred from Hero appearance, and backend endpoints must not be promoted to Hero interaction proof without a bounded integration slice.

Seat connection/provider functions remain intentionally deferred until a real frontend exercise path exists.

No V-series/SP execution should reopen completed backend foundations merely because an older backend deployment snapshot is stale.

## Historical snapshot — preserved

Historical backend deployment inventories and earlier `IN IMPLEMENTATION` wording remain preserved in repository history and older evidence records. They are not the current live inventory. The 2026-09-22 census supersedes the 2026-09-12 snapshot for current live inventory purposes.

## Required evidence distinction

`source implementation ≠ deployment ≠ integration ≠ runtime proof ≠ completion ≠ endorsement`

The distinction remains valid even after bounded gates are endorsed.

## Production Firestore data hygiene — 2026-09-22

The connected production dataset contains both useful bounded evidence and older probe records. **No manual field deletion is authorized from this status record.** A document that looks sparse, duplicated, or historical is first classified as canonical, diagnostic, historical evidence, or malformed before any mutation.

For future production proof, prefer a fresh run-scoped hierarchy created by an explicit operator-authorized diagnostic/probe workflow. Fresh runs should:
- use unique IDs so new evidence cannot overwrite historical records;
- create only the fields required by the canonical runtime contract;
- keep provider secrets out of logs and readbacks;
- record the exact run ID and evidence class;
- leave historical evidence immutable unless a separate cleanup authorization exists.

The previously observed commerce paths and server-only `commerceCorrelationIndex/{correlationId}` remain part of the commerce evidence model and must not be deleted merely because their documents are sparse.

## Next backend continuation

The next backend actions remain bounded rather than a generic rewrite:

1. retain the current 10-function active surface as the live deployment baseline until each runtime is independently reconciled;
2. keep Gate 4 parked unless an actual emulator PASS record is recovered;
3. keep real external provider runtime separate from the proven `stub-edge-runtime` path;
4. keep OAuth lifecycle/security and deploy-source reconciliation separately governed;
5. keep seat/provider surfaces deferred until frontend exercise exists.

For the broader 029 release hold, use the Masterplan and current evidence reconciliation rather than historical snapshots.

## Lease field-preservation fix — 2026-09-12 (#284/#287)

`teamai-task-execute`'s lease-commit path previously kept only string-typed fields from the in-memory task snapshot when writing the lease update, silently dropping any non-string Firestore field types on every lease. This is now fixed: the lease commit preserves the complete raw Firestore `fields` map and overlays only the lease-owned keys. Covered by `tests/backend-task-lease-preservation.test.mjs`. This is a repository-level bug fix and does not by itself change the broader backend release gates.


## Live deployment note — 2026-09-22

The trusted `teamai-task-continuation-request` boundary is deployed in Supabase as version 2 from the audited 029 branch source. It reuses the existing Firebase service-account secret and performs Firebase ID-token verification, canonical Seat/checkpoint validation, and durable continuation-request state transition only; it does not execute a provider.

The live `teamai-task-execute` function remains version 12 and the production Seat/connection shape is not yet directly verified. The newer real-provider executor remains undeployed until that gate is satisfied.

Repository-side hardening on the active 029 branch now makes normal task execution resolve the active connection from the canonical Firestore Seat scope, matching the continuation execution boundary. Provider results that omit normalized termination are durably terminalized as `PROVIDER_TERMINATION_INVALID` rather than leaving a leased task/request running.

The checked-in Firestore index set retains the required `execution-results` collection-group index (`seatId ASC, recordedAt DESC`). An equality-only `connections(seatId,status)` composite was deliberately not retained because Firestore supports compound equality queries through index merging. The indexes-only workflow now deploys and then reads back deployed indexes, verifying required repository indexes without deleting unrelated live indexes.


## Seat Budget runtime read model — 2026-09-22

The repository now contains a trusted `teamai-seat-budget-runtime` read boundary that resolves the canonical active/authorized Seat, reads the latest Seat-owned durable `execution-results` record, and exposes configuration plus runtime accounting without returning provider output.

The projection is intentionally backward-compatible with the live v12 stub: raw usage may be shown as recorded usage while remaining/usable capacity stays unknown when server-side budget accounting is absent. This is explicitly not treated as authoritative remaining capacity.

The runtime endpoint is held from production deployment until the declared Firestore collection-group index is deployed. This is an infrastructure prerequisite, not a code-validation gap.

