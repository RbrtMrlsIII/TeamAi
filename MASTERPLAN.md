# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → ORUCAVEAM skills + field/domain skills + tool/system skills → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to concrete skill path(s) in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/README.md` is the skill-library README; it is not the canonical TeamAi wiring map.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## TEAM-BACKEND-001 — Backend Foundation

**Status:** IN IMPLEMENTATION.

### Chronological execution checklist
1. [x] Architecture/authority reconciliation encoded in executable service assertions.
2. [x] Firebase UID ownership hierarchy encoded in Firestore path contracts.
3. [x] Deterministic Web AI effective-skill resolution encoded; skills do not grant authorization.
4. [x] Durable task lifecycle and event/idempotency contract encoded.
5. [x] Firestore source configuration baseline wired: `firebase.json`, `firestore.rules`, `firestore.indexes.json`.
6. [x] Canonical Product Law, AI assistant recovery guide, Masterplan and backend evidence updated together.
7. [ ] Firebase emulator/rules verification remains environment-constrained/parked. Available source/configuration checks must not be converted into an inferred emulator pass, hosted pass, or production pass.
8. [x] Authorized Firebase project identity, live `(default)` Firestore database, Email/Password and Google Auth providers, and Firestore Rules deployment verified.
9. [x] Workplace → Project → Team/Solo → Seat persistence source slice implemented and live authenticated creation, independent Firestore verification, and repeat-call idempotency are evidenced.
10. [x] Trusted Supabase Edge runtime persistence slice implemented and configured with the Firebase service-account credential as the required Supabase Edge secret; authenticated execution, independent Firestore verification, and idempotency were exercised in the available environment.
11. [x] Gate 5B: server-owned PayPal ↔ TeamAi ↔ Firebase UID correlation contract implemented and direct source-contract validation passed.
12. [ ] PayPal live webhook receipt, business processing, and replay protection remain incomplete until dedicated environment evidence exists.
13. [ ] Provider/runtime invocation remains blocked until authorization and task contracts are complete.
14. [ ] Entitlement activation remains blocked until commerce correlation and product gates allow it.
15. [ ] Scheduler actor selection remains server-owned and is not browser-authoritative.
16. [ ] TEAM-BACKEND-002 items remain separately gated.
17. [ ] Only after all `BLOCKS_029` gates are evidenced: release hold on TEAM-EXPERIENCE-029.

**Important:** Checklist ticks are evidence labels for source and environment facts already recorded. They are not a 029 production-release claim.

### Gate 5B boundary — PASS

Gate 5B is **source-contract completion only**. No live PayPal transaction, webhook business processing, entitlement activation, or replay-protection completion claim is inferred from it.

## Pre-029 Planning Architecture — Canonical Product Capability

TEAM-EXPERIENCE-029 must be planned as the construction of the **canonical AI-team experience**, not merely a set of pages. The central product capability is a human-controlled web environment where multiple externally operated AI applications/providers can participate as configured team seats, exchange authorized work through durable structured state, make downstream work eligible through the TeamAi orchestrator, and use explicitly granted tools/plugins/integrations.

Detailed planning contract: `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`.

## TEAM-EXPERIENCE-029 — Spatial Theme and Visual System

**Status:** PLANNED PRODUCT-EXPERIENCE SLICE — presentation work is substantially inhabited on main; **029 production release is not claimed**.

The spatial theme is presentation and interaction treatment. It is not a replacement for TeamAi identity, Firestore state, scheduler authority, provider entitlement, permissions, approvals, commerce truth, or durable events. A theme mode change must remain a UI-state/configuration change and must not change canonical business meaning.

### Root-wiring guard before 029 coding

The UI is presentation and interaction over authoritative state and policy intents, not a new authority layer.

### Detailed planning contracts

- `docs/TEAM-EXPERIENCE-029_PLANNING_CONTRACT.md`
- `docs/TEAM-EXPERIENCE-029_CONTEXT_AND_ORCHESTRATION_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_COMMERCIAL_AND_CAPABILITY_MODEL.md`
- `docs/TEAM-EXPERIENCE-029_AI_CONNECTION_SEAT_CAPABILITY_LIFECYCLE.md`
- `docs/VISION.md` — product experience intent (entrance, ~45° machine baseline, tree/branch camera subject, chrome); not a Product Law rewrite; no 029-released claim
- `docs/TEAMAI_VISION_IN_AUTHORITY_CHAIN.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`

### Current 029 product-design execution order

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → skills/frontend/spatial/UI_UX-Promax-Skill.md + applicable 029/domain skills → UI/system implementation → verification → GitHub evidence/artifacts → HandOver → Endorsement → PRODUCT-KNOWLEDGE.md → repeat`

Any backend capability discovered during 029 must be routed through the owning backend/integration contract rather than embedded as browser authority.

## Product experience vision (intent pointer)

Canonical human-facing experience intent for public entrance, ~45° machine baseline, selected-tree camera subject, and presentation chrome lives in:

- `docs/VISION.md`

It sits **below** Product Law and this Masterplan: it does not create a new law family, does not claim 029 release, and does not authorize browser-side durable domain writes. Camera and hierarchy contracts remain the technical detail under that intent.

## Standing product rules

- Presentation never invents entitlement, scheduler choice, or durable auth.
- One theme root only.
- Green CI is necessary, not Endorsement of 029 release.
- Hero / canvas does not write Firestore, charge PayPal, or bind secrets.
