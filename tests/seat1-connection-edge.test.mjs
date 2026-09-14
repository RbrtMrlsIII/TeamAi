import assert from 'node:assert/strict';
import test from 'node:test';
import {
  SEAT1_CONNECTION_PORT_ID,
  SEAT1_CONNECTION_EDGE_ID,
  seat1ConnectionPort,
  seat1ConnectionEdge,
  connectionEdgePoint,
} from '../frontend/spatial/seat-connection-edge.js';

test('Seat-1 connection port has stable semantic identity', () => {
  const port = seat1ConnectionPort({ x: 2, y: 0.7, z: -3 });
  assert.equal(port.id, SEAT1_CONNECTION_PORT_ID);
  assert.equal(port.tree, 'TREE-HERO-SEAT');
  assert.equal(port.seatIndex, 0);
  assert.equal(port.division, 'SEAT_CONNECTION');
  assert.equal(port.role, 'connection-port');
});

test('Seat-1 connection edge explicitly targets the workspace center', () => {
  const edge = seat1ConnectionEdge({ x: 2, y: 0.7, z: -3 });
  assert.equal(edge.id, SEAT1_CONNECTION_EDGE_ID);
  assert.equal(edge.from, SEAT1_CONNECTION_PORT_ID);
  assert.equal(edge.to, 'WORKSPACE_CENTER');
  assert.equal(edge.semantic, true);
  assert.equal(edge.presentationOnly, true);
});

test('edge traversal point follows the declared semantic endpoints', () => {
  const edge = seat1ConnectionEdge({ x: 4, y: 1, z: 2 }, { x: 0, y: 0.5, z: 0 });
  assert.deepEqual(connectionEdgePoint(edge, 0), { x: 4, y: 1, z: 2 });
  assert.deepEqual(connectionEdgePoint(edge, 0.5), { x: 2, y: 0.75, z: 1 });
  assert.deepEqual(connectionEdgePoint(edge, 1), { x: 0, y: 0.5, z: 0 });
});

test('edge module has no domain/provider authority', async () => {
  const fs = await import('node:fs/promises');
  const source = await fs.readFile(new URL('../frontend/spatial/seat-connection-edge.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /firestore|paypal|firebase|supabase|scheduler|oauth/i);
});
