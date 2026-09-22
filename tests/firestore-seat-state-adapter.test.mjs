import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSeatStateDocument } from '../dist/src/backend/firestore-runtime.js';

test('Firestore Seat adapter maps persisted seatId to domain SeatState.id', () => {
  const seat = normalizeSeatStateDocument(
    {
      uid: 'uid-1',
      workplaceId: 'workplace-1',
      projectId: 'project-1',
      teamId: 'team-1',
      seatId: 'seat-coder',
      provider: 'openai',
      application: 'coding',
      field: 'backend',
      skills: ['typescript'],
      authorization: { status: 'authorized' },
      status: 'active',
      turnBudget: {
        turnBudgetTokens: 10000,
        outputBudgetTokens: 5000,
        reasoningBudgetTokens: 3500,
        handoffReserveTokens: 1000,
        warningThresholdPercent: 0.8,
        hardStopPolicy: 'handoff-before-exhaustion',
        responsibilityProfile: 'coder',
        contextInputPolicy: { retention: 'minimal-durable-context' },
      },
    },
    'seat-coder',
  );

  assert.equal(seat.id, 'seat-coder');
});

test('Firestore Seat adapter prefers an explicit domain id when present', () => {
  const seat = normalizeSeatStateDocument(
    {
      id: 'domain-seat-id',
      seatId: 'persisted-seat-id',
    },
    'fallback-seat-id',
  );
  assert.equal(seat.id, 'domain-seat-id');
});
