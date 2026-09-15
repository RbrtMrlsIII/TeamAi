# TeamAi Machine Hero Qualification Law

Status: SUBORDINATE GOVERNANCE PROPOSAL / REAL WITHIN THIS PR ONLY

This document proposes a qualification boundary for a future 3D Hero machine. It is subordinate to `PRODUCT_LAW.md`, `MASTERPLAN.md`, `POLICY.md` / ORUCAVEAM, applicable governed decisions, and Issue #278 as the active 029 execution ledger. Nothing here amends, supersedes, reinterprets, or self-authorizes a change to those authorities. Runtime code, branches, pull requests, CI, screenshots, and browser behavior are implementation evidence only. They do not become product truth merely by passing tests.

## 1. Machine definition

The Hero qualifies as a machine only when semantic product truth produces the spatial state through one coherent chain:

`payload → machine state → parts/ports/relationships → geometry → transition → subject → camera → rendering`

Geometry may present identity, but geometry never defines semantic identity.

## 2. Authority separation

The machine must keep these authorities distinct:

- semantic identity: treeID, branchId, division identity, and purpose;
- geometry: current spatial footprint and transform;
- transition: state change between valid semantic divisions;
- subject: geometry-derived semantic footprint used for spatial focus;
- camera identity/configuration: named camera position, field of view, and related presentation configuration;
- camera target: derived from the active semantic subject when the governing state requires subject lock.

A camera preset may own configuration. It must not become the hidden owner of semantic identity.

## 3. Qualification gates

M1. Semantic identity is canonical and does not depend on coordinates or mesh names.

M2. A canonical transition object contains source/target semantics, geometry, ports, expansion, wiring, and subject.

M3. The reference transition is parameterized. A second valid source/target pair passes through the same renderer/transition algorithm without a new renderer branch.

M4. Mutating transition geometry mutates the subject footprint without changing camera configuration.

M5. Explicit camera identity remains observable when no semantic hierarchy transition has claimed camera control; hierarchy control may reclaim authority only through an explicit governed transition.

M6. The browser proves the assembled Hero follows the semantic subject and returns to the governed world baseline when the transition closes.

## 4. Promotion rule

All six gates must pass with reproducible evidence. Only then may a separately governed project decision consider promoting the implementation from tempo/evidence to accepted machine architecture.

Green CI is necessary evidence, not sufficient authority.

A visually convincing render is presentation evidence, not sufficient authority.

A passing PR is implementation evidence, not sufficient authority.

## 5. Current boundary

The current Hero remains TEMPO / PARTIAL. Seat-1 `SEAT_CONNECTION → SEAT_BEHAVIOR` is the reference fixture only. No broad branch activation, legacy camera resurrection, electrical completion, or C9/C10 completion is implied by this proposal.
