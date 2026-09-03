export type CommerceProvider = 'paypal';

export type CommerceEventType =
  | 'payment_completed'
  | 'subscription_activated'
  | 'subscription_renewed'
  | 'subscription_suspended'
  | 'subscription_cancelled'
  | 'refund_issued';

export type ServerOwnedCommerceIntent = {
  firebaseUid: string;
  correlationId: string;
  provider: CommerceProvider;
  createdAt: string;
  status: 'pending';
};

export type CommerceCorrelation = {
  firebaseUid: string;
  provider: CommerceProvider;
  providerEventId: string;
  idempotencyKey: string;
  correlationId: string;
};

export type DurableCommerceEvent = CommerceCorrelation & {
  commerceEventId: string;
  type: CommerceEventType;
  occurredAt: string;
};

export type EntitlementProjection = {
  firebaseUid: string;
  entitlementId: string;
  sourceCommerceEventId: string;
  status: 'active' | 'suspended' | 'cancelled' | 'revoked';
  effectiveAt: string;
};

export type CommerceCorrelationIndex = {
  correlationId: string;
  firebaseUid: string;
  intentPath: string;
  createdAt: string;
  status: 'pending' | 'consumed' | 'cancelled';
};

function requireNonEmpty(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value;
}

export function createServerOwnedCommerceIntent(
  firebaseUid: string,
  correlationId: string,
  createdAt: string,
): ServerOwnedCommerceIntent {
  return {
    firebaseUid: requireNonEmpty(firebaseUid, 'firebaseUid'),
    correlationId: requireNonEmpty(correlationId, 'correlationId'),
    provider: 'paypal',
    createdAt: requireNonEmpty(createdAt, 'createdAt'),
    status: 'pending',
  };
}

export function bindVerifiedPayPalEvent(
  intent: ServerOwnedCommerceIntent,
  providerEventId: string,
): CommerceCorrelation {
  requireNonEmpty(intent.firebaseUid, 'firebaseUid');
  requireNonEmpty(intent.correlationId, 'correlationId');
  requireNonEmpty(providerEventId, 'providerEventId');
  if (intent.provider !== 'paypal') throw new Error('unsupported commerce provider');
  if (intent.status !== 'pending') throw new Error('commerce intent is not pending');

  return {
    firebaseUid: intent.firebaseUid,
    provider: 'paypal',
    providerEventId,
    correlationId: intent.correlationId,
    idempotencyKey: `paypal:event:${providerEventId}`,
  };
}

export function assertServerOwnedCorrelation(input: CommerceCorrelation): CommerceCorrelation {
  requireNonEmpty(input.firebaseUid, 'firebaseUid');
  requireNonEmpty(input.providerEventId, 'providerEventId');
  requireNonEmpty(input.idempotencyKey, 'idempotencyKey');
  requireNonEmpty(input.correlationId, 'correlationId');
  if (input.provider !== 'paypal') throw new Error('unsupported commerce provider');
  return input;
}

export function commerceIntentPath(firebaseUid: string, correlationId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/intents/${requireNonEmpty(correlationId, 'correlationId')}`;
}

export function commerceCorrelationIndexPath(correlationId: string): string {
  return `commerceCorrelationIndex/${requireNonEmpty(correlationId, 'correlationId')}`;
}

export function commerceEventPath(firebaseUid: string, commerceEventId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/events/${requireNonEmpty(commerceEventId, 'commerceEventId')}`;
}

export function entitlementPath(firebaseUid: string, entitlementId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/entitlements/${requireNonEmpty(entitlementId, 'entitlementId')}`;
}
