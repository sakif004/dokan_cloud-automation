import { test, Browser, Page, expect, BrowserContext, chromium } from '@playwright/test';
import { AuthenticationPage } from '../../pages/admin/adminAuthPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;


test.beforeAll(async () => {
    // ✅ Optional: Clear any previous session before starting
    if (fs.existsSync('adminStorageState.json')) {
        fs.writeFileSync('adminStorageState.json', '{}'); //clear cookies before starting the test suite
    }

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Login once using your Page Object
    const authPage = new AuthenticationPage(page);
    await authPage.adminLogin();

    // ✅ Save session (cookies, tokens) for reuse
    await context.storageState({ path: 'adminStorageState.json' });
});


test.describe('creating - Vendor', () => {
    test('[CU0002] createVendorUser', async ({ page }) => {
        console.log('Creating Vendor User...');
    });

});

test.afterAll(async () => {
    fs.writeFileSync('adminStorageState.json', '{}'); //clear cookies after finishing the test suite
    await browser.close();
});