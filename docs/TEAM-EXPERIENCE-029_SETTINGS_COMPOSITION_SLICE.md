# TEAM-EXPERIENCE-029 — Settings composition slice

**Status:** implementation proposal / presentation-only slice

## Purpose

Inhabit the Settings navigation composition as the final chronological spatial body after Artifacts, using the existing 029 shell, navigation, panels, cards, controls, and unified theme root.

## Contract

- Settings is a configuration-inspection surface, not a second authority layer.
- Visual preferences expose the single theme root: mode/source, density, and motion.
- Team / provider / execution boundaries are displayed as configuration facts only.
- Configuration previews update only local presentation state and must not imply durable account, entitlement, provider, scheduler, or billing mutation.
- No second theme root, modal system, or legal box is introduced.

## Backend alignment

Authoritative provider connections, seats, capabilities, entitlements, scheduler eligibility, durable task state, and billing remain backend/system-owned. Settings may explain those boundaries and present the currently selected visual preferences, but it does not become their source of truth.

## Boundary

This slice performs no Firestore write, provider invocation, scheduler selection, entitlement mutation, PayPal activity, account mutation, or durable configuration write. Preview controls only change presentation state in the browser.

## Verification intent

- Settings is reachable from wide and compact navigation.
- The unified theme root is represented once and remains the visual authority.
- Configuration sections clearly distinguish local visual preference from backend-owned configuration.
- Preview controls do not claim durable persistence.
- Compact layout has no horizontal overflow.
