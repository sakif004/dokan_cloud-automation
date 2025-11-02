import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { VendorAuthenticationPage } from '../../pages/vendor/vendorAuthPage';
import { VendorProductPage } from '../../pages/vendor/productCreatePage';
import * as fs from 'fs';

const STORAGE_STATE_PATH = 'tests/fixtures/vendorStorageState.json';

let browser: Browser;
let context: BrowserContext;
let page: Page;
let productPage: VendorProductPage;

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
    console.log('✅ Vendor session saved to tests/fixtures/vendorStorageState.json');
});

test.describe('Vendor - Product Management', () => {
    test('Create Product with Brand and Collection', async () => {
        const productData = {
            name: 'Test Product',
            description: 'Test Product Description',
            category: 'Test Category',
            imageUrl: 'https://st4.depositphotos.com/14431644/37827/i/450/depositphotos_378271014-stock-photo-word-writing-text-product-test.jpg',
            regularPrice: '1200',
            salePrice: '1000',
            shipping: 'Free Shipping',
            weight: '1',
            height: '200',
            width: '200',
            length: '200',
            status: 'Published',
            brand: 'Test Brand',
            collection: 'Test Collection'
        };

        // Initialize VendorProductPage
        productPage = new VendorProductPage(page);

        // Create product
        await productPage.createProduct(productData);

        // Verify product was created successfully
        await productPage.verifyProductCreatedSuccessfully();
    });
});

// Clear cookies after finishing the test suite
test.afterAll(async () => {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
    await browser.close();
    console.log('✅ Browser closed and vendor session cleared');
});