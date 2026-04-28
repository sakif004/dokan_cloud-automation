// tests/auth.setupUsers.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';
import { ciStep } from '../utils/ciLogger';

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

    ciStep('setupAuth', 'Vendor auth starting');

    const vendorEmail = process.env.VENDOR_EMAIL;
    if (!vendorEmail) {
        ciStep('setupAuth', 'Vendor auth skipped: VENDOR_EMAIL missing');
        return;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(Urls.vendorUrl + '/vendor/login', { timeout: 30000 });
        await page.waitForURL('**/vendor/login', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');

        ciStep('setupAuth', 'Vendor login page loaded');

        await page.locator('#login-email').fill(vendorEmail);
        ciStep('setupAuth', 'Vendor email filled');

        await page.locator('#login-password').fill(process.env.VENDOR_PASSWORD ?? '');
        ciStep('setupAuth', 'Vendor password filled');

        // Accept Privacy Policy if visible
        const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
        if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
            await privacyPolicy.click();
            ciStep('setupAuth', 'Vendor privacy policy accepted');
        }

        await expect(page.locator("//button[@type='submit']")).toBeVisible({ timeout: 10000 });
        await page.locator("//button[@type='submit']").click();
        ciStep('setupAuth', 'Vendor Sign In submitted');

        await page.waitForURL('**/vendor', { timeout: 20000 });
        await expect(page).toHaveURL(/\/vendor$/);
        ciStep('setupAuth', 'Vendor login successful');

        await context.storageState({ path: vendorAuthFile });
        ciStep('setupAuth', `Vendor session saved: ${vendorAuthFile}`);

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

    ciStep('setupAuth', 'Customer auth starting');

    const customerEmail = process.env.CUSTOMER_EMAIL;
    if (!customerEmail || !Urls.customerUrl) {
        ciStep('setupAuth', 'Customer auth skipped: CUSTOMER_EMAIL/CUSTOMER_URL missing');
        return;
    }

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(Urls.customerUrl + '/login', { timeout: 30000 });
        await page.waitForURL('**/login', { timeout: 15000 });
        await page.waitForLoadState('domcontentloaded');

        ciStep('setupAuth', 'Customer login page loaded');

        await page.locator('#reg-email').fill(customerEmail);
        ciStep('setupAuth', 'Customer email filled');

        await page.locator('#login-password').fill(process.env.CUSTOMER_PASSWORD ?? '');
        ciStep('setupAuth', 'Customer password filled');

        // Accept Privacy Policy if visible
        const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
        if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
            await privacyPolicy.click();
            ciStep('setupAuth', 'Customer privacy policy accepted');
        }

        await expect(page.locator("//button[normalize-space(text())='Sign in']")).toBeVisible({ timeout: 10000 });
        await page.locator("//button[normalize-space(text())='Sign in']").click();
        ciStep('setupAuth', 'Customer Sign In submitted');

        await page.waitForURL('**/customers/account', { timeout: 20000 });
        await expect(page).toHaveURL(/\/customers\/account$/);
        ciStep('setupAuth', 'Customer login successful');

        await context.storageState({ path: customerAuthFile });
        ciStep('setupAuth', `Customer session saved: ${customerAuthFile}`);

    } finally {
        await context.close().catch(() => { });
    }
});
