# Machine Hero frontend foundation

Status: **IMPLEMENTED / TEMPO / EVIDENCE ONLY**

PR: #344

This slice is a standalone frontend proof surface. It does not replace the production Hero and does not claim machine promotion.

## Proven by implementation/tests

- Canonical semantic transition object contains Seat index, source/target semantic identity, source/target geometry, semantic ports, expansion, wiring, and derived subject.
- Subject footprint is derived from geometry bounds rather than camera coordinates.
- Semantic wiring is derived from source/target ports and fails closed when either port is missing.
- Wiring contains an explicit intermediate corridor waypoint.
- Camera identity remains named while its target follows the derived semantic subject.
- A different valid semantic pair uses the same camera algorithm.
- Division expansion is now a real geometry operation: expansion changes dimensions and position, and ports move with the expanded footprint.
- The graph's rendered parts and subject bounds consume the expanded transition geometry.
- The standalone WebGL renderer draws the expanded machine divisions and recomputed semantic wiring routes.
- A standalone WebGL preview renders the machine parts, semantic wiring corridor, and subject footprint.
- Geometry mutation moves the semantic target, subject, camera target, and wiring endpoints together.
- Playwright covers the standalone preview URL, WebGL canvas presence, expansion-state transition, geometry mutation, and isolation from the production Hero surface.

## Explicit non-claims

- No production WebGL renderer replacement.
- No complete tree/branch/division census.
- No final connection topology.
- No turn-loop electrical completion.
- No authenticated workspace completion.
- No C9/C10 product acceptance.
- No M1-M6 promotion.

## Entry surface

The prototype has its own HTML page: `public/machine-hero-preview.html`. The production `public/index.html` remains outside the standalone machine runtime contract.
