import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and captures the hero frame', async ({ page }, testInfo) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Living Web AI Workspace' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    for (const label of ['Wide', 'Low orbit', 'Team', 'Workspace', 'Map']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
    const path = testInfo.outputPath('hero-wide.png');
    await page.screenshot({ path });
    await testInfo.attach('hero-wide', { path, contentType: 'image/png' });
  });

  test('exercises semantic POV, turn-loop, seat-focus, and reduced-motion controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');

    await page.getByRole('button', { name: 'Workspace' }).click();
    await page.getByRole('button', { name: 'Map' }).click();
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.getByRole('button', { name: 'Start turn loop' }).click();
    await expect(page.locator('#state-label')).toHaveText(/FOCUS|ACTIVE|CONTRIBUTE/);

    await page.getByRole('button', { name: 'Stop turn loop' }).click();
    await expect(page.locator('#state-label')).toHaveText('IDLE');

    await page.locator('#hero-canvas').click({ position: { x: 500, y: 420 } });
    await expect(page.locator('#state-label')).toHaveText('FOCUS');
    await expect(page.locator('#seat-label')).toContainText('Web AI Seat 2');

    await page.getByRole('button', { name: 'Reduced motion: off' }).click();
    await expect(page.getByRole('button', { name: 'Reduced motion: on' })).toBeVisible();
  });
});
