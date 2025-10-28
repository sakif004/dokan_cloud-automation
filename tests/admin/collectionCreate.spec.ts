import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { adminAuthenticationPage } from '../../pages/admin/adminAuthPage';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';
import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let collectionPage: CollectionManagementPage;

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

test.describe('Admin - Collection Management', () => {
    test('Create Collection', async () => {
        const collectionData = {
            name: 'Test Collection',
            description: 'Test Collection Description',
            imageUrl: 'https://img.freepik.com/free-vector/new-collection-lettering-with-gradient-leaves-creative-inscription-leaves-center_1262-13804.jpg'
        };

        // Initialize CollectionManagementPage
        collectionPage = new CollectionManagementPage(page);

        // Create collection
        await collectionPage.createCollection(collectionData);

        // Verify collection was created successfully
        await collectionPage.verifyCollectionCreatedSuccessfully();
    });
});

// Clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    await browser.close();
    console.log('✅ Browser closed and session cleared');
});



// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//     // Admin Login
//     await page.goto('https://birdseye.staging.dokandev.com/admin/login');
//     await page.getByRole('textbox', { name: 'Email Address' }).click();
//     await page.getByRole('textbox', { name: 'Email Address' }).fill('sakifur@wedevs.com');
//     await page.getByRole('textbox', { name: 'Password' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).fill('sakifur@wedevs.com');
//     await page.getByRole('button', { name: 'Sign In', exact: true }).click();

//     // go to collection manu
//     await page.waitForLoadState('domcontentloaded');

//     await page.locator('a').filter({ hasText: /^Products$/ }).click();
//     await page.getByRole('link', { name: 'Collections' }).click();

//     // create new collection
//     await page.getByRole('link', { name: 'Create Collection' }).click();
//     await expect(page.getByRole('heading', { name: 'New Collection' })).toBeVisible();
//     await page.getByRole('textbox', { name: 'Name' }).click();
//     await page.getByRole('textbox', { name: 'Name' }).fill('Test Collection');
//     await page.getByRole('textbox', { name: 'Description' }).click();
//     await page.getByRole('textbox', { name: 'Description' }).fill('Test Collection Description');


//     await page.getByRole('button', { name: 'Upload Image' }).click();
//     await expect(page.getByRole('heading', { name: 'Insert Media' })).toBeVisible();
//     await page.getByRole('button', { name: 'Upload Files' }).click();
//     await page.getByRole('button', { name: 'Add from URL' }).click();
//     await page.getByRole('textbox', { name: 'https://' }).fill('https://img.freepik.com/free-vector/new-collection-lettering-with-gradient-leaves-creative-inscription-leaves-center_1262-13804.jpg');
//     await page.getByRole('button', { name: 'Add media' }).click();
//     await page.waitForLoadState('networkidle');
//     await page.waitForLoadState('domcontentloaded');
//     await page.waitForTimeout(1000);
//     await page.getByRole('button', { name: 'Select' }).click();

//     await page.getByRole('button', { name: 'Create Collection' }).click();
//     //wait for notification
//     await page.waitForLoadState('networkidle');
//     await expect(page.getByText('Created Successfully')).toBeVisible();
// });
