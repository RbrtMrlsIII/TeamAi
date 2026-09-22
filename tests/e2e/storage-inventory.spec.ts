import { expect, test } from '@playwright/test';

test.describe('Storage item inventory facility', () => {
  test('guest can discover locked Storage inventory without any content-write surface', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Storage' }).click();

    const facility = page.locator('#hero-storage-inventory-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-storage-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.locator('[data-storage-inventory]')).toContainText('No inventory items');
    await expect(facility.locator('[data-storage-inspect]')).toBeDisabled();
    await expect(facility.locator('input[type="file"]')).toHaveCount(0);
    await expect(facility).toContainText('Upload, binary transfer, content writes');
    await expect(facility.locator('[data-storage-branch]')).toHaveText('No inventory item selected');

    await facility.getByRole('button', { name: 'Sign in to inspect' }).click();
    await expect(facility).toBeHidden();
    await expect(page.locator('#hero-auth-panel')).toBeVisible();
    await expect(page.locator('#hero-auth-panel')).toHaveAttribute('aria-hidden', 'false');
  });

  test('authorized inventory read-model can populate metadata, selection, and semantic branch preview', async ({ page }) => {
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Storage' }).click();

    await page.evaluate(() => {
      window.TeamAiStorageInventoryFacility?.setPresentationAuthState(true);
      window.TeamAiStorageInventoryFacility?.setPresentationReadModel({
        inventoryKnown: true,
        authorized: true,
        entitled: true,
        healthy: true,
        source: 'authorized-backend-fixture',
        items: [
          {
            id: 'item-alpha',
            label: 'Reference artifact',
            kind: 'reference',
            source: 'workspace-artifact',
            workspaceId: 'workspace-main',
            projectId: 'atlas',
            updatedAt: '2026-09-21T00:00:00.000Z',
            sizeLabel: '24 KB',
            status: 'AVAILABLE',
            provenance: 'backend-read-model',
          },
          {
            id: 'item-beta',
            label: 'Team notes',
            kind: 'document',
            source: 'workspace-document',
            workspaceId: 'workspace-main',
            projectId: 'atlas',
            updatedAt: '2026-09-20T00:00:00.000Z',
            sizeLabel: '8 KB',
            status: 'AVAILABLE',
            provenance: 'backend-read-model',
          },
        ],
      });
    });

    const facility = page.locator('#hero-storage-inventory-facility');
    await expect(facility.locator('[data-storage-state]')).toHaveText('Authenticated · inventory ready');
    await expect(facility.locator('[data-storage-inventory] [data-storage-item]')).toHaveCount(2);
    await expect(facility.locator('[data-storage-source]')).toHaveText('Source: authorized-backend-fixture');
    await expect(facility.locator('[data-storage-inspect]')).toBeEnabled();

    await facility.locator('[data-storage-item="item-beta"]').click();
    await expect(facility.locator('[data-storage-selected-item]')).toHaveText('Team notes');
    await expect(facility.locator('[data-storage-branch]')).toHaveText(
      'BRANCH-STORAGE::item/item-beta/workspace/workspace-main/project/atlas/inventory',
    );

    await facility.locator('[data-storage-inspect]').click();
    await expect(facility.locator('[data-storage-result]')).toContainText('inspection intent requested');
    await expect(facility.locator('[data-storage-result]')).toContainText('No content write or transfer');
  });

  test('reduced-motion mode preserves Storage inventory semantics', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/hero/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await page.getByRole('button', { name: 'Storage' }).click();

    const facility = page.locator('#hero-storage-inventory-facility');
    await expect(facility).toBeVisible();
    await expect(facility.locator('[data-storage-state]')).toHaveText('Guest · DISCOVERABLE LOCKED');
    await expect(facility.getByRole('heading', { name: 'Item inventory' })).toBeVisible();
  });
});
