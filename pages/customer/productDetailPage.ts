// pages/customer/productDetailPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class ProductDetailPage {
    readonly page: Page;

    // Product info — confirmed from codegen
    /** Primary product name — scoped (page also has h3 "Related Products") */
    readonly productTitle: Locator;
    readonly quantityDecrease: Locator; // "−" button
    readonly quantityInput: Locator;    // spinbutton
    readonly quantityIncrease: Locator; // "+" button
    readonly addToCartButton: Locator;

    /** Add-to-cart success modal (Headless UI dialog) */
    readonly addedToCartHeading: Locator;
    readonly goToCartModalButton: Locator;
    readonly continueShoppingModalButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // PDP has multiple level-3 headings (product title + "Related Products"); use product-title h3
        this.productTitle = page.locator('h3.product-title');
        this.quantityDecrease = page.getByRole('button', { name: '−' });
        this.quantityInput = page.getByRole('spinbutton');             // quantity field
        this.quantityIncrease = page.getByRole('button', { name: '+' });
        this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });

        // Add-to-cart modal (codegen: heading "Successfully added to your…", buttons Continue Shopping / Go to Cart)
        this.addedToCartHeading = page.getByRole('heading', { name: /Successfully added to your/i });
        this.goToCartModalButton = page
            .getByRole('dialog')
            .getByRole('button', { name: 'Go to Cart' })
            .or(page.locator('[id^="headlessui-dialog"]').getByRole('button', { name: 'Go to Cart' }));
        this.continueShoppingModalButton = page
            .getByRole('dialog')
            .getByRole('button', { name: 'Continue Shopping' })
            .or(page.locator('[id^="headlessui-dialog"]').getByRole('button', { name: 'Continue Shopping' }));
    }

    /**
     * Set quantity using the +/− buttons or by filling the spinbutton directly
     */
    async setQuantity(qty: number) {
        await this.quantityInput.fill(String(qty));
    }

    /**
     * Click Add to Cart
     */
    async addToCart() {
        await this.addToCartButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify the post–add-to-cart success modal is visible
     */
    async verifyAddedToCart() {
        await expect(this.addedToCartHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Close the success modal by going to the cart page (same as codegen "Go to Cart")
     */
    async goToCartFromModal() {
        await this.goToCartModalButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verify the product title on the detail page
     */
    async verifyProductTitle(name: string) {
        await expect(this.productTitle).toContainText(name, { timeout: 10000 });
    }
}
