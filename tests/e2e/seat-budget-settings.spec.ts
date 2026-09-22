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
    await expect(panel.locator('[data-seat-budget-result]')).toContainText('Configuration intent dispatched');
    await expect(panel.locator('[data-seat-budget-result]')).toContainText('Durable persistence requires');
  });

  test('configured runtime loads settings and durable usage through the trusted boundaries', async ({ page }) => {
    await page.addInitScript(() => {
      window.TEAMAI_SEAT_CONNECTION_BASE_URL = 'https://edge.example/functions/v1';
      window.TEAMAI_FIREBASE_ID_TOKEN = 'firebase-token';
      window.TEAMAI_WORKPLACE_ID = 'workplace-1';
      window.TEAMAI_PROJECT_ID = 'project-2';
    });

    let savedPatch = null;
    await page.route('https://edge.example/functions/v1/teamai-seat-budget-runtime', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() || '{}');
      expect(request.headers().authorization).toBe('Bearer firebase-token');
      expect(body.seatId).toBe('seat-1');

      const configured = {
        turnBudgetTokens: savedPatch?.turnBudgetTokens ?? 12000,
        outputBudgetTokens: savedPatch?.outputBudgetTokens ?? 4000,
        reasoningBudgetTokens: savedPatch?.reasoningBudgetTokens ?? 5000,
        handoffReserveTokens: savedPatch?.handoffReserveTokens ?? 1000,
        warningThresholdPercent: savedPatch?.warningThresholdPercent ?? 0.8,
        hardStopPolicy: savedPatch?.hardStopPolicy ?? 'handoff-before-exhaustion',
        responsibilityProfile: savedPatch?.responsibilityProfile ?? 'coder',
        contextInputPolicy: { retention: 'minimal-durable-context' },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          available: true,
          authorized: true,
          configurable: true,
          healthy: true,
          seatId: 'seat-1',
          provider: 'stub-edge-runtime',
          model: 'teamai-task-execute-v1',
          configured,
          usageReported: false,
          usage: {
            consumedInputTokens: 1,
            consumedOutputTokens: 1,
            consumedTotalTokens: 2,
            remainingGenerationTokens: null,
            usableGenerationTokens: null,
          },
          accountingSource: 'durable-execution-result-raw-usage',
          state: 'COMPLETED',
          completionState: 'WORK_COMPLETE',
          continuationAvailable: false,
          latest: {
            taskId: 'exec-task-1',
            executionId: 'complete-run-1',
            recordedAt: '2026-09-22T05:00:00.000Z',
            providerRuntime: 'stub-edge-runtime',
            budgetRecorded: false,
          },
          source: 'firestore-execution-result',
          reason: 'Latest durable execution result contains raw runtime usage, but no server-side remaining-capacity accounting. This is not inferred.',
        }),
      });
    });

    await page.route('https://edge.example/functions/v1/teamai-seat-budget-settings', async (route) => {
      const request = route.request();
      const body = JSON.parse(request.postData() || '{}');
      expect(request.headers().authorization).toBe('Bearer firebase-token');
      expect(body.seatId).toBe('seat-1');

      if (body.action === 'save') {
        savedPatch = body.patch;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            action: 'save',
            available: true,
            authorized: true,
            configurable: true,
            healthy: true,
            seatId: 'seat-1',
            provider: 'stub-edge-runtime',
            model: 'teamai-task-execute-v1',
            configured: {
              ...body.patch,
              contextInputPolicy: { retention: 'minimal-durable-context' },
            },
            usage: null,
            source: 'firestore-canonical-seat',
            reason: 'Configuration persisted to canonical Seat.',
          }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          action: 'get',
          available: true,
          authorized: true,
          configurable: true,
          healthy: true,
          seatId: 'seat-1',
          provider: 'stub-edge-runtime',
          model: 'teamai-task-execute-v1',
          configured: {
            turnBudgetTokens: 12000,
            outputBudgetTokens: 4000,
            reasoningBudgetTokens: 5000,
            handoffReserveTokens: 1000,
            warningThresholdPercent: 0.8,
            hardStopPolicy: 'handoff-before-exhaustion',
            responsibilityProfile: 'coder',
            contextInputPolicy: { retention: 'minimal-durable-context' },
          },
          usage: null,
          source: 'firestore-canonical-seat',
          reason: 'Settings integration test',
        }),
      });
    });

    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Seat Budget' }).click();

    const panel = page.locator('#hero-seat-budget-facility');
    await expect(panel.locator('[data-seat-budget-seat]')).toHaveText('seat-1');
    await expect(panel.locator('[data-seat-budget-total]')).toHaveText('12,000 tokens');
    await expect(panel.locator('[data-seat-budget-reserve]')).toHaveText('1,000 tokens');
    await expect(panel.locator('[data-seat-budget-input="hardStopPolicy"]')).toHaveValue('handoff-before-exhaustion');
    await expect(panel.locator('[data-seat-budget-consumed]')).toHaveText('2 tokens · 0%');
    await expect(panel.locator('[data-seat-budget-remaining]')).toHaveText('Not reported');
    await expect(panel.locator('[data-seat-budget-state]')).toContainText('raw usage recorded');

    await panel.locator('[data-seat-budget-input="turnBudgetTokens"]').fill('16000');
    await panel.locator('[data-seat-budget-input="outputBudgetTokens"]').fill('5000');
    await panel.locator('[data-seat-budget-input="reasoningBudgetTokens"]').fill('7000');
    await panel.locator('[data-seat-budget-input="handoffReserveTokens"]').fill('1500');
    await panel.locator('[data-seat-budget-input="warningThresholdPercent"]').fill('75');
    await panel.locator('[data-seat-budget-input="hardStopPolicy"]').selectOption('stop-at-limit');

    await panel.locator('[data-seat-budget-save]').click();
    await expect(panel.locator('[data-seat-budget-result]')).toContainText('runtime readback refreshed');
    await expect(panel.locator('[data-seat-budget-total]')).toHaveText('16,000 tokens');
    await expect(panel.locator('[data-seat-budget-output]')).toHaveText('5,000 tokens');
    await expect(panel.locator('[data-seat-budget-reasoning]')).toContainText('7,000 tokens');
    await expect(panel.locator('[data-seat-budget-reserve]')).toHaveText('1,500 tokens');
    await expect(panel.locator('[data-seat-budget-input="warningThresholdPercent"]')).toHaveValue('75');
    await expect(panel.locator('[data-seat-budget-input="hardStopPolicy"]')).toHaveValue('stop-at-limit');
    await expect(panel.locator('[data-seat-budget-remaining]')).toHaveText('Not reported');
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
