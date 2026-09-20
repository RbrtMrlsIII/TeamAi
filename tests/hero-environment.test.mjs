import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import {
  createDeepSpaceField,
  DEEP_SPACE_ENVIRONMENT_MODE,
  DEEP_SPACE_NEBULA_ANCHORS,
  deriveDeepSpaceStagingRadius,
  isMachineWorldLayer,
} from '../frontend/spatial/hero-environment.js';

test('029 Slice A environment field generation is deterministic', () => {
  const a = createDeepSpaceField({ seed: 396 });
  const b = createDeepSpaceField({ seed: 396 });
  const c = createDeepSpaceField({ seed: 397 });

  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.equal(a.length, 224);

  for (const star of a) {
    assert.match(star.id, /^DEEP-STAR-\d+-\d+$/);
    assert.ok(star.position.every(Number.isFinite));
    assert.ok(Number.isFinite(star.size) && star.size > 0);
    assert.ok(Number.isFinite(star.alpha) && star.alpha > 0 && star.alpha <= 1);
  }
});

test('029 Slice A environment uses layered world-space depth', () => {
  const a = createDeepSpaceField({ seed: 396 });
  const byLayer = new Map();

  for (const star of a) {
    const radius = Math.hypot(...star.position);
    const previous = byLayer.get(star.layer);
    if (previous === undefined) byLayer.set(star.layer, radius);
    else assert.ok(Math.abs(radius - previous) < 1e-9);
  }

  assert.deepEqual(
    [...byLayer.values()].map((v) => Number(v.toFixed(6))),
    [30, 24, 19],
  );
  assert.equal(DEEP_SPACE_NEBULA_ANCHORS.length, 4);
});

test('029 Slice A environment has explicit machine-world ownership', () => {
  assert.equal(isMachineWorldLayer({ dataset: { heroLayer: 'machine' } }), true);
  assert.equal(isMachineWorldLayer({ dataset: { heroLayer: 'entrance' } }), false);
  assert.equal(isMachineWorldLayer({ dataset: {} }), false);
  assert.equal(DEEP_SPACE_ENVIRONMENT_MODE, 'machine');
  assert.equal(deriveDeepSpaceStagingRadius({ workspaceRadius: 5.95, seatRadius: 6.45 }), 7.35);
});

test('029 Slice A runtime wiring and source/public sync are explicit', async () => {
  const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  const source = await readFile(new URL('../frontend/spatial/hero-environment.js', import.meta.url), 'utf8');
  const runtime = await readFile(new URL('../public/hero-environment.js', import.meta.url), 'utf8');
  const sync = await readFile(new URL('../scripts/sync-machine-spatial-runtime.mjs', import.meta.url), 'utf8');

  assert.match(hero, /from ['\"]\.\/hero-environment\.js['\"]/);
  assert.match(hero, /isMachineWorldLayer/);
  assert.match(hero, /createDeepSpaceField/);
  assert.doesNotMatch(hero, /function floor\(\)\{/);
  assert.doesNotMatch(hero, /floor\(\);environment\(/);
  assert.equal(runtime, source);
  assert.match(sync, /'hero-environment\.js'/);
});
