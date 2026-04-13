// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';

/**
 * ================================================================================================
 * Auth Setup — Phase 1: Admin + FlyCommerce only
 * ================================================================================================
 *
 * THREE-PHASE AUTH STRATEGY (for a fresh marketplace):
 *
 * Phase 1 — Project "setup" → THIS FILE:
 *   Saves admin.json + flycommerce.json.
 *   Vendor + Customer are NOT touched here — accounts don't exist yet.
 *
 * Phase 2 — Project "adminSeedSetup":
 *   Admin creates the journey vendor + customer accounts using .env credentials.
 *
 * Phase 3 — Project "setupAuth" → auth.setupUsers.ts:
 *   Vendor + Customer now exist, so their sessions are saved to
 *   vendor.json + customer.json successfully.
 *
 * Files created by THIS file:
 *   playwright/.auth/admin.json
 *   playwright/.auth/flycommerce.json
 */

// ================================================================================================
// Admin Authentication Setup
// ================================================================================================
const adminAuthFile = 'playwright/.auth/admin.json';

setup('authenticate admin', async ({ page }) => {
    // Auth pages can be slow — extend beyond the default 30s
    setup.setTimeout(90000);

    console.log('🔐 Admin Authentication Starting...');

    await page.goto(Urls.adminUrl + '/admin/login', { timeout: 30000 });
    await page.waitForURL('**/admin/login', { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    console.log('📄 Admin login page loaded');

    // Role-based locators — matches adminAuthPage.ts, resilient across rebrands
    const emailInput = page.getByRole('textbox', { name: 'Email Address' });
    await emailInput.waitFor({ state: 'visible', timeout: 30000 });
    await emailInput.fill(Urls.adminEmail);
    console.log(`✍️  Admin email filled: ${Urls.adminEmail}`);

    await page.getByRole('textbox', { name: 'Password' }).fill(Urls.adminPassword);
    console.log('✍️  Admin password filled');

    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    console.log('🖱️  Sign In button clicked');

    // Wait for dashboard heading — confirms login succeeded
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 30000 });
    console.log('✅ Admin logged in successfully');

    await page.context().storageState({ path: adminAuthFile });
    console.log(`💾 Admin session saved to: ${adminAuthFile}\n`);
});

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

    const flycommerceUrl = Urls.flycommerceUrl || 'https://app.flycommerce.com';
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
