# Checkpoint — 029 Seat-1 adjacent-division wiring

**Date:** 2026-09-14
**Status:** IMPLEMENTED / PARTIAL
**Scope:** Presentation-only semantic wiring between the Seat-1 `SEAT_CONNECTION` division and one adjacent division geometry descriptor.

## Objective

Prove that the Seat-1 connection corridor is consumable by an adjacent division through semantic ports rather than fixed whole-Hero coordinates or decorative lines.

## Current contract

- Source and target divisions must expose semantic ports.
- The adjacency descriptor derives its length/yaw from those ports.
- The corridor is reserved explicitly for the source and target divisions.
- Traversal points are derived from the same semantic endpoints.
- The descriptor is presentation-only and has no provider, authorization, scheduler, or durable-domain authority.

## Product boundary

This slice does **not** establish complete inter-tree topology, final expansion animation timing/easing, final turn-loop electrical choreography, or any release/completion claim for the overall Seat tree.

The existing Seat-1 connection geometry descriptor remains the owner of the workspace-facing corridor. This slice proves an adjacent division can consume the semantic wiring seam without replacing that owner.

## Verification required

- deterministic unit tests for semantic source/target ports;
- Governance/census synchronization;
- Playwright integration only if renderer wiring is added in a later bounded slice.

No 029-released claim.
