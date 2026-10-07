import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import {
  MACHINE_SPATIAL_RUNTIME_FILES,
  MACHINE_SPATIAL_RUNTIME_PUBLIC_TARGETS,
} from '../scripts/machine-spatial-runtime-manifest.mjs';

test('machine spatial runtime manifest covers canonical renderer direct imports', () => {
  const renderer = readFileSync(
    'frontend/spatial/machine-world-renderer.js',
    'utf8',
  );
  const directImports = [...renderer.matchAll(
    /import\s+[^'"]+from\s+['"]\.\/([^'"]+\.js)['"]/g,
  )].map((match) => match[1]);

  const published = new Set(MACHINE_SPATIAL_RUNTIME_FILES);
  const aliases = new Map(Object.entries(MACHINE_SPATIAL_RUNTIME_PUBLIC_TARGETS));

  for (const imported of directImports) {
    if (published.has(imported)) continue;
    const canonicalSource = [...aliases.entries()]
      .find(([, publicTarget]) => publicTarget === imported)?.[0];
    assert.ok(
      canonicalSource && published.has(canonicalSource),
      'unpublished canonical renderer import: ' + imported,
    );
  }

  assert.ok(published.has('machine-world-structural-conduit.js'));
  assert.ok(published.has('machine-world-pod-docking-embodiment.js'));
});
