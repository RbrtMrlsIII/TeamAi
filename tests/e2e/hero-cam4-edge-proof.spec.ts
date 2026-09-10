/**
 * SP-03 — Cam-4 browser proof (Playwright).
 * Edge / inverse / reduced-motion / hierarchy coexistence on the live Hero surface.
 * Presentation only · no 029-released claim.
 */
import { expect, test } from '@playwright/test';

test.describe('SP-03 Cam-4 edge / inverse browser proof', () => {
  test('loads Cam-4 module in page context and proves edge + reduced-motion math', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    const cam4 = await page.evaluate(async () => {
      const m = await import('/hero-cam4-edge-swipe.js');
      const center = m.edgePressure(0.5, 0.5);
      const left = m.edgePressure(0.01, 0.5);
      const quiet = m.edgeDriftDelta(left, 0.016, { reducedMotion: true });
      const live = m.edgeDriftDelta(left, 0.016, { reducedMotion: false });
      const inv = m.inverseSwipeDelta(0.15, 0);
      return {
        zone: m.EDGE_ZONE_FRAC,
        centerPx: center.px,
        leftPx: left.px,
        quietYaw: quiet.dYaw,
        liveYaw: live.dYaw,
        invYaw: inv.dYaw,
      };
    });

    expect(cam4.zone).toBeGreaterThan(0);
    expect(cam4.zone).toBeLessThanOrEqual(0.12);
    expect(cam4.centerPx).toBe(0);
    expect(cam4.leftPx).toBeLessThan(0);
    expect(cam4.quietYaw).toBe(0);
    expect(cam4.liveYaw).toBeLessThan(0);
    expect(cam4.invYaw).toBeLessThan(0);
  });

  test('edge pointer on canvas + reduced motion + hierarchy open coexist', async ({ page }) => {
    await page.goto('/hero/');
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();

    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;

    // Edge band pointer path (left edge → slight vertical)
    const edgeX = box.x + Math.max(4, box.width * 0.02);
    const midY = box.y + box.height * 0.5;
    await page.mouse.move(edgeX, midY);
    await page.mouse.down();
    await page.mouse.move(edgeX + 12, midY + 8, { steps: 4 });
    await page.mouse.up();

    // Canvas and shell remain healthy after edge interaction
    await expect(canvas).toBeVisible();
    await expect(page.locator('.hero-shell')).toBeVisible();

    // Open hierarchy (seat focus) — Cam-6 subject must remain coherent
    await canvas.click({ position: { x: 80, y: Math.min(420, box.height - 40) } });
    const hierarchy = await page.evaluate(() => (window as any).TeamAiHero?.getHierarchyState?.());
    expect(hierarchy?.openParentId || hierarchy?.focusedChildId).toBeTruthy();

    // Reduced motion on — product control must remain operable
    await page.getByRole('button', { name: 'Reduced motion: off', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Reduced motion: on', exact: true })).toBeVisible();

    // Another edge pass under reduced motion must not break the page
    await page.mouse.move(edgeX, midY);
    await page.mouse.down();
    await page.mouse.move(edgeX + 20, midY - 6, { steps: 3 });
    await page.mouse.up();
    await expect(canvas).toBeVisible();
    await expect(page.locator('#state-label')).toBeVisible();
  });

  test('Cam-4 module stays presentation-only when loaded in browser', async ({ page }) => {
    await page.goto('/hero/');
    const src = await page.evaluate(async () => {
      const res = await fetch('/hero-cam4-edge-swipe.js');
      return res.text();
    });
    expect(src).toMatch(/presentation only|no 029-released/i);
    expect(src).not.toMatch(/firestore|paypal|OAuth|scheduler/i);
  });
});
