// pages/customer/storefrontPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class StorefrontPage {
    readonly page: Page;

    // Shop navigation
    private readonly shopLink: Locator;

    // Search
    private readonly searchInput: Locator;
    private readonly searchButton: Locator;

    // Product listing
    private readonly productCards: Locator;

    constructor(page: Page) {
        this.page = page;

        // Shop link in navigation
        this.shopLink = page.getByRole('link', { name: /^shop$/i }).first();

        // Search input — WooCommerce search or custom search
        this.searchInput = page.getByRole('searchbox').first();
        this.searchButton = page.getByRole('button', { name: /search/i }).first();

        // Product cards in the grid
        this.productCards = page.locator('.products .product, [class*="product-card"], [class*="product-item"]');
    }

    async navigateToShop() {
        await this.page.goto(`${Urls.customerUrl}/shop`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async searchProduct(name: string) {
        await this.searchInput.fill(name);
        // Try submitting with Enter first (most common pattern)
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(500);
    }

    async selectProduct(name: string) {
        // Click the product card/link matching the name
        await this.page.getByRole('link', { name: new RegExp(name, 'i') }).first().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyProductVisible(name: string) {
        await expect(
            this.page.getByText(new RegExp(name, 'i')).first()
        ).toBeVisible({ timeout: 10000 });
    }
}
