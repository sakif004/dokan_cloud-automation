import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';

/**
 * ================================================================================================
 * Auth Setup — Phase 1C: Marketplace Admin only
 * ================================================================================================
 *
 * Run this AFTER marketplace onboarding created the target marketplace domain.
 *
 * File created by THIS file:
 *   playwright/.auth/admin.json
 */
const adminAuthFile = 'playwright/.auth/admin.json';

setup('authenticate marketplace admin', async ({ page }) => {
    setup.setTimeout(90000);

    console.log('🔐 Marketplace Admin Authentication Starting...');

    await page.goto(Urls.adminUrl + '/admin/login', { timeout: 30000 });
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.getByRole('textbox', { name: 'Email Address' });
    await emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await emailInput.fill(Urls.adminEmail);

    await page.getByRole('textbox', { name: 'Password' }).fill(Urls.adminPassword);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 30000 });

    await page.context().storageState({ path: adminAuthFile });
    console.log(`💾 Marketplace admin session saved to: ${adminAuthFile}\n`);
});
