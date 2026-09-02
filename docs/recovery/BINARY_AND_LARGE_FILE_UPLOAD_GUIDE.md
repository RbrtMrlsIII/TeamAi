# TeamAi Binary and Large-File Upload Guide

## Purpose

This guide defines how Development AI agents handle important binary or large files that belong in GitHub but cannot be transferred safely through the connected GitHub interface.

The default preservation surface is the canonical TeamAi project ZIP. GitHub is for durable engineering history and repository-managed source/records. Do not upload large media merely for visual parity with the archive.

## When GitHub storage is required

A binary or large file may require GitHub preservation when it is a real version-controlled engineering dependency, such as:

- source 3D/spatial asset required by implementation;
- runtime asset required by the application;
- deterministic test fixture or QA reference required to reproduce a check;
- approved binary artifact whose history must be reviewed with the code; or
- another explicit repository dependency established by Product Law, a contract, implementation design, or QA requirement.

Generated planning boards, screenshots, visual findings, and other reference media remain archive-first unless an authority or technical dependency requires repository storage.

## Mandatory escalation before user upload

The Development AI must not improvise a binary upload route. Before asking the user to upload anything, create or identify the active TeamAi PR and provide all of the following in the intervention report:

1. **Exact source file:** local path and filename.
2. **Reason:** why repository storage is required and why archive-only storage is insufficient.
3. **Repository:** `RbrtMrlsIII/TeamAi` only.
4. **Exact destination:** repository folder/path.
5. **Exact PR:** PR number and branch name where the file will be introduced.
6. **User action:** the precise GitHub UI or approved transfer action needed.
7. **Post-upload verification:** SHA/size/path or other evidence the agent will check after the upload.

The agent must wait for the user's intervention where the tooling cannot safely transfer the local bytes.

## Credentials

Never request, paste, log, commit, or document a GitHub PAT or other credential. The existence of GitHub access does not authorize an agent to expose credentials in chat or repository content.

## Folder placement

Use the narrowest existing canonical folder that matches the artifact's purpose. Do not create a new top-level folder simply to hold one binary without first checking the repository structure and authority model.

Examples of placement decisions must be based on the actual artifact and current repository structure. When uncertain, use `REVIEW_REQUIRED`.

## PR discipline

The upload must be part of a specific TeamAi PR. The intervention message must name the exact PR number so the user never has to guess where the file belongs.

After upload, the Development AI must verify:

- expected path exists;
- file size and content hash are consistent with the supplied source where available;
- no duplicate copy was introduced;
- no HomeFinder path or repository was used; and
- the PR diff contains only the intended binary/file change plus its necessary documentation.

## 3D and spatial assets

3D/spatial files are a common exception because implementation may depend on them. Even then, the agent must establish that the asset is a real implementation dependency before requesting GitHub storage.

A generated spatial reference board is not automatically a source 3D asset. Preserve the distinction between reference media and implementation artifacts.

## Archive alignment

The canonical project ZIP remains the complete project-preservation artifact. GitHub does not have to become a byte-for-byte mirror of every ZIP member. The goal is reliable alignment of the repository's version-controlled engineering surface with the canonical project state, with large media preserved in the archive unless specifically promoted to repository-managed status.
