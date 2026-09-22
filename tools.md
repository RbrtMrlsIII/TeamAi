# TeamAi Tool Registry & Operational Guide

> **Purpose:** keep TeamAi's tool surface understandable, bounded, and durable across developers, AI sessions, infrastructure changes, and newly discovered techniques.
>
> **Core rule:** a tool being connected, available, or technically capable of an operation does **not** make it authoritative for that operation.

**Last reviewed:** 2026-09-22  
**Current implementation vehicle:** PR #402 / branch `backend/030-production-runtime-evidence`  
**Repository:** `RbrtMrlsIII/TeamAi`

---

## 1. Why this file exists

TeamAi uses several systems that overlap in capability but must not overlap in authority.

This document records:

- what each tool is for;
- what it is authoritative for;
- what data it may hold or access;
- what it must **not** become responsible for;
- useful smaller/specialized uses;
- security and credential concerns;
- validation expectations;
- current integration status;
- techniques discovered during engineering work;
- known limitations and operational traps;
- how future developers/AI sessions should record newly discovered capabilities or tool changes.

This file is intentionally operational rather than promotional. The goal is to prevent tool drift, accidental authority duplication, stale assumptions, and the common mistake of treating "available" as "implemented."

---

## 2. Authority model

The current TeamAi authority boundaries are:

| Concern | Authority | Boundary |
| --- | --- | --- |
| Source code, branches, commits, reviews, PR governance | **GitHub** | Repository/change truth |
| Human/application identity | **Firebase Authentication** | Identity authority |
| TeamAi durable application/domain state | **Cloud Firestore (Firebase)** | Domain-state authority |
| Trusted server execution and provider/webhook boundary | **Supabase Edge Functions** | Server/runtime boundary |
| Relational/spatial backend capability | **Supabase PostgreSQL + PostGIS** | Spatial/database capability, not TeamAi domain authority |
| Production web delivery | **Firebase Hosting** | Production delivery authority |
| Browser behavior and real UI/runtime integration | **Browser validation** | Presentation/integration evidence |
| Independent numerical/geometry verification | **Python + container** | Mathematical verification |
| Current external technical facts | **Web** | External-source verification |
| AI/API integration configuration | **OpenAI Platform** | OpenAI platform setup/use |
| Large-scale analytical / historical warehouse | **Google BigQuery** | Analytics/evidence layer |
| Model/dataset research | **Hugging Face** | Research support |
| Cross-app automation/integration brokerage | **Composio** | Tool bridge, never TeamAi authority |
| Repository specification/document retrieval | **File Search** | Uploaded-project evidence |
| Visual asset generation | **Image generation / OpenArt** | Non-authoritative visual production |
| Product/demo video generation | **InVideo** | Demonstration material |
| Scheduled checks/reports | **Automations** | Operational scheduling, not state authority |

### Authority equations

These distinctions are intentionally repetitive because they are high-risk failure modes:

```text
capability != authorization
workspace != Firestore
identity != authorization
provider != runtime
runtime != model
seat != connection
configuration != execution
execution != acceptance
CI green != production proof
repository implementation != deployment
deployment != integration
integration != runtime proof
runtime proof != human acceptance
analytics != domain authority
```

**AUTHORITATIVE SOURCE > INFERENCE.**

---

## 3. Tool lifecycle states

Every tool in this registry should be classified using one of these states:

### ACTIVE

The tool is connected/usable and has a defined TeamAi role.

This does not necessarily mean every advertised feature is deployed.

### AVAILABLE BUT DORMANT

The capability exists and may become useful, but there is no active TeamAi dependency or current implementation contract.

Do not wire it into production merely because it is available.

### NOT CONNECTED / NOT AUTHORIZED

The tool may exist in the ecosystem, but the current environment cannot use it with the required permissions.

Do not infer access, credentials, or runtime capability.

### RETIRED / REPLACED

The project deliberately avoids this capability because it is obsolete, duplicative, insecure, or superseded.

Retired tools remain documented when their historical use could otherwise confuse future work.

---

# 4. Core tools

## 4.1 GitHub

**Status:** ACTIVE

### Role

GitHub is the source/change/governance authority for TeamAi.

### Use it for

- source code;
- branches and commits;
- pull requests;
- reviews;
- issue history;
- GitHub Actions and CI/CD evidence;
- diffs and exact-head validation;
- change history and architectural traceability.

GitHub documents pull requests as the mechanism for proposing, discussing, reviewing, and merging changes, and GitHub Actions as the CI/CD automation layer. See:
- https://docs.github.com/en/pull-requests
- https://docs.github.com/en/actions/get-started/understand-github-actions

### Do not use it as

- the application database;
- a runtime state store;
- a secret store;
- production proof by itself;
- a substitute for deployed-runtime validation.

### Security

- Never commit provider keys, private keys, access tokens, OAuth secrets, service-account JSON, or encryption material.
- Treat repository history as persistent evidence. A secret committed once can remain recoverable from history.
- Pin exact commits/heads when validating production-sensitive changes.
- Do not rely on an old green workflow run after the branch head changes.

### TeamAi technique

For non-trivial execution:

```text
inspect -> pin branch/head -> compare -> change -> validate exact head
-> review -> merge -> deploy -> browser/runtime validation -> observe
```

---

## 4.2 Firebase Authentication

**Status:** ACTIVE

### Role

Firebase Authentication is TeamAi's identity authority.

### Holds

- user identity;
- authentication state;
- configured authentication providers.

### Use it for

- sign-in/sign-up identity;
- authenticated user identity;
- identity tokens where the application contract requires them.

### Do not use it for

- TeamAi authorization policy by itself;
- Seat ownership/authorization state;
- provider credentials;
- application workflow state.

Identity establishes **who** a caller is. TeamAi domain authorization establishes **what they may do**.

### Security

- Authentication credentials are sensitive.
- Never log passwords, refresh tokens, ID tokens, or upstream provider credentials.
- Public Firebase web configuration is not equivalent to administrative credentials.

---

## 4.3 Cloud Firestore

**Status:** ACTIVE / AUTHORITATIVE

### Role

Firestore `(default)` is TeamAi's durable application/domain state authority.

### Holds

Examples include:

- workspaces;
- projects;
- teams;
- Seats;
- Seat connections;
- execution-related domain records;
- entitlements;
- commerce state;
- runtime evidence documents where explicitly designed.

### Use it for

- current application state;
- authoritative identity-linked domain records;
- durable workflow state;
- scoped application reads/writes governed by Firestore Rules.

### Do not use it as

- a raw analytics warehouse;
- a secret bucket;
- a browser-side trust boundary;
- an excuse to duplicate state into another database without a declared contract.

### Security

- Firestore Rules are part of the authority boundary.
- Server-side access must still respect the application's authorization model.
- Provider credentials must remain in the designated encrypted secret path and must never enter diagnostic documents.
- Collection/document paths must be validated exactly when the path itself expresses tenant/workspace/team authority.

### TeamAi technique: exact-path authority

When a canonical document path is known, read the exact path rather than introducing a broader collection-group query merely for convenience.

The 2026-09-22 production diagnostic demonstrated why this matters: a historical Seat collection-group query failed at the Firestore REST query boundary before the canonical Seat document was read. The successor evidence script therefore uses the exact team-nested Seat path.

See:
`docs/evidence/PRODUCTION_FIRESTORE_SEAT_DIAGNOSTIC_2026-09-22.md`

---

## 4.4 Supabase PostgreSQL + PostGIS

**Status:** ACTIVE / SPATIAL BACKEND CAPABILITY

### Role

Supabase provides the TeamAi trusted server/runtime boundary and PostgreSQL/PostGIS capability.

Current TeamAi production posture keeps Firestore authoritative for application/domain state while Supabase Edge Functions provide trusted server execution.

PostGIS is a PostgreSQL extension for geospatial data, including indexable geographic types and spatial queries. Supabase recommends installing it in a dedicated schema rather than `public`.
Source:
https://supabase.com/docs/guides/database/extensions/postgis

### Use it for

- trusted server-side runtime;
- backend provider/webhook execution;
- relational support where explicitly required;
- geospatial query capability;
- spatial indexes and database-side spatial operations.

### Do not use it as

- an accidental replacement for Firestore;
- an unauthorized application state store;
- the 3D machine-world renderer or its source of geometric truth.

### Security

- Apply least privilege.
- Do not expose sensitive tables directly to clients without the intended RLS model.
- Keep PostGIS out of `public` when appropriate.
- Do not place provider secrets into spatial tables.

### TeamAi spatial boundary

PostGIS can be an excellent backend spatial engine, but the machine-world renderer and its 3D geometry remain a separate domain/runtime concern. Backend capability should not silently become visual authority.

---

## 4.5 Firebase Hosting

**Status:** ACTIVE / PRODUCTION DELIVERY

### Role

Firebase Hosting is the production web delivery authority.

### Use it for

- serving the production TeamAi web build;
- validating production delivery after controlled deployment.

### Do not confuse with

- GitHub Pages, which is a browser-validation surface;
- Vercel, which is currently non-authoritative/paused.

A successful source build does not prove production hosting behavior.

---

## 4.6 Browser validation

**Status:** ACTIVE / SPECIALIZED

### Role

Browser validation proves actual browser integration and behavior.

### Use it for

- production/preview UI behavior;
- protected deployment flows;
- interaction testing;
- visual/runtime integration;
- browser-level evidence after deployment.

### Do not use it for

- GitHub repository management;
- source-of-truth discovery when a native repository connector exists;
- replacing backend/SQL/API diagnostics.

### Security

- Treat browser sessions as authenticated runtime contexts.
- Do not enter secrets merely to prove a feature when a safer non-secret test path exists.
- Record observed runtime results rather than inferring backend state from UI appearance.

---

## 4.7 Python + container

**Status:** ACTIVE / VERIFICATION

### Role

Independent computational verification.

### Use it for

- geometry calculations;
- numerical tolerances;
- reproducible data inspection;
- benchmark harnesses;
- cross-checking SQL/spatial calculations;
- validating generated artifacts;
- local diagnostics that should remain independent of the implementation under test.

### Do not use it as

- TeamAi production authority;
- a replacement for Firestore or Supabase;
- a hidden mutation engine.

### TeamAi geometry technique

For complex geometry, validate the implementation with an independent mathematical calculation rather than checking only that the application rendered successfully.

---

## 4.8 Web

**Status:** ACTIVE / EXTERNAL VERIFICATION

### Role

Current external technical truth.

### Use it for

- current vendor documentation;
- standards;
- API behavior;
- library/version changes;
- external geospatial information;
- current platform behavior.

### Do not use it as

- private repository truth when GitHub is authoritative;
- private Firebase/Supabase data access;
- proof of TeamAi's deployed state.

### Technique

Use official vendor documentation first for platform behavior. For rapidly changing behavior, record the document date/version or retrieval date in project notes when it materially affects an implementation.

---

## 4.9 OpenAI Platform

**Status:** ACTIVE WHEN AI FEATURES REQUIRE IT

### Role

OpenAI API configuration and integration surface.

### Use it for

- OpenAI API setup;
- API key lifecycle when explicitly authorized;
- current API documentation;
- model/API integration configuration.

### Do not use it as

- TeamAi application state authority;
- the provider budget/entitlement authority;
- a substitute for TeamAi's own execution and acceptance contract.

### Security

- API keys are secrets.
- Never commit them.
- Prefer managed secret/configuration mechanisms.
- Do not paste keys into diagnostic evidence.

---

## 4.10 Google BigQuery

**Status:** ACTIVE CONNECTION / CURRENTLY EMPTY DATASET SURFACE / ANALYTICAL

### Role

BigQuery is TeamAi's potential analytical warehouse and long-horizon evidence layer.

Google documents BigQuery as an analytical platform and supports geospatial analytics through the `GEOGRAPHY` type and geography functions.
Sources:
- https://cloud.google.com/bigquery
- https://docs.cloud.google.com/bigquery/docs/geospatial-intro

### Current TeamAi state

The connected Google Cloud project is `team-ai-official`.

As of 2026-09-22:

- the BigQuery connection is active;
- the project is accessible;
- there are currently no visible BigQuery datasets;
- there is no TeamAi production BigQuery data-plane contract yet.

### Intended uses

- historical execution analytics;
- provider behavior analysis;
- continuation/exhaustion analysis;
- budget utilization analysis;
- validation evidence aggregation;
- large benchmark datasets;
- large analytical joins;
- batch geospatial analytics.

### Do not use it for

- canonical user identity;
- current Firestore Seat state;
- current authorization state;
- live Connection authority;
- execution authorization;
- provider secrets;
- replacing Firestore;
- replacing PostGIS;
- replacing the 3D machine-world geometry engine.

### Important spatial limitation

BigQuery geospatial analytics does **not** support three-dimensional geometries, including WKT `Z` coordinates and GeoJSON altitude.
Source:
https://docs.cloud.google.com/bigquery/docs/geospatial-data

Therefore:

```text
BigQuery GEOGRAPHY -> large-scale 2D Earth-oriented analytics
TeamAi geometry engine -> 3D machine-world geometry/runtime
```

### Security

- Treat warehouse exports as potentially sensitive copies of application data.
- Define retention and deletion policy before exporting production records.
- Prefer minimized/derived analytical records over raw credentials or unnecessary PII.
- Never export provider secrets, encryption material, access tokens, passwords, or authentication credentials.
- Keep dataset access least-privileged.
- Dataset location must be intentionally selected before creation because BigQuery dataset location cannot be changed in place after creation.

### Firebase relationship

Firebase can export supported product data to BigQuery. Firestore data can also be exported through Firestore export mechanisms and loaded into BigQuery.
Sources:
- https://firebase.google.com/docs/projects/bigquery-export
- https://firebase.google.com/docs/firestore/manage-data/export-import

This does **not** make BigQuery the Firebase database. It is a downstream analytical copy or analytical target.

### TeamAi rule

Do not create a Firebase-to-BigQuery pipeline merely because the connection is available. First define:

```text
data class -> source authority -> export boundary
-> schema -> retention -> security -> consumer -> validation
```

A future BigQuery implementation should be a separate, explicitly scoped engineering slice rather than being smuggled into an unrelated runtime PR.

---

# 5. Supporting and specialized tools

## 5.1 Composio

**Status:** ACTIVE / INTEGRATION BROKER

### Role

Composio provides access to third-party application tools and helps bridge external systems.

### Use it for

- external application actions when a native TeamAi connector is unavailable;
- discovering specialized integrations;
- controlled automation across external applications.

### Do not use it as

- a new TeamAi authority;
- a substitute for GitHub native repository tools;
- a substitute for Supabase's native database/runtime capabilities;
- a reason to introduce an external database unnecessarily.

### Security

- Only use active authorized connections.
- Review tool schemas before execution.
- Do not guess tool slugs or parameters.
- Never expose credentials in prompts or diagnostics.
- Treat external application actions as side effects that require explicit intent and bounded scope.

### Technique learned

Composio tool discovery should be followed by complete input-schema inspection before execution. For dependent workflows, resolve IDs and prerequisites first rather than firing actions with placeholders.

---

## 5.2 Hugging Face

**Status:** AVAILABLE / SPECIALIZED

### Role

Model and dataset research.

### Use it for

- model metadata;
- dataset inspection;
- research experiments;
- ML component evaluation.

### Do not use it for

- TeamAi application state;
- user authorization;
- live provider execution authority.

### Security

- Validate licenses and dataset provenance.
- Avoid introducing models/datasets without recording version/provenance.
- Treat downloaded artifacts as untrusted until inspected.

---

## 5.3 File Search

**Status:** AVAILABLE / PROJECT EVIDENCE

### Role

Search uploaded project specifications, documents, datasets, issue exports, and design references.

### Use it for

- recovering historical project requirements;
- locating architecture specifications;
- searching supplied evidence;
- grounding implementation decisions in uploaded project material.

### Do not use it as

- live repository truth;
- live production database truth;
- a substitute for GitHub/Supabase/Firebase inspection.

### Technique

When a requested fact should come from an uploaded project artifact, search the uploaded files rather than reconstructing the fact from memory.

---

## 5.4 Image generation / OpenArt

**Status:** AVAILABLE / VISUAL SPECIALIZED

### Use it for

- visual concepts;
- non-authoritative mockups;
- spatial UI concepts;
- diagrams and presentation material.

### Do not use it for

- geometric truth;
- precise engineering calculations;
- production spatial measurements;
- source-of-truth visual specifications unless independently converted and validated.

Generated imagery is a visual artifact, not a measurement instrument.

---

## 5.5 InVideo

**Status:** AVAILABLE / DEMO SPECIALIZED

Use for:

- product walkthroughs;
- demos;
- explanatory videos.

Do not use for engineering validation or authoritative product behavior.

---

## 5.6 Automations

**Status:** AVAILABLE / OPERATIONAL SPECIALIZED

Use for:

- scheduled diagnostics;
- recurring health checks;
- recurring reports;
- monitoring workflows after the engineering contract is stable.

Do not use as a hidden substitute for application runtime state.

---

# 6. Tool selection decision tree

Before using a tool, ask:

```text
1. What fact/state/action is required?
        |
        v
2. Which system owns that concern?
        |
        +-- source/change -> GitHub
        +-- identity -> Firebase Auth
        +-- domain state -> Firestore
        +-- trusted runtime -> Supabase Edge Functions
        +-- spatial DB capability -> PostGIS
        +-- production web -> Firebase Hosting
        +-- browser behavior -> Browser validation
        +-- independent math -> Python/container
        +-- current external facts -> Web
        +-- historical analytics -> BigQuery
        +-- AI API configuration -> OpenAI Platform
        |
        v
3. Is the tool authorized and connected?
        |
        v
4. Have its current inputs/schema/limitations been verified?
        |
        v
5. Is the operation read-only or mutating?
        |
        v
6. What independent evidence will prove the result?
```

When two tools can perform the same operation, prefer the tool that owns the authority for that concern.

---

# 7. Tool-to-tool boundaries

### GitHub vs Browser

GitHub proves repository/change state.

Browser validation proves actual browser behavior.

One does not substitute for the other.

### Firestore vs BigQuery

Firestore answers:

> "What is the current authoritative TeamAi application state?"

BigQuery answers:

> "What can we learn from historical/analytical data?"

BigQuery is downstream analytical infrastructure, not a second application database.

### Firestore vs Supabase

Firestore is the TeamAi application/domain authority.

Supabase Edge Functions provide trusted server execution; Postgres/PostGIS provides backend capability where explicitly needed.

Do not create mirrored domain state without a declared synchronization contract.

### PostGIS vs TeamAi 3D renderer

PostGIS is a spatial database capability.

The machine-world renderer is a 3D visual/runtime system.

Do not assume that a successful PostGIS query proves renderer correctness.

### CI vs production

A green workflow proves what the workflow ran against a particular commit and environment.

It does not, by itself, prove production deployment state.

---

# 8. Security model

## 8.1 Never store

TeamAi tools must never place these into ordinary documentation, evidence, logs, generated diagnostics, or source:

- provider API keys;
- OAuth access/refresh tokens;
- private keys;
- service-account private material;
- encryption keys;
- encrypted credential ciphertext/IV unless the storage contract explicitly requires it;
- passwords;
- authentication tokens;
- payment secrets.

## 8.2 Safe metadata

Diagnostic and analytical records should prefer:

- IDs;
- field-name inventories;
- status;
- capabilities;
- provider names;
- timestamps;
- counts;
- non-secret configuration metadata;
- hashes or opaque references where appropriate.

## 8.3 Side-effect discipline

Before a mutating tool call:

```text
identify authority
-> identify exact target
-> inspect schema
-> understand side effect
-> verify authorization
-> execute once
-> read back/validate
```

Avoid broad destructive actions during exploratory work.

---

# 9. Evidence rules

TeamAi uses a hierarchy of evidence:

```text
AUTHORITATIVE LIVE SYSTEM
        >
DEPLOYED RUNTIME EVIDENCE
        >
EXACT-HEAD CI / TEST EVIDENCE
        >
REPOSITORY SOURCE
        >
DOCUMENTATION / DESIGN INTENT
        >
INFERENCE
```

Historical evidence must be labeled as historical.

A previous successful run does not prove the current head.

A source implementation does not prove deployment.

A deployment does not prove integration.

An integration does not prove runtime behavior.

A runtime success does not automatically prove product acceptance.

---

# 10. Newly discovered tool knowledge protocol

This section is mandatory for future sessions.

When someone discovers a new capability, integration, limitation, security concern, or better technique:

### 10.1 Do not keep the discovery only in chat

Record it in this file when it is reusable knowledge.

### 10.2 Update the current tool entry

Add:

- capability;
- limitation;
- intended TeamAi use;
- prohibited use;
- security implications;
- evidence/source;
- current status.

### 10.3 Add a discovery record

Use this format:

```text
### YYYY-MM-DD: <tool> - <discovery>

Finding:
<what was learned>

Why it matters:
<architectural / operational consequence>

Validated by:
<source, live inspection, test, runtime evidence, or documentation>

Action:
<doc-only / code change / deployment change / no action>

Status:
<accepted / pending validation / rejected>
```

### 10.4 Tool updates

When a tool changes:

1. Update its current registry entry.
2. Record the changed behavior in the discovery log.
3. Record affected TeamAi workflows.
4. Re-check security and authority boundaries.
5. Re-run relevant validation before claiming compatibility.

Do not merely append "Tool X updated." State what changed.

### 10.5 New tools

When a new tool is added:

```text
new tool
-> status
-> authority role
-> intended use
-> forbidden use
-> data held
-> security model
-> validation method
-> owner/boundary
-> documentation source
```

Then add it to the authority table.

### 10.6 Removed tools

When a tool is removed or replaced:

- change its lifecycle state to RETIRED / REPLACED;
- record why;
- identify the replacement, if any;
- avoid deleting the historical record when future sessions could otherwise rediscover the same dead end.

---

# 11. Current known TeamAi tool inventory

| Tool | Current state | Primary TeamAi role |
| --- | --- | --- |
| GitHub | ACTIVE | Source/change/governance authority |
| Firebase Auth | ACTIVE | Identity |
| Firestore | ACTIVE / AUTHORITY | Durable domain/application state |
| Supabase Edge Functions | ACTIVE | Trusted server/runtime boundary |
| Supabase Postgres | ACTIVE | Backend relational capability |
| PostGIS | ACTIVE / CAPABILITY | Spatial database capability |
| Firebase Hosting | ACTIVE | Production delivery |
| Browser validation | ACTIVE | Browser/runtime evidence |
| Python | ACTIVE | Independent numerical verification |
| Container | ACTIVE | Reproducible local diagnostics |
| Web | ACTIVE | Current external facts |
| OpenAI Platform | AVAILABLE / FEATURE-DEPENDENT | AI API integration |
| BigQuery | ACTIVE CONNECTION / EMPTY | Analytics/evidence warehouse |
| Composio | ACTIVE | External integration broker |
| Hugging Face | AVAILABLE | Model/dataset research |
| File Search | AVAILABLE | Uploaded-project evidence |
| Image generation / OpenArt | AVAILABLE | Visual artifacts |
| InVideo | AVAILABLE | Product demos |
| Automations | AVAILABLE | Scheduled operations |

---

# 12. Current TeamAi tool-chain doctrine

The canonical development loop remains:

```text
inspect
  -> reason
  -> independently validate
  -> change
  -> test
  -> review
  -> exact-head verify
  -> merge
  -> deploy
  -> browser validate
  -> observe
  -> update this registry when new tool knowledge is discovered
```

The quality target is not the largest toolset.

It is the most reliable chain of authority and evidence.

---

# 13. References

Official platform references used for this registry include:

- GitHub pull requests: https://docs.github.com/en/pull-requests
- GitHub Actions: https://docs.github.com/en/actions/get-started/understand-github-actions
- Firebase BigQuery export: https://firebase.google.com/docs/projects/bigquery-export
- Firestore export/import and BigQuery loading: https://firebase.google.com/docs/firestore/manage-data/export-import
- BigQuery geospatial analytics: https://docs.cloud.google.com/bigquery/docs/geospatial-intro
- BigQuery geospatial constraints: https://docs.cloud.google.com/bigquery/docs/geospatial-data
- Supabase PostGIS: https://supabase.com/docs/guides/database/extensions/postgis

---

# 14. Discovery log

### 2026-09-22: BigQuery - analytical warehouse capability

**Finding:** The TeamAi Google Cloud project is accessible through the active BigQuery connection, while no BigQuery datasets are currently present.

**Why it matters:** BigQuery can be introduced later as an analytical/evidence layer without creating an accidental second domain database.

**Validated by:** live BigQuery project/dataset inventory.

**Action:** document capability now; defer production data-plane implementation to a separately scoped slice.

**Status:** accepted.

### 2026-09-22: BigQuery - 3D limitation

**Finding:** BigQuery geospatial analytics does not support 3D geometries.

**Why it matters:** it can support large-scale Earth-oriented 2D analytics but is not the authoritative engine for TeamAi's 3D machine-world geometry.

**Validated by:** current Google Cloud documentation.

**Action:** preserve the 3D geometry boundary.

**Status:** accepted.

### 2026-09-22: Firestore - exact-path diagnostic boundary

**Finding:** the historical collection-group Seat diagnostic failed with Firestore REST HTTP 400 before the canonical Seat document was read.

**Why it matters:** broad collection-group discovery is not a substitute for exact known-path verification.

**Validated by:** production diagnostic run and successor repository implementation.

**Action:** use the exact team-nested Seat path for the fresh evidence vehicle.

**Status:** accepted.

---

### 2026-09-22: GitHub Actions - manual dispatch requires a default-branch workflow

Finding:
The new PR #402 workflow firestore-production-evidence.yml could not be manually dispatched from backend/030-production-runtime-evidence. GitHub returned HTTP 404 because the workflow is not present on the default branch.

Why it matters:
A workflow_dispatch definition is required to exist on the default branch before it can be manually triggered. This is a platform boundary, not a repository defect.

Security implication:
Do not convert a production-secret workflow into an untrusted pull-request execution path merely to bypass this rule. That would widen the secret exposure boundary.

Validated by:
Live GitHub workflow-dispatch attempt plus current GitHub Actions documentation.

Action:
Keep the production evidence workflow scoped to PR #402 and do not mutate main merely to make the new workflow dispatchable. Use an already-authorized default-branch execution vehicle only when it exactly matches the intended evidence contract.

Status:
Recorded as an execution blocker; no insecure bypass adopted.

## 15. Maintenance rule

**This file is living engineering knowledge.**

A future developer or AI session that learns something reusable about a tool must update `tools.md` before the knowledge disappears into chat history.

The registry should grow in **precision**, not just in length.

Prefer:

> "BigQuery can do X, but TeamAi must use it only for Y because Z."

over:

> "BigQuery is connected."

That distinction is the purpose of this file.
