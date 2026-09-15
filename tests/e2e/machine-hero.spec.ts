import { expect, test } from '@playwright/test';

test.describe('Machine Hero foundation', () => {
  test('opens the standalone 3D machine preview and follows geometry', async ({ page }) => {
    await page.goto('/machine-hero-preview.html?machine-preview=webgl');
    await expect(page.getByText('TeamAi Machine Hero')).toBeVisible();
    await expect(page.locator('canvas[aria-label="Interactive Machine Hero WebGL preview"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Move geometry', exact: true })).toBeVisible();
    const status = page.locator('[data-machine-webgl-state]');
    await expect(status).toHaveText('payload-driven subject + wiring');
    await page.getByRole('button', { name: 'Move geometry', exact: true }).click();
    await expect(status).toHaveText('payload geometry moved · subject + wiring moved');
    await page.getByRole('button', { name: 'Move geometry', exact: true }).click();
    await expect(status).toHaveText('payload subject returned to base geometry');
  });

  test('remains an isolated preview surface', async ({ page }) => {
    await page.goto('/machine-hero-preview.html?machine-preview=webgl');
    await expect(page.locator('#hero-canvas')).toHaveCount(0);
    await expect(page.locator('[data-hero-engine-open]')).toHaveCount(0);
    await expect(page.locator('[data-world-camera-request]')).toHaveCount(0);
    await expect(page).toHaveURL(/machine-hero-preview\.html\?machine-preview=webgl$/);
  });
});
