import { expect, test } from '@playwright/test';

test.use({
  video: 'on',
  viewport: { width: 1440, height: 900 },
});

test.describe('029 real-product video evidence', () => {
  test('captures the actual Hero machine through focus, division, return, and turn-loop states', async ({ page }) => {
    await page.goto('/hero/');
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();

    await page.waitForTimeout(1200);

    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-shell-count', '16');
    await expect(canvas).toHaveAttribute('data-machine-world-facility-body-main-shell-count', '4');

    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    await page.waitForTimeout(1100);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_CONNECTION'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_BEHAVIOR'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.focusChild('SEAT_TASK_EVIDENCE'));
    await page.waitForTimeout(900);

    await page.evaluate(() => (window as any).TeamAiHero.closeHierarchyParent());
    await page.waitForTimeout(1100);

    await page.evaluate(() => (window as any).TeamAiHero.startLoop());
    await page.waitForTimeout(3000);
    await page.evaluate(() => (window as any).TeamAiHero.stopLoop());
    await page.waitForTimeout(500);

    const snapshot = await page.evaluate(() => ({
      seatCount: (window as any).TeamAiHero.getSeatCount(),
      selectedSeat: (window as any).TeamAiHero.getSelectedSeat(),
      state: (window as any).TeamAiHero.getState(),
      cameraId: (window as any).TeamAiHero.getBaseCameraId(),
      reducedMotion: (window as any).TeamAiHero.getReducedMotion(),
      hierarchyOpen: (window as any).TeamAiHero.getHierarchyState().openParentId,
    }));

    expect(snapshot.seatCount).toBe(10);
    expect(snapshot.selectedSeat).toBe(0);
    expect(snapshot.cameraId).toBe('HERO_WIDE');
    expect(snapshot.reducedMotion).toBe(false);
    expect(snapshot.hierarchyOpen).toBeFalsy();
  });
});