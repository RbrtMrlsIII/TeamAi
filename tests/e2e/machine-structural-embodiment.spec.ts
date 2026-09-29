import { expect, test } from '@playwright/test';

test.describe('S2-S10 structural embodiment candidate', () => {
  test('composes the structural machine in one Three.js canvas', async ({ page }) => {
    await page.goto('/spatial/machine-structural-embodiment-preview.html');
    const status = page.locator('[data-structural-status]');
    await expect(status).toContainText('READY · WORLD · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await expect(page.locator('canvas[aria-label="S2-S10 structural embodiment candidate"]')).toHaveCount(1);
    await page.screenshot({ path: 'test-results/s2-s10-world.png', fullPage: true });
    await page.getByRole('button', { name: 'Seat 1 / Divisions', exact: true }).click();
    await expect(status).toContainText('READY · SEAT · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await page.screenshot({ path: 'test-results/s2-s10-seat.png', fullPage: true });
    await page.getByRole('button', { name: 'Facility', exact: true }).click();
    await expect(status).toContainText('READY · FACILITY · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await page.screenshot({ path: 'test-results/s2-s10-facility.png', fullPage: true });
  });
});
