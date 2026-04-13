/**
 * seedData.spec.ts  (adminSeedSetup project)
 *
 * Creates fixed, stable entities that all journey tests depend on.
 * These entities are NEVER deleted by any test — they are permanent fixtures.
 *
 * Run order within serial block:
 *   1. Brand        → SeedData.brand
 *   2. Category     → SeedData.category
 *   3. Collection   → SeedData.collection
 *   4. Attribute    → SeedData.attribute
 *   5. Vendor       → SeedData.vendor   (email + password from .env — used by auth.setup.ts)
 *   6. Customer     → SeedData.customer (email + password from .env — used by auth.setup.ts)
 *
 * After this spec completes, run the "setupAuth" project so vendor.json + customer.json
 * can be saved (accounts now exist in the marketplace).
 */

import { test } from '../fixtures/auth.fixtures';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';
import { AttributeManagementPage } from '../../pages/admin/productAttributePage';
import { VendorManagementPage } from '../../pages/admin/vendorsPage';
import { CustomerManagementPage } from '../../pages/admin/customerManagementPage';
import { SeedData } from '../../utils/testData';

test.describe.serial('Admin - Seed Data Setup', () => {

    // ─── Brand ────────────────────────────────────────────────────────────────
    test('Seed: create Brand', async ({ adminPage }) => {
        // Initialize page object
        const brandPage = new BrandManagementPage(adminPage.page);

        // Create fixed brand — used by vendor product creation tests
        await brandPage.createBrand(SeedData.brand);

        // Verify success
        await brandPage.verifyBrandCreatedSuccessfully();
    });

    // ─── Category ─────────────────────────────────────────────────────────────
    test('Seed: create Category', async ({ adminPage }) => {
        // Initialize page object
        const categoryPage = new CategoryManagementPage(adminPage.page);

        // Create fixed category — used by vendor product creation tests
        await categoryPage.createCategory(SeedData.category);

        // Verify success
        await categoryPage.verifyCategoryCreatedSuccessfully();
    });

    // ─── Collection ───────────────────────────────────────────────────────────
    test('Seed: create Collection', async ({ adminPage }) => {
        // Initialize page object
        const collectionPage = new CollectionManagementPage(adminPage.page);

        // Create fixed collection — used by vendor product creation tests
        await collectionPage.createCollection(SeedData.collection);

        // Verify success
        await collectionPage.verifyCollectionCreatedSuccessfully();
    });

    // ─── Attribute ────────────────────────────────────────────────────────────
    test('Seed: create Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Create fixed attribute — Multiselect with sizes S, M, L, XL
        await attributePage.createAttribute(SeedData.attribute);
    });

    // ─── Journey Vendor Account ────────────────────────────────────────────────
    test('Seed: create journey Vendor account', async ({ adminPage }) => {
        // Initialize page object
        const vendorPage = new VendorManagementPage(adminPage.page);

        // Create vendor with credentials from .env (VENDOR_EMAIL + VENDOR_PASSWORD)
        // Password is set explicitly so auth.setup.ts (setupAuth phase) can login with VENDOR_PASSWORD
        await vendorPage.createVendor({
            firstName: SeedData.vendor.firstName,
            lastName: SeedData.vendor.lastName,
            storeName: SeedData.vendor.storeName,
            email: SeedData.vendor.email,
            phone: SeedData.vendor.phone,
            password: SeedData.vendor.password,
            country: SeedData.vendor.country,
            address: SeedData.vendor.address,
            division: SeedData.vendor.division,
            city: SeedData.vendor.city,
            subscriptionPlan: SeedData.vendor.subscriptionPlan,
        });

        // Verify vendor created successfully
        await vendorPage.verifyVendorCreatedSuccessfully();
    });

    // ─── Journey Customer Account ──────────────────────────────────────────────
    test('Seed: create journey Customer account', async ({ adminPage }) => {
        // Initialize page object
        const customerPage = new CustomerManagementPage(adminPage.page);

        // Navigate to customers list
        await customerPage.navigateToCustomers();

        // Create customer with credentials from .env (CUSTOMER_EMAIL + CUSTOMER_PASSWORD)
        // Password is set explicitly so auth.setup.ts (setupAuth phase) can login with CUSTOMER_PASSWORD
        await customerPage.createCustomer({
            firstName: SeedData.customer.firstName,
            lastName: SeedData.customer.lastName,
            email: SeedData.customer.email,
            phone: SeedData.customer.phone,
            password: SeedData.customer.password,
        });

        // Verify customer created successfully
        await customerPage.verifyCustomerCreatedSuccessfully();
    });

});
