# TeamAi — Skill Wiring Map

**Status:** BASELINE WIRING MAP / PENDING ENDORSEMENT  
**Purpose:** Navigate from canonical product meaning to ORUCAVEAM execution skills, field/domain skills, tool/system skills, verification, and evidence. This file is a wiring map, not a source of product authority and not a replacement for the skill-library README/index.

## 1. Resolution model

`Product Law concept + Masterplan item + field/domain + current phase + provider/service/runtime + permissions/policy → effective skill bundle`

Load the smallest sufficient skill bundle. A skill never grants authorization.

## 2. Single ORUCAVEAM skill family

ORUCAVEAM is the single execution-discipline framework. It contains one integrated sequence with **M — Minimalistic Efficiency / Resource Use** as its final dimension. There is no separate O-R-U-C-A-V-E-A lifecycle or secondary execution framework.

| Letter | Execution concern | Direct skill |
|---|---|---|
| O | Objective | `skills/execution/orucaveam/objective/SKILL.md` |
| R | Restrictions | `skills/execution/orucaveam/restrictions/SKILL.md` |
| U | User Authority / permission basis | `skills/execution/orucaveam/user-authority/SKILL.md` |
| C | Canonical Authority | `skills/execution/orucaveam/canonical-authority/SKILL.md` |
| A | Action | `skills/execution/orucaveam/action/SKILL.md` |
| V | Verification | `skills/execution/orucaveam/verification/SKILL.md` |
| E | Efficiency | `skills/execution/orucaveam/efficiency/SKILL.md` |
| A | Audit | `skills/execution/orucaveam/audit/SKILL.md` |
| M | Minimalistic Efficiency / Resource Use | `skills/tools/minimal-tool-usage/SKILL.md` |

The root dispatcher is `skills/execution/orucaveam/SKILL.md`.

## 3. Canonical end-to-end paths

| Canonical area | Masterplan / phase source | ORUCAVEAM + field/tool skill routing | Primary tool/system | Verification | Evidence / continuation |
|---|---|---|---|---|---|
| Product Law change | Product Law / active phase | `skills/governance/product-law-change/SKILL.md` + applicable ORUCAVEAM skills | Repository documents | Authority/discrepancy review | HandOver + endorsement; Product Knowledge when learned |
| Masterplan checklist wiring | Masterplan | `skills/governance/masterplan-skill-wiring/SKILL.md` + applicable ORUCAVEAM skills | Repository documents | Every executable item has concrete skill routing or no-skill rationale | Wiring map + HandOver |
| Active-index coupling | Any PR touching `public/`, `backend/`, `supabase/`, or `skills/` | `skills/governance/active-index-coupling/SKILL.md` + ORUCAVEAM | `verify-active-index.mjs` + canonical indexes | Governance-drift PASS; full MASTERPLAN (no truncation); required indexes in same PR | CI governance-drift job |
| User-directed validation change / concept retirement | Product truth vs tests/gates conflict, or post-merge supersession | `skills/governance/user-directed-validation/SKILL.md` + ORUCAVEAM | Contract + archive + validators | Warning before gate change; fail-closed CI; archive redirects | Issue #260 protocol + `docs/archive/superseded/` |
| Execution discipline | Policy | `skills/execution/orucaveam/SKILL.md` + applicable letter skills | Applicable tools | ORUCAVEAM gate record | Evidence + HandOver |
| Learning / teach-back | Completed execution | `skills/governance/learning-handover/SKILL.md` + applicable ORUCAVEAM/Audit skills | HandOver/Endorsement docs | Learning acceptance and scope | `PRODUCT-KNOWLEDGE.md` + optional ToolKit candidate |
| Backend / Firebase | TEAM-BACKEND-001 / 029 backend dependency | ORUCAVEAM + concrete backend skill family | Firebase / Firestore / Supabase | Authoritative backend evidence | Backend checkpoint/HandOver |
| Commerce | TEAM-BACKEND-001 / 029 commerce dependency | ORUCAVEAM + `skills/backend/commerce-paypal/SKILL.md` + `skills/backend/verification-recovery/SKILL.md` | PayPal / Supabase / Firestore | Contract + runtime + direct aggregate/event/entitlement read | Commerce evidence + HandOver/endorsement |
| Commerce UI read model | TEAM-EXPERIENCE-029 commerce frontend dependency | ORUCAVEAM + `skills/frontend/spatial/commerce-read-model/SKILL.md` + `skills/frontend/spatial/UI_UX-Promax-Skill.md` + browser verification | TeamAi frontend/read-model layer | Read-only contract, state mapping, accessibility, responsive browser verification | Commerce UI contract + evidence + HandOver |
| Browser smoke | TEAM-EXPERIENCE-029 when UI exists | `skills/verification/browser-smoke/SKILL.md` + applicable ORUCAVEAM skills | Playwright | Real browser assertions | CI report / trace |
| Vercel web development / preview | 029 web verification | `skills/web/vercel-preview/SKILL.md` + applicable ORUCAVEAM/M skills | Vercel | Controlled deployed-browser verification | CI/browser evidence |
| Spatial UI/UX | TEAM-EXPERIENCE-029 visual experience | `skills/frontend/spatial/UI_UX-Promax-Skill.md` + companions + ORUCAVEAM | TeamAi frontend/theme system | Theme-mode, accessibility, responsive, browser verification | GitHub evidence + HandOver |
| 3D Hero lighting | TEAM-EXPERIENCE-029 Hero presentation | Spatial family; **No Hero lighting/theme skill.** | Hero + theme root | Static adapter tests + Playwright | Issue #85/#96 + HandOver |
| 3D Hero hierarchy runtime | TEAM-EXPERIENCE-029 | `skills/frontend/spatial/hierarchy-runtime/SKILL.md` + numbers from hierarchy baseline §9 | `public/hero-flex.js` | Named-number static tests; R1–R10 | Issue #142 |
| 3D Hero Seat shell v1 | TEAM-EXPERIENCE-029 | `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` | Hero presentation | Part IDs, one-open tests | Issue #142 |
| 3D Hero camera Cam↔V recovery | Issue #232 | `skills/frontend/spatial/camera-ladder-recovery/SKILL.md` | Cam modules + Vision V | Cite ledger; do not restart Cam-2 | Issue #232 |
| Packaging | Full project package gates | `skills/packaging/project-package/SKILL.md` | Project package script | Extracted-path + hash equality | Full Project ZIP |

## 4–14. Unchanged body (summary)

Sections on field expansion, checklist-to-skill, skill detail pattern, authority direction, ToolKit boundary, Grok skill mirrors (§8b), wiring integrity, commerce frontend prep, hierarchy numbers vs skills, Grok Skills alignment, and Cam↔V camera chronology remain as on `main` before this PR. Agents must not invent a second ORUCAVEAM or second theme root. Repository `skills/**` + Product Law win over mirrors.

**#260 addition:** user-directed validation / concept retirement routes through `skills/governance/user-directed-validation/SKILL.md` and `docs/GOVERNANCE_USER_DIRECTED_VALIDATION.md` with archive redirects under `docs/archive/superseded/`.
