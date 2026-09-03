export type CommerceProvider = 'paypal';

export type CommerceEventType =
  | 'payment_completed'
  | 'subscription_activated'
  | 'subscription_renewed'
  | 'subscription_suspended'
  | 'subscription_cancelled'
  | 'refund_issued';

export type CommerceCorrelation = {
  firebaseUid: string;
  provider: CommerceProvider;
  providerEventId: string;
  idempotencyKey: string;
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

function requireNonEmpty(value: string, name: string): string {
  if (!value.trim()) throw new Error(`${name} is required`);
  return value;
}

export function assertServerOwnedCorrelation(input: CommerceCorrelation): CommerceCorrelation {
  requireNonEmpty(input.firebaseUid, 'firebaseUid');
  requireNonEmpty(input.providerEventId, 'providerEventId');
  requireNonEmpty(input.idempotencyKey, 'idempotencyKey');
  if (input.provider !== 'paypal') throw new Error('unsupported commerce provider');
  return input;
}

export function commerceEventPath(firebaseUid: string, commerceEventId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/events/${requireNonEmpty(commerceEventId, 'commerceEventId')}`;
}

export function entitlementPath(firebaseUid: string, entitlementId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/entitlements/${requireNonEmpty(entitlementId, 'entitlementId')}`;
}
