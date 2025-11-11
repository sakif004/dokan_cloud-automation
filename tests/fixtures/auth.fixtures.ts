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

/**
 * ================================================================================================
 * Fixture Type Declaration
 * ================================================================================================
 */
export type AuthFixtures = {
    adminPage: AdminPage;
    vendorPage: VendorPage;
    customerPage: CustomerPage;
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
});

/**
 * ================================================================================================
 * Re-export everything from @playwright/test
 * ================================================================================================
 */
export * from '@playwright/test';