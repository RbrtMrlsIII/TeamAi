import { expect, test } from '@playwright/test';

test.describe('Seat Budget Settings', () => {
  test('guest can discover the panel but receives no configuration authority', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Seat Budget' }).click();

    const panel = page.locator('#hero-seat-budget-facility');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-seat-budget-state]')).toContainText('Locked');
    await expect(panel.locator('[data-seat-budget-save]')).toBeDisabled();
    await expect(panel).toContainText('backend read model');
  });

  test('authorized read model renders budget identity, accounting, and protected reserve', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Seat Budget' }).click();

    await page.evaluate(() => {
      window.TeamAiSeatBudgetSettings?.setReadModel({
        available: true,
        authorized: true,
        configurable: true,
        healthy: true,
        seatId: 'seat-coder',
        provider: 'openai',
        model: 'gpt-test',
        configured: {
          turnBudgetTokens: 10000,
          outputBudgetTokens: 3000,
          reasoningBudgetTokens: 5000,
          handoffReserveTokens: 1000,
          warningThresholdPercent: 0.8,
          responsibilityProfile: 'coder',
          contextInputPolicy: { retention: 'minimal-durable-context' },
        },
        usage: {
          consumedTotalTokens: 6000,
          remainingGenerationTokens: 4000,
          usableGenerationTokens: 3000,
          consumedReasoningTokens: 1200,
          consumedWorkOutputTokens: 4800,
        },
        state: 'HANDOFF',
        completionState: 'HANDOFF_REQUIRED',
        continuationAvailable: true,
        reason: 'Remaining usable capacity is below estimated completion need.',
      });
    });

    const panel = page.locator('#hero-seat-budget-facility');
    await expect(panel.locator('[data-seat-budget-state]')).toContainText('Handoff');
    await expect(panel.locator('[data-seat-budget-seat]')).toHaveText('seat-coder');
    await expect(panel.locator('[data-seat-budget-responsibility]')).toHaveText('coder');
    await expect(panel.locator('[data-seat-budget-provider]')).toHaveText('openai / gpt-test');
    await expect(panel.locator('[data-seat-budget-total]')).toHaveText('10,000 tokens');
    await expect(panel.locator('[data-seat-budget-reserve]')).toHaveText('1,000 tokens');
    await expect(panel.locator('[data-seat-budget-remaining]')).toHaveText('4,000 tokens');
    await expect(panel.locator('[data-seat-budget-completion]')).toHaveText('HANDOFF_REQUIRED');
    await expect(panel.locator('[data-seat-budget-continuation]')).toHaveText('Available');
    await expect(panel.locator('[data-seat-budget-save]')).toBeEnabled();

    await panel.locator('[data-seat-budget-save]').click();
    await expect(panel.locator('[data-seat-budget-result]')).toContainText('Configuration intent requested');
    await expect(panel.locator('[data-seat-budget-result]')).toContainText('backend-owned');
  });

  test('reduced-motion mode preserves Seat Budget semantics', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Seat Budget' }).click();

    const panel = page.locator('#hero-seat-budget-facility');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-seat-budget-state]')).toContainText('Locked');
  });
});
