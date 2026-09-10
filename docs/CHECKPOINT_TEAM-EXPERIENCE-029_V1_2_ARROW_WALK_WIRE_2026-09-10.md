# Checkpoint — V1.2 Arrow → branch walk wire 2026-09-10

**Evidence:** IMPLEMENTED (apply path) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §6 V1.2  
**Owner:** `cycleSeatShellBranchFocus` + `scripts/apply-v1.2-arrow-branch-walk.mjs`

## What

- ArrowRight / ArrowLeft while seat shell open → `cycleSeatShellBranchFocus(±1)`
- Removes duplicate inline `SEAT_SHELL_V1_CHILDREN` index math from keydown
- npm `test` / `test:unit` / `test:e2e` chain runs apply after Cam-2 flex

## Verify

```bash
node scripts/apply-cam2-tree-follow-flex.mjs
node scripts/apply-v1.2-arrow-branch-walk.mjs
node --test tests/hero-v1.2-arrow-branch-walk-wire.test.mjs
```
