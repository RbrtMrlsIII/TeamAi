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

    const reachedContribution = page.evaluate(() => new Promise<boolean>((resolve) => {
      const listener = (event: any) => {
        if (event.detail?.state === 'CONTRIBUTE') {
          window.removeEventListener('teamai:hero-state-change', listener);
          resolve(true);
        }
      };
      window.addEventListener('teamai:hero-state-change', listener);
      (window as any).TeamAiHero.startLoop();
    }));

    await expect.poll(() => page.locator('#state-label').textContent()).toBe('CONTRIBUTE');
    await expect(reachedContribution).resolves.toBe(true);

    const canvas = page.locator('#hero-canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Hero canvas bounding box unavailable');

    await page.mouse.wheel(0, 120);
    const during = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return { camera: hero.getBaseCameraId(), zoom: hero.getNavZoom(), seat: hero.getSelectedSeat() };
    });

    expect(during.camera).toBe(before.camera);
    expect(during.zoom).toBeGreaterThan(before.zoom);
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

    const before = await page.evaluate(() => (window as any).TeamAiHero.getSelectedSeat());
    expect(before).toBe(0);

    const canvas = page.locator('#hero-canvas');
    const box = await canvas.boundingBox();
    if (!box) throw new Error('Hero canvas bounding box unavailable');

    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.5);
    await page.waitForTimeout(50);

    const after = await page.evaluate(() => (window as any).TeamAiHero.getSelectedSeat());
    expect(after).toBe(0);
  });
});
