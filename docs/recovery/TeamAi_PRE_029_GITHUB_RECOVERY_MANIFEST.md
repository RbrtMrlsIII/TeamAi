# TeamAi PRE-029 GitHub Recovery Manifest

Canonical restoration integrity record for the TeamAi GitHub repository.

- Baseline archive SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`
- Restored-tree files: `558`
- Restored-tree bytes: `3704933`
- File-inventory SHA-256: `cadc7c822cb91aa0524c356442f96ca15f8a27285e8fbe988d8666547f230583`
- Restoration: `RESTORED_BASELINE`
- Implementation completion: `OPEN`
- Foundation-006: `HISTORICAL_NUMBERING_GAP`
- Repository scope: **TeamAi only**. `HomeFinder-Official` is explicitly excluded.

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

The canonical ZIP plus this inventory is the PRE-029 recovery anchor. A future restored tree is considered identical only when its canonical archive hash and file-inventory hash match. Git history must preserve recovery-point commits; do not overwrite or force-push recovery anchors.
