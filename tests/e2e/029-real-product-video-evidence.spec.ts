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

    await page.evaluate(() => window.TeamAiHero.selectSeatShell(0));
    await page.waitForTimeout(1100);

    await page.evaluate(() => window.TeamAiHero.focusChild('SEAT_CONNECTION'));
    await page.waitForTimeout(900);

    await page.evaluate(() => window.TeamAiHero.focusChild('SEAT_BEHAVIOR'));
    await page.waitForTimeout(900);

    await page.evaluate(() => window.TeamAiHero.focusChild('SEAT_TASK_EVIDENCE'));
    await page.waitForTimeout(900);

    await page.evaluate(() => window.TeamAiHero.closeHierarchyParent());
    await page.waitForTimeout(1100);

    await page.evaluate(() => window.TeamAiHero.startLoop());
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.TeamAiHero.stopLoop());
    await page.waitForTimeout(500);

    const snapshot = await page.evaluate(() => ({
      seatCount: window.TeamAiHero.getSeatCount(),
      selectedSeat: window.TeamAiHero.getSelectedSeat(),
      state: window.TeamAiHero.getState(),
      cameraId: window.TeamAiHero.getBaseCameraId(),
      reducedMotion: window.TeamAiHero.getReducedMotion(),
      hierarchyOpen: window.TeamAiHero.getHierarchyState().openParentId,
    }));

    expect(snapshot.seatCount).toBe(10);
    expect(snapshot.selectedSeat).toBe(0);
    expect(snapshot.cameraId).toBe('HERO_WIDE');
    expect(snapshot.reducedMotion).toBe(false);
    expect(snapshot.hierarchyOpen).toBeFalsy();
  });
});
