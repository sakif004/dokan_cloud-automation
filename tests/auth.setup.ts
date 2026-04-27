// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';

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

    console.log('🔐 FlyCommerce App Authentication Starting...');

    // Skip gracefully if credentials not configured
    if (!Urls.flycommerceEmail || !Urls.flycommercePassword) {
        console.log('⚠️  FlyCommerce credentials not configured in .env — skipping');
        console.log('    Add DOKAN_CLOUD_EMAIL and DOKAN_CLOUD_PASSWORD to your .env file');
        return;
    }

    const flycommerceUrl = Urls.flycommerceUrl || '';
    await page.goto(flycommerceUrl + '/login');
    await page.waitForURL('**/login');
    await page.waitForLoadState('domcontentloaded');

    console.log('📄 FlyCommerce login page loaded');

    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(Urls.flycommerceEmail);
    console.log(`✍️  FlyCommerce email filled: ${Urls.flycommerceEmail}`);

    await page.getByRole('textbox', { name: 'Write your password' }).click();
    await page.getByRole('textbox', { name: 'Write your password' }).fill(Urls.flycommercePassword);
    console.log('✍️  FlyCommerce password filled');

    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    console.log('🖱️  Sign In button clicked');

    // Wait for My Stores heading — more reliable than networkidle
    await expect(page.getByRole('heading', { name: 'My Stores' })).toBeVisible({ timeout: 30000 });
    console.log('✅ FlyCommerce logged in successfully');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    await page.context().storageState({ path: flycommerceAuthFile });
    console.log(`💾 FlyCommerce session saved to: ${flycommerceAuthFile}\n`);
});
