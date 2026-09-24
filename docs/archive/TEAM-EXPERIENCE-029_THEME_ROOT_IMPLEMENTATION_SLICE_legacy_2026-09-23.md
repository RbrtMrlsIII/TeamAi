# TEAM-EXPERIENCE-029 — Theme Root Implementation Slice

**Status:** IMPLEMENTATION SLICE / REVIEW READY / NOT PRODUCT LAW
**Date:** 2026-09-04
**Authority chain:** PR #20 reviewed and merged → PR #19 planning baseline merged → this branch implements the approved 029 theme-root foundation.

## Purpose

Create the first actual frontend foundation without inventing a frontend application shell, pages, scheduler behavior, or domain state. This slice establishes the singular theme root and the shared primitive vocabulary that later compositions consume.

## Included

- `frontend/spatial/theme-root.css`
- `frontend/spatial/theme-root.ts`
- F0–F7 field identities while preserving the five reusable legal boxes: Shell, Panel, Card, Control, Navigation.
- F6 Status as a controlled system surface, not a new general-purpose legal box or navigation destination.
- F7 Modal as the single shared E4 surface, not a second dialog framework.
- Dark foundation: recommended Command Space, `#07111C`, glass only on elevated panels, blur capped at 12px.
- Light foundation: recommended Instrument Space, `#E7DCC8`, no glass fill, 0px blur.
- Shared Size / Space / Type values and 4px-grid geometry.
- Shared motion `0 / 120 / 200 / 320ms`, stagger `40ms`, travel `0 / 4 / 8px`, and reduced-motion behavior.
- Theme persistence with explicit `user` versus `os` source.
- Invalid persisted values normalized to safe defaults and complete bootstrap fallback.
- OS theme observation when `source=os`.

## Boundaries

- No Command Deck HTML or frontend application shell is created here because the frontend application itself had not been started yet.
- No scheduler, Firestore, PayPal, entitlement, authorization, or action-execution behavior is implemented.
- No second theme root, page-local palette, or separate dialog framework is introduced.
- Command Space / Instrument Space remain recommended names, not Product Law names.
- The Light `signal` value remains a reviewable design value and is not silently promoted to Product Law.

## Implementation note

The implementation is intentionally foundation-only. The next slice can build the persistent Shell, Navigation, and first inhabited Command Deck composition on top of this root without reopening the token vocabulary.
