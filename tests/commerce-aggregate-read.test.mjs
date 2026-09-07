import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { verifyCommerceAggregate } from '../scripts/firestore-commerce-aggregate-read.mjs';

const correlationId = '68b4ef3a-4132-46bf-8a01-43ebe97ba51e';
const providerEventId = 'WH-71666988RB043112X-1WA30416DF8293903';
const uid = 'uid-commerce-1';

function privateKey() {
  return generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey.export({ type: 'pkcs8', format: 'pem' });
}

function stringFields(fields) {
  return { fields: Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { stringValue: value }])) };
}

test('commerce aggregate re-read passes completed/singular/active contract', async () => {
  const account = { project_id: 'team-ai-official', client_email: 'runtime-test@example.iam.gserviceaccount.com', private_key: privateKey() };
  const fetchImpl = async (url) => {
    const href = String(url);
    if (href.includes('oauth2.googleapis.com/token')) return new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 });
    if (href.includes(`/commerceCorrelationIndex/${correlationId}`)) return new Response(JSON.stringify(stringFields({ firebaseUid: uid, correlationId })), { status: 200 });
    if (href.endsWith(`/accounts/${uid}/commerce/${correlationId}`)) return new Response(JSON.stringify(stringFields({ firebaseUid: uid, correlationId, status: 'completed' })), { status: 200 });
    if (href.endsWith(`/accounts/${uid}/commerce/${correlationId}/events`)) {
      return new Response(JSON.stringify({
        documents: [{
          name: `projects/team-ai-official/databases/(default)/documents/accounts/${uid}/commerce/${correlationId}/events/${providerEventId}`,
          ...stringFields({ providerEventId, type: 'payment_completed', correlationId }),
        }],
      }), { status: 200 });
    }
    if (href.endsWith(`/entitlements/${correlationId}`)) {
      return new Response(JSON.stringify(stringFields({
        firebaseUid: uid,
        entitlementId: correlationId,
        status: 'active',
        sourceCommerceEventId: providerEventId,
      })), { status: 200 });
    }
    return new Response('missing', { status: 404 });
  };

  const result = await verifyCommerceAggregate({ correlationId, providerEventId, account, fetchImpl });
  assert.equal(result.status, 'commerce-aggregate-read-pass');
  assert.equal(result.aggregateStatus, 'completed');
  assert.equal(result.eventCount, 1);
  assert.equal(result.entitlementStatus, 'active');
});

test('commerce aggregate re-read fails when parent remains pending', async () => {
  const account = { project_id: 'team-ai-official', client_email: 'runtime-test@example.iam.gserviceaccount.com', private_key: privateKey() };
  const fetchImpl = async (url) => {
    const href = String(url);
    if (href.includes('oauth2.googleapis.com/token')) return new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 });
    if (href.includes('commerceCorrelationIndex')) return new Response(JSON.stringify(stringFields({ firebaseUid: uid, correlationId })), { status: 200 });
    if (href.endsWith(`/commerce/${correlationId}`)) return new Response(JSON.stringify(stringFields({ status: 'pending' })), { status: 200 });
    if (href.endsWith('/events')) return new Response(JSON.stringify({ documents: [{ name: `.../events/${providerEventId}`, ...stringFields({ providerEventId }) }] }), { status: 200 });
    if (href.includes('/entitlements/')) return new Response(JSON.stringify(stringFields({ status: 'active', sourceCommerceEventId: providerEventId })), { status: 200 });
    return new Response('missing', { status: 404 });
  };

  await assert.rejects(
    () => verifyCommerceAggregate({ correlationId, providerEventId, account, fetchImpl }),
    /aggregate status is pending/,
  );
});
