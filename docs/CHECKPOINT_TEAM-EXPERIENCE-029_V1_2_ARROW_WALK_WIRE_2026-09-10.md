# Checkpoint — V1.2 Arrow → branch walk wire 2026-09-10

**Evidence:** IMPLEMENTED (apply path) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §6 V1.2  
**Owner:** `cycleSeatShellBranchFocus` + `scripts/apply-cam2-tree-follow-flex.mjs`

## What

- ArrowRight / ArrowLeft while seat shell open → `cycleSeatShellBranchFocus(±1)`
- Removes duplicate inline `SEAT_SHELL_V1_CHILDREN` index math from keydown
- DOM buttons for Back/Next can call the same API later without a second walker

## Verify

```bash
node --test tests/hero-v1.2-arrow-branch-walk-wire.test.mjs
```
