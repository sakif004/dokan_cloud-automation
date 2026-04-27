// pages/customer/storefrontPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class StorefrontPage {
    readonly page: Page;

    // Navigation
    readonly shopLink: Locator;
    readonly shopHeading: Locator;

    // Search
    readonly searchInput: Locator;

    constructor(page: Page) {
        this.page = page;

        // Shop link in header nav — exact match to avoid matching "Shop by Category" etc.
        this.shopLink = page.getByRole('link', { name: 'Shop', exact: true });
        this.shopHeading = page.getByRole('heading', { name: 'Shop' });

        // Search box on the shop page
        this.searchInput = page.getByRole('searchbox', { name: 'Search...' });
    }

    /**
     * Navigate to storefront home
     */
    async navigateToHome() {
        await this.page.goto(Urls.customerUrl + '/', {
            timeout: 60_000,
            waitUntil: 'domcontentloaded',
        });
    }

    /**
     * Navigate to the Shop page via the header link
     */
    async navigateToShop() {
        await this.navigateToHome();
        await this.shopLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.shopHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Type a product name into the search box — results filter in real time
     */
    async searchProduct(name: string) {
        await this.searchInput.click();
        await this.searchInput.fill(name);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        // Wait for results to appear
        await expect(
            this.page.locator('div').filter({ hasText: new RegExp(`^${name}$`) }).first()
        ).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click on a product from the search results / product listing in the banner
     */
    async selectProduct(name: string) {
        await this.page.getByRole('banner').getByText(name).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verify a product is visible in search results
     */
    async verifyProductVisible(name: string) {
        await expect(
            this.page.locator('div').filter({ hasText: new RegExp(`^${name}$`) }).first()
        ).toBeVisible({ timeout: 10000 });
    }
}
