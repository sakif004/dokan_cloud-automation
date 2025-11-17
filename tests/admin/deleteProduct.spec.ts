import { test } from '../fixtures/auth.fixtures';
import { ProductManagementPage } from '../../pages/admin/productManagementPage';

test.describe('Admin - Product Management', () => {
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
});