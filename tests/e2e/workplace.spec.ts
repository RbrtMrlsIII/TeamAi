import { test } from '@playwright/test';

/**
 * RETIRED with Command Deck product surface (PR #293, #299; Issue #278).
 *
 * Workplace composition lived on the Deck shell at `/spatial/`, including
 * "Enter Project" back to Deck. That root is no longer a live product surface.
 * Re-own Workplace / Project under the authenticated world machine (C8).
 *
 * Active contract: tests/e2e/spatial-retired.spec.ts
 */
test.describe.skip('Workplace composition (retired with Command Deck)', () => {
  test('historical Deck Workplace surface — re-own under C8, not /spatial/', async () => {
    // Intentionally skipped. Do not re-enable against /spatial/.
  });
});
