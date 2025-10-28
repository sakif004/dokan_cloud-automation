// adminCreateVendor.spec.ts
import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { adminAuthenticationPage } from '../../pages/admin/adminAuthPage';
import { VendorManagementPage } from '../../pages/admin/vendorsPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let vendorPage: VendorManagementPage;

const STORAGE_STATE_PATH = 'tests/fixtures/adminStorageState.json';

test.beforeAll(async () => {
    // ✅ Optional: Clear any previous session before starting
    if (fs.existsSync(STORAGE_STATE_PATH)) {
        fs.writeFileSync(STORAGE_STATE_PATH, '{}'); //clear cookies before starting the test suite
    }

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Login once using your Page Object
    const authPage = new adminAuthenticationPage(page);
    await authPage.adminLogin();

    // ✅ Save session (cookies, tokens) for reuse
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log('✅ Admin session saved successfully');
});


test.describe('Admin - Vendor Management', () => {

    test('Create Vendor User', async () => {
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
        vendorPage = new VendorManagementPage(page);
        // Create vendor
        await vendorPage.createVendor(vendorData);

        // Verify vendor was created successfully via notification
        await vendorPage.verifyVendorCreatedSuccessfully();
    });

});

//clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    await browser.close();
});