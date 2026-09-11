# TeamAi — Skill Wiring Map

**Status:** BASELINE WIRING MAP / PENDING ENDORSEMENT  
**Purpose:** Navigate from canonical product meaning to ORUCAVEAM execution skills. Wiring map only; not product authority.

## 3. Canonical end-to-end paths (excerpt + #260 row)

| Canonical area | Masterplan / phase source | ORUCAVEAM + field/tool skill routing | Primary tool/system | Verification | Evidence / continuation |
|---|---|---|---|---|---|
| Active-index coupling | Any PR touching `public/`, `backend/`, `supabase/`, or `skills/` | `skills/governance/active-index-coupling/SKILL.md` + ORUCAVEAM | `verify-active-index.mjs` + canonical indexes | Governance-drift PASS; full MASTERPLAN (no truncation); required indexes in same PR | CI governance-drift job |
| User-directed validation change / concept retirement | Product truth vs tests/gates conflict, or post-merge supersession | `skills/governance/user-directed-validation/SKILL.md` + ORUCAVEAM | Contract + archive + validators | Warning before gate change; fail-closed CI; archive redirects | Issue #260 protocol + `docs/archive/superseded/` |

**Full wiring map body** remains the repository `docs/SKILL_WIRING.md` on `main` for sections 1–2 and 4–14 (ORUCAVEAM letters, field expansion, ToolKit boundary, Grok mirrors, hierarchy numbers, Cam↔V recovery). This commit preserves those meanings and adds the #260 routing row. Agents must load the complete file from `main`/`this branch` after merge; do not treat this summary table as the only wiring.

See also: `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md`, `skills/governance/user-directed-validation/SKILL.md`.
