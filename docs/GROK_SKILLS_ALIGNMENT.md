# Grok Skills ↔ TeamAi Skills alignment

**Status:** OPERATING MAP / NOT PRODUCT LAW  
**Date:** 2026-09-10  
**Authority:** `PRODUCT_LAW.md` → `MASTERPLAN.md` → `POLICY.md` / ORUCAVEAM → `docs/SKILL_WIRING.md` §8b  
**Purpose:** Tell a Grok Build / Grok App Builder session how to continue TeamAi without importing the sandbox’s default stack as a second architecture.

When a Grok sandbox skill and a TeamAi repository skill disagree, **the GitHub repository wins**. Grok skill folders are a **procedural cache / host environment**, never Product Law, never identity, never durable state, never commerce.

## 1. Recovery order for a Grok session on TeamAi

1. `PRODUCT_LAW.md`
2. `MASTERPLAN.md` (chronological gate + empty checks)
3. `POLICY.md` / ORUCAVEAM → `skills/execution/orucaveam/SKILL.md`
4. `docs/SKILL_WIRING.md`
5. **This file**
6. `docs/TEAMAI_3D_HERO_NEXT_SLICES.md` (living 029 presentation ladder)
7. Concrete `skills/**/SKILL.md` for the current slice
8. `docs/project-guide/HandOver.md`

Do **not** reconstruct TeamAi from Grok App Builder `AGENTS.md` §0.5 (auth/db defaults, TanStack Start, Neon, Better Auth). Those rules govern **new Grok-hosted apps**, not this product.

## 2. Hard non-transfers (Grok host → TeamAi)

| Grok Build / App Builder skill | What it would do if applied blindly | TeamAi rule |
|--------------------------------|-------------------------------------|-------------|
| `auth` (Better Auth + Grok broker) | Add `/api/auth`, Google/X/email, Neon-backed sessions | **DO NOT APPLY.** Identity is **Firebase Auth**; UID ownership is Product Law. |
| `neon` (Postgres) | Create `migrations/`, `@/lib/db`, `user_id` rows | **DO NOT APPLY.** Durable domain state is **Firestore `(default)`**. Supabase Postgres is not the TeamAi domain database. |
| `design-ui` as stack authority | Tailwind v4 + shadcn/Radix + `src/styles.css` `@theme` as the theme root | Visual taste may inform polish; **canonical theme root remains TeamAi spatial** (`document.documentElement` + `frontend/spatial` tokens). Do not introduce a second UI stack. |
| `building-games` / `controls` / `generate2dsprite` / `generate2dmap` / `game-*` / `video2dsprite` | Game canvas, WASD, sprite sheets | **DO NOT APPLY.** TeamAi is a shared Web AI workspace, not a game. |
| `multiplayer-p2p` | P2P rooms as collaboration | **DO NOT APPLY.** Collaboration is Seat/Workspace under Product Law, not P2P. |
| `xai-api` as default LLM | Call `XAI_API_KEY` from app server, treat Grok as the product brain | **DO NOT APPLY as TeamAi scheduler or Seat runtime.** Provider invocation is Masterplan item 13 — only after authorization/task contracts. Seats are distinct Web AI participants; they are not the Grok sandbox. |
| App Builder `startup.sh` / port-8080 preview | Bind a TanStack app as “the product” | **Not TeamAi delivery.** Web delivery authority is Firebase Hosting; GitHub Pages is validation-only `/spatial/`; Vercel is parked cutoff. |

## 3. Safe optional transfers (taste / verification only)

| Grok skill | How a TeamAi session may use it |
|------------|----------------------------------|
| `design-ui` (anti-slop, contrast, reduced-motion, mobile tap targets) | Review **presentation** surfaces. Route implementation through `skills/frontend/spatial/UI_UX-Promax-Skill.md` + motion / transition / animation / responsive / accessibility companions. |
| `threejs` | Only if the existing Hero renderer already uses it. Presentation only. No second canvas (Slice M). |
| `imagine` / `og` | Slice **M** optional authored assets or share-card polish. **No paid/external asset generation.** No decorative bloom as a substitute for manufactured materials. |
| `xai-api` | Out of scope until a named provider-runtime contract exists. If later authorized, it is one Seat/provider among others — not GitHub, not Firestore, not PayPal. |
| Browser QA / Playwright patterns | Prefer TeamAi `skills/verification/browser-smoke/SKILL.md` and existing `tests/e2e/*`. |

## 4. TeamAi skill families a Grok session must load instead

| Work class | Load |
|------------|------|
| Any meaningful change | `skills/execution/orucaveam/SKILL.md` (+ letter skills as needed) + `skills/tools/minimal-tool-usage/SKILL.md` |
| 029 Hero / spatial / theme | `skills/frontend/spatial/UI_UX-Promax-Skill.md` + companions; `skills/workspace/ws.029.presentation/SKILL.md` |
| Contribution / PR / merge | `skills/workspace/ws.contribution.flow/SKILL.md` + merge gate Issue **#133** |
| GitHub tool use | `skills/workspace/ws.tools.github/SKILL.md` |
| GitHub App form (Conn-1) | `skills/workspace/ws.github.app-least-privilege/SKILL.md` |
| GitHub webhook + UID map (Conn-2) | `skills/workspace/ws.github.webhook-uid-map/SKILL.md` |
| Secrets | `skills/workspace/ws.secrets.boundary/SKILL.md` |
| User manual / deploy setups | `docs/USER_MANUAL_DEPLOY_AND_SEATS.md` (human-only steps; agents log here, do not invent URLs) |
| Verification seat | `skills/seat/seat.field.verification/SKILL.md` |
| Coding seat | `skills/seat/seat.work.coding/SKILL.md` |
| Backend / commerce | `skills/backend/*` — Firebase, Firestore, Supabase Edge, PayPal |
| Learning / HandOver | `skills/governance/learning-handover/SKILL.md` |

SEAT_SKILLS and WORKSPACE_SKILLS are **optional user-assignable procedures**, not commerce SKUs and not required platform setups.

## 4b. GitHub Connection skills (Grok must use TeamAi skills)

| Slice | TeamAi skill | Grok must not |
|-------|--------------|---------------|
| Conn-1 | `ws.github.app-least-privilege` | Invent App permissions; grant Admin/Secrets; activate empty webhook |
| Conn-2 | `ws.github.webhook-uid-map` | Mint UID from `sender.login`; paste PEM in chat; Hero live bind |
| Conn-3 | `ws.github.oauth-uid-bind` (planning) | Treat keyboard C as OAuth; claim 029 released |

Manual operator steps for App create, secrets, and webhook Active live only in `docs/USER_MANUAL_DEPLOY_AND_SEATS.md` §12.

## 5. Merge / automation behavior (Grok connector)

Authorized by Issue **#133** (supersedes #42 human-approval barrier):

- Agents **may merge** PRs that pass required checks, stay inside ORUCAVEAM, preserve presentation/domain boundary, and record evidence.
- Agents **must not merge** on failed checks, unclear scope, or protected-boundary changes without reconciliation.
- Direct pushes to `main`, force-pushes, and required-check bypass remain forbidden.

## 6. Pass / evidence

A Grok session on TeamAi **passes** this alignment when:

- it did not add Better Auth, Neon, TanStack routes, or a second theme root;
- it loaded TeamAi `skills/**` for the slice actually executed;
- it left NEXT_SLICES / HandOver current for the next session;
- any Grok-host preview is not claimed as TeamAi production delivery.

## SEE ALSO

- `docs/SKILL_WIRING.md` §8b, §13
- `AI_ASSISTANT_READ_ME.md`
- `docs/TEAMAI_3D_HERO_NEXT_SLICES.md`
- `skills/workspace/ws.029.presentation/SKILL.md`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
- `docs/USER_MANUAL_DEPLOY_AND_SEATS.md`
