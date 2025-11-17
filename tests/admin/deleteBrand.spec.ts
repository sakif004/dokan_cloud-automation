import { test } from '../fixtures/auth.fixtures';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';

test.describe('Admin - Brand Management', () => {
    test('Delete brand by name', async ({ adminPage }) => {
        const brandPage = new BrandManagementPage(adminPage.page);
        const brandName = 'Test Brand';

        await brandPage.deleteBrandByName(brandName);
    });
});