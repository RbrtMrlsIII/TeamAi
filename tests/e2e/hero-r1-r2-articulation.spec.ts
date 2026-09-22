import { expect, test } from '@playwright/test';

test.describe('029 canonical R1/R2 articulation runtime contract', () => {
  test('canonical Hero renderer exposes lifecycle-driven ring articulation and concentric ordering', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero/?seats=10');

    const canvas = page.locator('#hero-canvas');
    await expect(canvas).toBeVisible();

    await expect.poll(async () => canvas.getAttribute('data-machine-world-ring-articulation-phase')).toBe('STOWED');

    const initial = await page.evaluate(() => {
      const canvas = document.querySelector('#hero-canvas') as HTMLCanvasElement | null;
      if (!canvas) throw new Error('missing #hero-canvas');
      return {
        phase: canvas.dataset.machineWorldRingArticulationPhase,
        r1: canvas.dataset.machineWorldR1Articulation,
        r2: canvas.dataset.machineWorldR2Articulation,
        r1Count: canvas.dataset.machineWorldR1Count,
        r1Threads: canvas.dataset.machineWorldR1Threads,
        r2Count: canvas.dataset.machineWorldR2Count,
      };
    });

    expect(initial).toMatchObject({
      phase: 'STOWED',
      r1: '0',
      r2: '0',
      r1Count: '3',
      r1Threads: '2',
      r2Count: '4',
    });

    await page.evaluate(() => {
      const hero = (window as any).TeamAiHero;
      hero.setReducedMotion(true);
      hero.selectSeatShell(0);
    });

    await expect.poll(async () => page.evaluate(() => (window as any).TeamAiHero.getHierarchyState?.().phase)).toBe('open');

    await expect.poll(async () => canvas.getAttribute('data-machine-world-ring-articulation-phase')).toBe('LINKED');

    const opened = await page.evaluate(() => {
      const canvas = document.querySelector('#hero-canvas') as HTMLCanvasElement | null;
      if (!canvas) throw new Error('missing #hero-canvas');
      const values = {
        r0: Number(canvas.dataset.machineWorldR0Radius),
        r1: Number(canvas.dataset.machineWorldR1Radius),
        r2: Number(canvas.dataset.machineWorldR2Radius),
        r3: Number(canvas.dataset.machineWorldR3Radius),
        r1Articulation: Number(canvas.dataset.machineWorldR1Articulation),
        r2Articulation: Number(canvas.dataset.machineWorldR2Articulation),
        r1Signal: Number(canvas.dataset.machineWorldR1Signal),
        r2Signal: Number(canvas.dataset.machineWorldR2Signal),
      };
      return {
        ...values,
        reducedMotion: (window as any).TeamAiHero.getReducedMotion?.(),
      };
    });

    expect(opened.reducedMotion).toBe(true);
    expect(opened.r0).toBeLessThan(opened.r1);
    expect(opened.r1).toBeLessThan(opened.r2);
    expect(opened.r2).toBeLessThan(opened.r3);
    expect(opened.r1Articulation).toBe(1);
    expect(opened.r2Articulation).toBe(1);
    expect(opened.r1Signal).toBeGreaterThanOrEqual(0);
    expect(opened.r2Signal).toBeGreaterThanOrEqual(0);

    const rendererSource = await page.evaluate(async () => {
      const response = await fetch('/hero/machine-world-renderer.js');
      const source = await response.text();
      return {
        usesArticulationModel: source.includes('deriveMachineRingArticulation'),
        exposesR1: source.includes('machineWorldR1Articulation'),
        exposesR2: source.includes('machineWorldR2Articulation'),
        exposesPhase: source.includes('machineWorldRingArticulationPhase'),
      };
    });

    expect(rendererSource).toEqual({
      usesArticulationModel: true,
      exposesR1: true,
      exposesR2: true,
      exposesPhase: true,
    });
  });
});
