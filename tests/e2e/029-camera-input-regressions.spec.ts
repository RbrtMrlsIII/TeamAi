import { expect, test } from '@playwright/test';

test.describe('029 camera/input regression guards', () => {
  test('turn-loop preserves the current camera while contribution remains user-navigable', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell(0);
      hero.resetNav();
    });

    const before = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return { camera: hero.getBaseCameraId(), zoom: hero.getNavZoom(), seat: hero.getSelectedSeat() };
    });

    await page.evaluate(() => (window as any).TeamAiHero.startLoop());
    await expect(page.locator('#state-label')).toHaveText('FOCUS');
    await page.waitForTimeout(900);

    const during = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return { state: hero.getState(), camera: hero.getBaseCameraId(), zoom: hero.getNavZoom(), seat: hero.getSelectedSeat() };
    });

    expect(['ACTIVE', 'CONTRIBUTE']).toContain(during.state);
    expect(during.camera).toBe(before.camera);
    expect(during.seat).toBe(before.seat);

    await page.evaluate(() => (window as any).TeamAiHero.stopLoop());
  });

  test('empty canvas clicks do not advance the selected Seat', async ({ page }) => {
    await page.goto('/hero/?seats=2');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell(0);
      hero.resetNav();
    });

    expect(await page.evaluate(() => (window as any).TeamAiHero.getSelectedSeat())).toBe(0);

    const canvas = page.locator('#hero-canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Hero canvas bounding box unavailable');

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.waitForTimeout(50);

    expect(await page.evaluate(() => (window as any).TeamAiHero.getSelectedSeat())).toBe(0);
  });
});
