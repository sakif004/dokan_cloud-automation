import { test } from '../fixtures/auth.fixtures';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';

test.describe('Admin - Category Management', () => {
    test('Create Category', async ({ adminPage }) => {
        const categoryData = {
            name: 'Test Category',
            description: 'Test Category Description'
        };

        // ✅ adminPage.page = authenticated page (already logged in as admin)
        // Initialize CategoryManagementPage
        const categoryPage = new CategoryManagementPage(adminPage.page);

        // Create category
        await categoryPage.createCategory(categoryData);

        // Verify category was created successfully via notification
        await categoryPage.verifyCategoryCreatedSuccessfully();
    });
});