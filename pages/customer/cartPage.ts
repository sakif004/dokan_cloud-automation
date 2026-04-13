// pages/customer/cartPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class CartPage {
    readonly page: Page;

    // Cart content
    private readonly cartTable: Locator;
    private readonly emptyCartMessage: Locator;

    // Coupon
    private readonly couponInput: Locator;
    private readonly applyCouponButton: Locator;
    private readonly couponDiscountRow: Locator;

    // Checkout
    private readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Cart table (WooCommerce standard)
        this.cartTable        = page.locator('.woocommerce-cart-form, [class*="cart-table"], table').first();
        this.emptyCartMessage = page.getByText(/your cart is empty|no items in cart/i).first();

        // Coupon
        this.couponInput       = page.locator('#coupon_code, input[name="coupon_code"]').first();
        this.applyCouponButton = page.getByRole('button', { name: /apply coupon/i }).first();
        this.couponDiscountRow = page.locator('.cart-discount, [class*="coupon-discount"]').first();

        // Proceed to Checkout
        this.proceedToCheckoutButton = page.getByRole('link', { name: /proceed to checkout/i })
            .or(page.getByRole('button', { name: /proceed to checkout/i }))
            .first();
    }

    async navigateToCart() {
        await this.page.goto(`${Urls.customerUrl}/cart`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyProductInCart(productName: string) {
        await expect(this.cartTable).toContainText(productName, { timeout: 10000 });
    }

    async verifyCartIsEmpty() {
        await expect(this.emptyCartMessage).toBeVisible({ timeout: 10000 });
    }

    async applyCoupon(code: string) {
        await this.couponInput.fill(code);
        await this.applyCouponButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyCouponApplied() {
        await expect(this.couponDiscountRow).toBeVisible({ timeout: 10000 });
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }
}
