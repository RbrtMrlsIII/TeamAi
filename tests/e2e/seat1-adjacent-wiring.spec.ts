import { expect, test } from '@playwright/test';

test.describe('Seat-1 adjacent wiring continuity', () => {
  test('exposes semantic adjacency only through the current sequential handoff', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    await page.evaluate(() => (window as any).TeamAiHero.selectSeatShell(0));
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.()), { timeout: 5000 }).toMatchObject({
      phase: 'open',
      focusedChildId: 'SEAT_CONNECTION',
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getSeat1AdjacentWiring?.())).toMatchObject({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
      to: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
      amount: 1,
      phase: 'SOURCE_OPENING_OR_ACTIVE',
      presentationOnly: true,
    });

    await page.keyboard.press('ArrowRight');

    const closing = await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      return {
        hierarchy: hero.getHierarchyState?.(),
        wiring: hero.getSeat1AdjacentWiring?.(),
        connectionAmount: hero.getConnectionBranchAmount?.(),
        behaviorAmount: hero.getBehaviorBranchAmount?.(),
      };
    });

    expect(closing.hierarchy).toMatchObject({
      phase: 'division_closing',
      focusedChildId: 'SEAT_CONNECTION',
      divisionClosingChildId: 'SEAT_CONNECTION',
      divisionPendingChildId: 'SEAT_BEHAVIOR',
    });
    expect(closing.connectionAmount).toBeGreaterThan(0);
    expect(closing.behaviorAmount).toBe(0);
    expect(closing.wiring).toMatchObject({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
      to: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
      presentationOnly: true,
    });
    expect(closing.wiring.amount).toBeGreaterThan(0);
    expect(closing.wiring.amount).toBeLessThanOrEqual(1);
    expect(closing.wiring.phase).toBe('SOURCE_OPENING_OR_ACTIVE');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.()), { timeout: 5000 }).toMatchObject({
      phase: 'open',
      focusedChildId: 'SEAT_BEHAVIOR',
      divisionClosingChildId: null,
      divisionPendingChildId: null,
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getConnectionBranchAmount?.())).toBe(0);
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getBehaviorBranchAmount?.())).toBe(1);
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getSeat1AdjacentWiring?.())).toMatchObject({
      phase: 'TARGET_OPENING_OR_ACTIVE',
      amount: 1,
      presentationOnly: true,
    });
  });
});
