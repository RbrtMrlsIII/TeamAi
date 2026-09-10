/**
 * SP-03 — Cam-4 browser proof (Playwright).
 * Edge / inverse / reduced-motion / hierarchy coexistence on the live Hero surface.
 * Presentation only · no 029-released claim.
 */
import { expect, test } from '@playwright/test';

/** Resolve Cam-4 module URL relative to the hero page mount (public/ or /hero/). */
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
        if (m && typeof m.edgePressure === 'function') {
          return { ok: true as const, url, m };
        }
      } catch (e) {
        lastErr = e;
      }
    }
    return {
      ok: false as const,
      error: String(lastErr),
      href: location.href,
    };
  });
}

test.describe('SP-03 Cam-4 edge / inverse browser proof', () => {
  test('loads Cam-4 module in page context and proves edge + reduced-motion math', async ({ page }) => {
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
      const inv = m.inverseSwipeDelta(0.15, 0);
      return {
        zone: m.EDGE_ZONE_FRAC,
        centerPx: center.px,
        leftPx: left.px,
        quietYaw: quiet.dYaw,
        liveYaw: live.dYaw,
        invYaw: inv.dYaw,
      };
    }, loaded.url);

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

    // Wait for hero runtime API (same readiness used by hero.spec)
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

    // Prefer the proven hero.spec path for seat focus
    await canvas.click({ position: { x: 80, y: Math.min(420, Math.floor(box.height - 40)) } });
    await page.waitForTimeout(200);
    const hierarchy = await page.evaluate(() => (window as any).TeamAiHero?.getHierarchyState?.());
    // Soft gate: either hierarchy opened or state-label advanced (FOCUS)
    const state = await page.locator('#state-label').textContent();
    const opened = Boolean(hierarchy?.openParentId || hierarchy?.focusedChildId);
    const focused = Boolean(state && /FOCUS|ACTIVE|CONTRIBUTE/i.test(state));
    expect(opened || focused).toBeTruthy();

    const motionOff = page.getByRole('button', { name: 'Reduced motion: off', exact: true });
    if (await motionOff.isVisible()) {
      await motionOff.click();
      await expect(page.getByRole('button', { name: 'Reduced motion: on', exact: true })).toBeVisible();
    }

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
      const candidates = [
        new URL('hero-cam4-edge-swipe.js', location.href).href,
        '/hero/hero-cam4-edge-swipe.js',
        '/hero-cam4-edge-swipe.js',
      ];
      for (const url of candidates) {
        try {
          const res = await fetch(url);
          if (res.ok) return await res.text();
        } catch {
          /* try next */
        }
      }
      return '';
    });
    expect(src.length).toBeGreaterThan(100);
    expect(src).toMatch(/presentation only|no 029-released/i);
    expect(src).not.toMatch(/firestore|paypal|OAuth|scheduler/i);
  });
});
