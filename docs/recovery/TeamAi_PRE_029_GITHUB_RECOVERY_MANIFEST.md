# TeamAi PRE-029 GitHub Recovery Manifest

Canonical restoration integrity record for the TeamAi GitHub repository and canonical project archive.

- Baseline archive: `TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`
- Baseline archive SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`
- Canonical archive files: `556`
- Canonical archive bytes: `3696424`
- Archive media policy: **archive-first by default**
- GitHub repository surface: version-controlled TeamAi code, migrations, tests, contracts, operational/recovery records, and approved repository dependencies
- Implementation completion: `OPEN`
- Foundation-006: `HISTORICAL_NUMBERING_GAP`
- Repository scope: **TeamAi only**. `HomeFinder-Official` is explicitly excluded.

## Canonical preservation model

The canonical ZIP is the complete PRE-029 project snapshot and recovery artifact. GitHub does not have to contain every ZIP member. GitHub must remain aligned with the project state intended for version control.

Large planning/reference media is not required in Git solely because it is present in the ZIP. An important binary may be promoted to Git only when Product Law, a contract, implementation, runtime, fixture, or QA need establishes that repository storage is required.

## Top-level inventory

| Root | Files | Bytes |
|---|---:|---:|
| `(root)` | 19 | 328958 |
| `.agent` | 55 | 64306 |
| `build-system` | 82 | 204610 |
| `builds` | 82 | 127544 |
| `contracts` | 1 | 422 |
| `dist` | 39 | 63080 |
| `docs` | 201 | 2799692 |
| `migrations` | 8 | 18720 |
| `product-skills` | 12 | 4003 |
| `schemas` | 2 | 2316 |
| `src` | 41 | 72454 |
| `tests` | 11 | 16137 |
| `validation` | 5 | 2691 |

## Recovery rule

The canonical ZIP is the complete recovery anchor. GitHub is the durable engineering-history anchor. A restoration claim must state which preservation surface is being verified; do not treat archive membership and Git membership as automatically identical requirements.

Recovery-point commits remain append-only historical evidence. Do not overwrite or force-push recovery anchors.

For binary upload exceptions, follow `docs/recovery/BINARY_AND_LARGE_FILE_UPLOAD_GUIDE.md` and provide the user the exact destination path and exact PR number before manual upload.
