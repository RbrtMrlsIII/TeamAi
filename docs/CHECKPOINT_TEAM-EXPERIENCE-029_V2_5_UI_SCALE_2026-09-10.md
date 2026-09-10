# Checkpoint — V2.5 UI scale scaffold 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §3.2 · §6 V2.5  
**Owner:** `frontend/spatial/theme-root.js` + settings shell panel

## What

- `readScale` / `applyUiScale` on documentElement (`data-ui-scale`, `--ui-scale`)
- Range control in settings shell (0.85–1.35)
- Persist via `persistTheme({ scale })` · event `teamai:ui-scale`
- Still one theme root

## Verify

```bash
node --test tests/hero-v2.5-ui-scale.test.mjs
```
