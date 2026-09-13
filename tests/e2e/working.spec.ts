import { test } from '@playwright/test';

/**
 * RETIRED with Command Deck product surface (PR #293, #299; Issue #278).
 *
 * Working composition lived on the Deck shell at `/spatial/`. That root is no
 * longer a live product surface. Re-own execution workspace presentation under
 * the authenticated world machine (C8) when that gate opens.
 *
 * Active contract: tests/e2e/spatial-retired.spec.ts
 */
test.describe.skip('Working composition (retired with Command Deck)', () => {
  test('historical Deck Working surface — re-own under C8, not /spatial/', async () => {
    // Intentionally skipped. Do not re-enable against /spatial/.
  });
});
