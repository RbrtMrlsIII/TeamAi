# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

TEAM-BACKEND-030 production Firestore authority, security, and runtime evidence (Issue #401 / Draft successor PR)

## Status

IMPLEMENTATION ACTIVE / IN PROGRESS. PR #398 is merged as the reviewed 029 structural baseline. Issue #401 and successor PR #402 are now the sole implementation frontier for production Firestore authority, security, and runtime evidence. The live branch head is the source of truth for current verification.

| Authority area | Implemented / source state | Repository proof | Live / human proof |
|---|---|---|---|
| Spatial renderer | Canonical source renderer, controller split, semantic topology, adaptive geometry, R0/R1/R2, Seat-1 wiring, camera choreography | exact-head source/test + Browser proof on current head | final deployed visual acceptance remains open |
| Firestore Seat | Canonical team-nested resolver, explicit persisted-to-domain identity mapping, Seat-owned budget/config | repository contracts and tests | real production Seat inspection remains open; default-branch diagnostic vehicle now runs the exact-path probe |
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
- Firestore collection-group index configuration is checked into `firestore.indexes.json`, with a manual indexes-only deployment workflow. Live promotion of `teamai-seat-budget-runtime` remains blocked until that index exists in production.

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

## 030 successor frontier

The first successor implementation slice is deliberately additive:

- fresh run-scoped Firestore metadata evidence under `runtime-diagnostics/{runId}`;
- exact canonical Seat/connection inspection without mutation of canonical Seat/Connection documents;
- production evidence remains manually dispatched and protected by Actions secrets;
- the default-branch `firestore-seat-shape-diagnostic.yml` filename is the current dispatch vehicle for that probe;
- Rules hardening is downstream of observed field inventory;
- live index deployment and real-provider execution remain separately gated.

## Current blocker

- **Production Firestore Seat shape remains unverified.** Exact-path run `35763013851` wrote negative evidence `run-2026-09-22T17-48-26-734Z-edb51fd8-897`: Seat `gate3-test-seat` under team `gate3-test-team` is absent, and the protected test project currently lists **zero** team documents. This is not collection-group HTTP 400. Seat authorization, entitlement, budget, and execute-capable connection remain unproven.
- **The live task executor is still v12.** The newer repository Edge implementation remains gated behind the production Seat proof.
- **Real provider continuation is unproven.** Repository continuation tests cannot substitute for the live exhaustion/checkpoint/continuation/completion chain.
- **Firestore index deployment remains pending for `teamai-seat-budget-runtime`.** The checked-in collection-group index must be deployed in the live Firebase project before the new runtime read boundary can be promoted. The 2026-09-22 CLI attempt failed on Service Usage GET 403, not on index write.
- **Firestore field-level Rules hardening is not yet final.** The real Seat field inventory must be reconciled before narrowing authenticated owner writes.
- **Final spatial acceptance remains open.** The 10-seat envelope, R0 receiving choreography, R1/R2 articulation, responsive behavior, reduced motion, and accessibility interaction matrix need final evidence.
- **Merge authority remains separate.** #398 is already merged as the reviewed structural baseline; #402 remains Draft until its own exact-head evidence, review, and human acceptance satisfy the governed promotion path.

### Shared CI support: advisory issue preflight

PR #407 is infrastructure support for Issue #406. It is not a replacement current slice and does not create a second product implementation frontier. The advisory control plane validates issue metadata once before provider fan-out and treats explicit `none`/`n/a` as no owning issue.
