## Repository change contract

- Governing Product Law concept: <!-- `Product_Law/PRODUCT_LAW.md` path + section -->
- Masterplan checklist item: <!-- `Masterplan/MASTERPLAN.md` item -->
- Current slice: <!-- `Masterplan/NEXT_SLICES.md` -->
- Owning Issue: <!-- issue -->
- Skill routing: <!-- concrete paths from `docs/SKILL_WIRING.md` -->
- ORUCAVEAM: <!-- applicable letters -->
### Draft proof target

<!-- what this PR is trying to prove -->
- Claimed scope: <!-- exact behavior/change -->
- Verification/evidence: <!-- exact scope -->
- Limitations: <!-- exact unproven boundary -->

## Canonical synchronization

- [ ] `AI_ASSISTANT_READ_ME.md` updated for every substantive governed session.
- [ ] `Masterplan/MASTERPLAN.md` updated when checklist order/state changed.
- [ ] `Masterplan/NEXT_SLICES.md` updated when the current slice changed.
- [ ] `Product_Law/WIRING.md` updated when field ownership/purpose changed.
- [ ] `docs/SKILL_WIRING.md` and the owning Skill updated when procedure/routing changed.
- [ ] `PRODUCT-KNOWLEDGE.md` updated only for validated reusable learning.
- [ ] Retired material preserved in `docs/archive/` or `handover/` and removed from active routing.

## Review-readiness handoff

- [ ] The declared **Draft proof target** is the specific behavior this PR is proving, not the whole owning Issue.
- [ ] Verification/evidence claims refer to the exact current PR head; historical runs are identified as historical context.
- [ ] Open Issue checklist items, downstream production gates, and future slices are listed as limitations/observations unless they materially prevent the PR's own proof target.
- [ ] The PR is still **Draft** while required substantive exact-head validation is running or incomplete.
- [ ] **Ready for review** is a lifecycle promotion step after the required substantive validation set is successful on the exact head; it does not itself mean merge authorization.
- [ ] AI advisory review is downstream evidence only and never replaces `review-readiness`, independent human approval, or normal merge authorization.

## Validation / promotion

- [ ] Substantive PR begins as **Draft**.
- [ ] Full PR `base...head` is the governance synchronization scope.
- [ ] Existing validation conflicts were classified as retained, obsolete, or replaced before assertions changed.
- [ ] No validator was weakened merely to obtain green CI.
- [ ] No Product Law, identity, authorization, scheduler, entitlement, commerce, or durable-state authority was moved into presentation code.
- [ ] No auto-merge is enabled, used, or relied upon for product changes.
- [ ] One slice is not treated as one PR or one merge requirement.
- [ ] Ready-for-review occurs only after required checks, evidence, canonical synchronization, and governing review conditions pass.
