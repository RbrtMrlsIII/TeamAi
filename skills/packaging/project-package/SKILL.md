# Project Package Skill

## WHEN TO USE
Use when producing or verifying the Full Project ZIP required by a TeamAi checkpoint, handover, or baseline.

## INPUT
Pinned GitHub commit/tree, repository package rules, and intended output location.

## AUTHORITY
GitHub tracked source is the canonical source tree. The ZIP is a derived project-state package and never a second source authority.

## ACTION
1. Pin the exact repository commit/tree.
2. Derive the package from the tracked file set.
3. Flatten the package at the project root; do not add an outer repository directory.
4. Reject forbidden/generated artifacts, secrets, runtime caches, build output, and generated evidence images.
5. Verify extracted relative paths and file bytes/hashes against the pinned tracked tree.
6. Record the package manifest and verification result.

## DO NOT
- Build the ZIP from an unpinned working tree.
- Silently omit a tracked generated artifact that violates package rules.
- Treat the ZIP as a new source authority.

## PASS
The extracted package contains exactly the intended relative paths and file bytes from the pinned canonical tree, subject to the explicit packaging policy.

## EVIDENCE
Pinned commit/tree, package manifest, verification output, artifact-clean status, and handover reference.

## SEE ALSO
- `POLICY.md`
- `docs/PROJECT_ZIP_AND_ARTIFACT_POLICY.md`
- `docs/SKILL_WIRING.md`
