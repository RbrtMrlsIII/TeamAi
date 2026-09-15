import { expect, test } from '@playwright/test';

test.describe('Modular branch connection core', () => {
  test('renders the isolated 15-part ten-seat core and supports animated expansion', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.getByText('BRANCH CONNECTION CORE')).toBeVisible();
    await expect(page.getByText('15 modules · 10 seats · 4 outer housings · 1 hub')).toBeVisible();
    const canvas = page.locator('canvas[aria-label="3D modular branch connection core"]');
    await expect(canvas).toBeVisible();
    const status = page.locator('[data-core-state]');
    await expect(status).toContainText('collapsed · 0%');
    await page.getByLabel('Branch camera').selectOption('BRANCH-SEAT-06');
    await expect(status).toContainText('camera BRANCH_CAMERA_BRANCH-SEAT-06');
    await expect(page.locator('[data-branch-inspector]')).toContainText('BRANCH-SEAT-06');
    await expect(page.locator('[data-branch-inspector]')).toContainText('seat-configuration');
    await page.getByLabel('Branch camera').selectOption('BRANCH-OUTER-BETA');
    await expect(status).toContainText('camera BRANCH_CAMERA_BRANCH-OUTER-BETA');
    await page.getByRole('button', { name: 'Expand', exact: true }).click();
    await expect(status).toContainText('opening');
    await expect(status).toContainText('expanded · 100%', { timeout: 3000 });
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(status).toContainText('closing');
    await expect(status).toContainText('collapsed · 0%', { timeout: 3000 });
  });

  test('renders eight seats through the same parameterized core', async ({ page }) => {
    await page.goto('/machine-core-preview.html?seats=8');
    await expect(page.locator('[data-core-count]')).toHaveText('13 modules · 8 seats · 4 outer housings · 1 hub');
    await expect(page.locator('[data-core-state]')).toContainText('collapsed · 0% · 13 independent modules');
  });

  test('clicking the machine selects the semantic branch instead of cycling indexes', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    const canvas = page.locator('canvas[aria-label="3D modular branch connection core"]');
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    await canvas.click({ position: { x: (box?.width || 0) / 2 + 135, y: (box?.height || 0) / 2 } });
    await expect(page.locator('[data-core-state]')).toContainText('camera BRANCH_CAMERA_BRANCH-SEAT-01');
    await expect(page.locator('[data-branch-inspector]')).toContainText('BRANCH-SEAT-01');
  });

  test('phone viewport keeps the machine, camera control, and expansion controls usable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/machine-core-preview.html');
    await expect(page.locator('canvas[aria-label="3D modular branch connection core"]')).toBeVisible();
    const camera = page.getByLabel('Branch camera');
    const expand = page.getByRole('button', { name: 'Expand', exact: true });
    await expect(camera).toBeVisible();
    await expect(expand).toBeVisible();
    await camera.selectOption('BRANCH-SEAT-10');
    await expect(page.locator('[data-core-state]')).toContainText('camera BRANCH_CAMERA_BRANCH-SEAT-10');
    await expand.click();
    await expect(page.locator('[data-core-state]')).toContainText('opening');
  });

  test('reduced-motion preserves semantic open and close states without a travel animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/machine-core-preview.html');
    const status = page.locator('[data-core-state]');
    await expect(status).toContainText('reduced-motion collapsed · 0%');
    await page.getByRole('button', { name: 'Expand', exact: true }).click();
    await expect(status).toContainText('reduced-motion expanded · 100%');
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(status).toContainText('reduced-motion collapsed · 0%');
  });

  test('real Hero shell can opt into the machine candidate without changing default Hero mode', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-experience', 'world');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.goto('/hero/?machine-candidate=1');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-machine-candidate', '1');
    await expect(page.locator('#hero-canvas')).toBeHidden();
    await expect(page.locator('[data-hero-machine-candidate]')).toBeVisible();
    await expect(page.locator('[data-machine-core-visual]')).toBeVisible();
    await expect(page.getByText('15 modules · 10 seats · 4 outer housings · 1 hub')).toBeVisible();
  });

  test('has no production Hero surface or legacy tree navigation', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.locator('#hero-canvas')).toHaveCount(0);
    await expect(page.locator('[data-camera]')).toHaveCount(0);
    await expect(page.locator('text=BRANCH CONNECTION CORE')).toBeVisible();
  });
});
