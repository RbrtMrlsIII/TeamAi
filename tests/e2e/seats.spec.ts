import { test } from '@playwright/test';

/**
 * RETIRED with Command Deck product surface (PR #293, #299; Issue #278).
 *
 * These Seats / Provider composition cases targeted live `[data-deck-root]` on
 * `/spatial/`. After surface retirement, `/spatial/` redirects to `/hero/` and
 * must not present Command Deck. Authenticated Seats belong under the world
 * machine / Workspace Center (C8) — do not revive Deck as the product door.
 *
 * Active contract: tests/e2e/spatial-retired.spec.ts
 */
test.describe.skip('Seats / Provider composition (retired with Command Deck)', () => {
  test('historical Deck Seats plate — re-own under C8 world machine, not /spatial/', async () => {
    // Intentionally skipped. Do not re-enable against /spatial/.
  });
});
