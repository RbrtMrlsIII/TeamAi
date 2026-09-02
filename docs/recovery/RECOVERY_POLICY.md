# TeamAi Recovery Policy

## Scope
This recovery policy applies only to the TeamAi project and repository `RbrtMrlsIII/TeamAi`.

`HomeFinder-Official` is not a TeamAi source, mirror, backup, or recovery target.

## Recovery anchor
The PRE-029 restored baseline is the first durable recovery point:
- Archive: `TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`
- SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`
- File inventory SHA-256: `cadc7c822cb91aa0524c356442f96ca15f8a27285e8fbe988d8666547f230583`

The canonical archive is the complete project-preservation surface. GitHub is the durable engineering/source-control surface and must remain aligned with the code and records intended for version control.

## Preservation rules
1. Recovery-point commits are append-only historical evidence.
2. Recovery anchors must never be force-pushed away.
3. Each implementation batch must identify its starting recovery point.
4. A restoration claim requires exact artifact/hash evidence, not a filename or memory.
5. Implementation completion is separate from restoration: `RESTORED_BASELINE` does not mean the product is complete.
6. Historical endorsements are never inferred from Git history; endorsement evidence follows TeamAi's canonical governance rules.
7. Any future baseline must preserve the previous recovery anchor and record the new artifact hash.
8. Do not require every archive member to exist in Git merely because it exists in the canonical ZIP.
9. Large binaries and generated/reference media are archive-first unless repository preservation is explicitly required by product, contract, implementation, runtime, fixture, or QA needs.
10. When an important binary must be version-controlled but the Development AI cannot transfer the bytes safely, the AI must stop and use the mandatory user-guided upload protocol rather than improvising credentials or alternate repositories.

## Binary/media upload protocol
For every exceptional GitHub binary upload, the Development AI must tell the user the exact local file, reason for repository storage, target repository, exact destination folder/path, exact PR number and branch, required user upload action, and post-upload verification step. The AI must never request or accept a PAT in chat.

## Workflow and duplication rules
- TeamAi uses only `RbrtMrlsIII/TeamAi`.
- `.github/workflows/TeamAi.yml` remains the single canonical workflow for the existing CI responsibility.
- Before creating any `.yml` or `.yaml`, inspect the existing workflow set and reuse/update an owning workflow rather than creating a duplicate.

## Current gate
The TeamAi project baseline is preserved and the GitHub restoration path is established. The active restoration gate must reconcile the repository's version-controlled code/records with the canonical archive while excluding unnecessary large media from Git. Implementation completeness remains open until independently evidenced.
