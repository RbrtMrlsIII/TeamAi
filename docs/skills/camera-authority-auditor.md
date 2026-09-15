# Skill: Camera Authority Auditor

Status: GOVERNED EXECUTION SKILL / REAL

## Purpose

Prove that camera identity, camera configuration, semantic subject identity, and camera target are separate authorities.

## Procedure

1. Trace every path that can select a camera ID.
2. Trace every path that can mutate camera position/FOV/configuration.
3. Trace every path that can select a semantic subject.
4. Trace every path that can derive the camera target.
5. Build a precedence table for explicit camera commands, hierarchy camera resolution, semantic subject lock, and hierarchy close.
6. Add regression tests for each precedence case.
7. Run browser verification when the behavior crosses the assembled Hero boundary.

## Required invariants

- Explicit camera identity remains observable unless a governed transition explicitly transfers camera identity authority.
- A semantic subject may alter the target without silently replacing named camera configuration.
- Subject target coordinates come from active geometry.
- Closing the transition removes stale semantic targeting and restores the governed baseline.

## Stop conditions

Stop promotion when a presentation preset silently becomes semantic authority, when identity and target cannot be tested independently, or when precedence differs by execution path.
