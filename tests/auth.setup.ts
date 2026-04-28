// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';
import { ciStep } from '../utils/ciLogger';

/**
 * ================================================================================================
 * Auth Setup — Phase 1A: FlyCommerce App Admin only
 * ================================================================================================
 *
 * Flow prerequisite:
 *   1) FlyCommerce app admin logs in (this file) -> saves flycommerce.json
 *   2) Marketplace is created in app_store onboarding
 *   3) Marketplace admin auth runs in tests/auth.setupAdmin.ts
 *
 * File created by THIS file:
 *   playwright/.auth/flycommerce.json
 */

// ================================================================================================
// FlyCommerce Cloud App Authentication Setup (formerly Dokan Cloud)
// ================================================================================================
const flycommerceAuthFile = 'playwright/.auth/flycommerce.json';

setup('authenticate flycommerce', async ({ page }) => {
    setup.setTimeout(60000);

    ciStep('setupFlycommerceAuth', 'FlyCommerce auth starting');

    // Skip gracefully if credentials not configured
    if (!Urls.flycommerceEmail || !Urls.flycommercePassword) {
        ciStep('setupFlycommerceAuth', 'Skipped: DOKAN_CLOUD_EMAIL/DOKAN_CLOUD_PASSWORD missing');
        return;
    }

    const flycommerceUrl = Urls.flycommerceUrl || '';
    await page.goto(flycommerceUrl + '/login');
    await page.waitForURL('**/login');
    await page.waitForLoadState('domcontentloaded');

    ciStep('setupFlycommerceAuth', 'Login page loaded');

    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(Urls.flycommerceEmail);
    ciStep('setupFlycommerceAuth', 'Email filled');

    await page.getByRole('textbox', { name: 'Write your password' }).click();
    await page.getByRole('textbox', { name: 'Write your password' }).fill(Urls.flycommercePassword);
    ciStep('setupFlycommerceAuth', 'Password filled');

    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    ciStep('setupFlycommerceAuth', 'Sign In submitted');

    // Wait for My Stores heading — more reliable than networkidle
    await expect(page.getByRole('heading', { name: 'My Stores' })).toBeVisible({ timeout: 30000 });
    ciStep('setupFlycommerceAuth', 'Login successful');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await page.context().storageState({ path: flycommerceAuthFile });
    ciStep('setupFlycommerceAuth', `Session saved: ${flycommerceAuthFile}`);
});
