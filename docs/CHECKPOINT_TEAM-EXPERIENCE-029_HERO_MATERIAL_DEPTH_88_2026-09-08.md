# Checkpoint — TEAM-EXPERIENCE-029 Issue #88 material/depth pass

**Date:** 2026-09-08  
**Branch:** `029-hero-material-depth-88`  
**Evidence label:** IMPLEMENTED (source/contract) — not DEPLOYED, not RUNTIME-PROVEN, not COMPLETED.

## Objective
Single presentation-only material/depth pass on authored `workspaceRing` and `seatShell` so light reveals manufactured form. Topology unchanged.

## Changes
- `frontend/spatial/hero-material-families.js` — deterministic families from adapter lighting outputs.
- `public/hero-flex.js` — reads `--hero-light-*` from the existing theme-driven shell; applies families to authored draws plus restrained inset/contact separation.
- `tests/hero-material-families.test.mjs` — bounds, Light-mode family contrast, renderer consumption.

## Reasons
`docs/CHRONOLOGY.md` §6 item 3 and verification ladder section D. Smallest compliant visual slice after #93 on main. No new Hero skill. No second theme root.

## Assumptions
- Presentation only. No Firestore, PayPal, scheduler, entitlements, or auth mutation.
- `--hero-light-*` remain CSS projections of the adapter, not Product Law tokens.
- Issue #42: do not merge to main without human approval.
- Issue #88 stays open until endorsement + visual/browser review.

## Verification
Source contract tests added. Browser smoke / visual review still outstanding. Not RUNTIME-PROVEN.

## Limitations
- Dark-glassmorphism not implemented (paired future mode).
- Reduced-motion lighting contract remains Issue #89.
- Cross-root motion remains Issue #95.
- Adapter fixture matrix remains PR #125 / Issue #98 (open; not merged).

## Next slice (for following sessions)
1. Human review of this PR; merge only if #42 policy allows.
2. Issue #89 reduced-motion + responsive lighting contract.
3. Do not create a second deployment file. User-manual setups only.
4. Vercel remains cut off.
