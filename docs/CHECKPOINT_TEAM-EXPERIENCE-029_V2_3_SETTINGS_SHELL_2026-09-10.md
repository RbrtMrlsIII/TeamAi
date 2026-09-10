# Checkpoint — V2.3 settings shell 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §3.2 · §6 V2.3  
**Owner:** theme-root / settings surface via `public/hero-settings-shell.js`

## What

- Settings button + compact panel beside machine-nav (same chrome column)
- Theme dark/light + motion toggles write `document.documentElement` only
- Events: `teamai:settings-shell`, `teamai:theme-mode`, `teamai:motion-pref`
- No second theme root; full settings page remains `frontend/spatial/settings.*`

## Verify

```bash
node --test tests/hero-v2.3-settings-shell.test.mjs
```
