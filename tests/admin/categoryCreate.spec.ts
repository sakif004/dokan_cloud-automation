import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { adminAuthenticationPage } from '../../pages/admin/adminAuthPage';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let categoryPage: CategoryManagementPage;

const STORAGE_STATE_PATH = 'tests/fixtures/adminStorageState.json';

test.beforeAll(async () => {
    // ✅ Clear any previous session before starting
    if (fs.existsSync(STORAGE_STATE_PATH)) {
        fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    }

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Login once using adminAuthenticationPage
    const authPage = new adminAuthenticationPage(page);
    await authPage.adminLogin();

    // ✅ Save session (cookies, tokens) for reuse
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log('✅ Admin session saved successfully');
});

test.describe('Admin - Category Management', () => {
    test('Create Category', async () => {
        const categoryData = {
            name: 'Test Category',
            description: 'Test Category Description'
        };

        // Initialize CategoryManagementPage
        categoryPage = new CategoryManagementPage(page);

        // Create category
        await categoryPage.createCategory(categoryData);

        // Verify category was created successfully via notification
        await categoryPage.verifyCategoryCreatedSuccessfully();
    });
});

// Clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    await browser.close();
    console.log('✅ Browser closed and session cleared');
});