# Skill — PR squash-merge (TeamAi)

**Purpose:** Prefer **squash merge** for feature PRs so `main` stays linear and each landed slice is one recoverable commit.

## When

- Thin residual / presentation PRs (CAM, ENT, CHR, docs)
- Multiple fixup commits on the branch that should not pollute `main`

## How

1. Validate: Playwright / unit for the slice + governance/evidence as configured.
2. Squash-merge with title: `feat(#issue): short intent (#pr)`
3. Body notes: presentation-only boundaries, no 029-released claim if spatial.
4. Treat the **squash commit SHA on main** as the new baseline for the next residual.

## Do not

- Squash when the PR intentionally preserves multi-commit history for audit (rare; say so in the PR).
- Treat squash as permission to skip validation.

## Related

- `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` — post-merge state becomes current truth
- Active-index coupling still applies to the landed content
