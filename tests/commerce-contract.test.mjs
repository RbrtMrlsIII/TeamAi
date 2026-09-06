import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertServerOwnedCorrelation,
  commerceIntentPath,
  commerceEventPath,
  entitlementPath,
} from '../dist/src/backend/commerce.js';

test('commerce correlation is server-owned and PayPal-specific', () => {
  const correlation = assertServerOwnedCorrelation({
    firebaseUid: 'uid-1',
    provider: 'paypal',
    providerEventId: 'paypal-event-1',
    idempotencyKey: 'paypal:event:paypal-event-1',
    correlationId: 'correlation-1',
  });
  assert.deepEqual(correlation, {
    firebaseUid: 'uid-1',
    provider: 'paypal',
    providerEventId: 'paypal-event-1',
    idempotencyKey: 'paypal:event:paypal-event-1',
    correlationId: 'correlation-1',
  });
  assert.throws(
    () => assertServerOwnedCorrelation({
      firebaseUid: '',
      provider: 'paypal',
      providerEventId: 'paypal-event-1',
      idempotencyKey: 'paypal:event:paypal-event-1',
      correlationId: 'correlation-1',
    }),
    /firebaseUid is required/,
  );
});

test('commerce hierarchy is UID-rooted and Firestore-valid', () => {
  const intentPath = commerceIntentPath('uid-1', 'correlation-1');
  const eventPath = commerceEventPath('uid-1', 'correlation-1', 'event-1');
  const entitlementPathValue = entitlementPath('uid-1', 'correlation-1', 'entitlement-1');

  assert.equal(intentPath, 'accounts/uid-1/commerce/correlation-1');
  assert.equal(eventPath, 'accounts/uid-1/commerce/correlation-1/events/event-1');
  assert.equal(
    entitlementPathValue,
    'accounts/uid-1/commerce/correlation-1/entitlements/entitlement-1',
  );

  for (const path of [intentPath, eventPath, entitlementPathValue]) {
    assert.equal(path.split('/').length % 2, 0, `expected document path: ${path}`);
  }
});
