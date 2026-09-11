# #258 residual — Layer A/B legibility + machine chrome consolidation

**Status:** EXECUTION (presentation) · **no 029-released claim**  
**Date:** 2026-09-11  
**Authority:** VISION §1 · §3 · ENTRANCE_IA · V3.4 handoff · Issue #258

## Acceptance (ENT-R1)

| Layer | User must perceive | Entrance-primary | Machine-primary |
|-------|--------------------|------------------|-----------------|
| **A — Entrance** | Branded web face; Hero backdrop | Brand/lede, Open engine / get-started | Not a wall of seat chips |
| **B — Machine** | Inside the instrument | Brand **retired**; get-started demoted | **One** parts/trees dropdown + settings beside it |

## Chrome inventory

| Surface | Class | Residual action |
|---------|-------|-----------------|
| `.hero-copy` brand | entrance-primary | **ENT-R2** retire on `data-hero-layer=machine` |
| `.hero-controls` Open engine / docks | mixed | Machine: demote docks; keep return path |
| `.seat-stack__module` chips | **debt** | **CHR-R2** soft-hide when machine-nav owns parts list |
| `.machine-nav` select | machine-primary | **CHR-R1** sole parts/trees control |
| `.hero-settings-shell` | machine-primary | **CHR-R3** beside nav only |
| Inspection spine | machine when open | Later CHR-R5 |
| Far links | outside | Keep (V3.5) |

## This slice set (landed with residual PR)

| ID | Intent |
|----|--------|
| RES-0 / ENT-R1 | This contract |
| ENT-R2 | Machine layer retires brand (not 0.42 opacity) |
| ENT-R3 | Visible Return to entrance control |
| CHR-R1 / R2 | Dropdown remains; legacy stack modules soft-hidden |
| CAM-R-RETIRE | HERO_LOW_ORBIT + TURN_FOLLOW removed from UI/runtime |

## Forbidden

- Second canvas / second theme root / second settings island  
- Stealing `data-hero-machine-ui` ownership from hierarchy absorption  
- 029-released claim  

## Later on #258

CAM-R1–R3 seat look-at · CHR-R3–R6 polish absorption · ENT-R4 Playwright · ENT get-started CTA

## Governance

Spatial `public/` change requires sync of `MASTERPLAN.md`, `docs/TEAMAI_029_CURRENT_STATE_MAP.md`, `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` (verify-active-index coupling).

Load `skills/governance/active-index-coupling/SKILL.md` before spatial PRs.

## CAM-R-RETIRE — HERO_LOW_ORBIT + TURN_FOLLOW removed

**Status:** applied on residual branch (presentation only).

- UI: Low orbit control removed from `public/index.html`.
- Action map: both ids removed from tree-aligned / lock-only lists.
- Runtime: `hero-flex.js` strips both presets from `cameras()` and maps turn-loop `setCamera('TURN_FOLLOW')` → `HERO_WIDE`.
- Intent: turn loop must not force low/side orbit each WebAI turn; world baseline remains `HERO_WIDE` (~45°).
- Open: seat-relative turn follow (subject lock per selectedSeat) is still a future CAM residual if product wants contribution camera, not a restore of TURN_FOLLOW preset.
