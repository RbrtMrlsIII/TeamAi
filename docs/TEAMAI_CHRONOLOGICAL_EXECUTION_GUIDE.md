# TeamAi Chronological Execution Guide

**Status:** RECOVERY GUIDE — current `main` vs plan vs Issues  
**Date:** 2026-09-13  
**HEAD this guide was written against:** `41f2445` (merge of [#297](https://github.com/RbrtMrlsIII/TeamAi/pull/297); also includes [#301](https://github.com/RbrtMrlsIII/TeamAi/pull/301))  
**Not Product Law. Not a second #278 or #284 ledger. No 029-release claim.**

## Purpose

Give a new or resumed session one place to answer:

```text
what is the standing chronological program?
what does the plan still require?
what is actually true on current main?
which open Issue owns the remaining work?
what is closed / superseded and must not be reopened as a competing queue?
```

Durable product meaning stays in `PRODUCT_LAW.md`. Chronological gates stay in `MASTERPLAN.md`. 029 execution detail stays in Issue **#278**. Backend execution detail stays in Issue **#284**. This file is the **cross-track map** between those authorities and live GitHub.

Older decision order lives in [`docs/CHRONOLOGY.md`](./CHRONOLOGY.md). Compact recovery index: [`docs/TEAMAI_CURRENT_STATE.md`](./TEAMAI_CURRENT_STATE.md).

---

## How to use this file

1. Reconstruct authority: Product Law → Masterplan → Policy/ORUCAVEAM → Skill Wiring.
2. Read this guide for *where we are*.
3. Open only the owning Issue for remaining work. Do not treat this table as a new checklist to execute blindly.
4. Re-read GitHub HEAD, Issue bodies, and CI before claiming a row is still true. This file ages; `main` does not wait.

State vocabulary (do not collapse):

`PLANNED → IMPLEMENTED → VERIFIED → RUNTIME-PROVEN → COMPLETED → ENDORSED`

A merged PR is repository truth. It is not automatically deployed-browser proof, owner acceptance, or release.

---

## 1. Standing chronological program

This is the only program order. Later work must not contradict an earlier gate without explicit reconciliation.

```text
TEAM-EXPERIENCE-028
        ↓
PHASE 0 CLEAN BASELINE
        ↓
TEAM-BACKEND-001          (bounded backend foundation — ENDORSED)
        ↓
TEAM-BACKEND-002          (live backend frontier — ACTIVE ledger #284)
        ↓
TEAM-EXPERIENCE-029
    C0 product-shape endorsement
    C1 canonical reconciliation
    C2 classic public entrance
    C3 explicit 3D-world entry + return
    C4 coherent nav + Settings
    C5 camera vocabulary reduction
    C6 world-baseline zoom-out / continuous travel
    C7 proportional orbit
        → complete required tree/branch/division semantics
        → adaptive geometry + expansion
        → real connection topology
        → turn-loop contribution electricity
    C8 authenticated / server-authorized workspace
    C9 desktop + phone product acceptance
    C10 ProMax refinement
```

Inside 029, Masterplan now reads the structural dependency as:

```text
C0–C5 surface foundations
  → C6–C7 camera/travel foundation
  → tree/branch/division machine
  → connection topology
  → turn-loop contribution
  → C8 auth workspace
  → C9 acceptance
  → C10 ProMax
```

ProMax must not hide unfinished semantics, topology, or auth.

---

## 2. Current Issue topology (live)

These are the **only open Issues** on 2026-09-13. Everything else is closed historical lineage unless a new Issue is opened.

| Issue | Role | Use it for | Do not use it for |
|---|---|---|---|
| **[#278](https://github.com/RbrtMrlsIII/TeamAi/issues/278)** | **029 product-experience execution ledger** | Entrance → guest world → auth transition → tree/branch machine → C8/C9/C10 | Backend runtime, PayPal, Edge census |
| **[#284](https://github.com/RbrtMrlsIII/TeamAi/issues/284)** | **TEAM-BACKEND-002 durable backend ledger** | Eight-function Edge freeze, remaining backend gaps, provider/runtime, Gate 4 | Hero camera/tree polish |
| **[#133](https://github.com/RbrtMrlsIII/TeamAi/issues/133)** | Governance / merge-gate contract | PR-only merge, validation-change protocol, archive rules. DoD is already checked. | Product-shape work |
| **[#204](https://github.com/RbrtMrlsIII/TeamAi/issues/204)** | Conn-3 GitHub OAuth bind + post-install browser continuation | Trusted Edge mint of Firebase UID ↔ installation_id; browser return path | Hero live bind, Seat GitHub tools |
| **[#83](https://github.com/RbrtMrlsIII/TeamAi/issues/83)** | Future light-skeuomorphic / theme-lighting track | Visual/material pass **after** #278 structural machine is further along | Solving camera/tree/surface gaps |
| **[#295](https://github.com/RbrtMrlsIII/TeamAi/issues/295)** | Open discussion (not a ledger) | Questions, disagreements, half-formed checks | Binding requirements or EXECUTED records |
| **[#296](https://github.com/RbrtMrlsIII/TeamAi/issues/296)** | Product Knowledge promotion | Distill already-settled 029/backend learnings into `PRODUCT-KNOWLEDGE.md` | New roadmap |

Open PRs at time of writing: **none** (docs PRs [#297](https://github.com/RbrtMrlsIII/TeamAi/pull/297) and [#301](https://github.com/RbrtMrlsIII/TeamAi/pull/301) are merged).

**Comment rule:** on #278 and #284, comments are evidence-only (`EXECUTED` / diagnosis / observed data). Guidance belongs in the Issue body or canonical docs. Discussion belongs on #295.

---

## 3. Gate-by-gate: plan vs current `main` vs Issue

### 3.1 Pre-029 / backend program

| Gate | Plan still says | Current `main` | Owning Issue |
|---|---|---|---|
| TEAM-EXPERIENCE-028 | Historical predecessor | Closed as program; do not reopen | Historical |
| PHASE 0 CLEAN BASELINE | Required before backend | Historical baseline | Historical |
| TEAM-BACKEND-001 items 1–6, 8–12, 15–16 | Foundation + commerce + bounded endorsement | **ENDORSED** for recorded scope | Closed #48 (lineage) |
| TEAM-BACKEND-001 **#7 Gate 4** emulator/rules | Must not infer PASS | **PARKED / NOT PROVEN** | #284 remaining gap 9 |
| TEAM-BACKEND-001 **#13** provider/runtime | Connect only after auth/task contracts | `teamai-task-execute` is real lease/result path with **`stub-edge-runtime`** provider stage | #284 remaining gap 6 |
| TEAM-BACKEND-001 **#14** security/failure/timeout/recovery | Full verification | **Not complete** | #284 |
| TEAM-BACKEND-001 **#17** release hold on 029 | Lift only after BLOCKS_029 gates | Hold remains; **029 presentation work is allowed** as presentation, not as backend-complete product | Masterplan + #278/#284 |
| TEAM-BACKEND-002 | Live eight-function Edge surface + remaining gaps | Census frozen 2026-09-12; obsolete `paypal-webhook` removed; lease-field fix merged [#287](https://github.com/RbrtMrlsIII/TeamAi/pull/287) | **#284** |
| Conn-1 | GitHub App least privilege | Merged historical | Closed #200 |
| Conn-2 | Webhook + UID lookup | Merged; not Hero live bind | Closed #201 |
| Conn-3 | Trusted OAuth mint + browser continuation | Edge deployed; **browser/product proof pending** | **#204** (absorbs closed #244) |

### 3.2 029 C0–C10 vs `main`

| Gate | Plan | Current `main` (implementation) | Proof / remaining | Issue |
|---|---|---|---|---|
| **C0** shape | Classic entrance → explicit 3D → auth workspace → C9 → C10 | **ENDORSED**. Command Deck is **retired as a product surface** (2026-09-12), not the authenticated workspace. Intended funnel is Entrance → 3D world/machine → Workspace Center. | Decision recorded in Product Law amendment + #278 §1 | #278 |
| **C1** maps agree | Masterplan, current-state, next-slices, Vision, census agree | Indexes exist and are coupled by governance-drift. Some recovery docs lag live routes (fix in the same PRs that notice them). | Ongoing; not a feature slice | #278 + #133 |
| **C2** classic entrance | First paint is a website | `public/index.html` classic shell; Pages publishes `public/` at **site root** ([#279](https://github.com/RbrtMrlsIII/TeamAi/pull/279), [#299](https://github.com/RbrtMrlsIII/TeamAi/pull/299)); first-paint dedup [#282](https://github.com/RbrtMrlsIII/TeamAi/pull/282) | Foundation merged. Fresh deployed visual acceptance still C9 | #278 |
| **C3** explicit 3D + return | Deliberate Enter 3D world; return to website | Enter / Website controls exist; `/hero/` is the world-route alias (`experience-rebaseline.js`) | Foundation merged. Auth choreography in §2 of #278 is **not** implemented | #278 |
| **C4** coherent nav + Settings | One world nav owns Settings | `.world-navigation` + Menu/Settings after [#281](https://github.com/RbrtMrlsIII/TeamAi/pull/281) | Authenticated Settings taxonomy in #278 §2 is still conceptual | #278 |
| **C5** camera vocabulary | Small understandable set; no operator wall | Six-button `[data-camera]` wall **removed** (#281). `HERO_LOW_ORBIT` / `TURN_FOLLOW` stay retired | Do not recreate the wall. Low-feeling poses: diagnose active path (`SEAT_CLOSE` / `TEAM_ORBIT`) | #278 |
| **C6** zoom / travel | Return to world baseline; later **continuous** pull-back | Code fallback to `HERO_WIDE` at `NAV_ZOOM_MAX` (#281). Destination correction ≠ continuous tree travel | Branch-level subject targeting **incomplete**. Continuous travel **open** | #278 |
| **C7** proportional orbit | Natural swipe/pointer direction | Implementation present in assembled runtime | Deployed browser acceptance still required. Stale `inverse*` names must not become authority | #278 |
| **Tree machine** | Semantic trees/branches, payload-driven geometry, expansion lifecycle | Census baseline merged [#283](https://github.com/RbrtMrlsIII/TeamAi/pull/283); Seat truth baseline merged [#297](https://github.com/RbrtMrlsIII/TeamAi/pull/297). `TREE-HERO-SEAT` is **PARTIAL**. `TREE-DOMAIN` and `TREE-SKILL-RESPONSIBILITY` **INCOMPLETE** | No invented census rows for undefined trees | #278 |
| **C8** auth workspace | Firebase identity + server authorization; restore Workplace/Project/Seats | Auth UI is **presentation-only**. No client Firestore SDK in the shipped browser. Login/Sign up belong to guest gateway, not Settings | **Do not grant entitlement from flags/DOM/Hero state** | #278 + #284 |
| **C9** acceptance | Desktop + phone + owner | Playwright covers `/` classic, `/hero/` world, phone overlay split [#298](https://github.com/RbrtMrlsIII/TeamAi/pull/298) | **BLOCKING**. CI ≠ owner acceptance | #278 |
| **C10** ProMax | Refine a correct machine | **Not started** | Gated by C9. #83 is the later visual track, not a C10 substitute | #83 after #278 |

### 3.3 Publication / surfaces on current `main`

GitHub Pages is validation-only. Firebase Hosting remains web-delivery authority. Vercel stays cut off.

| Route | Plan / #278 | Workflow on `main` | Live meaning |
|---|---|---|---|
| `/` | Canonical public Entrance | `public/` copied to Pages **root** | Classic first paint |
| `/hero/` | Hero/world compatibility | `public/` copied again under `/hero/` | Same SPA; JS treats `/hero/` as world route |
| `/spatial/` | Retired Command Deck; historical links only | **Not published** after [#299](https://github.com/RbrtMrlsIII/TeamAi/pull/299) | Source remains in `frontend/spatial/` for history; not an active destination |

Local `npm start` **redirects** `/spatial/` → `/hero/` (same as product law). Sub-paths under `/spatial/` may still serve static fixtures (e.g. backend-validator contract). Deck composition e2e suites are **retired/skipped**; `spatial-retired.spec.ts` is the active contract. Source under `frontend/spatial/` remains history, not a product door.

Command Deck: **retired as product concept and published surface**. Useful surviving behavior must be re-owned by the spatial/world machine. Do not delete history. Do not build new work *as* Command Deck.

---

## 4. What recently landed on `main` (execution chronology)

Newest last. These are merged facts, not a to-do list.

| When (UTC) | PR | What it actually changed |
|---|---|---|
| 2026-09-11 | [#272](https://github.com/RbrtMrlsIII/TeamAi/pull/272) / [#273](https://github.com/RbrtMrlsIII/TeamAi/pull/273) | Docs: C0–C10 rebaseline before more implementation |
| 2026-09-11 | [#274](https://github.com/RbrtMrlsIII/TeamAi/pull/274) | C0–C10 foundation in `public/` (classic entrance, Enter 3D, world nav) |
| 2026-09-11 | [#275](https://github.com/RbrtMrlsIII/TeamAi/pull/275) | Repository-owned assembled `public/hero-flex.js` — no live `raw.githubusercontent.com` loader |
| 2026-09-12 | [#279](https://github.com/RbrtMrlsIII/TeamAi/pull/279) | Pages front door = classic `public/`, not Command Deck |
| 2026-09-12 | [#281](https://github.com/RbrtMrlsIII/TeamAi/pull/281) | Remove six-button wall; C6 `HERO_WIDE` fallback; homepage/phone Playwright |
| 2026-09-12 | [#282](https://github.com/RbrtMrlsIII/TeamAi/pull/282) | Classic first-paint: hide duplicate `.hero-copy` / `.far-environment` |
| 2026-09-12 | [#283](https://github.com/RbrtMrlsIII/TeamAi/pull/283) | 3D Hero tree census + expansion contract |
| 2026-09-12 | [#287](https://github.com/RbrtMrlsIII/TeamAi/pull/287) | Backend: preserve typed task fields on lease write |
| 2026-09-12 | [#289](https://github.com/RbrtMrlsIII/TeamAi/pull/289) / [#290](https://github.com/RbrtMrlsIII/TeamAi/pull/290) | Backend-002: freeze/reconcile eight active Edge functions |
| 2026-09-12 | [#291](https://github.com/RbrtMrlsIII/TeamAi/pull/291) | Highest-stake product-law experience baseline docs |
| 2026-09-12 | [#293](https://github.com/RbrtMrlsIII/TeamAi/pull/293) | Command Deck retirement docs / spatial baseline freeze |
| 2026-09-13 | [#298](https://github.com/RbrtMrlsIII/TeamAi/pull/298) | Phone overlay breakpoint split (spatial-parts vs seat-stack) |
| 2026-09-13 | [#299](https://github.com/RbrtMrlsIII/TeamAi/pull/299) | Stop publishing `/spatial/` as a live Pages surface |
| 2026-09-13 | [#300](https://github.com/RbrtMrlsIII/TeamAi/pull/300) | `AI_ASSISTANT_READ_ME.md` bootstrap / governance preflight |
| 2026-09-13 | [#301](https://github.com/RbrtMrlsIII/TeamAi/pull/301) | Chronological execution guide — main vs plan vs Issues recovery map |
| 2026-09-13 | [#297](https://github.com/RbrtMrlsIII/TeamAi/pull/297) | TREE-HERO-SEAT census truth baseline (docs/csv/json/xml) |

Why “the website didn’t change” for several days: work was landing under `/hero/` while Pages root still served Command Deck. That mismatch is **closed on `main`** by #279 + #299. Remaining owner-visible gaps are machine/camera/auth/C9, not the wrong front door.

---

## 5. Closed Issues that must not become a second queue

| Closed Issue | Why it is closed | Where the remainder lives |
|---|---|---|
| #271 | Earlier 029 planning parent | #278 |
| #276 | Command Deck **Pages publication** | Retired by #279/#293/#299; do not read as “delete `frontend/spatial/`” |
| #277 | Hero flex consolidation | #275 |
| #258 | Residual Layer A/B / chrome / subject-lock | Merged #259–#266; camera remainder in #278 |
| #260 | User-directed validation protocol | Consolidated into **#133** |
| #256 | Hierarchy trees guide | Historical; census + #278 |
| #244 | Conn-3 post-install return | Absorbed by **#204** |
| #42 | Mandatory human approval before merge | **Superseded by #133** |
| #48 | TEAM-BACKEND-001 validation gate | Bounded endorsement; residuals on #284 |
| #201 | Conn-2 | Merged; not Hero live bind |
| Vision/P/R/F/Cam/SP issues (#70–#214 family) | Historical implementation lineage | Do not treat green history as C9 |

---

## 6. Remaining honest gaps (recovery, not a sprint board)

**CI note (2026-09-13):** After #299, Playwright was red on `main` because Deck composition suites still required `[data-deck-root]` on `/spatial/`. Those suites are retired/skipped in favor of `spatial-retired.spec.ts`. That unblocks required checks; it is **not** C9 owner acceptance.

Work **#278** if the gap is product-experience:

1. Guest Login/Sign up **choreography** (orbit stop → expand defined trees → center workspace → small auth surface). Not built.
2. Authenticated restore of Workplace / Project / actual Seats. Presentation-only today.
3. Branch-specific camera subject (seat lock exists; deeper branch targeting does not).
4. Continuous spatial zoom-out / tree-to-tree travel (destination snap is not the final contract).
5. Complete required trees/branches/divisions, payload-driven expansion, real connection topology, turn-loop electricity.
6. Integrated desktop + phone **owner** acceptance (C9), then C10.

Work **#284** if the gap is backend:

1. Real provider invocation (Masterplan #13) — still stub.
2. Full security/failure/timeout/cancellation/recovery (Masterplan #14).
3. Gate 4 emulator PASS (Masterplan #7).
4. Shared Edge module synchronization, GitHub OAuth token lifecycle/CSRF, explicit secrets deny, main-to-live deploy proof, PayPal mapping vs 67 subscribed events, client write schema when a real client write contract exists.

Work **#204** if the gap is Conn-3 browser continuation.

Do **not** start **#83** (light-skeuo environment) to compensate for missing tree/camera/auth truth.

Do **not** start C10.

Do **not** wire live Command Deck writes. The Deck is retired as a destination.

Do **not** invent census rows, backend mappings, or geometry for undefined trees.

---

## 7. Agent stop conditions

Stop and reconcile instead of coding when:

- Product Law, Masterplan, #278/#284 body, and `main` disagree;
- a tree/branch is undefined and the change would fabricate identity;
- a test is being weakened to match a stale UI;
- the change would grant entitlement from client flags, Hero state, or DOM;
- Command Deck is being treated as the public door or the future workspace;
- C10/ProMax is proposed before C9;
- a #278/#284 comment is being treated as a work queue;
- Gate 4 / provider-runtime / 029-release is being inferred from docs or CI green.

---

## 8. Pointers

| Need | Open |
|---|---|
| Product authority | `PRODUCT_LAW.md` |
| Chronological gates | `MASTERPLAN.md` |
| This cross-track map | `docs/TEAMAI_CHRONOLOGICAL_EXECUTION_GUIDE.md` |
| Older decision order | `docs/CHRONOLOGY.md` |
| Compact recovery index | `docs/TEAMAI_CURRENT_STATE.md` |
| 029 ledger | Issue #278 |
| Backend ledger | Issue #284 |
| Merge/validation protocol | Issue #133 |
| Tree census | `docs/TEAMAI_3D_HERO_TREE_CENSUS.md` (+ csv/json/xml) |
| Edge census | `docs/BACKEND_002_SUPABASE_ACTIVE_FUNCTION_CENSUS_2026-09-12.md` |
| Discussion | Issue #295 |

**No 029-release claim.**
