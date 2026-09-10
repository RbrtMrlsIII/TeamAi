# Checkpoint — V0.3 subject-lock regression 2026-09-10

**Evidence:** IMPLEMENTED (tests) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §2.1 · §6 V0.3  
**Owner:** Cam-5/6 `resolveSelectedSeatDock` + apply-cam2 wire (existing)

## What

- Regression matrix: seat 0 vs 2 look-at differ; closed hierarchy no force; open shell force off origin; flex still has `force:true` alongside V0.2 baseline return.
- **No** new camera module.

## Verify

```bash
node --test tests/hero-v0.3-subject-lock-regression.test.mjs
```
