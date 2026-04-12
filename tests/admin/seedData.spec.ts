/**
 * seedData.spec.ts
 *
 * Creates fixed, stable entities that product creation tests depend on.
 * These entities are NEVER deleted by any test — they are permanent fixtures.
 *
 * Run order: This spec runs FIRST in adminPreSetup (see playwright.config.ts).
 *
 * Fixed entities created:
 *   - Brand      → SeedData.brand.name      ("Automation Brand")
 *   - Category   → SeedData.category.name   ("Automation Category")
 *   - Collection → SeedData.collection.name ("Automation Collection")
 *   - Attribute  → SeedData.attribute.name  ("Automation Size" — S, M, L, XL)
 */

import { test } from '../fixtures/auth.fixtures';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';
import { AttributeManagementPage } from '../../pages/admin/productAttributePage';
import { SeedData } from '../../utils/testData';

test.describe.serial('Admin - Seed Data Setup', () => {

    // ─── Brand ────────────────────────────────────────────────────────────────
    test('Create seed Brand', async ({ adminPage }) => {
        // Initialize page object
        const brandPage = new BrandManagementPage(adminPage.page);

        // Create fixed brand used by all product creation tests
        await brandPage.createBrand(SeedData.brand);

        // Verify success
        await brandPage.verifyBrandCreatedSuccessfully();
    });

    // ─── Category ─────────────────────────────────────────────────────────────
    test('Create seed Category', async ({ adminPage }) => {
        // Initialize page object
        const categoryPage = new CategoryManagementPage(adminPage.page);

        // Create fixed category used by all product creation tests
        await categoryPage.createCategory(SeedData.category);

        // Verify success
        await categoryPage.verifyCategoryCreatedSuccessfully();
    });

    // ─── Collection ───────────────────────────────────────────────────────────
    test('Create seed Collection', async ({ adminPage }) => {
        // Initialize page object
        const collectionPage = new CollectionManagementPage(adminPage.page);

        // Create fixed collection used by all product creation tests
        await collectionPage.createCollection(SeedData.collection);

        // Verify success
        await collectionPage.verifyCollectionCreatedSuccessfully();
    });

    // ─── Attribute ────────────────────────────────────────────────────────────
    test('Create seed Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Create fixed attribute — Multiselect with sizes S, M, L, XL
        await attributePage.createAttribute(SeedData.attribute);
    });

});
