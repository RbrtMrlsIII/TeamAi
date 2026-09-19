# Checkpoint — V0.4 free nav about subject 2026-09-10

**Evidence:** IMPLEMENTED (lock + tests) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §2.2 · §6 V0.4  
**Owner:** Cam-3 (`navAllowedOnOpenTree`, `poseAboutTreeCenter`, `shouldApplyTreeNav`) + flex wheel/pointer via apply-cam2

## What

- Free orbit/zoom while parent open remains **allowed** and look-at stays on subject.
- Regression tests for pose look-at stability and flex wheel not hard-blocked by `openParentId`.
- **No** new camera module; Cam-6 seatDock still supplies subject when forced.

## Verify

```bash
node --test tests/hero-v0.4-free-nav-subject.test.mjs
```
