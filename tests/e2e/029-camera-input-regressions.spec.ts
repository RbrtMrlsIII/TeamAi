import { expect, test } from '@playwright/test';

test.describe('029 camera/input regression guards', () => {
  test('turn-loop preserves the current camera while contribution remains user-navigable', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const heartbeat = await page.evaluate(() => new Promise<number>((resolve) => requestAnimationFrame(() => resolve(performance.now()))));
    expect(heartbeat).toBeGreaterThan(0);

    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell(0);
      hero.resetNav();
    });

    const before = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return { camera: hero.getBaseCameraId(), seat: hero.getSelectedSeat() };
    });

    await page.evaluate(() => new Promise<void>((resolve) => {
      const onState = (event: any) => {
        if (event.detail?.state === 'CONTRIBUTE') {
          window.removeEventListener('teamai:hero-state-change', onState);
          resolve();
        }
      };
      window.addEventListener('teamai:hero-state-change', onState);
      (window as any).TeamAiHero.startLoop();
    }));

    if (pageErrors.length > 0) throw new Error(`Hero page errors: ${pageErrors.join(' | ')}`);

    const during = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return { state: hero.getState(), camera: hero.getBaseCameraId(), seat: hero.getSelectedSeat() };
    });

    expect(during.state).toBe('CONTRIBUTE');
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
