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



/*
//updated the delete operations with conditional execution

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
        
        // Check if product exists before attempting to delete
        const productExists = await productPage.checkProductExists(productName).catch(() => false);
        
        if (!productExists) {
            test.skip();
            console.log(`Product "${productName}" not found, skipping delete test.`);
        }
        
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
        
        // Check if category exists before attempting to delete
        const categoryExists = await categoryPage.checkCategoryExists(categoryName).catch(() => false);
        
        if (!categoryExists) {
            test.skip();
            console.log(`Category "${categoryName}" not found, skipping delete test.`);
        }
        
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
        
        // Check if brand exists before attempting to delete
        const brandExists = await brandPage.checkBrandExists(brandName).catch(() => false);
        
        if (!brandExists) {
            test.skip();
            console.log(`Brand "${brandName}" not found, skipping delete test.`);
        }
        
        // Execute delete flow
        await brandPage.deleteBrandByName(brandName);
    });

    test('Delete collection by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const collectionPage = new CollectionManagementPage(adminPage.page);
        
        // Target collection to delete
        const collectionName = 'Test Collection';
        
        // Check if collection exists before attempting to delete
        const collectionExists = await collectionPage.checkCollectionExists(collectionName).catch(() => false);
        
        if (!collectionExists) {
            test.skip();
            console.log(`Collection "${collectionName}" not found, skipping delete test.`);
        }
        
        // Execute delete flow
        await collectionPage.deleteCollectionByName(collectionName);
    });
});


// In productManagementPage.ts
async checkProductExists(productName: string): Promise<boolean> {
    await this.navigateToAllProducts();
    await this.searchProductByName(productName);
    
    // Check if search results exist
    const firstResult = this.page.locator('[data-testid="product-row"]').first();
    return await firstResult.isVisible({ timeout: 5000 }).catch(() => false);
}

// In productCategoryPage.ts
async checkCategoryExists(categoryName: string): Promise<boolean> {
    await this.navigateToCategories();
    await this.searchCategoryByName(categoryName);
    
    const firstResult = this.page.locator('[data-testid="category-row"]').first();
    return await firstResult.isVisible({ timeout: 5000 }).catch(() => false);
}

// Similar for brandPage and collectionPage...
*/