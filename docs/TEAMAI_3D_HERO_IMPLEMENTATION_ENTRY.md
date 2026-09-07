# TeamAi 3D Hero Implementation Entry

Status: blocked until the `MASTERPLAN.md` TEAM-EXPERIENCE-029 release hold is explicitly lifted.

## Entry checklist

- [ ] Re-read `PRODUCT_LAW.md` and active `MASTERPLAN.md` gate.
- [ ] Confirm TEAM-BACKEND-001 completion/endorsement and required evidence.
- [ ] Load `docs/SKILL_WIRING.md` and the smallest applicable ORUCAVEAM + frontend spatial skill bundle.
- [ ] Revalidate the canonical `frontend/spatial/theme-root.css` as the sole theme authority.
- [ ] Start with Issue #84 only; do not combine the adapter with the environment or contribution choreography in the first implementation slice.
- [ ] Add deterministic static verification for the adapter before visual expansion.
- [ ] Then advance #85, #86, #88 and #89 sequentially, preserving the prior slice evidence.
- [ ] Advance #81 only after the lighting/material foundation is stable.
- [ ] Run browser smoke and visual review at every spatial gate; capture evidence separately from code.
- [ ] Complete HandOver/Endorsement before claiming a slice complete and only then record reusable knowledge in `PRODUCT-KNOWLEDGE.md`.

## Non-negotiable renderer boundary

The spatial renderer may present state and interaction intent. It may not become scheduler, Firestore, authorization, entitlement, provider-runtime, credential, or direct provider-to-provider authority.
