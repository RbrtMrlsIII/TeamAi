# TEAM-EXPERIENCE-029 — Frontend Structural Inventory

**Status:** PRE-IMPLEMENTATION INVENTORY / RECONCILIATION RECORD  
**Authority:** Derived inventory for 029 planning; does not create UI or domain authority.

## Purpose

Record the frontend structures that actually exist before permanent Spatial Theme roots, field numbers, or page-local visual contracts are introduced.

This inventory is deliberately structural rather than visual. It answers **what frontend roots exist, where they live, and which existing mechanism owns them** before theme implementation begins.

## Governing rule

Do not invent a frontend field, root number, theme provider, token namespace, component hierarchy, or breakpoint scale solely because it is expected to exist in the future.

A permanent Spatial Theme root may be created only after the existing frontend structure has been inspected and reconciled against:

`PRODUCT_LAW.md → MASTERPLAN.md → POLICY.md / ORUCAVEAM → docs/SKILL_WIRING.md → spatial coordinator + bounded companion skills`

## Inventory method

Before each implementation slice:

1. Inspect the current repository tree and actual frontend sources (if any).
2. Identify HTML entrypoints/templates, CSS/style sources, JS/TS modules, shared components, layout shells, existing theme state, token declarations, responsive rules, accessibility behavior, and browser-facing entrypoints.
3. Trace each discovered visual/state mechanism to its owning root.
4. Record discrepancies such as duplicate theme state, duplicated token namespaces, page-local breakpoint systems, conflicting selectors, stale references, or structural coupling.
5. Establish the smallest edit boundary needed for the approved slice.
6. Update this inventory only with evidence from the current source tree.

## Root classification

Use these categories while inspecting real code:

| Classification | Meaning |
|---|---|
| Environment root | Global document/application environment, including document theme/color-scheme behavior. |
| Shell root | Application frame, global navigation, viewport/container ownership. |
| Primitive root | Shared visual primitives such as surfaces, panels, cards, controls, typography, status and elevation. |
| Interaction root | Shared state/transition behavior for visual interactions. |
| Layout root | Responsive and density rules owned by a shared layout mechanism. |
| Field root | A real functional UI structure found in source, not a predicted future page. |
| Verification surface | Browser-facing route or test target used by Playwright; never a visual authority. |

## Current source reality (2026-09-04 hygiene)

**No frontend application roots exist on `main` yet.** There is no `frontend/` tree, no `theme-root` CSS/TS, and no HTML shell. `build-system/` contains audit and packaging scripts only — it is **not** a frontend source tree.

Field identity **F0–F7** is assigned for implementation review in `TEAM-EXPERIENCE-029_THEME_ROOT_RECONCILIATION_AND_IMPLEMENTATION_REVIEW.md` while legal boxes remain only Shell · Panel · Card · Control · Navigation. Status (F6) and Modal (F7) are system surfaces.

**First implementation root:** a single theme-root under the spatial path (presentation foundation only). Do not invent speculative page fields before that root exists.

## Spatial Theme constraint

The final TeamAi visual environment will use one unified theme root:

- Dark → **Dark Spatial Glassmorphism / Command Space**.
- Light → **Light Spatial Skeuomorphism / Instrument Space**.

The unified theme root owns the shared semantic token vocabulary and delegates bounded procedures to companion skills. It must not become a duplicate source of domain, identity, scheduler, commerce, approval, or durable-state authority.

## Companion routing constraint

The Spatial coordinator routes bounded concerns without absorbing them:

- `skills/frontend/spatial/transition/SKILL.md` — state transitions.
- `skills/frontend/spatial/animation/SKILL.md` — choreographed sequences.
- `skills/frontend/spatial/motion/SKILL.md` — movement/timing tokens.
- `skills/frontend/spatial/responsive/SKILL.md` — viewport adaptation.
- `skills/frontend/spatial/accessibility/SKILL.md` — contrast/focus/keyboard/reduced motion.
- `skills/verification/browser-smoke/SKILL.md` — Playwright browser verification.

No second Spatial Playwright skill is permitted.

## Discrepancy classes to check

At minimum inspect for:

- duplicate theme providers/stores/DOM mode switches;
- competing light/dark token namespaces;
- component-local semantic tokens that conflict with shared tokens;
- styling architecture forks (global CSS vs component CSS vs utility layers) without a clear owning boundary;
- page-local responsive breakpoints;
- animation/transition timing defined outside the shared Motion vocabulary;
- reduced-motion exceptions that bypass the Accessibility procedure;
- `!important` accumulation used to overcome structural specificity problems;
- visual mode changes coupled to business/domain state;
- browser tests that become de facto UI authority rather than evidence.

## Evidence requirement

Every populated inventory entry should identify the source path(s), owning root/mechanism, observed behavior, discrepancy status, and the relevant PR/commit evidence. Screenshots may supplement structural evidence but do not replace source inspection.

## Next inventory boundary

After theme-root lands, re-run this inventory against the real files and record owning roots. Until then, treat “no frontend roots” as the factual baseline.
