import { expect, test } from '@playwright/test';

test.describe('Machine Hero foundation', () => {
  test('magnificent renderer exposes the complete 15-module machine', async ({ page }) => {
    await page.goto('/machine-hero-magnificent.html?machine-preview=magnificent');
    await expect(page.getByText('The Hero as a living machine')).toBeVisible();
    await expect(page.getByText('10 seats / 4 outer branches')).toBeVisible();
    await expect(page.locator('canvas[aria-label="Magnificent TeamAi modular machine core WebGL preview"]')).toBeVisible();
    await page.getByRole('button', { name: 'Expand machine', exact: true }).click();
    await expect(page.getByText('semantic divisions expanded')).toBeVisible();
    await page.getByRole('button', { name: 'Reset', exact: true }).click();
    await expect(page.getByText('base geometry')).toBeVisible();
  });

  test('remains isolated from the production Hero surface', async ({ page }) => {
    await page.goto('/machine-core-preview.html');
    await expect(page.locator('#hero-canvas')).toHaveCount(0);
    await expect(page.locator('[data-hero-engine-open]')).toHaveCount(0);
    await expect(page.locator('[data-world-camera-request]')).toHaveCount(0);
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

  test('WebGL preview consumes the shared semantic payload case matrix', async ({ page }) => {
    await page.goto('/machine-core-preview.html?machine-preview=webgl&machine-case=dense');
    const preview = page.locator('[data-machine-hero-webgl]');
    await expect(preview).toBeVisible();
    await expect(preview.locator('[data-machine-webgl-state]')).toContainText('dense semantic payload');
    const canvas = preview.locator('canvas[aria-label="Interactive Machine Hero WebGL semantic payload preview"]');
    await expect(canvas).toBeVisible();
    await expect(canvas).toHaveJSProperty('width', expect.any(Number));
    await expect.poll(() => canvas.evaluate((node) => ({ width: node.width, height: node.height, webgl: Boolean(node.getContext('webgl')) }))).toEqual(expect.objectContaining({ webgl: true }));

    await preview.getByRole('button', { name: 'Next payload case', exact: true }).click();
    await expect(preview.locator('[data-machine-webgl-state]')).toContainText('sparse semantic payload');

    await preview.getByRole('button', { name: 'Expand divisions', exact: true }).click();
    await expect(preview.locator('[data-machine-webgl-state]')).toContainText('expanded');
    await expect(preview.locator('[data-machine-webgl-state]')).toContainText('topology valid');
  });
});
