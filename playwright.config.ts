import { defineConfig, devices } from '@playwright/test';

/**
 * Load .env file
 * https://github.com/motdotla/dotenv
 */
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * ================================================================================================
 * Playwright Configuration — FlyCommerce Automation
 * ================================================================================================
 *
 * SETUP (run once manually on a fresh marketplace, in order):
 *
 *   npx playwright test --project=setup
 *     → Saves admin.json + flycommerce.json
 *
 *   npx playwright test --project=adminSeedSetup --no-deps
 *     → Admin creates seed data + journey vendor + journey customer accounts
 *
 *   npx playwright test --project=setupAuth --no-deps
 *     → Saves vendor.json + customer.json (accounts now exist)
 *
 * After the above 3 steps, all .auth JSON files exist and any project can be run freely:
 *
 *   npx playwright test --project=adminCRUD
 *   npx playwright test --project=vendorJourney
 *   npx playwright test --project=customerJourney
 *   etc.
 *
 * No dependencies are set on test projects — auth JSON files handle session reuse.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests',

    /* Run tests in files in parallel within each project */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code */
    forbidOnly: !!process.env.CI,

    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,

    /* Workers: 1 on CI to avoid resource contention; auto on local */
    workers: process.env.CI ? 1 : undefined,

    /* HTML reporter */
    reporter: 'html',

    /* Shared settings for all projects */
    use: {
        trace: 'on-first-retry',
    },

    projects: [

        // ── Phase 1: Admin + FlyCommerce auth ─────────────────────────────────
        // Vendor/customer auth gracefully skipped — accounts don't exist yet.
        {
            name: 'setup',
            testMatch: '**/auth.setup.ts',
        },

        // ── One-time setup: seed data (run manually, no-deps) ─────────────────
        // Creates permanent fixtures: Brand, Category, Collection, Attribute,
        // journey Vendor account, journey Customer account.
        // Run once: npx playwright test --project=adminSeedSetup --no-deps
        {
            name: 'adminSeedSetup',
            testMatch: '**/admin/seedData.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── One-time setup: vendor + customer auth (run manually, no-deps) ─────
        // Saves vendor.json + customer.json after accounts are created by adminSeedSetup.
        // Run once: npx playwright test --project=setupAuth --no-deps
        {
            name: 'setupAuth',
            testMatch: '**/auth.setupUsers.ts',
        },

        // ── Admin CRUD tests ───────────────────────────────────────────────────
        // Uses admin.json. Run freely after setup.
        {
            name: 'adminCRUD',
            testMatch: [
                '**/admin/adminLogin.spec.ts',
                '**/admin/categoryCreate.spec.ts',
                '**/admin/deleteCategory.spec.ts',
                '**/admin/brandCreate.spec.ts',
                '**/admin/deleteBrand.spec.ts',
                '**/admin/collectionCreate.spec.ts',
                '**/admin/deleteCollection.spec.ts',
                '**/admin/productAttribute.spec.ts',
                '**/admin/vendorCreate.spec.ts',
                '**/admin/customerManagement.spec.ts',
                '**/admin/setupGuide.spec.ts',
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Vendor journey — login + create seed product ───────────────────────
        // Uses vendor.json. Run after setupAuth.
        {
            name: 'vendorJourney',
            testMatch: [
                '**/vendor/vendorLogin.spec.ts',
                '**/vendor/productCreate.spec.ts',
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Customer journey — browse, cart, checkout ──────────────────────────
        // Uses customer.json. Run after vendorJourney (product must exist).
        {
            name: 'customerJourney',
            testMatch: [
                '**/customer/customerLogin.spec.ts',
                '**/customer/browseProducts.spec.ts',
                '**/customer/addToCart.spec.ts',
                '**/customer/checkout.spec.ts',
            ],
            /** Fixture (goto + waits) + storefront steps share the default 30s otherwise */
            timeout: 90_000,
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Admin verify — confirm orders ──────────────────────────────────────
        {
            name: 'adminVerify',
            testMatch: [
                // '**/admin/orderManagement.spec.ts',  ← add when created
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Cleanup — delete products + related items ──────────────────────────
        {
            name: 'cleanup',
            testMatch: [
                '**/admin/deleteProduct.spec.ts',
                '**/e2e/e2eDeleteProductRelatedThings.spec.ts',
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Marketplace onboarding (standalone — run before any other project) ─
        // Creates a new marketplace on app.flycommerce.com.
        // Run once: npx playwright test --project=marketplaceSetup
        {
            name: 'marketplaceSetup',
            testMatch: '**/app_store/marketplaceOnboarding.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

    ],
});
