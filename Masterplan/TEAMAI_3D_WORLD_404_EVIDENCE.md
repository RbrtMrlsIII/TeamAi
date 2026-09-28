# PR #404 — Evidence Registry

**Historical implementation vehicle:** PR #404 (merged 2026-09-28)  
**Active continuation vehicle:** PR #424 frontend/029-spatial-world-continuation  
**Governing issue:** #405  
**Purpose:** one canonical evidence index for the 029 spatial reconstruction program.

This file is the **evidence ledger**, not a second roadmap. The detailed construction checklist remains in [TEAMAI_3D_WORLD_404_CHECKLIST.md](./TEAMAI_3D_WORLD_404_CHECKLIST.md), the ownership map remains in [TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md](./TEAMAI_3D_WORLD_404_AUTHORITY_MATRIX.md), and the broader construction contract remains in [TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md](../docs/TEAMAI_3D_WORLD_MASTER_CONSTRUCTION_PLAN.md).

## How the evidence system works

Use three layers, in this order:

1. **Successor PR** = newcomer-readable navigation and current-state summary for the post-#404 continuation; PR #404 remains historical provenance.
2. **Masterplan/** = durable execution status plus evidence references.
3. **Source / tests / CI artifacts** = primary proof.

A checkbox is a **status marker**, not the proof itself. A proof claim is admissible only when it points to a concrete source, test, exact-head run, artifact, or controlled runtime observation.

Evidence state remains:

IMPLEMENTED → REPOSITORY-VERIFIED → LIVE-DEPLOYED → RUNTIME-PROVEN → HUMAN-ACCEPTED

A higher state does not follow automatically from a lower one.

## Historical latest validated spatial implementation anchor

> This anchor belongs to the merged PR #404 lineage. It must not be treated as current continuation proof. The successor PR must establish a fresh exact-head evidence record before new acceptance claims.


- **latest validated spatial implementation head from the pre-continuation evidence ledger:** f4132eb5e3f6c5d730d698a6cbf6d72586e514cc

## Current continuation evidence state

- **Active vehicle:** PR #424 `frontend/029-spatial-world-continuation`
- The opening #424 documentation commits are continuation routing/evidence reconciliation; the material-authority commits are the first source behavior change in this continuation.
- Historical #404 evidence remains immutable provenance and must not be relabeled as #424 proof.
- Fresh exact-head evidence is required after the S24 source/public change, including Governance, Full-System, Security, Deep Security, and Canonical Browser validation.
- The current public deployment remains the merged `main` surface until #424 is promoted and merged; no exact deployed-artifact claim is being inferred from this Draft PR.

- **historical main at that validation point:** 76da305f0ec3efb3d368b22fb70748f0051f4d15
- **at that validation point:** #404 was **290 commits ahead / 0 behind**
- **PR state:** OPEN / DRAFT / GitHub reports mergeable
- **full project tests:** **1,117 passed / 0 failed / 0 skipped**
- **canonical browser verification:** **PASS, 76 passed / 4 skipped**
- **security/governance checks:** PASS
- **review-readiness:** SKIPPED because the PR remains Draft. This is lifecycle state, not approval.
- **evidence note:** later documentation-only commits may advance the branch head without changing this implementation anchor.

## Evidence index

### E404-BASE — branch and authority reconciliation

**Claim:** The current spatial branch has been reconciled to current main without mixing advisory-control-plane work into the spatial implementation.
