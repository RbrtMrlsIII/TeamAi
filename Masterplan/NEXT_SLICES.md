# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

TEAM-EXPERIENCE-029 spatial machine convergence (Issue #396 / Draft PR #398)

## Status

IMPLEMENTATION ACTIVE / IN PROGRESS. Draft PR #398 remains the sole implementation vehicle on `frontend/029-machine-world-convergence`. The live branch head is the source of truth for current verification.

| Authority area | Implementation state | Proof state |
|---|---|---|
| Spatial renderer | Canonical source renderer, controller split, semantic topology, adaptive geometry, R0/R1/R2, Seat-1 wiring, camera choreography | exact-head source/test proof; final deployed visual acceptance remains open |
| Firestore Seat | Canonical team-nested resolver, explicit persisted-to-domain identity mapping, Seat-owned budget/config | repository proof; real production Seat inspection remains open |
| Seat connection/provider | Seat-owned binding, credential loading, active connection resolution | live connection/bind functions deployed; production execution-capable relationship remains unproven |
| Task execution | Real-provider Edge source with truthful termination, durable handoff checkpoint, continuation execution | live `teamai-task-execute` remains v12; new runtime deployment is gated |
| Continuation | Durable checkpoint, explicit request, waiting state, fresh-turn semantics | repository E2E and deployed request boundary proven; live provider continuation remains open |
| Frontend/product | #400 representative MCP, Workspace, Team/Agents, Marketplace, Storage, and #392 presentation contracts | representative browser proof; authoritative backend wiring remains intentionally bounded |
| Delivery | Firebase Hosting is production authority; GitHub Pages is validation-only | #398 production deployment and browser observation remain open |

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
- Draft PR #398 — `frontend/029-machine-world-convergence`
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

- R0 workspace receiving choreography now has a semantic presentation model and canonical WebGL rendering pass from the Seat connection route into `WORKSPACE_CENTER`.
- Seat Budget Settings is a real end-to-end configuration capability through a trusted Edge boundary and canonical Seat transaction. Its live function is deployed as `teamai-seat-budget-settings` v1.
- Seat Budget durable runtime read model is implemented and exact-head verified. It reads the latest Seat-owned `execution-results` evidence and distinguishes authoritative budget accounting from legacy raw usage.
- Firestore collection-group index configuration is checked into `firestore.indexes.json`, with a manual indexes-only deployment workflow. Live promotion of `teamai-seat-budget-runtime` remains blocked until that index exists in production.

## Current blocker

- **Production Firestore Seat shape remains unverified.** The diagnostic must prove active/authorized/entitled Seat state, provider configuration/binding, valid budget shape, and exactly one compatible active execute-capable connection with matching UID/workplace/project/Seat identity.
- **The live task executor is still v12.** The newer repository Edge implementation remains gated behind the production Seat proof.
- **Real provider continuation is unproven.** Repository continuation tests cannot substitute for the live exhaustion/checkpoint/continuation/completion chain.
- **Firestore index deployment remains pending for `teamai-seat-budget-runtime`.** The checked-in collection-group index must be deployed in the live Firebase project before the new runtime read boundary can be promoted.
- **Firestore field-level Rules hardening is not yet final.** The real Seat field inventory must be reconciled before narrowing authenticated owner writes.
- **Final spatial acceptance remains open.** The 10-seat envelope, R0 receiving choreography, R1/R2 articulation, responsive behavior, reduced motion, and accessibility interaction matrix need final evidence.
- **Merge authority remains separate.** #398 stays Draft until exact-head evidence, reconciliation, review, and human acceptance satisfy the governed promotion path.
