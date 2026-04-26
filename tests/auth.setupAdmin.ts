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

    let loggedIn = false;
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        await page.goto(Urls.adminUrl + '/admin/login', { timeout: 30000 });
        await page.waitForURL('**/admin/login', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');

        const emailInput = page.getByRole('textbox', { name: 'Email Address' });
        await emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await emailInput.fill(Urls.adminEmail);
        await page.getByRole('textbox', { name: 'Password' }).fill(Urls.adminPassword);
        await page.getByRole('button', { name: 'Sign In', exact: true }).click();

        try {
            // CI can be slightly behind right after onboarding; retry if still on login page.
            await expect(page).not.toHaveURL(/\/admin\/login\/?$/i, { timeout: 12000 });
            loggedIn = true;
            break;
        } catch {
            const currentUrl = page.url();
            const loginError = (await page.locator('.error, .alert, .invalid-feedback, [role="alert"]').first().textContent().catch(() => ''))?.trim();
            console.log(
                `⚠️ Marketplace admin login attempt ${attempt}/${maxAttempts} failed. URL: ${currentUrl}.` +
                    (loginError ? ` Message: ${loginError}` : ' No visible error message.')
            );
            if (attempt < maxAttempts) {
                console.log(`⏳ Marketplace admin not ready yet (attempt ${attempt}/${maxAttempts}). Retrying...`);
                await page.waitForTimeout(8000);
            }
        }
    }

    expect(loggedIn, 'Marketplace admin login did not succeed after retries').toBeTruthy();
    await expect(page).toHaveURL(/\/admin(\/.*)?$/i, { timeout: 30000 });

    // Add one stable post-login UI marker without relying on a specific heading node.
    await expect(page.getByRole('link', { name: /dashboard/i }).first()).toBeVisible({ timeout: 30000 });

    await page.context().storageState({ path: adminAuthFile });
    console.log(`💾 Marketplace admin session saved to: ${adminAuthFile}\n`);
});
