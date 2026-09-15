# Machine Hero proof matrix

Status: **IMPLEMENTATION EVIDENCE / NOT PROMOTED**

PR: #344

This matrix records reproducible evidence for the governed Machine Hero qualification law. Passing evidence does not itself promote the Hero.

| Gate | Requirement | Evidence in this slice | Status |
|---|---|---|---|
| M1 | Semantic identity is canonical and coordinate-independent | `frontend/spatial/machine-hero-scene.js`; semantic IDs carried separately from geometry; invalid semantic transitions fail closed | Implemented evidence |
| M2 | Canonical transition contains semantics, geometry, ports, expansion, wiring, subject | `createMachineTransition`; `tests/machine-hero-scene.test.mjs` | Implemented evidence |
| M3 | Same renderer/transition algorithm handles a second valid source/target pair | Reverse semantic-pair test in `tests/machine-hero-scene.test.mjs` | Implemented evidence |
| M4 | Geometry mutation changes subject without replacing camera configuration | Subject/camera mutation tests plus standalone WebGL preview mutation | Implemented evidence |
| M5 | Named camera identity remains separate from semantic target | `resolveMachineCamera`; named `SEAT_CLOSE` remains stable while target changes | Implemented evidence |
| M6 | Assembled Hero browser path follows semantic subject and returns to world baseline | `tests/e2e/machine-hero.spec.ts`, test `M6 assembled Hero proof follows semantic subject after geometry mutation`, URL `/hero/?machine-proof=1` | Pending fresh CI proof |

## Explicit boundary

The production Hero remains unchanged at normal runtime. The M6 bridge is opt-in and presentation-only. This matrix does not claim M1-M6 acceptance, machine promotion, complete topology, C9, or C10.
