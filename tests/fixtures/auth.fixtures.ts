// tests/fixtures/auth.fixtures.ts
import { test as base, type Page, type BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Urls } from '../../utils/testData';
import { ciStep } from '../../utils/ciLogger';

/**
 * ================================================================================================
 * Page holder classes — minimal wrappers used as fixtures
 * ================================================================================================
 */

class AdminPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

class VendorPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }
}

class CustomerPage {
    page: Page;
    context: BrowserContext;
    constructor(page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
    }
}

// FlyCommerce Cloud App (formerly DokanCloudPage)
class FlycommercePage {
    page: Page;
    constructor(page: Page) { this.page = page; }
}

/**
 * ================================================================================================
 * Fixture type declaration
 * ================================================================================================
 */
export type AuthFixtures = {
    adminPage:       AdminPage;
    vendorPage:      VendorPage;
    customerPage:    CustomerPage;
    flycommercePage: FlycommercePage;  // renamed from dokanCloudPage
};

/**
 * ================================================================================================
 * Custom test fixture extension
 * ================================================================================================
 */
export const test = base.extend<AuthFixtures>({

    // ── Admin Fixture ─────────────────────────────────────────────────────────
    adminPage: async ({ browser }, use) => {
        ciStep('fixtures', 'Loading admin fixture');

        const context = await browser.newContext({
            storageState: 'playwright/.auth/admin.json',
        });
        const page = await context.newPage();

        // Ensure session is loaded and page is fully interactive
        await page.goto(Urls.adminUrl + '/admin');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        ciStep('fixtures', 'Admin fixture ready');
        await use(new AdminPage(page));

        ciStep('fixtures', 'Closing admin context');
        await context.close();
    },

    // ── Vendor Fixture ────────────────────────────────────────────────────────
    vendorPage: async ({ browser }, use) => {
        ciStep('fixtures', 'Loading vendor fixture');

        const context = await browser.newContext({
            storageState: 'playwright/.auth/vendor.json',
        });
        const page = await context.newPage();

        await page.goto(Urls.vendorUrl + '/vendor');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        ciStep('fixtures', 'Vendor fixture ready');
        await use(new VendorPage(page));

        ciStep('fixtures', 'Closing vendor context');
        await context.close();
    },

    // ── Customer Fixture ──────────────────────────────────────────────────────
    customerPage: async ({ browser }, use) => {
        ciStep('fixtures', 'Loading customer fixture');

        // Skip gracefully if credentials not configured
        const customerEmail = process.env.CUSTOMER_EMAIL;
        if (!customerEmail) {
            ciStep('fixtures', 'Customer fixture skipped: CUSTOMER_EMAIL missing');
            const ctx = await browser.newContext();
            const pg  = await ctx.newPage();
            await use(new CustomerPage(pg, ctx));
            await ctx.close();
            return;
        }

        // Skip gracefully if auth file not yet created
        const authFile = path.join(process.cwd(), 'playwright/.auth/customer.json');
        if (!fs.existsSync(authFile)) {
            ciStep('fixtures', 'Customer fixture skipped: customer.json missing (run setup -> adminSeedSetup -> setupAuth)');
            const ctx = await browser.newContext();
            const pg  = await ctx.newPage();
            await use(new CustomerPage(pg, ctx));
            await ctx.close();
            return;
        }

        const context = await browser.newContext({ storageState: authFile });
        const page    = await context.newPage();

        // Navigate to storefront to confirm session is active (avoid networkidle — burns test timeout on SPAs)
        await page.goto(Urls.customerUrl, { waitUntil: 'domcontentloaded' });

        ciStep('fixtures', 'Customer fixture ready');
        await use(new CustomerPage(page, context));

        ciStep('fixtures', 'Closing customer context');
        await context.close();
    },

    // ── FlyCommerce App Fixture (formerly dokanCloudPage) ─────────────────────
    flycommercePage: async ({ browser }, use) => {
        ciStep('fixtures', 'Loading FlyCommerce fixture');

        // Skip gracefully if credentials not configured
        if (!Urls.flycommerceEmail || !Urls.flycommercePassword) {
            ciStep('fixtures', 'FlyCommerce fixture skipped: credentials missing');
            const ctx = await browser.newContext();
            const pg  = await ctx.newPage();
            await use(new FlycommercePage(pg));
            await ctx.close();
            return;
        }

        // Fail clearly if auth file is missing (must run setup first)
        const authFile = path.join(process.cwd(), 'playwright/.auth/flycommerce.json');
        if (!fs.existsSync(authFile)) {
            throw new Error(
                'FlyCommerce auth file not found: playwright/.auth/flycommerce.json\n' +
                'Run: npx playwright test --project=setupFlycommerceAuth\n' +
                'Make sure DOKAN_CLOUD_EMAIL and DOKAN_CLOUD_PASSWORD are set in .env'
            );
        }

        const context = await browser.newContext({ storageState: authFile });
        const page    = await context.newPage();

        const flycommerceUrl = Urls.flycommerceUrl || 'https://app.flycommerce.com';
        await page.goto(flycommerceUrl + '/cloud/stores');
        await page.waitForLoadState('networkidle');
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(2000);

        ciStep('fixtures', 'FlyCommerce fixture ready');
        await use(new FlycommercePage(page));

        ciStep('fixtures', 'Closing FlyCommerce context');
        await context.close();
    },
});

/**
 * ================================================================================================
 * Re-export everything from @playwright/test
 * ================================================================================================
 */
export * from '@playwright/test';
