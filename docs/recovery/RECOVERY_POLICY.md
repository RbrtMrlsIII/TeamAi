# TeamAi Recovery Policy

## Scope

This recovery policy applies only to the TeamAi project and repository `RbrtMrlsIII/TeamAi`.

`HomeFinder-Official` is not a TeamAi source, mirror, backup, or recovery target.

## Recovery anchor

The PRE-029 restored baseline is the first durable recovery point:

- Archive: `TeamAi_PRE_029_PROJECT_RESTORED_BASELINE_CANONICAL.zip`
- SHA-256: `9990dbaf02b7c6d6bc8f55ae21889b4e633f40b066b515e7b97619bde3f7e89a`
- File inventory SHA-256: `cadc7c822cb91aa0524c356442f96ca15f8a27285e8fbe988d8666547f230583`

## Preservation rules

1. Recovery-point commits are append-only historical evidence.
2. Recovery anchors must never be force-pushed away.
3. Each implementation batch must identify its starting recovery point.
4. A restoration claim requires exact artifact/hash evidence, not a filename or memory.
5. Implementation completion is separate from restoration: `RESTORED_BASELINE` does not mean the product is complete.
6. Historical endorsements are never inferred from Git history; endorsement evidence follows TeamAi's canonical governance rules.
7. Any future baseline must preserve the previous recovery anchor and record the new artifact hash.

## Current gate

The TeamAi project is restored to the PRE-029 baseline, but implementation completeness remains open. Continue closing genuine implementation frontiers before claiming production frontend completion.
