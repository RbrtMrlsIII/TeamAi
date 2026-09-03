import test from 'node:test';
import assert from 'node:assert/strict';
import {
  assertServerOwnedCorrelation,
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

test('commerce state remains rooted in Firebase UID', () => {
  assert.equal(
    commerceEventPath('uid-1', 'event-1'),
    'accounts/uid-1/commerce/events/event-1',
  );
  assert.equal(
    entitlementPath('uid-1', 'entitlement-1'),
    'accounts/uid-1/commerce/entitlements/entitlement-1',
  );
});
