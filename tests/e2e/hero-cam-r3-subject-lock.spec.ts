import { expect, test } from '@playwright/test';

/**
 * CAM-R3 — subject-lock browser proof (presentation only).
 * No TURN_FOLLOW / HERO_LOW_ORBIT · no 029-released claim.
 */
test.describe('CAM-R3 subject-lock browser proof', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await page.waitForFunction(() => typeof (window as any).TeamAiHero?.getSubjectLockSnapshot === 'function');
  });

  test('TeamAiHero exposes subject-lock helpers without retired cameras', async ({ page }) => {
    const api = await page.evaluate(() => {
      const h = (window as any).TeamAiHero;
      return {
        hasSnapshot: typeof h?.getSubjectLockSnapshot === 'function',
        hasRetarget: typeof h?.retargetSubjectLock === 'function',
        hasSetSeat: typeof h?.setSelectedSeat === 'function',
        hasSetCamera: typeof h?.setCamera === 'function',
      };
    });
    expect(api.hasSnapshot).toBe(true);
    expect(api.hasRetarget).toBe(true);
    expect(api.hasSetSeat).toBe(true);
    expect(api.hasSetCamera).toBe(true);

    await expect(page.getByRole('button', { name: 'Low orbit', exact: true })).toHaveCount(0);
  });

  test('Seat camera activates subject-lock; Wide unlocks when closed', async ({ page }) => {
    await page.getByRole('button', { name: 'Seat', exact: true }).click();
    const locked = await page.evaluate(() => (window as any).TeamAiHero.getSubjectLockSnapshot());
    expect(locked.active).toBe(true);
    expect(locked.cameraId).toBe('SEAT_CLOSE');

    const after = await page.evaluate(() => {
      const h = (window as any).TeamAiHero;
      h.setSelectedSeat(2);
      return h.getSubjectLockSnapshot();
    });
    expect(after.selectedSeat).toBe(2);
    expect(after.active).toBe(true);

    await page.getByRole('button', { name: 'Wide', exact: true }).click();
    const wide = await page.evaluate(() => (window as any).TeamAiHero.getSubjectLockSnapshot());
    if (!wide.shellOpen) {
      expect(wide.cameraId).toBe('HERO_WIDE');
      expect(wide.active).toBe(false);
    }
  });
});
