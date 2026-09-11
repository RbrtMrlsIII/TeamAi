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

The root dispatcher is `skills/execution/orucaveam/SKILL.md`. It composes only the letters needed by the task and then adds the smallest sufficient field/domain and tool/system skills.

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
| Vercel web development / preview | 029 web verification | `skills/web/vercel-preview/SKILL.md` + applicable ORUCAVEAM/M skills | Vercel | Controlled deployed-browser verification (when connected; temporary cutoff is non-blocking) | CI/browser evidence |
| Spatial UI/UX | TEAM-EXPERIENCE-029 visual experience | `skills/frontend/spatial/UI_UX-Promax-Skill.md` + motion/transition/animation/responsive/accessibility companions + applicable ORUCAVEAM skills | TeamAi frontend/theme system | Theme-mode, accessibility, responsive, and browser verification | GitHub evidence + HandOver |
| 3D Hero lighting | TEAM-EXPERIENCE-029 Hero presentation | Same spatial family. Hero consumes `frontend/spatial/hero-theme-lighting-adapter.js`. **No Hero lighting/theme skill.** | Hero presentation + theme root | Static adapter/light-rig tests + Playwright | Issue #85/#96 + HandOver |
| 3D Hero hierarchy runtime | TEAM-EXPERIENCE-029 in-machine parent/open grammar | ORUCAVEAM + `skills/frontend/spatial/hierarchy-runtime/SKILL.md` + UI_UX-Promax + motion/responsive/accessibility. Numbers from `docs/TEAMAI_3D_HERO_HIERARCHY_RUNTIME_BASELINE.md` §9. | `public/hero-flex.js` + baseline doc | Named-number static tests; R1–R10 PR table; reduced-motion readability | Issue #142 + HandOver |
| 3D Hero Seat shell v1 | TEAM-EXPERIENCE-029 first parent fill | ORUCAVEAM + `skills/frontend/spatial/seat-shell-hierarchy/SKILL.md` + hierarchy-runtime + seat-read-model (later feed) | Hero presentation (in-machine leaves) | Part IDs, one-open, leaf-inside-shell static tests; optional open-silhouette frame | Issue #142 then Seat-open implementation issue |
| 3D Hero camera Cam↔V recovery | TEAM-EXPERIENCE-029 camera chronology (Issue #232) | ORUCAVEAM + `skills/frontend/spatial/camera-ladder-recovery/SKILL.md` + hierarchy-runtime. Ledger: `docs/TEAMAI_CAMERA_CAM_V_LADDER_RECONCILIATION.md`. | Cam modules + Vision V ladder | Cite ledger frontier; do not restart Cam-2 | Issue #232 + HandOver |
| Packaging | Every completed gate requiring full project package | `skills/packaging/project-package/SKILL.md` + applicable ORUCAVEAM/V/A/M skills | Project package script | Extracted-path + byte/hash equality | Full Project ZIP + manifest |

## 4. Field/domain expansion rule

A field skill family is a set of small direct procedures for a real recurring work domain. Examples include `backend/`, `commerce/`, `web/`, `engineering/`, `verification/`, `frontend/spatial/`, or `packaging/`.

A field skill must:

1. identify the governing Product Law/Masterplan concept;
2. state its owning authority;
3. provide direct executable steps;
4. state prohibited substitutions or scope violations;
5. define its pass/evidence condition; and
6. link back to the relevant ORUCAVEAM letter skills and canonical sources.

Do not create empty taxonomy folders. Expand the field family when a recurring bounded procedure demonstrates the need.

## 5. Checklist-to-skill rule

Every executable checklist item in `MASTERPLAN.md` must resolve to concrete skill paths or explicit `No skill required`.

## 6–14. Authority and integrity

See repository history for full sections 6–14 (ORUCAVEAM authority direction, ToolKit boundary, Grok mirrors, commerce frontend prep, hierarchy numbers, Cam↔V recovery). Unchanged by #260 except the table row above for user-directed validation.
