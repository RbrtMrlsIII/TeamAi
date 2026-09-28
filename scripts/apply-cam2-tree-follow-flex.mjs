/**
 * Historical compatibility verification entry point.
 * The retired mutation engine is gone; validation must never rewrite the
 * committed Hero runtime artifact.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const syncScript = join(dirname(fileURLToPath(import.meta.url)), 'sync-hero-flex-runtime.mjs');
const result = spawnSync(process.execPath, [syncScript, '--check'], {
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
