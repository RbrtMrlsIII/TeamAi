import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BASELINE_TEAM_POPULATION_MAX_SEATS,
  BASELINE_TEAM_QUALITY_TIER,
  TEAM_POPULATION_MAX_TIER,
  TEAM_QUALITY_MAX_TIER,
  commerceBillingGuidance,
  getCommerceOffer,
  listCommerceOffers,
  resolveCommerceTierChange,
} from '../dist/src/billing/commerce-products.js';
import {
  assertCommerceOfferReference,
  createServerOwnedCommerceIntent,
} from '../dist/src/backend/commerce.js';

test('Marketplace commerce catalog exposes five Team Quality and nine Team Population tiers', () => {
  assert.equal(TEAM_QUALITY_MAX_TIER, 5);
  assert.equal(TEAM_POPULATION_MAX_TIER, 9);
  assert.equal(listCommerceOffers('team-quality').length, 5);
  assert.equal(listCommerceOffers('team-population').length, 9);
  assert.equal(getCommerceOffer('team-population', 1)?.maxPersistentSeats, 2);
  assert.equal(getCommerceOffer('team-population', 9)?.maxPersistentSeats, 10);
  assert.equal(BASELINE_TEAM_QUALITY_TIER, 0);
  assert.equal(BASELINE_TEAM_POPULATION_MAX_SEATS, 1);
});

test('lower active tiers remain locked and higher tiers carry inline replacement warning semantics', () => {
  const lower = resolveCommerceTierChange('team-population', 4, 2);
  assert.equal(lower.transition, 'LOWER_TIER_LOCKED');
  assert.equal(lower.canPurchase, false);

  const higher = resolveCommerceTierChange('team-population', 2, 4);
  assert.equal(higher.transition, 'HIGHER_TIER_REPLACES_ACTIVE');
  assert.equal(higher.canPurchase, true);
  assert.match(higher.warning ?? '', /will disappear/);
});

test('commerce intent preserves offer identity and hosted-billing/card-storage boundary', () => {
  const offer = getCommerceOffer('team-quality', 3);
  assert.ok(offer);
  const reference = assertCommerceOfferReference({
    offerId: offer.id,
    productFamily: 'team-quality',
    tier: 3,
  });
  const intent = createServerOwnedCommerceIntent('uid-1', 'corr-1', '2026-09-21T08:00:00.000Z', reference);
  assert.equal(intent.offerId, offer.id);
  assert.equal(intent.productFamily, 'team-quality');
  assert.equal(intent.tier, 3);
  assert.equal(intent.billingCycle, 'monthly');
  assert.equal(intent.billingMode, 'external-hosted-page');
  assert.equal(intent.cardStorage, 'none');
});

test('billing guidance never asks TeamAi to collect card credentials', () => {
  const guidance = commerceBillingGuidance();
  assert.equal(guidance.cardStorage, 'none');
  assert.match(guidance.text, /does not store card credentials/);
});
