# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

Repository Governance Foundation Reconciliation

## Status

IN PROGRESS — PR #346 DRAFT

## Objective

Complete the governance migration so future development can expand or replace the 3D Hero without reviving stale authorities, regressing protected invariants, or losing evidence. Establish `Product_Law/` and `Masterplan/` as the canonical roots, retire live `HandOver.md` and `Endorsement.md`, unify Skill routing, reconcile Issue #133, and make governance validation prove the whole draft PR target.

## Dependencies

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `Masterplan/NEXT_SLICES.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/governance/repository-synchronization/SKILL.md`
- `skills/governance/machine-builder/SKILL.md`
- Issue #133
- Issue #278
- PR #344 remains Draft and unpromoted

## Verification

- canonical root and retired-reference audit
- PR base/head synchronization audit
- governance validator tests
- migration invariant tests
- project tests plus typecheck/build/backend authority verification
- exact-head browser verification for any user-visible claim

## Current blocker

Fresh exact-head verification for #346 is not yet green. The latest completed workflow quartet was attached to the prior workflow SHA rather than the PR's current head, so it is not admissible as current-head proof. Migration-layer assertions and stale active-document authority pointers have been the known validation debt; no backend/typecheck/security/browser regression has been demonstrated. Continue reconciling the active graph until Governance Integrity and Full-System Verification both pass on the same current PR head. Do not promote or merge #344 from this slice.

<!-- #348 canonical synchronization marker: proof-target surface -->
<!-- #351 canonical synchronization marker: retired Vercel integration removed from active governance/delivery surfaces. -->
