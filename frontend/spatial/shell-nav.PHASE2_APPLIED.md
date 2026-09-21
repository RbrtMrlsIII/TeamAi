# Seats plate phase-2 ownership

The historical phase-2 mutation route has been retired.

## Current owner

`frontend/spatial/shell-nav.js` explicitly imports the Seat read model and connection/provider owners. The behavior is committed source, not injected by a patch script.

| Surface | Current path |
|---|---|
| Seat read model | `frontend/spatial/seat-read-model.js` |
| Connection projection | `frontend/spatial/seat-connection-wire.js` |
| Provider binding | `frontend/spatial/seat-provider-bind-wire.js` |
| Shell/navigation owner | `frontend/spatial/shell-nav.js` |
| Browser delivery | governed build / Pages source copy |
| Compatibility wrapper | `scripts/apply-seat-plate-phase2.mjs` (verify-only) |

## Verification rule

`npm run seat:plate:phase2` remains available for legacy callers, but it must only verify the committed owner-level source contract and must never rewrite `shell-nav.js`.

The same rule applies to the historical Seat connection and provider-bind wrapper scripts.

Source mutation belongs only to the intentional synchronization/build mechanisms. Runtime behavior belongs to explicit source modules.
