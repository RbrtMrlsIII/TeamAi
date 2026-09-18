# Checkpoint — R1/R2 hit targets + focus (Slice A)

**Date:** 2026-09-08  
**Branch:** `feat/029-r1-r2-hit-targets-focus`  
**Skills:** teamai-project → hierarchy-runtime → workspace-ring  

## Delivered

- `createRingFocusState` / `focusRingItem` / `cycleRingFocus` / `ringFocusAccessibleName`
- R1/R2 visual focus emphasis
- Keyboard: `[` `]` cycle R1; `;` `'` cycle R2; `.` clear (when seat hierarchy closed)
- Click: left third → R1 cycle; right third → R2 cycle; center clears ring focus
- `aria-live` via seat label when ring focused

## Non-goals

- No auth / OAuth / form fields
- No seat hierarchy change
- No 029-released claim

## Next

Slice B — §9 named radius scales, or C — orbit/zoom.
