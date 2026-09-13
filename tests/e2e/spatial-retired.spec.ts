import { expect, test } from '@playwright/test';

test.describe('Command Deck retirement (PR #293, #278 slice 1)', () => {
  test('/spatial/ redirects to the 3D world instead of serving Command Deck', async ({ page }) => {
    const response = await page.goto('/spatial/');
    // Playwright follows redirects by default, so this is the response
    // for the final URL (/hero/), not /spatial/ itself.
    expect(response?.ok(), `GET /spatial/ (post-redirect) status ${response?.status()}`).toBeTruthy();
    expect(page.url()).toContain('/hero/');
    await expect(page.locator('[data-deck-root]')).toHaveCount(0);
  });

  test('/spatial (no trailing slash) also redirects', async ({ page }) => {
    const response = await page.goto('/spatial');
    expect(response?.ok(), `GET /spatial (post-redirect) status ${response?.status()}`).toBeTruthy();
    expect(page.url()).toContain('/hero/');
  });
});
