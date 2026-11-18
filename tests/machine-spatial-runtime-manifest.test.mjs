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
  const aliases = new Set(Object.values(MACHINE_SPATIAL_RUNTIME_PUBLIC_TARGETS));

  for (const imported of directImports) {
    if (published.has(imported) || aliases.has(imported)) continue;
    assert.fail('unpublished canonical renderer import: ' + imported);
  }

  for (const [canonicalSource, publicTarget] of Object.entries(MACHINE_SPATIAL_RUNTIME_PUBLIC_TARGETS)) {
    assert.ok(published.has(canonicalSource), 'unpublished alias source: ' + canonicalSource);
    assert.ok(publicTarget, 'empty public target for: ' + canonicalSource);
  }

  assert.ok(published.has('machine-world-structural-conduit.js'));
  assert.ok(published.has('machine-world-pod-docking-embodiment.js'));
});
