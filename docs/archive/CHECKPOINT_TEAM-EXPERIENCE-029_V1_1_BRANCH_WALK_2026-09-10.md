# Checkpoint — V1.1 Back/Next branch walk 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §2.3 · §6 V1.1  
**Owner:** `SEAT_SHELL_V1_CHILDREN` + `focusChild` via `public/hero-seat-branch-walk.js`

## What

- Pure step resolver + `cycleSeatShellBranchFocus` for Back (−1) / Next (+1)
- Wrap by default; does not invent a second hierarchy runtime
- Wire to DOM/keyboard in **V1.2** (same owner path)

## Verify

```bash
node --test tests/hero-v1.1-branch-walk.test.mjs
```
