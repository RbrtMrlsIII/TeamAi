# TeamAi — Full Project ZIP & Artifact Policy

**Status:** CANONICAL PROJECT-PACKAGING POLICY
**Authority:** This policy operationalizes `PRODUCT_LAW.md` and `AI_ASSISTANT_READ_ME.md`. It does not create a competing source authority.

## 1. Full Project ZIP is a first-class project state

The **Full Project ZIP is not an optional add-on feature**. It is the portable project-package representation used for phase handover, bulk editing, recovery, review, and controlled transfer of a TeamAi project state.

The GitHub repository remains the engineering/source authority. The Full Project ZIP is a reproducible package of that authoritative project tree, not a second source of truth.

A phase/gate handover that requires a project package is incomplete until the corresponding package has been produced, contents verified against the canonical repository state, and the required deliverable has been delivered through the supported handover path.

Ordinary implementation CI may generate and upload a ZIP as a derived verification artifact. That artifact is not itself a completed user handover.

## 2. Canonical packaging relationship

The package target is:

`GitHub canonical tracked tree at pinned commit → deterministic flattened ZIP → extraction → byte-for-byte file-content verification → supported handover delivery when required`

The ZIP MUST:

- represent the repository project root directly;
- contain no extra outer project directory;
- preserve every canonical tracked file required by the package policy;
- preserve each included file's exact bytes;
- preserve paths exactly relative to the project root;
- be reproducible from the same pinned repository commit;
- carry no secrets, local credentials, or generated runtime artifacts.

ZIP archive container bytes may differ between implementations or compression settings. **The byte-to-byte invariant applies to the extracted project file bytes and relative paths**, not to the ZIP container metadata itself.

## 3. Flattening rule

A Full Project ZIP is **flattened** at the project root.

Correct:

`AI_ASSISTANT_READ_ME.md`
`src/...`
`docs/...`
`package.json`

Incorrect:

`TeamAi/AI_ASSISTANT_READ_ME.md`
`TeamAi/src/...`

The extraction root must reconstruct the repository tree directly.

## 4. Repository/package equality rule

The package builder MUST use the canonical repository tracked-file set, not an ad-hoc filesystem walk.

At the pinned commit:

`expected paths = git ls-files`

and after extraction:

`actual paths = ZIP contents`

The verification MUST require:

`expected paths == actual paths`

and for every path:

`SHA-256(extracted bytes) == SHA-256(canonical repository bytes)`.

A package MUST NOT be declared synchronized when files were omitted, invented, renamed, transformed, normalized, line-ending-converted, or otherwise altered.

## 5. Artifact rules

Generated/runtime artifacts are **not project source** and MUST NOT enter the Full Project ZIP.

The package MUST exclude untracked generated content such as:

- screenshots and browser captures;
- generated visual evidence images;
- Vercel/Firebase preview output;
- build output (`dist/`, `.next/`, `out/`);
- dependency trees (`node_modules/`);
- test/coverage reports;
- temporary/cache directories;
- generated logs and execution dumps;
- local emulator state;
- deployment caches;
- editor/IDE workspace state;
- local environment/secrets files.

The builder uses the tracked-file set, so ordinary untracked artifacts are naturally excluded. **A tracked file that violates these rules is not silently omitted; packaging MUST fail and the repository state must be reconciled first.**

## 6. Artifact-image rule

Artifact images are forbidden in the Full Project ZIP.

An image that is a genuine product/source asset may remain part of the canonical tracked tree when it is intentionally required by the product. Generated screenshots, browser captures, UI evidence images, temporary diagrams, Vercel previews, test captures, and similar artifact imagery are not source assets and MUST NOT be committed or packaged.

When classification is ambiguous, treat the image as a packaging blocker until the TeamAi Development Team classifies it explicitly and, when appropriate, moves it to a canonical source-asset location with source-asset intent.

This boundary reflects the artifact investigation already carried into TeamAi's canonical policy: generated screenshots/captures and similar visual artifacts are not the project source package. They remain external verification artifacts where needed, not Full Project ZIP contents.

## 7. Secrets and environment rule

Tracked secrets and local credential files are packaging blockers. The Full Project ZIP MUST NOT contain provider tokens, service-account private keys, local `.env` secrets, signing material, or equivalent credentials.

Example/configuration files may be packaged when they contain placeholders rather than live secrets.

## 8. Bulk-edit rule

The Full Project ZIP is the preferred handoff/editing unit for **coherent bulk changes**. Before a bulk implementation commit:

`canonical repository state → Full Project ZIP → full edit → package verification → one coherent repository change/PR`

This minimizes fragmented commits and reduces accidental external preview/deployment churn.

The ZIP does not authorize bypassing GitHub review. After bulk editing, the resulting project tree MUST return to GitHub as the source/change authority through the normal branch/PR workflow.

## 9. Handover enforcement rule

A handover may be represented as **complete** only when all required handover components are present, including the Full Project ZIP whenever the declared handover scope is a full-project handover.

Required chain:

`handover declared → pinned commit/tree → Full Project ZIP produced → package verification PASS → deliverable exists → supported user delivery/reference recorded`

When a declared full-project handover has no verified deliverable, the handover gate MUST fail. An implementation, CI pass, or uploaded workflow artifact alone does not silently satisfy a user-handover requirement unless the handover record explicitly identifies that artifact as the supported deliverable and its verification covers the pinned handover scope.

This enforcement is deliberately separate from ordinary implementation execution: this baseline PR establishes the rule, while the final user-facing Full Project ZIP handover occurs when the repository state is ready for that handover.

## 10. 029 operating rule

For TEAM-EXPERIENCE-029, the preferred sequence is:

`approved 029 baseline → full project package → coherent implementation edit → package/tree verification → GitHub CI → controlled Vercel web verification when useful → review → merge`

Vercel may be used for relevant web development, preview, browser interaction, or end-to-end verification across the web surface. It is **not limited to UI-only work**, but it remains non-authoritative for hosting/delivery, backend/domain state, commerce, scheduler authority, architecture acceptance, or completion.

## 11. Relationship to authoritative platforms

- GitHub = source/change authority.
- GitHub Actions = engineering verification/execution surface.
- Firestore `(default)` = canonical durable TeamAi domain/application state.
- Firebase Hosting = current TeamAi web delivery authority.
- Vercel = controlled non-authoritative web development/preview/browser-verification surface.
- Supabase Edge Functions = trusted server execution.
- PayPal = external payment-event authority.
- Founder Pulse = read-only operational observation.

The Full Project ZIP does not replace any of these authorities.

## 12. Verification record

A valid package record should identify:

- source repository and pinned commit SHA;
- package filename/version;
- file count;
- excluded generated/untracked artifact classes;
- any intentionally included source assets;
- package SHA-256 when useful;
- extracted-tree verification result;
- supported handover delivery/reference when a handover is declared.

The package is a reproducible project-state artifact, not a deployment result and not implementation proof by itself.
