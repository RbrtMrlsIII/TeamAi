/**
 * F — Health leaf domain read-model tests.
 * source:'domain' only with named contract; else fixture.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  createHierarchyRuntime,
  HEALTH_STATUS,
  HIERARCHY_PART,
  healthLeafAccessibleName,
} from '../public/hero-hierarchy-runtime.js';
import {
  HEALTH_DOMAIN_CONTRACT_ID,
  HEALTH_SOURCE,
  applyHealthReadModel,
  clearHealthDomain,
  getHealthLeafView,
} from '../public/hero-f-health-domain.js';

test('HEALTH_DOMAIN_CONTRACT_ID is named and stable', () => {
  assert.equal(HEALTH_DOMAIN_CONTRACT_ID, 'seat.connection.health.v1');
  assert.equal(HEALTH_SOURCE.FIXTURE, 'fixture');
  assert.equal(HEALTH_SOURCE.DOMAIN, 'domain');
});

test('default runtime is fixture UNKNOWN', () => {
  const state = createHierarchyRuntime();
  assert.equal(state.healthStatus, HEALTH_STATUS.UNKNOWN);
  // healthSource/contractId may be seeded in runtime or defaulted by view/apply
  assert.equal(state.healthSource ?? HEALTH_SOURCE.FIXTURE, HEALTH_SOURCE.FIXTURE);
  assert.equal(state.healthContractId ?? null, null);
  assert.equal(state.presentationOnly, true);
  assert.equal(state.durable, false);
});

test('domain without named contract is refused; fixture remains', () => {
  const state = createHierarchyRuntime();
  applyHealthReadModel(state, {
    source: 'domain',
    status: HEALTH_STATUS.LOADING,
    contractId: 'wrong.contract',
  });
  assert.equal(state.healthSource ?? HEALTH_SOURCE.FIXTURE, HEALTH_SOURCE.FIXTURE);
  assert.equal(state.healthStatus, HEALTH_STATUS.UNKNOWN);
  assert.equal(state.healthContractId ?? null, null);
});

test('domain with named contract applies status', () => {
  const state = createHierarchyRuntime();
  applyHealthReadModel(state, {
    source: HEALTH_SOURCE.DOMAIN,
    status: HEALTH_STATUS.LOADING,
    contractId: HEALTH_DOMAIN_CONTRACT_ID,
  });
  assert.equal(state.healthSource, HEALTH_SOURCE.DOMAIN);
  assert.equal(state.healthStatus, HEALTH_STATUS.LOADING);
  assert.equal(state.healthContractId, HEALTH_DOMAIN_CONTRACT_ID);
  assert.equal(state.presentationOnly, true);
  assert.equal(state.durable, false);
});

test('invalid status is refused', () => {
  const state = createHierarchyRuntime();
  applyHealthReadModel(state, {
    source: HEALTH_SOURCE.DOMAIN,
    status: 'authorized-secret',
    contractId: HEALTH_DOMAIN_CONTRACT_ID,
  });
  assert.equal(state.healthSource ?? HEALTH_SOURCE.FIXTURE, HEALTH_SOURCE.FIXTURE);
  assert.equal(state.healthStatus, HEALTH_STATUS.UNKNOWN);
});

test('clearHealthDomain reverts to fixture', () => {
  const state = createHierarchyRuntime();
  applyHealthReadModel(state, {
    source: HEALTH_SOURCE.DOMAIN,
    status: HEALTH_STATUS.UNAVAILABLE,
    contractId: HEALTH_DOMAIN_CONTRACT_ID,
  });
  clearHealthDomain(state);
  assert.equal(state.healthSource, HEALTH_SOURCE.FIXTURE);
  assert.equal(state.healthStatus, HEALTH_STATUS.UNKNOWN);
  assert.equal(state.healthContractId, null);
});

test('getHealthLeafView never claims authorization or durable', () => {
  const state = createHierarchyRuntime();
  applyHealthReadModel(state, {
    source: HEALTH_SOURCE.DOMAIN,
    status: HEALTH_STATUS.LOADING,
    contractId: HEALTH_DOMAIN_CONTRACT_ID,
  });
  const view = getHealthLeafView(state);
  assert.equal(view.leafId, HIERARCHY_PART.SEAT_CONNECTION_HEALTH_FACE);
  assert.equal(view.status, HEALTH_STATUS.LOADING);
  assert.equal(view.source, HEALTH_SOURCE.DOMAIN);
  assert.equal(view.presentationOnly, true);
  assert.equal(view.durable, false);
  assert.equal(view.authorization, false);
});

test('accessible name stays presentation-only not authorization', () => {
  const name = healthLeafAccessibleName(HEALTH_STATUS.LOADING);
  assert.match(name, /loading/i);
  assert.match(name, /Presentation only|not authorization/i);
});

test('module source forbids durable domain writes', async () => {
  const src = await readFile(new URL('../public/hero-f-health-domain.js', import.meta.url), 'utf8');
  assert.match(src, /named contract/i);
  assert.doesNotMatch(src, /firestore|paypal|scheduler|OAuth/i);
  assert.match(src, /presentation/i);
});
