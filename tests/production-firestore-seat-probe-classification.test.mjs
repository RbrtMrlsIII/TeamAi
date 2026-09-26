import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyMissingSeatProbe } from '../scripts/classify-production-firestore-seat-probe.mjs';

test('zero teams with a successful list is an operator hierarchy blocker', () => {
  const result = classifyMissingSeatProbe({ teamIds: [], teamListError: null });
  assert.deepEqual(result, {
    result: 'canonical_seat_not_found',
    blockerClass: 'operator_hierarchy_absent',
    operatorActionRequired: true,
  });
});

test('a missing Seat inside an existing team list is not an operator create-Seat instruction', () => {
  const result = classifyMissingSeatProbe({
    teamIds: ['gate3-test-team'],
    teamListError: null,
  });
  assert.deepEqual(result, {
    result: 'canonical_seat_not_found',
    blockerClass: 'canonical_seat_missing_in_existing_hierarchy',
    operatorActionRequired: false,
  });
});

test('a failed team list stays a probe/list failure rather than an operator hierarchy claim', () => {
  const result = classifyMissingSeatProbe({
    teamIds: [],
    teamListError: 'Firestore teams list failed: 403',
  });
  assert.deepEqual(result, {
    result: 'canonical_seat_not_found',
    blockerClass: 'team_list_failed',
    operatorActionRequired: false,
  });
});

test('missing-Seat classification never reports a present Seat', () => {
  for (const input of [
    {},
    { teamIds: null, teamListError: null },
    { teamIds: ['other-team'] },
    { teamListError: 'team_list_failed' },
  ]) {
    assert.equal(classifyMissingSeatProbe(input).result, 'canonical_seat_not_found');
  }
});
