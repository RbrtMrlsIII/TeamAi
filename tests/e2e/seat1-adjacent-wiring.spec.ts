import { expect, test } from '@playwright/test';

test.describe('Seat-1 adjacent semantic wiring', () => {
  test('renderer consumes the semantic wiring seam as Behavior expands', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell?.(0);
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.().phase)).toBe('open');
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getConnectionBranchAmount?.())).toBe(1);

    await page.keyboard.press('ArrowRight');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.()), { timeout: 5000 }).toMatchObject({
      phase: 'open',
      focusedChildId: 'SEAT_BEHAVIOR',
      divisionClosingChildId: null,
      divisionPendingChildId: null,
    });

    await expect.poll(async () => page.evaluate(() => document.querySelector('#hero-canvas')?.dataset.seat1AdjacentWiring), { timeout: 5000 }).toBe('active');
  });
});
