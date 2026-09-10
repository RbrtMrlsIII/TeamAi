# Checkpoint — V2.2 machine nav bind 2026-09-10

**Evidence:** IMPLEMENTED (source) · **no 029-released claim**  
**Vision:** `docs/VISION.md` §3.1 · §6 V2.2  
**Owner:** `.seat-stack` chrome + `MACHINE_NAV_MAP` via `hero-machine-nav-bind.js`

## What

- Single `<select>` mounted into existing `.seat-stack` (or `[data-machine-nav]`)
- Change → `teamai:machine-nav-select` CustomEvent (presentation)
- No second navigation rail

## Verify

```bash
node --test tests/hero-v2.2-machine-nav-bind.test.mjs
```
