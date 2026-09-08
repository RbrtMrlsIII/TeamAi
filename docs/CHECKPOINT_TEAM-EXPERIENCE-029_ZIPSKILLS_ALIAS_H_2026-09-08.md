# Checkpoint — Slice H: MECHANISM_ZIPSKILLS ↔ WORKSPACE_ZIPSKILLS alias

**Date:** 2026-09-08  
**Branch:** `feat/029-mechanism-zipskills-reconcile-h`  
**Skills:** teamai-project → hierarchy-runtime → workspace-ring

## Delivered

- `WORKSPACE_ZIPSKILLS` registered in semantic camera map → same `DETAIL_ANCHOR` as legacy `MECHANISM_ZIPSKILLS`
- `canonical()` / `aliases()` on `TeamAiHeroSemanticCamera`
- Inspection spine + seat-stack expose `canonicalSemanticCamera` while **keeping** `MECHANISM_ZIPSKILLS` for Playwright
- Seat-stack zipskills: `optional: true`, `workspaceScoped: true`, copy denies required setup
- Static tests: `tests/hero-zipskills-alias.test.mjs`

## Product rule

ZipSkills is **optional** workspace governance equip (LAW 109). Not a Seat child authority. Not a required platform config. External assignment allowed.

## R1–R10 accounting

| Root | This slice |
|------|------------|
| R1–R4 | Deferred — no new open parent |
| R5 | Reduced-motion unchanged |
| R6 | Labels clarify optional / workspace |
| R8–R9 | Presentation trajectories only |
| R10 | Isolation preserved |

## Boundaries

Presentation only · no 029-released claim · Merge gate #133
