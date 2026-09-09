# CHECKPOINT — TEAM-EXPERIENCE-029 P1.1 SEAT_CONNECTION visual flex

**Date:** 2026-09-09  
**Slice:** P1.1 — connection branch visual flex + keyboard C + a11y labels  
**Evidence:** IMPLEMENTED (source + static tests) · presentation only · **no 029-released claim**

## Objective

Wire P1 hierarchy runtime connection-branch APIs into `public/hero-flex.js` so the CONNECTION plate expands visually, ticks each frame, exposes configure handoff on **C**, and uses the accessible name from runtime.

## Changes

| File | Change |
|------|--------|
| `public/hero-flex.js` | Import `tickConnectionBranch`, `getConnectionBranchAmount`, `connectionFaceAccessibleName`, `requestConnectionConfigureHandoff`, `CONNECTION_BRANCH_MS`. Frame ticks branch after pose. CONNECTION plate uses `branchBoost` scale/emit. Keyboard **C** → configure handoff when CONNECTION focused. Labels use `connectionFaceAccessibleName`. `TeamAiHero` exposes branch helpers. Arrow focus passes `nowMs`. |
| `tests/hero-p1.1-connection-flex.test.mjs` | Static wiring + runtime consumer assertions |

## Restrictions held

- Presentation only — no Firestore write, no entitlement, no live bind claim
- One theme root unchanged
- No full hero-flex rewrite; minimal delta on existing draw/frame/keydown
- P1 runtime remains authority for amounts; flex only consumes

## Verification

```text
node --test tests/hero-p1-seat-connection.test.mjs tests/hero-p1.1-connection-flex.test.mjs
→ 12 pass
```

## Assumptions

- P1 (`4bda6e7`) already on main with runtime APIs
- Configure handoff remains a presentation intent event (`teamai:web-ai-seat-configure-request`); normal UI owns real configure

## Limitations

- Not RUNTIME-PROVEN in live browser/WebGL this turn (static + contract tests only)
- Visual boost is geometric/emissive only — not a material system rewrite
- Health leaf domain read-model still fixture (`source` not claimed domain)

## Next slice

**P2 SEAT_BEHAVIOR** — same depth-first treatment (branch motion, camera dock, reduced snap, a11y) once P1.1 is on main.

## Audit (AGENT_SLICE_EXECUTION)

1. **Changes** — hero-flex wiring + P1.1 test file + this checkpoint + NEXT_SLICES  
2. **Reasons** — P1 deferred visual/keyboard deliberately; smallest consumer of existing runtime  
3. **Assumptions** — Product Law presentation boundary; hierarchy ladder plan of record  
4. **Verification** — 12 node tests green  
5. **Limitations** — presentation-only; not live WebGL proof  
6. **Next** — P2 SEAT_BEHAVIOR
