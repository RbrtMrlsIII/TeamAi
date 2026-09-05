# TeamAi Branch / Field Reconciliation Map

**Status:** ACTIVE GOVERNANCE MAP  
**Baseline:** `main` at `2e4f90f005e59a371ccf19ed305ff4e6c6f11bd2`

## Canonical rule

`main` is the assembled canonical source state. Branches are development, review, evidence, recovery, or temporary working surfaces. Git commits and merged pull requests preserve historical trace; a branch does not need to remain alive solely to preserve provenance.

## Field boundaries

| Field | Branch family | Owns | Must not own |
|---|---|---|---|
| Frontend | `field/frontend-*` | visual contract, spatial composition, frontend validators, browser-facing presentation | backend authority, scheduler, Firestore, PayPal, entitlement mutation |
| Backend | `field/backend-*` / `team-backend-001/*` | runtime/state/provider/commerce execution contracts and backend verification | visual authority, Product Law, direct provider-to-provider orchestration |
| Governance | `field/governance-*` plus canonical governance docs | Product Law, Masterplan, Policy/ORUCAVEAM, skills, authority/recovery records | implementation authority outside approved canonical documents |
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

PR #43 (Command Deck finishing/reconciliation) is merged into `main` as `2e4f90f005e59a371ccf19ed305ff4e6c6f11bd2`. Its branch `field/frontend-command-deck-reconciliation-v1` is therefore no longer an active work field and is a **MERGED** cleanup candidate after lineage is verified.

The branch inventory contains a small set of active/current field lines plus a much larger historical/specialized set from 029, recovery, backend, CI, documentation, and stabilization work. The next cleanup pass should classify each branch before any deletion request.

## Immediate field posture

- `field/frontend-command-deck-reconciliation-v1` — **MERGED**; PR #43 merged.
- `field/branch-reconciliation-map-v1` — current governance-map working line; PR #44 uses this branch and its validations have passed on the reconciled tip.
- No empty permanent field branches are required. Create `field/frontend-*`, `field/backend-*`, `field/governance-*`, or `field/verification-*` only when real work begins.
- `field/integration-*` is temporary by definition and exists only for active reconciliation.

## Safety boundaries

- Do not resume Vercel.
- Do not change Firestore authority in this slice.
- Do not rewrite Git history.
- Do not delete historical evidence without separately verified lineage and an explicit destructive action.
- Frontend field work may define and validate contracts for backend-facing UI, but must not become backend execution authority.
