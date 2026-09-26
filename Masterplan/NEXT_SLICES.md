# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

TEAM-BACKEND-030 production Firestore authority, security, and runtime evidence (Issue #401 / Draft successor PR)

## Status

IMPLEMENTATION ACTIVE / IN PROGRESS. PR #398 is merged as the reviewed 029 structural baseline. PR #413 is merged and Firestore index deploy/readback is RUNTIME-PROVEN by default-branch run `36146692843`. Issue #401 remains the sole implementation frontier; the current successor is Gate 3 Seat-shape evidence, which is blocked by an absent operator-authorized test hierarchy. The live branch head is the source of truth for current verification.

| Authority area | Implemented / source state | Repository proof | Live / human proof |
|---|---|---|---|
| Spatial renderer | Canonical source renderer, controller split, semantic topology, adaptive geometry, R0/R1/R2, Seat-1 wiring, camera choreography | exact-head source/test + Browser proof on current head | final deployed visual acceptance remains open |
| Firestore Seat | Canonical team-nested resolver, explicit persisted-to-domain identity mapping, Seat-owned budget/config | repository contracts and tests; missing-Seat path classifies `operator_hierarchy_absent` | real production Seat inspection remains open; documented Gate 3 selectors currently list zero team documents |
| Seat connection/provider | Seat-owned binding, credential loading, active connection resolution | repository + deployed function source reconciliation | production execution-capable relationship remains unproven |
| Task execution | Real-provider Edge source with canonical Seat-owned connection authority, truthful termination, durable handoff checkpoint, continuation execution | Full-System/Security/contract proof | live `teamai-task-execute` remains v12; promotion gated |
| Continuation | Durable checkpoint, explicit request, waiting state, fresh-turn semantics | repository E2E + deployed request boundary | live provider continuation remains open |
| Frontend/product | #400 representative MCP, Workspace, Team/Agents, Marketplace, Storage, and #392 presentation contracts | representative Browser proof | authoritative backend wiring intentionally bounded |
| Delivery | Firebase Hosting is production authority; GitHub Pages is validation-only | repository workflow/contracts | production deployment/browser observation remains open |

## Objective

Converge the 029 Spatial World implementation and the #392/#400 runtime/product surfaces without creating competing authority.

The current chain is:

```
Product Law
  → current Issue/PR execution boundary
  → canonical spatial source
  → canonical Firestore Seat/domain state
  → trusted Edge runtime
  → durable result/checkpoint
  → explicit continuation
  → frontend read-model + user intent
  → exact-head verification
  → controlled deployment
  → production observation
```

The audited ownership fixes now include a neutral machine-subject geometry owner instead of a production-to-preview dependency, and identical uncapped candidate discovery semantics between Node and Edge canonical Seat resolution.

## Dependencies

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- Issue #396 — 029 Spatial World execution guide
- Issue #400 — Canonical Frontend Feature & Spatial UX Contract
- #392 — Seat budget, usage, handoff, continuation, and cooperation runtime
- Merged PR #398 — reviewed 029 structural baseline
- Issue #401 — 030 production Firestore authority/security/runtime evidence
- `.github/teamai/authority-manifest.yml`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
- `docs/RECONCILIATION_FIRESTORE_WRITE_AUTHORITY_REVIEW.md`

## Verification

All substantive claims are admissible only for the exact PR `base...head` under review.

- **Governance Integrity:** active authority graph, forbidden/historical routing, current-slice grammar, proof-target consistency.
- **Full-System:** typecheck, trusted Edge compilation, machine source/public parity, project tests, package verification.
- **Security Static Analysis:** source and secret-boundary analysis.
- **Canonical Browser:** observable entrance, machine world, facility, responsive, and reduced-motion behavior.
- **Independent geometry:** 1–10 Seat density, maximum-density ring separation, semantic subject bounds, topology continuity, connection corridors, and route sampling.
- **Production Firestore diagnostic:** read-only metadata-only inspection of the real authorized Coder Seat.
- **Runtime proof:** controlled new task-executor deployment only after Seat-shape/connection validation, then provider incomplete termination → durable checkpoint → explicit continuation request → target Seat-owned connection → fresh budgeted turn → truthful completion.
- **Deployment proof:** governed Firebase Hosting deployment followed by production browser observation. GitHub Pages remains validation-only.

Green CI does not prove Firebase runtime state, provider execution, production deployment, or human acceptance.

## Completed capability slices — 2026-09-22
- Production Firestore Seat diagnostic workflow/script wiring is now contract-tested; the live diagnostic remains manually dispatched and requires protected secrets plus a real Seat ID.
- Backend cleanup removed the duplicate `src/server.ts` in-memory Fastify runtime. `src/main.ts` is the sole configured local Node entrypoint, guarded by `tests/backend-runtime-entrypoint.test.mjs`.

- R0 workspace receiving choreography now has a semantic presentation model and canonical WebGL rendering pass from the Seat connection route into `WORKSPACE_CENTER`.
- Seat Budget Settings is a real end-to-end configuration capability through a trusted Edge boundary and canonical Seat transaction. Its live function is deployed as `teamai-seat-budget-settings` v1.
- Seat Budget durable runtime read model is implemented and exact-head verified. It reads the latest Seat-owned `execution-results` evidence and distinguishes authoritative budget accounting from legacy raw usage.
- Firestore collection-group index configuration is checked into `firestore.indexes.json`, with a manual indexes-only deployment workflow. At this 2026-09-22 checkpoint, live promotion of `teamai-seat-budget-runtime` was blocked pending index deployment; the prerequisite was subsequently satisfied and is now RUNTIME-PROVEN by run `36146692843`.

- R1/R2 browser regression was diagnosed from the exact-head Browser artifact and repaired at `b2957c4430ac66d970ab0db695bc04b3f90eed4c`; the canonical Browser gate passes. A dedicated canonical R1/R2 articulation browser contract now runs on every exact head. This closes the observed render-loop exception and adds runtime proof, but does not complete final spatial visual acceptance.

- Default-branch `firestore-seat-shape-diagnostic.yml` now invokes the exact-path evidence probe so the first 030 Seat evidence run can be dispatched without merging #402 first. Live Seat inspection remains unproven until that dispatch succeeds.
## Evidence-state contract for pre-merge review

Use these states consistently in the checklist and review discussion:

```text
IMPLEMENTED
  source/architecture exists and is covered by repository contracts

REPOSITORY-VERIFIED
  exact-head automated tests prove the stated behavior

LIVE-DEPLOYED
  connected service inventory/source inspection proves the artifact is deployed

RUNTIME-PROVEN
  a real runtime interaction produced the claimed durable/observable result

HUMAN-ACCEPTED
  the authorized human reviewer/operator accepted the behavior for promotion
```

A checked implementation item must not be read as LIVE-DEPLOYED, RUNTIME-PROVEN, or HUMAN-ACCEPTED. Production data that is no longer needed for evidence is handled only by a governed cleanup/probe procedure, never by manual field deletion.

## Post-#398 production-data strategy

After #398 is merged, the next vehicle should create **fresh run-scoped Firestore evidence** using the canonical runtime/data path. New probe documents should carry a unique run namespace and should not reuse or mutate historical probe documents. The first run must be read/write scoped to an operator-authorized test hierarchy and must never print provider secrets.


## Historical 029 continuity

TEAM-EXPERIENCE-029 remains the governing 029 product lineage. The post-#346 control-plane reconstruction remains historical context; PR #398 is the reviewed structural baseline now landed on `main`. No historical vehicle is reopened as a parallel current implementation path.

## 2026-09-24 029 spatial acceptance companion

PR #404 remains the Draft 029 reconstruction vehicle; it does not replace the single current slice above. Latest validated spatial implementation head is `8944ececfd6dfee15a39833107dd3bac932411bd`; subsequent branch movement is documentation-only reconciliation. The detailed spatial evidence is maintained in `TEAMAI_3D_WORLD_404_EVIDENCE.md`, with `TEAMAI_3D_WORLD_404_CHECKLIST.md` retaining status-only execution tracking. The current implementation includes authored S4 articulated subjects, intermediate expansion sampling, the 1–10 Seat × 3 shell-state × 7-division clearance matrix, physical-port validation, S8 route clearance, S9 semantic signal projection, and S10 semantic camera contracts.

These are repository implementation/evidence facts, not 029 completion claims. Exact-head CI and Browser validation are green on `8944ece`; subsequent documentation-only reconciliation does not change the validated spatial implementation. No production deployment, human acceptance, or merge authorization is inferred from these repository results.

## 030 successor frontier

The first successor implementation slice is deliberately additive:

- fresh run-scoped Firestore metadata evidence under `runtime-diagnostics/{runId}`;
- exact canonical Seat/connection inspection without mutation of canonical Seat/Connection documents;
- production evidence remains manually dispatched and protected by Actions secrets;
- the default-branch `firestore-seat-shape-diagnostic.yml` filename is the current dispatch vehicle for that probe;
- Rules hardening is downstream of observed field inventory;
- live `execution-results` index deployment/readback is RUNTIME-PROVEN by run `36146692843`;
- real-provider execution remains separately gated behind Gate 3 Seat proof.

## Review-readiness guidance checkpoint

Issue #415 is a governance/verification infrastructure vehicle and does **not** replace or create the singular current slice above. It reconciles the active reviewer procedure with the PR lifecycle: proof-target-first review, exact-head evidence, explicit distinction between PR verification gaps and broader Issue backlog, and the boundary between AI advisory evidence, `review-readiness`, human approval, and merge authorization. Issue #414 remains historical runtime evidence for the underlying advisory-output symptom.

## Current blocker

- **Production Firestore Seat shape remains unverified and is classified as `operator_hierarchy_absent`.** Fresh Gate 3 run `36141179411` on main `529fede864df0218947377e1d50e48f096c4a7c7` returned 404 for documented `gate3-test-team` / `gate3-test-seat` with `teamDocumentCount=0` and `teamListError=null` (run-scoped evidence `run-2026-09-25T13-28-39-012Z-7f6a60cf-a26`). Earlier exact-path run `35763013851` recorded the same empty-hierarchy condition. This is not a collection-group HTTP 400, not an index defect, and not a probe-auth failure. The probe does not create Seat documents. The archived 2026-09-03 Gate 3 PASS proves that the same named hierarchy was successfully exercised under a verified Firebase UID at that earlier time, but the archived record does not expose the UID value; the current diagnostic scope is the protected `TEAMAI_FIREBASE_TEST_UID` secret. Therefore repository evidence does not establish whether the current empty hierarchy is a deletion/reset event or a scope/identity change. Inspection cannot proceed until an operator-authorized team/Seat hierarchy exists or a different authorized path is supplied. Seat authorization, entitlement, budget, and execute-capable connection remain unproven.
- **The live task executor is still v12.** The newer repository Edge implementation remains gated behind the production Seat proof.
- **Real provider continuation is unproven.** Repository continuation tests cannot substitute for the live exhaustion/checkpoint/continuation/completion chain.
- **Firestore index verification is RUNTIME-PROVEN.** PR #413 merged at `ce1656b7190fa8657253385fd884837ff7d12653`. Fresh default-branch run `36146692843` passed deploy and normalized readback (`requiredCount=1`, `deployedCount=2`, `missing=[]`). The unrelated extra live index remains preserved; no `--force` deletion was used. This is no longer a current implementation blocker.
- **`teamai-seat-budget-runtime` remains undeployed.** The former index prerequisite is satisfied; live promotion is now gated on Gate 3 Seat-shape evidence, not on index presence.
- **Firestore field-level Rules hardening is not yet final.** The real Seat field inventory must be reconciled before narrowing authenticated owner writes.
- **Final spatial acceptance remains open.** The 10-seat envelope, R0 receiving choreography, R1/R2 articulation, responsive behavior, reduced motion, and accessibility interaction matrix need final evidence.
- **Merge authority remains separate.** #398, #402, and #413 are merged baselines. PR #404 remains the Draft 029 spatial implementation vehicle and must not absorb #401 backend authority. PR #416 is governance/review-readiness infrastructure only.

### Shared CI support: advisory issue preflight

PR #407 is infrastructure support for Issue #406. It is not a replacement current slice and does not create a second product implementation frontier. The advisory control plane validates issue metadata once before provider fan-out and treats explicit `none`/`n/a` as no owning issue.

The reusable advisory-runner path and direct-push event-graph repair are infrastructure support only. They are not a replacement current slice, not 029 completion, and must not be mixed into Draft PR #404.
