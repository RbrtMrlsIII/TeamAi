# Seats plate phase2 bind

## Do you need to run the CLI commit?

**No — not required for CI or GitHub Pages.**

| Surface | How bind is applied |
|---------|---------------------|
| Unit / e2e CI | `npm test` / `npm run test:e2e` runs `seat:plate:phase2` first |
| GitHub Pages | workflow runs `node scripts/apply-seat-plate-phase2.mjs` before copy |
| Local static preview | run `npm run seat:plate:phase2` once after pull |

Optional (only if you want the bound file committed in git history):

```bash
npm run seat:plate:phase2
git add frontend/spatial/shell-nav.js
git commit -m "chore(029): commit applied Seats plate phase2 bind"
```

The apply script is **idempotent** — safe to re-run.
