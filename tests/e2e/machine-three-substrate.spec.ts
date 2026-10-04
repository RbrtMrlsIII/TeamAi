import { expect, test } from '@playwright/test';

test.describe('Y1 Three.js WebGL2 substrate', () => {
  test('renders real S2 Core + S3 Seat 1 through the adapter without creating a second Hero canvas', async ({ page }) => {
    await page.goto('/spatial/machine-three-substrate-preview.html');
    const status = page.locator('[data-three-status]');
    await expect(status).toContainText('READY · WebGL2 · 186 · ');
    await expect(status).toContainText('Core + Seat 1');
    await expect(page.locator('canvas[aria-label="Y1 Three.js WebGL2 substrate preview"]')).toHaveCount(1);
    await page.getByRole('button', { name: 'Seat 1', exact: true }).click();
    await expect(status).toContainText('READY · WebGL2 · 186 · ');
    await expect(page.locator('canvas')).toHaveCount(1);
    await expect(page.locator('canvas')).not.toHaveAttribute('data-hero-canvas');
  });

  test('fails visibly when the WebGL2 substrate cannot initialize', async ({ page }) => {
    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(type, attributes) {
        if (type === 'webgl2') return null;
        return original.call(this, type, attributes);
      };
    });
    await page.goto('/spatial/machine-three-substrate-preview.html');
    await expect(page.locator('[data-three-status]')).toContainText('BLOCKED · WebGL2 unavailable');
  });
});
