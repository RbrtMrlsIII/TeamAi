# Checkpoint — V2.4 theme polish 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §3.2 · §6 V2.4  
**Owner:** `frontend/spatial/theme-root.js` + `public/hero-settings-shell.js`

## What

- Settings shell theme/motion buttons call `applyDocumentTheme` + `persistTheme`
- `initializeTheme()` on boot; `aria-pressed` sync on panel buttons
- Still **one** theme root: `document.documentElement`

## Verify

```bash
node --test tests/hero-v2.4-theme-polish.test.mjs
```
