# Checkpoint — 029 Seat-1 payload-driven division geometry

**Date:** 2026-09-14
**Status:** IMPLEMENTED / NOT FINAL
**Owner:** Issue #278 / `03.9 TREE MACHINE` in `MASTERPLAN.md`
**Scope:** Seat-1 `SEAT_CONNECTION` presentation geometry and connection-corridor contract.

## Objective

Replace the Seat-1 connection edge's fixed geometry assumptions with a small semantic geometry descriptor that can derive division footprint and wiring-corridor characteristics from payload and clearance inputs.

## Current evidence

- `frontend/spatial/seat-division-geometry.js` defines payload measurement, flexible width/depth/height derivation, a stable connection port, and a reserved corridor descriptor.
- `scripts/apply-seat1-connection-edge-flex.mjs` mirrors the geometry module into the public runtime and routes the Seat-1 connection wire through the descriptor.
- Unit coverage verifies richer payload produces a larger footprint and that the corridor reserves space for adjacent divisions and the workspace center.

## Product boundary

This does **not** establish final expansion timing, final easing, final electrical choreography, complete inter-tree topology, or final mobile geometry. Existing timings and renderer primitives remain implementation baselines until representative browser evidence establishes stronger final motion/geometry law.

The previous Seat's user configuration remains outside this presentation geometry contract and is not reset by geometry recomputation.

## Wiring intent

The Seat-1 connection division owns a semantic port and a corridor reservation. The corridor is explicitly reserved for `adjacent-divisions` and `workspace-center` so later divisions can consume topology rather than drawing decorative wires over occupied geometry.

## Verification required

- static/unit tests for deterministic geometry outputs;
- Playwright browser evidence at the real deployed Hero for Seat-1 opening and connection visibility;
- responsive/reduced-motion verification after the geometry is integrated with the final expansion model.

No 029-released claim.
