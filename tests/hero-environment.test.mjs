import assert from 'node:assert/strict';
import test from 'node:test';
import { MACHINE_SPATIAL_RUNTIME_FILES } from '../scripts/machine-spatial-runtime-manifest.mjs';
import { readFile } from 'node:fs/promises';
import {
  createDeepSpaceField,
  DEEP_SPACE_ENVIRONMENT_MODE,
  DEEP_SPACE_NEBULA_ANCHORS,
  deriveDeepSpaceStagingRadius,
  isMachineWorldLayer,
} from '../frontend/spatial/hero-environment.js';

test('029 Slice A environment field generation is deterministic', () => {
  const a = createDeepSpaceField({seed:396});
  const b = createDeepSpaceField({seed:396});
  const c = createDeepSpaceField({seed:397});

  assert.deepEqual(a,b);
  assert.notDeepEqual(a,c);
  assert.equal(a.length,224);

  for (const star of a) {
    assert.match(star.id,/^DEEP-STAR-\d+-\d+$/);
    assert.ok(star.position.every(Number.isFinite));
    assert.ok(Number.isFinite(star.size) && star.size >0);
    assert.ok(Number.isFinite(star.alpha) && star.alpha > 0 && star.alpha <= 1);
  }
});
