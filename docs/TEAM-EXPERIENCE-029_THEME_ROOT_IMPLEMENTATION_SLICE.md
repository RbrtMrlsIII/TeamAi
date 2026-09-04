# TEAM-EXPERIENCE-029 — Theme Root Implementation Slice

**Status:** IMPLEMENTATION SLICE / PREVIEW REVIEW / NOT PRODUCT LAW
**Date:** 2026-09-04
**Authority chain:** PR #20 reviewed and merged → this branch implements only the approved 029 theme-root foundation.

## Purpose

Create the first actual frontend foundation without inventing a frontend application shell, pages, scheduler behavior, or domain state. This slice establishes the singular theme root and the shared primitive vocabulary that later compositions consume.

## Included

- `frontend/spatial/theme-root.css`
- `frontend/spatial/theme-root.ts`
- Dark material foundation: recommended Command Space, first surface anchor `#07111C`, glass limited to elevated panels, blur capped at 12px.
- Light material foundation: recommended Instrument Space, first surface anchor `#E7DCC8`, no glass fill and 0px blur.
- F0–F7 field identities while preserving the five reusable legal boxes from PR #19.
- Shared Size / Space / Type values and 4px-grid geometry.
- Shared motion `0 / 120 / 200 / 320ms`, stagger `40ms`, travel `0 / 4 / 8px`, and reduced-motion behavior.
- Theme persistence with explicit `user` versus `os` source.
- Safe normalization of invalid stored values and complete bootstrap fallback.
- OS theme observation when `source=os`.

## Explicit boundaries

- No HTML page or Command Deck composition is created here; the repository did not previously contain the frontend application surface.
- No scheduler, Firestore, PayPal, entitlement, approval execution, or authorization behavior is implemented.
- No second theme root, page-local theme, page-local palette, or separate dialog framework is introduced.
- Recommended names Command Space / Instrument Space remain non-Product-Law names.
- Status and Modal remain controlled system surfaces, not new general-purpose legal boxes.

## Review note

The Light `signal` value is intentionally carried as a reviewable design value and must be rechecked for readability when used as text. It is not silently promoted to Product Law by this implementation slice.
