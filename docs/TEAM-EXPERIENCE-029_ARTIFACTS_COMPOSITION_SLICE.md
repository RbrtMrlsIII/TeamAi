# TEAM-EXPERIENCE-029 — Artifacts composition slice

**Status:** implementation proposal / presentation-only slice

## Purpose

Inhabit the Artifacts navigation composition as the next chronological spatial body after Approvals, using the existing 029 shell, navigation, panels, cards, controls, and theme root.

## Contract

- Artifact queue = F4 cards in an F3 panel.
- Selected artifact = F3 E3 detail panel.
- Detail presents type, task, event, seat, provider, project scope, status, creation time, summary, provenance, and next handling.
- The visual separates durable-result/event-shaped evidence from the UI that inspects it.
- "fixture" is used where the record is illustrative rather than a claim about a live backend record.
- No second theme root, modal system, or legal box is introduced.

## Backend alignment

The TeamAi execution model routes action/result state through durable structured events and task transitions. Artifacts therefore represent inspectable evidence produced by that chain, not scheduler authority, provider authorization, or execution authority.

## Boundary

This slice performs no Firestore write, provider invocation, scheduler selection, entitlement mutation, PayPal activity, publication, or durable artifact mutation. "Preview record" only updates presentation status text.

## Verification intent

- Artifacts is reachable from wide and compact navigation.
- Four artifact records are visible.
- Selection updates only the presentation detail.
- The detail exposes provenance and next handling.
- Authority-boundary copy clearly separates evidence representation from backend-owned mutation.
- Compact layout has no horizontal overflow.
