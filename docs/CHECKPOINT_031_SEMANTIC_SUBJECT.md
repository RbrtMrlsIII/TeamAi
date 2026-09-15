# 031 semantic subject checkpoint

This checkpoint records the first implementation of the geometry-derived semantic subject layer on top of the reusable adjacent-transition primitive from #336.

## Current boundary

`division payload → geometry → expansion → wiring → subject footprint`

The subject is presentation-only and is derived from source/target semantic geometry plus current expansion state. It is not derived from a camera preset, mesh index, or fixed screen/world coordinate.

## Implemented in this branch

- `frontend/spatial/seat-adjacent-subject.js` defines a deterministic subject identity and footprint resolver.
- `frontend/spatial/seat-adjacent-transition.js` now returns `sourcePort`, `targetPort`, and `subject` in the canonical transition object.
- `tests/seat-adjacent-subject.test.mjs` covers subject identity, geometry mutation, source/target attachment, and fail-closed behavior.

## Explicitly not claimed

- Camera runtime consumption is not yet wired in this checkpoint.
- No additional production branch pair is activated.
- No new camera authority is introduced.
- No final animation/easing law or electrical topology is defined.
- No C9/C10 or release claim.

## Next proof

Wire the existing camera resolver to consume `transition.subject` while preserving the current named camera authority, then verify that changing semantic geometry moves the camera target without changing camera configuration.
