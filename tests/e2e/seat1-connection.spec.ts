import { expect, test } from '@playwright/test';

test.describe('Seat-1 SEAT_CONNECTION vertical', () => {
  test('loads the semantic connection edge and reaches an open Seat-1 connection state', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    const edgeModule = await page.evaluate(async () => {
      const module = await import('./seat-connection-edge.js');
      const edge = module.seat1ConnectionEdge({ x: 2, y: 0.78, z: -1.5 });
      return {
        id: edge.id,
        from: edge.from,
        to: edge.to,
        semantic: edge.semantic,
        presentationOnly: edge.presentationOnly,
      };
    });

    expect(edgeModule).toEqual({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION→WORKSPACE_CENTER',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:PORT',
      to: 'WORKSPACE_CENTER',
      semantic: true,
      presentationOnly: true,
    });

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.selectSeatShell(0);
    });

    await expect.poll(async () => {
      return await page.evaluate(() => {
        const hero = (window as any).TeamAiHero;
        return {
          selectedSeat: hero.getSelectedSeat?.(),
          hierarchy: hero.getHierarchyState?.(),
          connectionAmount: hero.getConnectionBranchAmount?.(),
        };
      });
    }, { timeout: 5000 }).toMatchObject({
      selectedSeat: 0,
      hierarchy: { focusedChildId: 'SEAT_CONNECTION', openParentId: 'SEAT_SHELL#0', phase: 'open' },
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getConnectionBranchAmount())).toBe(1);
  });

  test('changing Seat-1 division focus closes the prior division before the next becomes active', async ({ page }) => {
    await page.goto('/hero/');
    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.().phase)).toBe('open');

    await page.keyboard.press('ArrowRight');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.()), { timeout: 5000 }).toMatchObject({
      phase: 'open',
      focusedChildId: 'SEAT_BEHAVIOR',
      divisionClosingChildId: null,
      divisionPendingChildId: null,
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getConnectionBranchAmount())).toBe(0);
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getBehaviorBranchAmount())).toBe(1);
  });
});
