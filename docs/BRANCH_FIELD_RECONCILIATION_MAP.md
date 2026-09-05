# TeamAi Branch / Field Reconciliation Map

**Status:** ACTIVE GOVERNANCE MAP  
**Baseline:** `main` at `72613b93cbe59c861ceefd2361a416b7afd4e2f1`

## Canonical rule

`main` is the assembled canonical source state. Branches are development, review, evidence, recovery, or temporary working surfaces. Git commits and merged pull requests preserve historical trace; a branch does not need to remain alive solely to preserve provenance.

## Field boundaries

| Field | Branch family | Owns | Must not own |
|---|---|---|---|
| Frontend | `field/frontend-*` | visual contract, spatial composition, frontend validators, browser-facing presentation | backend authority, scheduler, Firestore, PayPal, entitlement mutation |
| Backend | `field/backend-*` / `team-backend-001/*` | runtime/state/provider/commerce execution contracts and backend verification | visual authority, Product Law, direct provider-to-provider orchestration |
| Governance | `field/governance-*` plus canonical governance docs | Product Law, Masterplan, Policy/ORUCAVEAM, skill wiring, recovery rules | implementation authority outside approved canonical documents |
| Verification | `field/verification-*` / `ci/*` | CI, browser smoke, package/integrity, evidence contracts | product/runtime authority |
| Integration | `field/integration-*` | temporary cross-field reconciliation | permanent source authority |

## Historical / specialized families

`arch/*`, `docs/*`, `docs-*`, `restore/*`, `checkpoint/*`, `chore/*`, `fix/*`, `ci/*`, `ui/*`, `backend/*`, `skill-*`, and `tmp/*` are historical or specialized work lines. They should not be treated as competing product roots.

## Classification before branch reuse or deletion

Every non-main branch must be classified against current `main` as one of:

- **ACTIVE-FIELD** — current work intentionally continues here.
- **MERGED** — its useful change is already represented in `main`.
- **SUPERSEDED** — its intended change was replaced by a later canonical PR/commit.
- **HISTORICAL-EVIDENCE** — retained only because it is useful provenance/checkpoint evidence.
- **DIVERGENT-REVIEW** — contains unique changes not yet reconciled; do not delete.

Classification is based on branch tip, PR lineage, merge state, and whether useful content is already represented in `main`; branch names alone are insufficient.

## Current observation

The current branch inventory contains one active field branch, `field/frontend-command-deck-reconciliation-v1`. The remaining inventory is dominated by historical 029, recovery, backend, CI, documentation, and stabilization lines.

The next cleanup operation should therefore separate **active field branches** from **historical/superseded branches**, then remove only the latter after lineage is verified. No destructive Git-history rewrite is part of this map.

## Vercel boundary

Vercel remains present as a non-authoritative platform. It is paused and must not be resumed without explicit approval. Vercel branch/deployment activity must not become a field authority or merge gate.

## Firestore boundary

Firestore write-authority ambiguity is intentionally deferred from this branch-map slice. Frontend validator/contract design may proceed first; the eventual Firestore authority reconciliation remains a separate backend/governance decision.
