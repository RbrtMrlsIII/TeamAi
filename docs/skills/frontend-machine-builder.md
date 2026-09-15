# Frontend Machine Builder

Status: GOVERNING SKILL / REAL WHEN #343 IS PROMOTED

## Purpose
Build the Hero as a composable spatial machine without allowing presentation code to become semantic authority.

## Rules

1. Start from semantic state, never from camera presets or hard-coded screen coordinates.
2. Every spatially interactive part gets a stable semantic identity, geometry, and explicit ports where relationships require them.
3. Transitions are data. Renderer branches may not encode individual source/target pairs.
4. Derive subject footprints from current geometry after transition computation.
5. Camera configuration and camera target remain independent values.
6. New machine primitives must be opt-in until their production promotion gate is satisfied.
7. Prefer pure functions for identity, geometry, subject, and camera resolution; side effects stay at the final browser integration boundary.
8. Every geometry mutation must have a deterministic subject consequence that can be asserted without pixels.
9. Browser tests must exercise the assembled path, not only helper functions.
10. Never claim a prototype is the production Hero merely because it is visually convincing.

## Execution loop

`model → transition → geometry → subject → camera → projector → browser proof`

At each boundary, record the input, output, invariant, and failure mode. A failed invariant creates a new implementation slice or a law decision, never a silent compatibility patch.

## Promotion

The skill can produce implementation evidence for M1-M6. It cannot independently promote the Hero. Promotion requires the governing law, the proof matrix, reproducible tests, and an explicit project decision.
