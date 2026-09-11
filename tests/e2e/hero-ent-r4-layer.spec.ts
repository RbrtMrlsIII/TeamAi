import { expect, test } from '@playwright/test';

/**
 * ENT-R4 — explicit entrance ↔ machine-layer browser proof.
 * Presentation only · one canvas · no 029-released claim.
 */
test.describe('ENT-R4 entrance ↔ machine layer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'classic');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'entrance');
    await expect(page.locator('#hero-canvas')).toBeHidden();
  });

  test('Explicit 3D entry enters machine; Website restores entrance; one canvas', async ({ page }) => {
    await page.getByRole('button', { name: 'Enter 3D world', exact: true }).click();

    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'world');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'machine', { timeout: 5000 });
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('#hero-canvas')).toHaveCount(1);

    await expect(page.locator('.hero-copy')).toBeHidden();

    await page.getByRole('button', { name: 'Website', exact: true }).click();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'classic', { timeout: 5000 });
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-hero-layer', 'entrance', { timeout: 5000 });
    await expect(page.locator('#hero-canvas')).toBeHidden();
    await expect(page.locator('#hero-canvas')).toHaveCount(1);
  });
});
