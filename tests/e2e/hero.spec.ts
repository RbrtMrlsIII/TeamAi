import { expect, test } from '@playwright/test';

test.describe('Living Web AI Workspace Hero', () => {
  test('renders the signature geometry shell and semantic controls', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Living Web AI Workspace' })).toBeVisible();
    await expect(page.locator('#hero-canvas')).toBeVisible();
    for (const label of ['Wide', 'Low orbit', 'Team', 'Workspace', 'Map']) {
      await expect(page.getByRole('button', { name: label })).toBeVisible();
    }
  });

  test('POV controls update presentation state without leaving the Hero', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Workspace' }).click();
    await page.waitForTimeout(1100);
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.locator('#state-label')).toHaveText('IDLE');
    await expect(page.locator('.hero-shell')).toHaveAttribute('data-state', 'IDLE');
  });

  test('turn loop advances through the contribution lifecycle', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Start turn loop' }).click();
    await expect(page.locator('#state-label')).toHaveText(/FOCUS|ACTIVE|CONTRIBUTE/, { timeout: 3500 });
    await expect(page.locator('#seat-label')).toContainText('Web AI Seat');
  });

  test('canvas selection focuses a Web AI Seat and reduced motion remains usable', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hero-canvas').click({ position: { x: 500, y: 420 } });
    await expect(page.locator('#state-label')).toHaveText('FOCUS');
    await expect(page.locator('#seat-label')).toContainText('Web AI Seat 2');

    await page.getByRole('button', { name: 'Reduced motion: off' }).click();
    await expect(page.getByRole('button', { name: 'Reduced motion: on' })).toBeVisible();
    await page.getByRole('button', { name: 'Map' }).click();
    await expect(page.locator('#hero-canvas')).toBeVisible();
  });
});
