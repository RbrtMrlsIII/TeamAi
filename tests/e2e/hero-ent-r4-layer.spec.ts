import { expect, test } from '@playwright/test';

/**
 * ENT-R4 — entrance ↔ machine layer browser proof.
 * Presentation only · one canvas · no 029-released claim.
 */
test.describe('ENT-R4 entrance ↔ machine layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'entrance');
  });

  test('Open engine enters machine; Return restores entrance; one canvas', async ({ page }) => {
    await expect(page.locator('#hero-canvas')).toHaveCount(1);

    const brand = page.locator('.hero-copy, [data-entrance-region="brand"]').first();
    await expect(brand).toBeVisible();

    await page.getByRole('button', { name: 'Open engine', exact: true }).click();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'machine', { timeout: 5000 });

    await expect(brand).toBeHidden();

    const ret = page.getByRole('button', { name: 'Return to entrance', exact: true });
    await expect(ret).toBeVisible();

    await ret.click();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'entrance', { timeout: 5000 });
    await expect(brand).toBeVisible();

    await expect(page.locator('#hero-canvas')).toHaveCount(1);
  });
});
