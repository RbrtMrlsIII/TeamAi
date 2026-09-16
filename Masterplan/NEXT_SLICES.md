# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

Post-merge delivery verification and TEAM-EXPERIENCE-029 continuation

## Status

IN PROGRESS — #346 and #348 merged; #344 remains Draft

## Objective

Maintain canonical repository/session truth after the merged governance foundation (#346) and post-merge delivery/runtime change (#348). Verify the production delivery path, retire stale recovery references, keep the Machine Hero candidate isolated and unpromoted, and continue TEAM-EXPERIENCE-029 from the canonical Masterplan frontier without reviving retired authorities.

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
- Issue #347
- PR #344 remains Draft and unpromoted

## Verification

- canonical authority and retired-reference audit
- current session/control-plane documentation consistency
- production Vercel runtime verification for `/`, `/health`, `/hero/`, and `/spatial/`
- exact-head browser verification for #344 only after its own current-head gates are established
- project tests, typecheck/build, security, and governance evidence for any substantive change

## Current blocker

Production route-content verification remains dependent on the authenticated Vercel runtime/browser path. PR #344 also has independent machine-core Playwright failures and must remain Draft until fresh current-head browser evidence proves the candidate contract. Continue 029 work only from this canonical frontier; do not promote #344 from this slice.
