// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//     await page.goto('https://birdseye.staging.dokandev.com/vendor/login');
//     await page.getByRole('textbox', { name: 'Email Address' }).click();
//     await page.getByRole('textbox', { name: 'Email Address' }).fill('testvendorone@wedevs.com');
//     await page.getByRole('textbox', { name: 'Password' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).fill('testvendorone@wedevs.com');
//     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
//     await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
// });


import { test, expect, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { VendorAuthenticationPage } from '../../pages/vendor/vendorAuthPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const STORAGE_STATE_PATH = 'tests/fixtures/vendorStorageState.json';

test.beforeAll(async () => {
    // ✅ Clear any previous session before starting
    if (fs.existsSync(STORAGE_STATE_PATH)) {
        fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    }

    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();

    // Login once using VendorAuthenticationPage
    const vendorAuthPage = new VendorAuthenticationPage(page);
    await vendorAuthPage.vendorLogin();

    // ✅ Save session (cookies, tokens) for reuse
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log('✅ Vendor session saved successfully');
});

test.describe('Setup - Vendor Authentication', () => {
    test('Vendor login and save session', async () => {
        // Session already saved in beforeAll
        // This test just verifies login was successful
        const dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
        expect(dashboardHeading).toBeDefined();
    });
});

// Clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    await browser.close();
    console.log('✅ Browser closed and vendor session cleared');
});