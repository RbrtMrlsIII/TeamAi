# TeamAi — Skill Wiring Map

**Status:** BASELINE WIRING MAP / PENDING ENDORSEMENT
**Purpose:** Navigate from canonical product meaning to executable skills, tools, verification, and evidence. This file is a wiring map, not a source of product authority and not a replacement for a skill-library README/index.

## 1. Resolution model

`Product Law concept + Masterplan item + field/domain + current phase + provider/service/runtime + permissions/policy → effective skill set`

Load the smallest sufficient skill bundle. A skill never grants authorization.

## 2. Canonical end-to-end paths

| Canonical area | Masterplan / phase source | Skill path | Primary tool/system | Verification | Evidence / continuation |
|---|---|---|---|---|---|
| Product Law change | Product Law / active phase | `skills/governance/product-law-change/SKILL.md` | Repository documents | Authority/discrepancy review | Handover + endorsement; Product Knowledge when learned |
| Masterplan checklist wiring | Masterplan | `skills/governance/masterplan-skill-wiring/SKILL.md` | Repository documents | Every executable item has skill/no-skill rationale | Wiring map + handover |
| Execution discipline | Policy | `skills/execution/orucaveam/SKILL.md` | Applicable tools | ORUCAVEAM gate record | Evidence + handover |
| Learning / teach-back | Completed execution | `skills/governance/learning-handover/SKILL.md` | Handover/endorsement docs | Learning acceptance and scope | `PRODUCT-KNOWLEDGE.md` + optional ToolKit candidate |
| Backend / Firebase | TEAM-BACKEND-001 / 029 backend dependency | `skills/backend/` (field family; create only when needed) | Firebase / Supabase | Authoritative backend evidence | Backend checkpoint/handover |
| Commerce | TEAM-BACKEND-001 / 029 commerce dependency | `skills/commerce/` (field family; create only when needed) | PayPal / Supabase / Firestore | Contract + runtime evidence | Commerce evidence + endorsement |
| Browser smoke | TEAM-EXPERIENCE-029 when UI exists | `skills/verification/browser-smoke/SKILL.md` | Playwright | Real browser assertions | CI report / trace |
| Vercel preview verification | 029 web verification | `skills/web/vercel-preview/SKILL.md` (to be created when Vercel is reactivated) | Vercel | Deployed-browser verification | CI/browser evidence |
| Packaging | Every completed gate requiring full project package | `skills/packaging/project-package/SKILL.md` (to be created if/when package execution is activated) | Project package script | Extracted-path + byte/hash equality | Full Project ZIP + manifest |

## 3. Checklist rule

Every executable checklist item in `MASTERPLAN.md` must resolve to one or more skill paths in this map, or explicitly state `No skill required` and why.

A missing skill is a wiring gap. It should not be solved by inventing undocumented ad-hoc procedure.

## 4. Skill detail pattern

A skill path should tell an agent directly:

`WHEN TO USE → INPUT → AUTHORITY → ACTION → DO NOT → PASS → EVIDENCE → SEE ALSO`

`SEE ALSO` may point to the governing Product Law section, Masterplan section, policy, contract, or deeper technical documentation.

## 5. Authority direction

`PRODUCT_LAW → MASTERPLAN → POLICY → SKILL → TOOL → VERIFICATION → KNOWLEDGE`

Handover and endorsement wrap the execution boundary; they do not become a higher product authority.

## 6. TeamAi / ToolKit boundary

TeamAi-specific skills and decisions remain in TeamAi. ToolKit receives only generalized, validated lessons. A ToolKit skill cannot silently overwrite a TeamAi Product Law or current project decision.
