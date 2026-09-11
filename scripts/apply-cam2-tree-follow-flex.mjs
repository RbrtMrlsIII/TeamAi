import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicPath = join(root, 'public/hero-flex.js');
const basePath = join(root, 'public/_flex_src/hero-flex.base.js');

/**
 * Stable command surface for the Hero flex assembly pipeline.
 * Ownership is delegated to the repository-local engine below.
 * The engine owns the Cam-2 / Cam-3 / Cam-4 path, including:
 *   hero-cam4-edge-swipe, proportionalSwipeDelta, inverseSwipeDelta, edgeDriftDelta
 *   flex-apply-integrity / assertFlexIntegrityOrExit / SP-04
 *   pinned base marker a2f8a3e
 *   V0.1 HERO_WIDE:{p:[0,d*.67,d]} → HERO_WIDE:{p:[0,d,d]} baseline reconciliation
 *   V0.2 Vision: return-to-baseline / V0.2 return baseline / V0.2 close baseline
 * Runtime/build source is repository-owned and must not use a cross-origin GitHub Raw source.
 */

// Always seed from the repository-owned source before invoking the patch engine.
// This makes the normal build/test path deterministic and network-independent.
writeFileSync(publicPath, readFileSync(basePath, 'utf8'));
await import('./apply-cam2-tree-follow-flex.engine.mjs');
