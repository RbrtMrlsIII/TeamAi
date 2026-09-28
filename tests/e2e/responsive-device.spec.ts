import { test, expect } from '@playwright/test';

test('S23 mobile device semantics exercise the responsive machine at maximum seat density', async ({ page }) => {
  await page.goto('/hero/');
  await expect(page.locator('#hero-canvas')).toBeVisible();
  await page.evaluate(() => (window as any).TeamAiHero.setSeatCount(10));
  await expect(page.locator('#seat-label')).toContainText('10 seats presented');

  const state = await page.evaluate(() => {
    const canvas = document.querySelector('#hero-canvas') as HTMLCanvasElement | null;
    const root = document.documentElement;
    const viewport = window.visualViewport;
    return {
      viewportWidth: viewport?.width || window.innerWidth,
      viewportHeight: viewport?.height || window.innerHeight,
      coarsePointer: window.matchMedia('(pointer: coarse)').matches,
      noHover: window.matchMedia('(hover: none)').matches,
      maxTouchPoints: navigator.maxTouchPoints,
      touchAction: canvas ? getComputedStyle(canvas).touchAction : '',
      canvasTier: canvas?.dataset.machineWorldResponsiveTier || '',
      canvasOrientation: canvas?.dataset.machineWorldResponsiveOrientation || '',
      density: canvas?.dataset.machineWorldResponsiveDensity || '',
      facilityFeatureScale: Number(canvas?.dataset.machineWorldResponsiveFacilityFeatureScale || 0),
      readability: canvas?.dataset.machineWorldReadability || '',
      seatSpacingPx: Number(canvas?.dataset.machineWorldReadabilitySeatSpacingPx || 0),
      podFeaturePx: Number(canvas?.dataset.machineWorldReadabilityPodFeaturePx || 0),
      facilityFeaturePx: Number(canvas?.dataset.machineWorldReadabilityFacilityFeaturePx || 0),
      seatSpacingThresholdPx: Number(canvas?.dataset.machineWorldReadabilitySeatThresholdPx || 0),
      featureThresholdPx: Number(canvas?.dataset.machineWorldReadabilityFeatureThresholdPx || 0),
      scrollWidth: root.scrollWidth,
      scrollHeight: root.scrollHeight,
      clientWidth: root.clientWidth,
      clientHeight: root.clientHeight,
    };
  });

  expect(state.viewportWidth).toBeLessThanOrEqual(430);
  expect(state.viewportHeight).toBeGreaterThanOrEqual(700);
  expect(state.coarsePointer).toBe(true);
  expect(state.noHover).toBe(true);
  expect(state.maxTouchPoints).toBeGreaterThan(0);
  expect(state.touchAction).toBe('none');
  expect(state.canvasTier).toBe('phone');
  expect(state.canvasOrientation).toBe('portrait');
  expect(state.density).toBe('compact');
  expect(state.facilityFeatureScale).toBeGreaterThan(1);
  expect(state.seatSpacingThresholdPx).toBe(32);
  expect(state.readability).toBe('pass');
  expect(state.seatSpacingPx).toBeGreaterThanOrEqual(state.seatSpacingThresholdPx);
  expect(state.podFeaturePx).toBeGreaterThanOrEqual(state.featureThresholdPx);
  expect(state.facilityFeaturePx).toBeGreaterThanOrEqual(state.featureThresholdPx);
  expect(state.scrollWidth).toBeLessThanOrEqual(state.clientWidth);
  expect(state.scrollHeight).toBeLessThanOrEqual(state.clientHeight);

  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const settings = page.locator('#world-menu [data-settings-open]');
  await expect(settings).toBeVisible();
  await settings.click();
  const panel = page.locator('#hero-settings-panel');
  await expect(panel).toBeVisible();
  const box = await panel.boundingBox();
  const viewportSize = page.viewportSize();
  expect(box).not.toBeNull();
  expect(viewportSize).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewportSize!.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewportSize!.height);
});
