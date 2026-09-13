# MASTERPLAN — TeamAi Execution Authority Pointer

`PRODUCT_LAW.md` is the product authority. The full chronological Masterplan is maintained in the synchronized project package while this repository surface carries the active gates needed for agent recovery and execution.

## Current execution wiring

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → ORUCAVEAM skills + field/domain skills + tool/system skills → verification → evidence → HandOver / Endorsement → PRODUCT-KNOWLEDGE.md`

Every executable checklist item must resolve to concrete skill path(s) in `docs/SKILL_WIRING.md` or explicitly state why no skill is required. `skills/README.md` is the skill-library README; it is not the canonical TeamAi wiring map.

## Current chronological gate
`TEAM-EXPERIENCE-028 → PHASE 0 CLEAN BASELINE → TEAM-BACKEND-001 → TEAM-EXPERIENCE-029`

## Active state reconciliation — 2026-09-12

The backend clock has crossed the bounded TEAM-BACKEND-001 implementation/validation gate. Its remaining boundaries stay explicit. The spatial/product-experience clock is now governed by the owner-endorsed C0–C10 rebaseline described below.

- Firebase Rules emulator verification (Gate 4) remains **PARKED / NOT PROVEN** because a real emulator PASS is not present in repository evidence.
- `teamai-task-execute` remains runtime-proven only through its bounded authenticated path with `stub-edge-runtime`; real external provider invocation remains **OPEN / NOT PROVEN**.
- GitHub App installation is operator-confirmed; Conn-3 callback live deployment/browser proof remains **PENDING** and is not a Hero live bind.
- Seat connection/provider surfaces remain implementation/deployment surfaces rather than automatic product acceptance.
- PR #259 remains an important historical implementation baseline: CAM-R-RETIRE + ENT-T1/ENT-R2/R3 + CHR soft-hide. It is **not** the final product-shape authority after the owner-directed C0–C10 rebaseline.
- Historical checkpoints may retain earlier pending wording because they are evidence records. This active index is the current recovery map and must not rewrite historical evidence.

### Current connected Supabase deployment inventory — 2026-09-12

The connected TeamAi Supabase project (`srpgzzretfyqdsfclnuo`) currently reports exactly eight ACTIVE TeamAi Edge Functions. The precise inventory is frozen in `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md` and must remain synchronized with backend current-state records. The obsolete `paypal-webhook` deployment is absent from the connected runtime after operator deletion.

- `teamai-commerce-intent` v19
- `teamai-domain-bootstrap` v22
- `teamai-github-oauth-bind` v8
- `teamai-github-webhook` v7
- `teamai-paypal-webhook-v5c` v21
- `teamai-seat-connection-test` v7
- `teamai-seat-provider-bind` v7
- `teamai-task-execute` v12

This inventory is deployment evidence only. It does not upgrade source implementation into runtime proof, completion, endorsement, or release readiness.

## TEAM-BACKEND-001 — Backend Foundation

**Status:** ENDORSED for bounded recorded scope; residual evidence boundaries remain explicit.

See repository history and backend evidence docs for the full Gate checklist, skill-routing table, Gate 5B/5C boundaries, and hard completion rule. This surface carries the active recovery gates.

## Pre-029 Planning Architecture — Canonical Product Capability

TEAM-EXPERIENCE-029 must be planned as the construction of the **canonical AI-team experience**. Planning vs Working stages, user-intent preservation, orchestration, Team Leader/Summarizer, connection/seat lifecycle, plugin/MCP model, and Team Quality vs Tool Quality remain as previously recorded in this Masterplan and related contracts.

## TEAM-EXPERIENCE-029 — C0–C10 and structural machine

Owner-endorsed C0–C10 rebaseline with pre-C9 structural dependency on complete semantic tree/branch/division machine, adaptive geometry, continuous travel, connection topology, and turn-loop contribution layer. Issue #278 is the active 029 execution ledger. Tree census must stay synchronized. Command Deck is retired.

Construction direction remains:

`semantic identity → payload → division → expansion → topology → camera → interaction → electricity`

## Phone-viewport overlay collision fix — #298 (follow-up to #278)

`.spatial-parts`/`.hero-inspection` (`public/hero-parts.css`) and `.seat-stack` (`public/hero-seat-stack.css`) each had a breakpoint chain that only scaled the cards down in place at phone widths without separating them horizontally, causing their translucent cards to visually collide at ~390-420px viewports (the overlapping/blurred screenshots reported on #278). Fixed by docking `.spatial-parts`/`.hero-inspection` to the left edge at `<=520px` (instead of centered/scaled), hiding `.spatial-parts` entirely at `<=360px`, and reinforcing the right dock of `.seat-stack` at the same breakpoint. CSS positioning only; no JS/behavior change. Pending CI and owner browser confirmation at the reported viewport width; no 029-released claim.

## SEAT_CONNECTION vertical (presentation) — #306 / #278

First vertical deepen of `SEAT_CONNECTION` only: fixture payload (`CONNECTION_PAYLOAD_V1`), one parent-child fixture edge (`CONNECTION_EDGES_V1`: `SEAT_CONNECTION→SEAT_SHELL`), expanded helpers (`isConnectionExpanded`, `enrichHierarchySnapshot`) in `public/hero-connection-vertical.js`, and camera subject preference in `public/hero-cam2-tree-follow.js` (DETAIL when connection amount ≥ 0.85). Census status columns updated for fixture-edge / branch-subject-partial. Presentation only — not live bind, not electricity complete, not C9/C10. Hero-flex dataset/export wire-up may follow in a subsequent slice.

<!-- teamai residual: #306 SEAT_CONNECTION vertical presentation; no 029-released claim. -->
