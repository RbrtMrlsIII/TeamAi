import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSeatDivisionGeometry,
  connectionCorridorPoint,
} from '../frontend/spatial/seat-division-geometry.js';

test('Seat-1 connection geometry grows from payload and exposes a reserved corridor', () => {
  const compact = buildSeatDivisionGeometry({
    angle: 0,
    center: { x: 2, y: 0.8, z: 0 },
    payload: { labels: ['Connection'], controls: ['configure'], density: 'compact' },
  });
  const rich = buildSeatDivisionGeometry({
    angle: 0,
    center: { x: 2, y: 0.8, z: 0 },
    payload: {
      labels: ['Connection', 'Health', 'Provider setup'],
      controls: ['configure', 'test', 'revalidate'],
      density: 'default',
    },
  });

  assert.ok(rich.dimensions.width > compact.dimensions.width);
  assert.ok(rich.dimensions.depth > compact.dimensions.depth);
  assert.ok(rich.corridor.length > 0);
  assert.equal(rich.corridor.owner, rich.id);
  assert.deepEqual(rich.corridor.reservedFor, ['adjacent-divisions', 'workspace-center']);

  const midpoint = connectionCorridorPoint(rich, 0.5);
  assert.ok(Number.isFinite(midpoint.x));
  assert.ok(Number.isFinite(midpoint.y));
  assert.ok(Number.isFinite(midpoint.z));
});

test('connection corridor endpoint is derived from the explicit workspace target', () => {
  const geometry = buildSeatDivisionGeometry({
    center: { x: 1.5, y: 0.7, z: -0.25 },
    angle: Math.PI,
    workspaceTarget: { x: 0.2, y: 0.45, z: 0.1 },
    payload: { labels: ['Connection'], controls: ['configure'] },
  });
  const end = connectionCorridorPoint(geometry, 1);
  assert.deepEqual(end, { x: 0.2, y: 0.45, z: 0.1 });
  assert.ok(Math.abs(geometry.corridor.yaw) > 0);
});


test('division geometry preserves the authored travel angle for downstream physical consumers', () => {
  const angle = Math.PI * 0.625;
  const geometry = buildSeatDivisionGeometry({
    center: { x: 2, y: 0.8, z: -1 },
    angle,
    payload: { labels: ['Toolkit'], controls: ['equip'] },
  });
  assert.equal(geometry.angle, Number(angle.toFixed(12)));
});
