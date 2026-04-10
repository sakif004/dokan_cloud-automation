import { test } from '../fixtures/auth.fixtures';
import { VendorManagementPage } from '../../pages/admin/vendorsPage';
import { generateVendorData } from '../../utils/fakerData';

test.describe('Admin - Vendor Management', () => {

    test('Create Vendor User', async ({ adminPage }) => {
        test.setTimeout(60000);
        // storeName and email are unique per run to avoid marketplace conflicts
        const { firstName, lastName, storeName, email, phone, password } = generateVendorData();

        const vendorData = {
            firstName,
            lastName,
            storeName,
            country: 'Bangladesh',
            address: 'wedevs academy',
            division: 'Dhaka',  // fallback if Google Places autocomplete is slow
            city: 'Dhaka',
            email,
            phone,
            password,
            subscriptionPlan: 'Free Plan',
        };

        // Initialize VendorManagementPage
        const vendorPage = new VendorManagementPage(adminPage.page);

        // Create vendor
        await vendorPage.createVendor(vendorData);

        // Verify vendor was created successfully via notification
        await vendorPage.verifyVendorCreatedSuccessfully();
    });

});
