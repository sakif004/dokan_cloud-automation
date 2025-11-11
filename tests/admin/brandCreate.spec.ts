import { test } from '../fixtures/auth.fixtures';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';

test.describe('Admin - Brand Management', () => {
    test('Create Brand', async ({ adminPage }) => {
        const brandData = {
            name: 'Test Brand',
            description: 'Test Brand Description',
            imageUrl: 'https://www.thethrive.in/wp-content/uploads/2022/03/All-You-Need-To-Know-About-Brand-Image.jpg'
        };

        // Initialize BrandManagementPage
        const brandPage = new BrandManagementPage(adminPage.page);

        // Create brand
        await brandPage.createBrand(brandData);

        // Verify brand was created successfully
        await brandPage.verifyBrandCreatedSuccessfully();
    });
});
