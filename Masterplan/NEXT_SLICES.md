# NEXT SLICES — current slice

**Role:** exactly one current execution frontier. Historical queues do not belong here.

## Current Slice

Post-#346/#348 control-plane reconciliation, then TEAM-EXPERIENCE-029 progression

## Status

IN PROGRESS — #346, #348, #351, and #353 merged; #352 governance reconciliation remains active

## Objective

Maintain canonical repository/session truth after the merged governance and delivery changes, harden the Draft-versus-Ready validation lifecycle, and continue TEAM-EXPERIENCE-029 from the canonical frontier without reviving retired authorities or provider-specific delivery dependencies.

## Dependencies

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `Masterplan/NEXT_SLICES.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `skills/governance/repository-synchronization/SKILL.md`
- `skills/governance/machine-builder/SKILL.md`
- `skills/governance/nemotron-copilot-review/SKILL.md`
- Issue #133
- Issue #278
- Issue #347
- PR #353 is the merged machine candidate and remains non-production

## Verification

- canonical authority and retired-reference audit
- current session/control-plane documentation consistency
- validation lifecycle checks for Draft and Ready states
- exact-head project, security, and browser verification for substantive changes
- migration invariant tests and full project verification
- model-assisted review may provide advisory findings only after the required exact-head validator workflows complete successfully; pending or failed execution evidence must block model invocation

## Current blocker

Complete the post-merge control-plane reconciliation without reintroducing retired authorities or treating skipped downstream validation as proof. TEAM-EXPERIENCE-029 remains incomplete at C8/C9/C10, and the merged #353 machine candidate still requires the remaining product acceptance gates before any production Hero replacement decision.

<!-- #352 validation-lifecycle synchronization: substantive Draft validation remains active; review-readiness is promotion-stage; skipped downstream jobs are not proof of pass. -->
<!-- #357 Nemotron copilot review: advisory model review is a verification aid, not an authority or merge substitute. -->
<!-- #361 execution-aware review: model invocation is downstream of required exact-head validator success and current Issue/governance context. -->
