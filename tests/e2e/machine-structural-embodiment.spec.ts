import { expect, test } from '@playwright/test';

test.describe('S2-S10 structural embodiment candidate', () => {
  test('composes the structural machine in one Three.js canvas', async ({ page }) => {
    await page.goto('/spatial/machine-structural-embodiment-preview.html');
    const status = page.locator('[data-structural-status]');
    const canvas = page.locator('canvas[aria-label="S2-S10 structural embodiment candidate"]');
    await expect(status).toContainText('READY · WORLD · 10 seats · 4 facilities · 7 divisions · ');
    await expect(status).toContainText(' semantic edges · WebGL2 · Three r');
    await expect(canvas).toHaveCount(1);
    await expect(canvas).toHaveAttribute('data-structural-view', 'world');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'WORLD_OVERVIEW');
    await expect(canvas).toHaveAttribute('data-three-material-model', 'S24-authored-theme-family');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '10');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '4');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-world.png', fullPage: true });

    await page.getByRole('button', { name: 'Seat 1 / Divisions', exact: true }).click();
    await expect(status).toContainText('READY · SEAT · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'seat');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'DIVISION_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'POD_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '7');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-docking-articulated-mount-count'))).toBe(14);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-seat.png', fullPage: true });

    await page.getByRole('button', { name: 'Facility', exact: true }).click();
    await expect(status).toContainText('READY · FACILITY · 10 seats · 4 facilities · 7 divisions · ');
    await expect(canvas).toHaveAttribute('data-structural-view', 'facility');
    await expect(canvas).toHaveAttribute('data-structural-topology-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-camera-mode', 'FACILITY_FOCUS');
    await expect(canvas).toHaveAttribute('data-structural-visible-pods', '0');
    await expect(canvas).toHaveAttribute('data-structural-visible-facilities', '1');
    await expect(canvas).toHaveAttribute('data-structural-visible-divisions', '0');
    const facilityConduitKinds = await canvas.getAttribute('data-structural-conduit-edge-kinds');
    expect(facilityConduitKinds).toContain('facility-facility');
    expect(facilityConduitKinds).not.toContain('pod-facility');
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges'))).toBeGreaterThan(0);
    await expect.poll(async () => Number(await canvas.getAttribute('data-structural-visible-topology-edges')))
      .toBeLessThan(Number(await canvas.getAttribute('data-structural-total-topology-edges')));
    await page.screenshot({ path: 'test-results/s2-s10-facility.png', fullPage: true });
  });
});
