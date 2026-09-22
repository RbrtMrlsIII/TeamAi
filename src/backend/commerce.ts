import {
  getCommerceOffer,
  type CommerceProductFamily,
  resolveCommerceTierChange,
} from '../billing/commerce-products.js';

export type CommerceProvider = 'paypal';

export type CommerceEventType =
  | 'payment_completed'
  | 'payment_denied'
  | 'payment_pending'
  | 'subscription_created'
  | 'subscription_activated'
  | 'subscription_updated'
  | 'subscription_renewed'
  | 'subscription_suspended'
  | 'subscription_cancelled'
  | 'subscription_payment_failed'
  | 'refund_issued'
  | 'refund_warning';

export type ServerOwnedCommerceIntent = {
  firebaseUid: string;
  correlationId: string;
  provider: CommerceProvider;
  createdAt: string;
  status: 'pending';
  offerId?: string;
  productFamily?: CommerceProductFamily;
  tier?: number;
  billingCycle: 'monthly';
  billingMode: 'external-hosted-page';
  cardStorage: 'none';
};

export type CommerceOfferReference = {
  offerId: string;
  productFamily: CommerceProductFamily;
  tier: number;
};

export type CommerceAggregateStatus = 'pending' | 'completed' | 'cancelled' | 'unavailable' | 'error';

export type CommerceReadModel = {
  aggregateStatus: CommerceAggregateStatus;
  entitlementStatus: EntitlementProjection['status'] | 'missing';
  entitlementSourceCommerceEventId: string | null;
  providerEntitlementStatus: string | null;
};

export function isCommerceAccessActive(readModel: CommerceReadModel): boolean {
  return readModel.aggregateStatus === 'completed'
    && readModel.entitlementStatus === 'active'
    && Boolean(readModel.entitlementSourceCommerceEventId);
}

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
  productFamily?: CommerceProductFamily;
  tier?: number;
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

export function assertCommerceOfferReference(reference: CommerceOfferReference): CommerceOfferReference {
  const offer = getCommerceOffer(reference.productFamily, reference.tier);
  if (!offer) throw new Error('unknown commerce offer');
  if (offer.id !== requireNonEmpty(reference.offerId, 'offerId')) throw new Error('commerce offer identity mismatch');
  return Object.freeze({ ...reference });
}

export function createServerOwnedCommerceIntent(
  firebaseUid: string,
  correlationId: string,
  createdAt: string,
  offerReference?: CommerceOfferReference,
): ServerOwnedCommerceIntent {
  const reference = offerReference ? assertCommerceOfferReference(offerReference) : undefined;
  return {
    firebaseUid: requireNonEmpty(firebaseUid, 'firebaseUid'),
    correlationId: requireNonEmpty(correlationId, 'correlationId'),
    provider: 'paypal',
    createdAt: requireNonEmpty(createdAt, 'createdAt'),
    status: 'pending',
    ...(reference
      ? {
          offerId: reference.offerId,
          productFamily: reference.productFamily,
          tier: reference.tier,
        }
      : {}),
    billingCycle: 'monthly',
    billingMode: 'external-hosted-page',
    cardStorage: 'none',
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

export function classifyCommerceTierChange(
  family: CommerceProductFamily,
  activeTier: number | null | undefined,
  requestedTier: number,
) {
  return resolveCommerceTierChange(family, activeTier, requestedTier);
}

export function commerceIntentPath(firebaseUid: string, correlationId: string): string {
  return `accounts/${requireNonEmpty(firebaseUid, 'firebaseUid')}/commerce/${requireNonEmpty(correlationId, 'correlationId')}`;
}

export function commerceCorrelationIndexPath(correlationId: string): string {
  return `commerceCorrelationIndex/${requireNonEmpty(correlationId, 'correlationId')}`;
}

export function commerceEventPath(firebaseUid: string, correlationId: string, providerEventId: string): string {
  return `${commerceIntentPath(firebaseUid, correlationId)}/events/${requireNonEmpty(providerEventId, 'providerEventId')}`;
}

export function entitlementPath(firebaseUid: string, correlationId: string, entitlementId: string): string {
  return `${commerceIntentPath(firebaseUid, correlationId)}/entitlements/${requireNonEmpty(entitlementId, 'entitlementId')}`;
}
