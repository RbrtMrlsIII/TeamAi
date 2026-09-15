import { expect, test } from '@playwright/test';

test.describe('semantic camera authority', () => {
  test('explicit named camera identity survives hierarchy follow and remains observable', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => (window as any).TeamAiHero.setCamera('SEAT_CLOSE'));
    await page.waitForTimeout(150);

    expect(await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('SEAT_CLOSE');
    expect(await page.evaluate(() => Boolean((window as any).TeamAiHero.getSemanticSubjectCameraTargetApplied?.()))).toBe(false);

    await page.evaluate(() => (window as any).TeamAiHero.setCamera('OVERHEAD_MAP'));
    await page.waitForTimeout(150);

    expect(await page.evaluate(() => (window as any).TeamAiHero.getBaseCameraId())).toBe('OVERHEAD_MAP');
  });
});
