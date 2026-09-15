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

  test('M6 assembled Hero proof follows semantic subject after geometry mutation', async ({ page }) => {
    await page.goto('/hero/?machine-proof=1');
    const proof = page.locator('[data-hero-machine-proof]');
    await expect(proof).toBeVisible();
    await expect(proof).toHaveAttribute('data-camera-id', 'SEAT_CLOSE');
    await expect(proof.locator('[data-hero-machine-proof-state]')).toHaveText('semantic subject locked');
    const initialTarget = await proof.evaluate((node) => ({ x: node.getAttribute('data-target-x'), z: node.getAttribute('data-target-z') }));
    await proof.getByRole('button', { name: 'Mutate geometry', exact: true }).click();
    await expect(proof.locator('[data-hero-machine-proof-state]')).toContainText('subject moved · target');
    const movedTarget = await proof.evaluate((node) => ({ x: node.getAttribute('data-target-x'), z: node.getAttribute('data-target-z') }));
    expect(movedTarget).not.toEqual(initialTarget);
    await proof.getByRole('button', { name: 'Mutate geometry', exact: true }).click();
    await expect(proof.locator('[data-hero-machine-proof-state]')).toHaveText('semantic subject locked');
    const resetTarget = await proof.evaluate((node) => ({ x: node.getAttribute('data-target-x'), z: node.getAttribute('data-target-z') }));
    expect(resetTarget).toEqual(initialTarget);
    expect(await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('HERO_WIDE');
  });
});
