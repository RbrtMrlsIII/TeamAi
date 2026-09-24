import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { HERO_AUTHORED_MESHES } from '../public/hero-authored-meshes.js';

const heroFlex = fs.readFileSync(path.join(process.cwd(), 'public/hero-flex.js'), 'utf8');

test('authored Hero meshes are static assets with explicit topology', () => {
  for (const [name, mesh] of Object.entries(HERO_AUTHORED_MESHES)) {
    assert.ok(mesh.positions.length >= 48, `${name} needs authored position data`);
    assert.ok(mesh.indices.length >= 36, `${name} needs authored topology`);
    assert.equal(mesh.positions.length % 3, 0, `${name} positions must be xyz triplets`);
    assert.equal(mesh.indices.length % 3, 0, `${name} indices must be triangles`);
    assert.ok(mesh.indices.every(index => Number.isInteger(index) && index >= 0 && index < mesh.positions.length / 3), `${name} indices must reference authored vertices`);
  }
});

test('canonical renderer owns scene geometry while semantic modules remain scalable', async () => {
  const renderer = await fs.promises.readFile(path.join(process.cwd(), 'public/machine-world-renderer.js'), 'utf8');
  assert.match(renderer, /shapeBuffer/);
  assert.match(renderer, /createBranchConnectionCore/);
  assert.match(renderer, /createMachineExpansionMechanism/);
  assert.match(renderer, /deriveMachineSubject/);
  assert.match(renderer, /gl\.drawArrays/);
  assert.match(heroFlex, /teamai:web-ai-seat-unlocked/);
  assert.match(heroFlex, /setSeatCount/);
  assert.doesNotMatch(heroFlex, /gl\.createShader|gl\.createProgram|gl\.drawArrays/);
});
