# Grok Skills ↔ TeamAi Skills alignment

**Status:** OPERATING MAP / NOT PRODUCT LAW  
**Date:** 2026-09-15  
**Authority:** `Product_Law/PRODUCT_LAW.md` → `Masterplan/MASTERPLAN.md` → `Masterplan/NEXT_SLICES.md` → `POLICY.md` / ORUCAVEAM → `docs/SKILL_WIRING.md`  
**Purpose:** Tell a Grok Build / Grok App Builder session how to continue TeamAi without importing the sandbox’s default stack as a second architecture.

When a Grok sandbox skill and a TeamAi repository skill disagree, **the GitHub repository wins**. Grok skill folders are a **procedural cache / host environment**, never Product Law, never identity, never durable state, never commerce.

## 1. Recovery order for a Grok session on TeamAi

1. `Product_Law/PRODUCT_LAW.md`
2. `Product_Law/WIRING.md`
3. `Masterplan/MASTERPLAN.md`
4. `Masterplan/NEXT_SLICES.md` (sole active frontier)
5. `POLICY.md` / ORUCAVEAM → `skills/execution/orucaveam/SKILL.md`
6. `docs/SKILL_WIRING.md`
7. **This file**
8. Concrete `skills/**/SKILL.md` for the current slice
9. `AI_ASSISTANT_READ_ME.md` for current session/recovery state

Do **not** reconstruct TeamAi from Grok App Builder defaults such as Better Auth, Neon, TanStack Start, or provider-native assumptions. Those rules govern new Grok-hosted apps, not this product.

## 2. Hard non-transfers (Grok host → TeamAi)

| Grok Build / App Builder skill | What it would do if applied blindly | TeamAi rule |
|--------------------------------|-------------------------------------|-------------|
| `auth` (Better Auth + Grok broker) | Add `/api/auth`, Google/X/email, Neon-backed sessions | **DO NOT APPLY.** Identity is **Firebase Auth**; UID ownership is Product Law. |
| `neon` (Postgres) | Create migrations and app-domain rows | **DO NOT APPLY.** Durable domain state is **Firestore `(default)`**. |
| `design-ui` as stack authority | Introduce Tailwind/shadcn as a second theme root | Visual taste may inform polish; canonical theme root remains TeamAi spatial (`document.documentElement` + `frontend/spatial` tokens). |
| game/multiplayer skills | Add game/P2P collaboration mechanics | **DO NOT APPLY.** TeamAi is a shared Web AI workspace, not a game or P2P room. |
| `xai-api` as default LLM | Treat Grok as the product brain or scheduler | **DO NOT APPLY as TeamAi scheduler or Seat authority.** Provider invocation is governed separately. |
| App Builder preview/server assumptions | Bind a sandbox app as “the product” | **DO NOT APPLY.** Use TeamAi delivery and browser-verification surfaces. |

## 3. Safe optional transfers

| Grok skill | How a TeamAi session may use it |
|------------|----------------------------------|
| `design-ui` | Review presentation quality only; route implementation through TeamAi spatial Skills. |
| `threejs` | Presentation only and only where the existing TeamAi renderer contract allows it. No second semantic runtime. |
| `imagine` / `og` | Optional authored assets/share-card polish, subject to Product Law and evidence boundaries. |
| Browser QA patterns | Prefer TeamAi browser Skills and `tests/e2e/*`. |

## 4. TeamAi skill families a Grok session must load instead

| Work class | Load |
|------------|------|
| Any meaningful change | `skills/execution/orucaveam/SKILL.md` + applicable domain Skill |
| Repository/document synchronization | `skills/governance/repository-synchronization/SKILL.md` |
| 029 Hero / spatial / theme | `skills/frontend/spatial/UI_UX-Promax-Skill.md` + named companions; `skills/workspace/ws.029.presentation/SKILL.md` |
| Camera / Cam / Vision V chronology | `skills/frontend/spatial/camera-ladder-recovery/SKILL.md` + `hierarchy-runtime` |
| Contribution / PR / merge | `skills/workspace/ws.contribution.flow/SKILL.md` + merge-gate Issue **#133** |
| GitHub tool use | `skills/workspace/ws.tools.github/SKILL.md` |
| GitHub connection work | applicable `skills/workspace/ws.github.*` Skill |
| Secrets | `skills/workspace/ws.secrets.boundary/SKILL.md` |
| Verification | `skills/seat/seat.field.verification/SKILL.md` + browser/contract Skills as applicable |
| Backend / commerce | applicable `skills/backend/*` |
| Learning / continuity | `skills/governance/learning-handover/SKILL.md` |

SEAT_SKILLS and WORKSPACE_SKILLS are optional assignable procedures, not commerce SKUs and not required platform setups.

## 5. Merge / automation behavior

Issue **#133** remains the merge-gate owner. TeamAi uses draft-first PRs.

- Agents may implement and prepare a PR for review.
- Agents MUST NOT self-promote a draft solely because checks are green.
- Auto-merge is not a product execution policy.
- Required checks, canonical reconciliation, evidence, scope boundaries, and an authorized review decision are required before merge.
- Direct pushes to `main`, force-pushes, and required-check bypass remain forbidden.

## 6. Pass / evidence

A Grok session on TeamAi passes this alignment when:

- it did not add a competing auth/database/theme/runtime architecture;
- it loaded the TeamAi Skills for the slice actually executed;
- it used `Masterplan/NEXT_SLICES.md` as the current frontier rather than historical roadmap files;
- it left `AI_ASSISTANT_READ_ME.md` current for the session;
- historical continuity records remain under `docs/archive/` and `handover/` and are not used as active instructions;
- any Grok-host preview is not claimed as TeamAi production delivery.

## SEE ALSO

- `Product_Law/PRODUCT_LAW.md`
- `Product_Law/WIRING.md`
- `Masterplan/MASTERPLAN.md`
- `Masterplan/NEXT_SLICES.md`
- `POLICY.md`
- `docs/SKILL_WIRING.md`
- `AI_ASSISTANT_READ_ME.md`
- `skills/frontend/spatial/camera-ladder-recovery/SKILL.md`
- `skills/workspace/ws.029.presentation/SKILL.md`
- `backend/BACKEND_LIVE_SERVICE_STATUS.md`
- `docs/USER_MANUAL_DEPLOYMENT.md`
