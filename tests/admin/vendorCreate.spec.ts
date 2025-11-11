import { test } from '../fixtures/auth.fixtures';
import { VendorManagementPage } from '../../pages/admin/vendorsPage';

test.describe('Admin - Vendor Management', () => {

    test('Create Vendor User', async ({ adminPage }) => {
        const vendorData = {
            firstName: 'Vendor',
            lastName: 'five',
            storeName: 'ven_five',
            country: 'United States',
            address: 'abc',
            email: 'vendor_five@wedevs.com',
            phone: '01630741571',
            password: 'vendor_five@wedevs.com',
            subscriptionPlan: 'Free Plan'
        };

        // Initialize VendorManagementPage
        const vendorPage = new VendorManagementPage(adminPage.page);
        // Create vendor
        await vendorPage.createVendor(vendorData);

        // Verify vendor was created successfully via notification
        await vendorPage.verifyVendorCreatedSuccessfully();
    });

});