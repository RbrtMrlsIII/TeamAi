# Checkpoint — Slice P1.1 SEAT_CONNECTION flex wiring

**Date:** 2026-09-09  
**Scope:** Visual + input wiring of P1 connection branch into `public/hero-flex.js`.

## Delivered
- Frame loop calls `tickConnectionBranch` after `tickHierarchyPose`
- CONNECTION face scales/emits with `getConnectionBranchAmount`
- Keyboard **C** → `requestConnectionConfigureHandoff` (presentation only)
- Apply script `scripts/apply-p1.1-connection-flex.mjs` (idempotent)
- Static test `tests/hero-p1.1-connection-flex.test.mjs`

## Boundaries
Presentation only · no live bind · no 029-released claim

## Next
P2 `SEAT_BEHAVIOR` hierarchy (after P1 visual pass is fair)
