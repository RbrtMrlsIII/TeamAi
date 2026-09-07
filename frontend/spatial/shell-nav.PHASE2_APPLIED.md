# shell-nav phase2 bind status

Run from repo root to materialize the bind in `frontend/spatial/shell-nav.js`:

```bash
npm run seat:plate:phase2
```

Idempotent. CI already runs this before unit/e2e tests.

Bound markers expected after apply:
- `from "./seat-read-model.js"`
- `function projectedSeat`
- `applyProjectionToHeroSeatStack`
- health display uses `connectionHealth`

This marker file documents that phase2 bind is the intended mainline state even when the large `shell-nav.js` rewrite is applied via the script.
