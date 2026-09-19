# TeamAi Backend Evidence Reconciliation — 2026-09-10

**Status:** CURRENT EVIDENCE RECONCILIATION  
**Purpose:** reconcile the live/connected backend claims against the repository's historical evidence before any new backend implementation or cleanup. This record preserves completed proof, unresolved evidence boundaries, and the frontend/spatial handoff boundary.

## 1. Executive reconciliation

The repository contains stronger backend evidence than the older `BACKEND_LIVE_SERVICE_STATUS.md` and `TEAMAI_029_CURRENT_STATE_MAP.md` wording currently implies.

Confirmed from the repository:

- `TEAM-BACKEND-001` has a durable **ENDORSED bounded-scope HandOver** dated 2026-09-07.
- Real PayPal Sandbox purchase, approval, capture, provider webhook delivery, HTTP 200, v13 redelivery, and post-v13 Firestore aggregate/event/entitlement re-read are recorded as runtime-proven.
- Authenticated `teamai-task-execute` returned HTTP 201 with task/lease/event identifiers and a durable Firestore result path; its provider stage is explicitly `stub-edge-runtime`.
- Firestore lease contention, restart/recovery, and durable result retrieval are recorded as runtime-proven through Actions run #7.
- GitHub App installation is now operator-confirmed successful; the remaining Conn-3 defect is the browser return path, tracked separately in Issue #244 and fixed at source level in merged PR #246 but not yet re-proven after live Edge deployment.
- Seat connection/provider functions are deployed but intentionally remain **deferred pending a real frontend exercise path**.

Two claims still require caution because repository evidence was not found in this reconciliation:

1. **Firebase Rules Gate 4 emulator PASS.** The durable checkpoint still says the emulator-capable execution was unavailable and no PASS was claimed. Do not invent a PASS from configuration or source checks.
2. **Real external provider runtime beyond `stub-edge-runtime`.** The live task execution path is proven, but repository evidence still identifies the provider stage as `stub-edge-runtime`. Do not relabel that as a real external provider integration.

## 2. Evidence matrix

| Capability | Repository evidence | Current classification | Do not infer |
|---|---|---|---|
| Firebase identity + Firestore bootstrap | Gate-3 checkpoints and live execution records | RUNTIME-PROVEN bounded slices | all backend completion |
| Firestore lease contention | Actions run #7 + backend read/write economy record | RUNTIME-PROVEN | broader scheduler product path |
| Restart/recovery | Actions run #7 + backend HandOver | RUNTIME-PROVEN | every possible failure mode |
| Durable execution result | Actions run #7 + Edge runtime audit | RUNTIME-PROVEN | real external provider execution |
| `teamai-task-execute` | 2026-09-06 audit, HTTP 201, real task/lease/event ids | RUNTIME-PROVEN | non-stub provider |
| PayPal Sandbox OAuth | commerce runtime proof 2026-09-06 | RUNTIME-PROVEN | production/live-mode readiness |
| PayPal Sandbox capture | real order captured as `COMPLETED` | RUNTIME-PROVEN | browser payment authority |
| PayPal webhook delivery | real PayPal event reached v5c and returned HTTP 200 | RUNTIME-PROVEN | canonical `paypal-webhook` cutover |
| PayPal replay/redelivery repair | v13 redelivery + final aggregate re-read | RUNTIME-PROVEN | every future provider failure mode |
| Commerce entitlement projection | Firestore aggregate/event/entitlement read shows `completed` + `active` + singular event | RUNTIME-PROVEN | full commerce product completion |
| TEAM-BACKEND-001 governance | 2026-09-07 HandOver / Endorsement | ENDORSED for bounded scope | 029 release endorsement |
| GitHub App install | operator-confirmed real GitHub installation, including another-user install | OPERATOR-CONFIRMED SUCCESS | Hero live bind |
| GitHub callback return | PR #246 source fix merged | IMPLEMENTED / DEPLOYMENT PROOF PENDING | browser proof after deployment |
| Seat connection/provider surfaces | live Supabase inventory + source contracts | DEPLOYED / DEFERRED | end-to-end seat acceptance |
| Firebase Rules emulator Gate 4 | reproducible harness + parked checkpoint | PARKED / NOT PROVEN | emulator/hosted/production PASS |
| Real external provider runtime | no repository evidence beyond `stub-edge-runtime` | OPEN | real provider execution |

## 3. PayPal proof recovered

Canonical evidence: `docs/evidence/TEAMAI_COMMERCE_PAYPAL_RUNTIME_PROOF_2026-09-06.md`.

The recorded sequence is:

```text
TeamAi commerce intent
  → server-owned correlationId
  → PayPal Sandbox OAuth
  → real Sandbox order
  → buyer approval
  → capture COMPLETED
  → PAYMENT.CAPTURE.COMPLETED webhook
  → v12 HTTP 200
  → learned aggregate-state defect
  → v13 correction
  → real redelivery to v13 HTTP 200
  → read-only Firestore aggregate/event/entitlement verification
```

Recorded identifiers include correlationId `68b4ef3a-4132-46bf-8a01-43ebe97ba51e`, provider event `WH-71666988RB043112X-1WA30416DF8293903`, and final read workflow run ID `34089143256` attempt 2. The final read reports `aggregateStatus=completed`, `eventCount=1`, `entitlementStatus=active`, and `sourceMatches=true`.

This is sufficient repository evidence for the bounded PayPal runtime claim represented in the 2026-09-07 HandOver.

## 4. Recovery / execution proof recovered

`docs/project-guide/HandOver-2026-09-06-Authenticated-Edge-Runtime.md` and the backend read/write-economy record preserve:

- two-worker lease contention as runtime-proven;
- restart/recovery as runtime-proven;
- durable result retrieval as runtime-proven;
- authenticated `teamai-task-execute` invocation as runtime-proven.

The Edge audit records a real Cloud Shell invocation returning HTTP `201`, `ok=true`, `phase=complete`, with task/lease/event identifiers under the verified UID/workplace/project/task hierarchy.

## 5. Security boundary clarification

The repository does contain security-related contract evidence, including Firebase Bearer-token enforcement on trusted Edge paths and the intended Firestore ownership boundary of same-UID access versus cross-UID denial. However, the specific Gate-4 emulator execution remains explicitly parked in the durable checkpoint.

Therefore the correct classification is:

`security contracts + bounded live auth evidence = proven at exercised boundaries`

but not:

`Gate-4 emulator PASS = proven`

unless a new emulator-capable execution record is found and linked.

## 6. Conn-3 browser flow

The operator-confirmed GitHub App installation is preserved separately from the CLI result.

The `curl` HTTP 401 is a test-path discrepancy and must not downgrade the actual GitHub App installation evidence.

PR #246 changes the GET callback from terminal HTML to HTTP 303 toward `https://rbrtmrlsiii.github.io/TeamAi/hero`, while preserving the authenticated POST UID/install binding path. The source fix is merged. The next evidence boundary is a real deployment plus browser test.

## 7. Frontend and spatial handoff boundary

Backend progress must remain independently recoverable while the 029 spatial track proceeds.

The frontend may consume a bounded backend read-model or explicitly labeled stub without owning backend authority. Backend agents may advance backend evidence or implementation without changing Hero ownership.

For the ongoing V-series and SP sequence:

- preserve the existing spatial authority chain and current owner roots;
- do not reopen completed Cam/P/V work merely because backend wording was stale;
- do not turn backend endpoints into Hero interaction proof;
- do not let a staged V asset or SP checkpoint imply backend completion;
- keep one current spatial slice and one measurable next command at a time.

The existing SP sequence remains the spatial governance rail. Backend reconciliation is a separate clock and should not rewrite the spatial execution order.

## 8. Early-fix lessons recovered from history

The repository history contains several useful, evidence-backed fixes that should be considered before new implementation:

1. **Restore exact canonical baseline before a bounded repair.** Historical camera/hierarchy work previously required restoration after an incomplete branch. Preserve the minimal-delta recovery pattern rather than rewriting large surfaces.
2. **Keep evidence-class labels separate.** `deployed`, `runtime-proven`, `completed`, and `endorsed` are not interchangeable.
3. **Do not treat the CLI 401 as product-flow failure** when the actual GitHub installation succeeds and connected runtime history confirms the install/bind path.
4. **Keep aggregate state repair before duplicate early return** for webhook redelivery, because a safe replay can repair an already-persisted event without creating a second event document.
5. **Do not place TeamAi domain data in Supabase Postgres** merely because the public schema is empty. Firestore remains the durable application authority.
6. **Keep frontend/backend ownership separate.** Fixture-backed or presentation-only UI must not be promoted to live domain behavior without a specific integration proof.

## 9. Current action boundary

The backend is not waiting for a generic “backend feature.” It is waiting on evidence-specific boundaries:

- Conn-3: deploy and browser-verify the already-merged 303 callback fix;
- Gate 4: only advance if an actual emulator-capable execution record exists;
- real external provider runtime: advance only under its explicit authorization/runtime contract;
- seat connection/provider surfaces: wait for a frontend exercise path;
- future 029 work: continue independently through the spatial/SP governance rail.

**One next evidence action:** reconcile this record with the current backend status/ledger and preserve any newly observed live runtime delta before the next implementation change.
