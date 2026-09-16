# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

Post-#346 session and control-plane reconciliation

## Status

IN PROGRESS — Draft session-truth PR

## Objective

Make the live session and current-slice documents match repository truth after #346 and #348 merged. #346 is not an open Draft. #344 remains Draft and unpromoted. Leftover control-plane and delivery work is the frontier, not "finish 346".

## Dependencies

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `Masterplan/NEXT_SLICES.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/governance/repository-synchronization/SKILL.md`
- Issue #347
- Issue #133
- Issue #278
- PR #344 remains Draft and unpromoted
- PR #349 is a leftover Vercel Draft and is not current delivery authority while `vercel.json` already exists on `main` via #348

## Verification

- canonical six-surface synchronization
- `build-system/scripts/repository-canonical-governance-audit.py`
- document-migration tests
- no runtime, Hero replacement, C8, C9, or C10 claim

## Current blocker

Session files on `main` still describe #346 as Draft. That is the recovery trap this slice closes. After merge, leftover Issue #347 control-plane items, #349 stale/draft overlap, and #344 promotion gates remain; they are not this slice. Do not promote #344 from this slice.

<!-- session-reconciliation marker: post-346 truth -->
