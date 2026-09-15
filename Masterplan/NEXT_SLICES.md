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
- browser verification remains a separate PR #344 promotion gate

## Current blocker

#346 remains Draft until canonical references are reconciled, old validators are either retired or reduced to one non-overlapping evidence role, Issue #133 is migrated to the new merge discipline, and fresh CI proves the replacement invariants.
