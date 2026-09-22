import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';

function read(relativePath) {
  return readFileSync(new URL('../' + relativePath, import.meta.url), 'utf8');
}

test('Firestore declares the composite index required by the Seat Budget runtime read model', () => {
  const config = JSON.parse(read('firestore.indexes.json'));
  assert.ok(Array.isArray(config.indexes));
  assert.ok(config.indexes.some((index) =>
    index.collectionGroup === 'execution-results' &&
    index.queryScope === 'COLLECTION_GROUP' &&
    JSON.stringify(index.fields) === JSON.stringify([
      { fieldPath: 'seatId', order: 'ASCENDING' },
      { fieldPath: 'recordedAt', order: 'DESCENDING' },
    ])
  ));
});

test('Firebase project config points Firestore at the checked-in index manifest', () => {
  const config = JSON.parse(read('firebase.json'));
  assert.equal(config.firestore?.indexes, 'firestore.indexes.json');
});
