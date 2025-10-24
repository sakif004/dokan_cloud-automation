import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { AuthenticationPage } from '../../pages/admin/adminAuthPage';
import { BrandManagementPage } from '../../pages/admin/productBrandPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let brandPage: BrandManagementPage;

test.beforeAll(async () => {
    // ✅ Clear any previous session before starting
    if (fs.existsSync('adminStorageState.json')) {
        fs.writeFileSync('adminStorageState.json', '{}');
    }

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Login once using AuthenticationPage
    const authPage = new AuthenticationPage(page);
    await authPage.adminLogin();

    // ✅ Save session (cookies, tokens) for reuse
    await context.storageState({ path: 'adminStorageState.json' });
    console.log('✅ Admin session saved successfully');
});

test.describe('Admin - Brand Management', () => {
    test('Create Brand', async () => {
        const brandData = {
            name: 'Test Brand',
            description: 'Test Brand Description',
            imageUrl: 'https://www.thethrive.in/wp-content/uploads/2022/03/All-You-Need-To-Know-About-Brand-Image.jpg'
        };

        // Initialize BrandManagementPage
        brandPage = new BrandManagementPage(page);

        // Create brand
        await brandPage.createBrand(brandData);

        // Verify brand was created successfully
        await brandPage.verifyBrandCreatedSuccessfully();
    });
});

// Clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync('adminStorageState.json', '{}');
    await browser.close();
    console.log('✅ Browser closed and session cleared');
});