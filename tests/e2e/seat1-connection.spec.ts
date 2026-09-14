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
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getSeat1AdjacentWiring?.())).toMatchObject({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
      to: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
      phase: 'SOURCE_OPENING_OR_ACTIVE',
      amount: 1,
      presentationOnly: true,
    });
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
    await expect.poll(async () => page.locator('#seat-label').textContent()).toBe('Seat behavior face (expanded). Do/Dont presentation only; not durable policy. Press B for normal UI.');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getSeat1AdjacentWiring?.())).toMatchObject({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
      to: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
      phase: 'TARGET_OPENING_OR_ACTIVE',
      amount: 1,
      presentationOnly: true,
    });

    await page.keyboard.press('ArrowLeft');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.()), { timeout: 5000 }).toMatchObject({
      phase: 'open',
      focusedChildId: 'SEAT_CONNECTION',
      divisionClosingChildId: null,
      divisionPendingChildId: null,
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getBehaviorBranchAmount())).toBe(0);
    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getConnectionBranchAmount())).toBe(1);
    await expect.poll(async () => page.locator('#seat-label').textContent()).toBe('Seat connection face (expanded). Presentation only; not live bind. Press C to configure seat in normal UI.');

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getSeat1AdjacentWiring?.())).toMatchObject({
      id: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:ADJACENCY_WIRING',
      from: 'TREE-HERO-SEAT#0:SEAT_CONNECTION:GEOMETRY',
      to: 'TREE-HERO-SEAT#0:SEAT_BEHAVIOR:GEOMETRY',
      phase: 'SOURCE_OPENING_OR_ACTIVE',
      amount: 1,
      presentationOnly: true,
    });
  });
});
