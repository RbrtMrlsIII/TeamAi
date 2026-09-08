import { expect, test } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs';

/**
 * Issue #88 visual evidence — material/depth pass for workspaceRing / seatShell.
 * Captures HERO_WIDE and SEAT_CLOSE under light + reduced-motion.
 * Presentation only; no domain authority.
 */
test.describe('Issue #88 material/depth visual evidence', () => {
  test('capture HERO_WIDE and SEAT_CLOSE frames (light, normal + reduced motion)', async ({ page }, testInfo) => {
    const outDir = testInfo.outputPath('issue-88-visual');
    fs.mkdirSync(outDir, { recursive: true });

    await page.goto('/hero/?seats=4');
    await expect(page.locator('#hero-canvas')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Living Web AI Workspace' })).toBeVisible();

    // Ensure light theme attribute on documentElement (canonical)
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme-mode', 'light');
      document.documentElement.setAttribute('data-density', 'default');
      document.documentElement.setAttribute('data-motion', 'full');
    });

    // HERO_WIDE
    await page.getByRole('button', { name: 'Wide', exact: true }).click();
    await page.waitForTimeout(600);
    const widePath = path.join(outDir, '88-hero-wide-light.png');
    await page.screenshot({ path: widePath, fullPage: false });
    await testInfo.attach('88-hero-wide-light', { path: widePath, contentType: 'image/png' });

    // SEAT_CLOSE
    await page.getByRole('button', { name: 'Seat', exact: true }).click();
    await page.waitForTimeout(600);
    const seatPath = path.join(outDir, '88-seat-close-light.png');
    await page.screenshot({ path: seatPath, fullPage: false });
    await testInfo.attach('88-seat-close-light', { path: seatPath, contentType: 'image/png' });

    // Reduced motion — suppress continuous choreography; materials still readable
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-motion', 'reduced');
      (window as any).TeamAiHero?.setReducedMotion?.(true);
    });
    await page.getByRole('button', { name: 'Wide', exact: true }).click();
    await page.waitForTimeout(400);
    const reducedPath = path.join(outDir, '88-hero-wide-reduced-motion.png');
    await page.screenshot({ path: reducedPath, fullPage: false });
    await testInfo.attach('88-hero-wide-reduced-motion', { path: reducedPath, contentType: 'image/png' });

    // Assert canvas still present and TeamAiHero API live (materials path loaded)
    const api = await page.evaluate(() => ({
      hasHero: typeof (window as any).TeamAiHero === 'object',
      reduced: (window as any).TeamAiHero?.getReducedMotion?.() ?? null,
      seats: (window as any).TeamAiHero?.getSeatCount?.() ?? null,
    }));
    expect(api.hasHero).toBe(true);
    expect(api.reduced).toBe(true);
    expect(api.seats).toBe(4);

    // Static source evidence: authored materials still consumed
    const srcOk = await page.evaluate(async () => {
      const res = await fetch('/hero/hero-flex.js');
      const text = await res.text();
      return (
        text.includes('authoredRingMaterial') &&
        text.includes('authoredSeatShellMaterial') &&
        text.includes('authoredSeatInsetMaterial') &&
        text.includes('heroMaterialContext')
      );
    });
    expect(srcOk).toBe(true);
  });
});
