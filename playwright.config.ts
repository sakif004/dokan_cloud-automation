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
 * FINAL JOURNEY (manual phase order):
 *
 *   Phase 1A: npx playwright test --project=setupFlycommerceAuth
 *     → Saves flycommerce.json (SuperAdmin/AppAdmin on app.flycommerce.com)
 *
 *   Phase 1B: npx playwright test --project=marketplaceSetup
 *     → Creates marketplace from FlyCommerce app
 *
 *   Phase 1C: npx playwright test --project=setupMarketplaceAdminAuth
 *     → Saves admin.json for the newly created marketplace admin
 *
 *   Phase 1D: npx playwright test --project=marketplaceAdminSetupGuide
 *     → Completes setup guide as marketplace admin
 *
 *   Phase 2: npx playwright test --project=adminSeedSetup --no-deps
 *     → Creates Brand, Category, Collection, Attribute, journey Vendor + Customer
 *
 *   Phase 3: npx playwright test --project=setupAuth --no-deps
 *     → Saves vendor.json + customer.json
 *
 *   Phase 4: npx playwright test --project=vendorJourney
 *     → Vendor creates seed product
 *
 *   Phase 5: npx playwright test --project=customerJourney
 *     → Customer completes checkout (COD)
 *
 * No dependencies are set on projects — run phases explicitly in order.
 */
export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',

    use: {
        trace: 'on-first-retry',
    },

    projects: [
        // ── Phase 1A: FlyCommerce App Admin auth ─────────────────────────────
        {
            name: 'setupFlycommerceAuth',
            testMatch: '**/auth.setup.ts',
        },

        // ── Phase 1B: Marketplace onboarding from FlyCommerce app ────────────
        {
            name: 'marketplaceSetup',
            testMatch: '**/app_store/marketplaceOnboarding.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Phase 1C: Marketplace Admin auth (after marketplace exists) ──────
        {
            name: 'setupMarketplaceAdminAuth',
            testMatch: '**/auth.setupAdmin.ts',
        },

        // ── Phase 1D: Marketplace admin setup guide ───────────────────────────
        {
            name: 'marketplaceAdminSetupGuide',
            testMatch: '**/admin/setupGuide.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Phase 2: One-time seed data + journey accounts ────────────────────
        {
            name: 'adminSeedSetup',
            testMatch: '**/admin/seedData.spec.ts',
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Phase 3: Vendor + Customer auth ───────────────────────────────────
        {
            name: 'setupAuth',
            testMatch: '**/auth.setupUsers.ts',
        },

        // ── Phase 4: Vendor product creation ──────────────────────────────────
        {
            name: 'vendorJourney',
            testMatch: [
                '**/vendor/productCreate.spec.ts',
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Phase 5: Customer checkout journey ────────────────────────────────
        {
            name: 'customerJourney',
            testMatch: [
                '**/customer/checkout.spec.ts',
            ],
            timeout: 90_000,
            use: { ...devices['Desktop Chrome'] },
        },

        // ── Optional admin CRUD suites (outside final journey) ────────────────
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
            ],
            use: { ...devices['Desktop Chrome'] },
        },

        {
            name: 'adminVerify',
            testMatch: [
                // '**/admin/orderManagement.spec.ts',
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
    ],
});
