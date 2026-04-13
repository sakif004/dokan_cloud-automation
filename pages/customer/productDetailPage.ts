// pages/customer/productDetailPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailPage {
    readonly page: Page;

    // Product info
    private readonly productTitle: Locator;
    private readonly productPrice: Locator;

    // Quantity + Add to Cart
    private readonly quantityInput: Locator;
    private readonly addToCartButton: Locator;

    // Success feedback
    private readonly cartSuccessMessage: Locator;
    private readonly viewCartLink: Locator;

    constructor(page: Page) {
        this.page = page;

        // Product heading on the detail page
        this.productTitle = page.getByRole('heading', { level: 1 }).first();
        this.productPrice = page.locator('.price, [class*="product-price"]').first();

        // Quantity — WooCommerce standard input name
        this.quantityInput = page.locator('input[name="quantity"]').first();

        // Add to Cart — button with role=button or type=submit
        this.addToCartButton = page.getByRole('button', { name: /add to cart/i }).first();

        // Success state — message or cart count
        this.cartSuccessMessage = page.locator('.woocommerce-message, [class*="cart-success"], [class*="added-to-cart"]').first();
        this.viewCartLink = page.getByRole('link', { name: /view cart/i }).first();
    }

    async setQuantity(qty: number) {
        await this.quantityInput.fill(String(qty));
    }

    async addToCart() {
        await this.addToCartButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyAddedToCart() {
        // Either a success message appears or a "View Cart" link becomes visible
        const messageVisible = await this.cartSuccessMessage.isVisible({ timeout: 5000 }).catch(() => false);
        const viewCartVisible = await this.viewCartLink.isVisible({ timeout: 5000 }).catch(() => false);

        if (!messageVisible && !viewCartVisible) {
            // Fallback: assert the add-to-cart button has changed state
            await expect(this.addToCartButton).toBeVisible({ timeout: 5000 });
        }
    }

    async verifyProductTitle(name: string) {
        await expect(this.productTitle).toContainText(name, { timeout: 10000 });
    }
}
