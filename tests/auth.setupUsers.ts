// tests/auth.setupUsers.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';

/**
 * ================================================================================================
 * Auth Setup — Phase 3: Vendor + Customer only
 * ================================================================================================
 *
 * This file runs AFTER "adminSeedSetup" has created the journey vendor and customer accounts.
 * By the time this runs, both accounts exist and login will succeed.
 *
 * Files created by THIS file:
 *   playwright/.auth/vendor.json
 *   playwright/.auth/customer.json
 *
 * Run order:
 *   setupFlycommerceAuth -> marketplaceSetup -> setupMarketplaceAdminAuth
 *     -> marketplaceAdminSetupGuide -> adminSeedSetup
 *       -> setupAuth (this file — saves vendor.json + customer.json)
 */

// ================================================================================================
// Vendor Authentication Setup
// ================================================================================================
const vendorAuthFile = 'playwright/.auth/vendor.json';

setup('authenticate vendor', async ({ browser }) => {
    setup.setTimeout(90000);

    console.log('🔐 Vendor Authentication Starting...');

    const vendorEmail = process.env.VENDOR_EMAIL;
    if (!vendorEmail) {
        console.log('⏭  VENDOR_EMAIL not set in .env — skipping vendor auth');
        return;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(Urls.vendorUrl + '/vendor/login', { timeout: 30000 });
        await page.waitForURL('**/vendor/login', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');

        console.log('📄 Vendor login page loaded');

        await page.locator('#login-email').fill(vendorEmail);
        console.log(`✍️  Vendor email filled: ${vendorEmail}`);

        await page.locator('#login-password').fill(process.env.VENDOR_PASSWORD ?? '');
        console.log('✍️  Vendor password filled');

        // Accept Privacy Policy if visible
        const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
        if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
            await privacyPolicy.click();
            console.log('✅ Privacy Policy accepted');
        }

        await expect(page.locator("//button[@type='submit']")).toBeVisible({ timeout: 10000 });
        await page.locator("//button[@type='submit']").click();
        console.log('🖱️  Sign In button clicked');

        await page.waitForURL('**/vendor', { timeout: 20000 });
        await expect(page).toHaveURL(/\/vendor$/);
        console.log('✅ Vendor logged in successfully');

        await context.storageState({ path: vendorAuthFile });
        console.log(`💾 Vendor session saved to: ${vendorAuthFile}\n`);

    } finally {
        await context.close().catch(() => { });
    }
});

// ================================================================================================
// Customer Authentication Setup
// ================================================================================================
const customerAuthFile = 'playwright/.auth/customer.json';

setup('authenticate customer', async ({ browser }) => {
    setup.setTimeout(90000);

    console.log('🔐 Customer Authentication Starting...');

    const customerEmail = process.env.CUSTOMER_EMAIL;
    if (!customerEmail || !Urls.customerUrl) {
        console.log('⏭  CUSTOMER_EMAIL or CUSTOMER_URL not set in .env — skipping customer auth');
        return;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(Urls.customerUrl + '/login', { timeout: 30000 });
        await page.waitForURL('**/login', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');

        console.log('📄 Customer login page loaded');

        await page.locator('#reg-email').fill(customerEmail);
        console.log(`✍️  Customer email filled: ${customerEmail}`);

        await page.locator('#login-password').fill(process.env.CUSTOMER_PASSWORD ?? '');
        console.log('✍️  Customer password filled');

        // Accept Privacy Policy if visible
        const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
        if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
            await privacyPolicy.click();
            console.log('✅ Privacy Policy accepted');
        }

        await expect(page.locator("//button[normalize-space(text())='Sign in']")).toBeVisible({ timeout: 10000 });
        await page.locator("//button[normalize-space(text())='Sign in']").click();
        console.log('🖱️  Sign In button clicked');

        await page.waitForURL('**/customers/account', { timeout: 20000 });
        await expect(page).toHaveURL(/\/customers\/account$/);
        console.log('✅ Customer logged in successfully');

        await context.storageState({ path: customerAuthFile });
        console.log(`💾 Customer session saved to: ${customerAuthFile}\n`);

    } finally {
        await context.close().catch(() => { });
    }
});
