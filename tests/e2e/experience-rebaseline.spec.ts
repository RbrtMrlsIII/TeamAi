import { test, expect } from '@playwright/test';

test.describe('029 experience rebaseline', () => {
  test('classic entrance is clean before explicit 3D entry', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'classic');
    await expect(page.getByRole('heading', { name: /calmer front door/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Enter 3D world' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeHidden();
    await expect(page.locator('.seat-stack')).toBeHidden();
    await expect(page.locator('.spatial-parts')).toBeHidden();
  });

  test('explicit entry opens the 3D world and exposes coherent navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Enter 3D world' }).click();
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'world');
    await expect(page.locator('.world-navigation')).toBeVisible();
    await expect(page.getByRole('button', { name: 'World' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Website' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeVisible();
  });

  test('world menu exposes Settings without reviving the retired camera controls', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Enter 3D world' }).click();
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('button', { name: 'Settings' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Low orbit', exact: true })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Turn follow', exact: true })).toHaveCount(0);
  });
});
