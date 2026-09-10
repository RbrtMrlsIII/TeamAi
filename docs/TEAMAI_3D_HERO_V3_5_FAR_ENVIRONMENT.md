# V3.5 — Far-environment clarity

**Status:** Implemented (presentation) · **no 029-released claim**  
**Date:** 2026-09-10  
**Authority:** VISION §4 ownership · §6 V3.5 · ENTRANCE_IA region `entrance-far`  
**Class:** Keep / clarify — **outside machine shell**

## Objective

Make the far-environment (About / Contact / Terms / Privacy) unambiguously **outside** the 3D Hero machine: always visible, never soft-absorbed with hierarchy machine UI, not a seat-config surface.

## Owners

| Piece | Owner |
|-------|--------|
| Markup | `aside.far-environment` **sibling after** `.hero-shell` |
| Region marker | `data-entrance-region="far"` |
| Outside-machine marker | `data-far-outside-machine="1"` |
| Styles | `public/hero-dom-chrome.css` |

## Rules

1. Far lives **outside** `.hero-shell` — not a child of the machine.  
2. Fixed footer so body `overflow: hidden` cannot clip legal links.  
3. Machine-ui absorption selectors must **not** target `.far-environment`.  
4. Links remain ordinary web anchors (hash placeholders until copy pages exist).  
5. No seat config, API keys, or OAuth in far region.

## Forbidden

- Moving far inside `.hero-shell`  
- Second theme root / second settings island for legal links  
- Treating far as machine chrome  
- 029-released claim  

## Tests

`tests/hero-v3.5-far-environment.test.mjs`

## Next authorized command

Vision Phase V3 ladder complete for entrance IA slices. Parallel **Conn-3** remains Edge/OAuth only. Optional V4 polish is not auto-authorized without a new frontier decision.
