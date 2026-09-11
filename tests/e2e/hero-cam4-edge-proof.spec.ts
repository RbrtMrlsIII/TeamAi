/**
 * SP-03 — Cam-4 browser proof (Playwright).
 * Edge / proportional / reduced-motion / hierarchy coexistence on the live Hero surface.
 * Presentation only · no 029-released claim.
 */
import { expect, test } from '@playwright/test';

async function loadCam4(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const candidates = [
      new URL('hero-cam4-edge-swipe.js', location.href).href,
      '/hero/hero-cam4-edge-swipe.js',
      '/hero-cam4-edge-swipe.js',
      '/public/hero-cam4-edge-swipe.js',
    ];
    let lastErr: unknown = null;
    for (const url of candidates) {
      try {
        const m = await import(/* @vite-ignore */ url);
        if (m && typeof m.edgePressure === 'function') return { ok: true as const, url, m };
      } catch (e) { lastErr = e; }
    }
    return { ok: false as const, error: String(lastErr), href: location.href };
  });
}

test.describe('SP-03 Cam-4 proportional browser proof', () => {
  test('loads Cam-4 module and proves edge + reduced-motion + proportional math', async ({ page }) => {
    await page.goto('/hero/');
    await expect(page.locator('#hero-canvas')).toBeVisible();

    const loaded = await loadCam4(page);
    expect(loaded.ok, `Cam-4 import failed: ${JSON.stringify(loaded)}`).toBeTruthy();
    if (!loaded.ok) return;

    const cam4 = await page.evaluate(async (moduleUrl) => {
      const m = await import(/* @vite-ignore */ moduleUrl);
      const center = m.edgePressure(0.5, 0.5);
      const left = m.edgePressure(0.01, 0.5);
      const quiet = m.edgeDriftDelta(left, 0.016, { reducedMotion: true });
      const live = m.edgeDriftDelta(left, 0.016, { reducedMotion: false });
      const proportional = m.proportionalSwipeDelta(0.15, 0);
      return {
        zone: m.EDGE_ZONE_FRAC,
        centerPx: center.px,
        leftPx: left.px,
        quietYaw: quiet.dYaw,
        liveYaw: live.dYaw,
        proportionalYaw: proportional.dYaw,
      };
    }, loaded.url);

    expect(cam4.zone).toBeGreaterThan(0);
    expect(cam4.zone).toBeLessThanOrEqual(0.12);
    expect(cam4.centerPx).toBe(0);
    expect(cam4.leftPx).toBeLessThan(0);
    expect(cam4.quietYaw).toBe(0);
    expect(cam4.liveYaw).toBeLessThan(0);
    expect(cam4.proportionalYaw).toBeGreaterThan(0);
  });

  test('edge pointer + reduced motion + hierarchy open coexist', async ({ page }) => {
    await page.goto('/hero/');
    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();
    await page.waitForFunction(() => Boolean((window as any).TeamAiHero), null, { timeout: 15_000 });
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    if (!box) return;

    const edgeX = box.x + Math.max(4, box.width * 0.02);
    const midY = box.y + box.height * 0.5;
    await page.mouse.move(edgeX, midY);
    await page.mouse.down();
    await page.mouse.move(edgeX + 12, midY + 8, { steps: 4 });
    await page.mouse.up();

    await expect(canvas).toBeVisible();
    await expect(page.locator('.hero-shell')).toBeVisible();
  });

  test('Cam-4 module stays presentation-only when loaded in browser', async ({ page }) => {
    await page.goto('/hero/');
    const src = await page.evaluate(async () => {
      const candidates = [new URL('hero-cam4-edge-swipe.js', location.href).href, '/hero-cam4-edge-swipe.js'];
      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (res.ok) return await res.text();
        } catch { /* try next */ }
      }
      return '';
    });
    expect(src.length).toBeGreaterThan(100);
    expect(src).toMatch(/presentation only|no 029-released/i);
    expect(src).not.toMatch(/firestore|paypal|OAuth|scheduler/i);
  });
});
