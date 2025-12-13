import { test } from '../fixtures/auth.fixtures';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';
import { ProductManagementPage } from '../../pages/admin/productManagementPage';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';


test.describe.serial('Admin - Category Management', () => {
    test('Delete product by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const productPage = new ProductManagementPage(adminPage.page);
        // Target product to delete
        const productName = 'Test Product';
        // Execute delete flow
        await productPage.deleteProduct(productName);
        // Assert success message
        await productPage.verifyProductDeleted();
    });

    test('Delete Category by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const categoryPage = new CategoryManagementPage(adminPage.page);
        // Target category to delete
        const categoryName = 'Test Category';
        // Execute delete flow
        await categoryPage.deleteCategoryByName(categoryName);
        // Assert success message
        await categoryPage.verifyCategoryDeleted();
    });

    test('Delete brand by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const brandPage = new BrandManagementPage(adminPage.page);
        // Target brand to delete
        const brandName = 'Test Brand';
        // Execute delete flow

        await brandPage.deleteBrandByName(brandName);
    });

    test('Delete collection by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const collectionPage = new CollectionManagementPage(adminPage.page);
        // Target collection to delete
        const collectionName = 'Test Collection';
        // Execute delete flow

        await collectionPage.deleteCollectionByName(collectionName);
    });
});
