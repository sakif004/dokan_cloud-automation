// tests/fixtures/auth.fixtures.ts
import { test as base, type Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

/**
 * ================================================================================================
 * Page Object Models - Minimal, just holds page reference
 * ================================================================================================
 */

// ========== Admin Page ==========
class AdminPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

// ========== Vendor Page ==========
class VendorPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

// ========== Customer Page ==========
class CustomerPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

// ========== Dokan Cloud Page ==========
class DokanCloudPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

/**
 * ================================================================================================
 * Fixture Type Declaration
 * ================================================================================================
 */
export type AuthFixtures = {
    adminPage: AdminPage;
    vendorPage: VendorPage;
    customerPage: CustomerPage;
    dokanCloudPage: DokanCloudPage;
};

/**
 * ================================================================================================
 * Custom Test Fixture Extension
 * ================================================================================================
 */
export const test = base.extend<AuthFixtures>({
    // ===== Admin Fixture =====
    adminPage: async ({ browser }, use) => {
        console.log('🔐 Loading Admin fixture...');

        // Create context with admin auth
        const context = await browser.newContext({
            storageState: 'playwright/.auth/admin.json'
        });

        // Create page
        const page = await context.newPage();

        // ✅ Navigate to ensure session is properly loaded and page is fully interactive
        await page.goto(Urls.adminUrl + '/admin');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000); // Extra wait for page to be fully ready

        // Instantiate AdminPage
        const adminPage = new AdminPage(page);

        console.log('✅ Admin fixture ready');

        // Provide to test
        await use(adminPage);

        // Cleanup
        console.log('🧹 Closing Admin context');
        await context.close();
    },

    // ===== Vendor Fixture =====
    vendorPage: async ({ browser }, use) => {
        console.log('🔐 Loading Vendor fixture...');

        // Create context with vendor auth
        const context = await browser.newContext({
            storageState: 'playwright/.auth/vendor.json'
        });

        // Create page
        const page = await context.newPage();

        // ✅ Navigate to ensure session is properly loaded and page is fully interactive
        await page.goto(Urls.vendorUrl + '/vendor');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000); // Extra wait for page to be fully ready

        // Instantiate VendorPage
        const vendorPage = new VendorPage(page);

        console.log('✅ Vendor fixture ready');

        // Provide to test
        await use(vendorPage);

        // Cleanup
        console.log('🧹 Closing Vendor context');
        await context.close();
    },

    // ===== Customer Fixture =====
    customerPage: async ({ browser }, use) => {
        console.log('🔐 Loading Customer fixture...');

        // Create context with customer auth
        const context = await browser.newContext({
            storageState: 'playwright/.auth/customer.json'
        });

        // Create page
        const page = await context.newPage();

        // ✅ Navigate to ensure session is properly loaded and page is fully interactive (if customer URL configured)
        if (Urls.customerUrl) {
            await page.goto(Urls.customerUrl);
            await page.waitForLoadState('networkidle');
            await page.waitForLoadState('domcontentloaded');
            await page.waitForTimeout(2000); // Extra wait for page to be fully ready
        }

        // Instantiate CustomerPage
        const customerPage = new CustomerPage(page);

        console.log('✅ Customer fixture ready');

        // Provide to test
        await use(customerPage);

        // Cleanup
        console.log('🧹 Closing Customer context');
        await context.close();
    },

    // ===== Dokan Cloud Fixture =====
    dokanCloudPage: async ({ browser }, use) => {
        console.log('🔐 Loading Dokan Cloud fixture...');

        // Check if credentials are configured
        if (!Urls.dokanCloudEmail || !Urls.dokanCloudPassword) {
            console.log('⚠️  Dokan Cloud credentials not configured in .env file.');
            console.log('⚠️  Skipping Dokan Cloud fixture. To enable:');
            console.log('   1. Add DOKAN_CLOUD_EMAIL and DOKAN_CLOUD_PASSWORD to your .env file');
            console.log('   2. Run: npx playwright test --project=setup');

            // Create a context without auth (tests using this fixture will need to handle login)
            const context = await browser.newContext();
            const page = await context.newPage();
            const dokanCloudPage = new DokanCloudPage(page);

            await use(dokanCloudPage);
            await context.close();
            return;
        }

        // Check if auth file exists
        const fs = require('fs');
        const path = require('path');
        const authFile = path.join(process.cwd(), 'playwright/.auth/dokanCloud.json');

        if (!fs.existsSync(authFile)) {
            throw new Error(
                'Dokan Cloud authentication file not found.\n' +
                'Please run setup to create the authentication file:\n' +
                '  npx playwright test --project=setup\n\n' +
                `Expected file: ${authFile}\n\n` +
                'Make sure DOKAN_CLOUD_EMAIL and DOKAN_CLOUD_PASSWORD are set in your .env file.'
            );
        }

        // Create context with Dokan Cloud auth
        const context = await browser.newContext({
            storageState: 'playwright/.auth/dokanCloud.json'
        });

        // Create page
        const page = await context.newPage();

        // ✅ Navigate to ensure session is properly loaded and page is fully interactive
        const dokanCloudUrl = Urls.dokanCloudUrl || 'https://app.dokan.co';
        await page.goto(dokanCloudUrl + '/cloud/stores');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000); // Extra wait for page to be fully ready

        // Instantiate DokanCloudPage
        const dokanCloudPage = new DokanCloudPage(page);

        console.log('✅ Dokan Cloud fixture ready');

        // Provide to test
        await use(dokanCloudPage);

        // Cleanup
        console.log('🧹 Closing Dokan Cloud context');
        await context.close();
    },
});

/**
 * ================================================================================================
 * Re-export everything from @playwright/test
 * ================================================================================================
 */
export * from '@playwright/test';