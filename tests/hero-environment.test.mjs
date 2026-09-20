import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
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
  assert.equal(deriveDeepSpaceStagingRadius({ workspaceRadius: 5.95, seatRadius: 6.45, seatFootprintRadius: 1.482 }), 8.032);
  assert.equal(deriveDeepSpaceStagingRadius({ workspaceRadius: 4.35, seatRadius: 4.25, seatFootprintRadius: 1.9 }), 6.25);
});

test('029 Slice A runtime wiring and source/public sync are explicit', async () => {
  const hero = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');
  const source = await readFile(new URL('../frontend/spatial/hero-environment.js', import.meta.url), 'utf8');
  const runtime = await readFile(new URL('../public/hero-environment.js', import.meta.url), 'utf8');
  const base = await readFile(new URL('../public/_flex_src/hero-flex.base.js', import.meta.url), 'utf8');
  const sync = await readFile(new URL('../scripts/sync-machine-spatial-runtime.mjs', import.meta.url), 'utf8');
  const assembled = spawnSync(process.execPath, ['scripts/apply-cam2-tree-follow-flex.mjs'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  assert.equal(assembled.status, 0, assembled.stderr || assembled.stdout);
  const regenerated = await readFile(new URL('../public/hero-flex.js', import.meta.url), 'utf8');

  assert.match(hero, /from ['\"]\.\/hero-environment\.js['\"]/);
  assert.match(hero, /isMachineWorldLayer/);
  assert.match(hero, /const STAR_VS/);
  assert.match(hero, /gl\.drawArrays\(gl\.POINTS/);
  assert.match(base, /from ['\"]\.\/hero-environment\.js['\"]/);
  assert.match(base, /isMachineWorldLayer/);
  assert.doesNotMatch(base, /function floor\(\)\{/);
  assert.match(hero, /createDeepSpaceField/);
  assert.match(hero, /const SEAT_BASE_RADIUS=1\.9/);
  assert.match(hero, /seatFootprintRadius:SEAT_BASE_RADIUS\*p\.seatScale/);
  assert.doesNotMatch(hero, /function floor\(\)\{/);
  assert.doesNotMatch(hero, /floor\(\);environment\(/);
  assert.equal(runtime, source);
  assert.match(sync, /'hero-environment\.js'/);
  assert.match(regenerated, /from ['\"]\.\/hero-environment\.js['\"]/);
  assert.match(regenerated, /createDeepSpaceField/);
  assert.doesNotMatch(regenerated, /function floor\(\)\{/);
});
