import { test } from '../fixtures/auth.fixtures';
import { VendorManagementPage } from '../../pages/admin/vendorsPage';

test.describe('Admin - Vendor Management', () => {

    test('Create Vendor User', async ({ adminPage }) => {
        const vendorData = {
            firstName: 'Test',
            lastName: 'Vendor',
            storeName: 'Test_Vendor',
            country: 'United States',
            address: '1600 Amphitheatre Parkway',
            state: 'California',
            city: 'Mountain View',
            zipCode: '94043',
            email: 'sakifur.rahman.swe@gmail.com',
            phone: '01630741571',
            password: 'sakifur.rahman.swe@gmail.com',
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