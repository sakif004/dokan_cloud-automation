import { test } from '../fixtures/auth.fixtures';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';

test.describe('Admin - Category Management', () => {
    test('Delete Category', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const categoryPage = new CategoryManagementPage(adminPage.page);
        // Target category to delete
        const categoryName = 'Test Category';
        // Execute delete flow
        await categoryPage.deleteCategoryByName(categoryName);
        // Assert success message
        await categoryPage.verifyCategoryDeleted();
    });
});