// pages/customer/checkoutPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class CheckoutPage {
    readonly page: Page;

    // Billing / contact fields (WooCommerce standard field names)
    private readonly firstNameInput: Locator;
    private readonly lastNameInput: Locator;
    private readonly addressInput: Locator;
    private readonly cityInput: Locator;
    private readonly phoneInput: Locator;
    private readonly emailInput: Locator;

    // Payment method
    private readonly cashOnDeliveryRadio: Locator;

    // Place Order
    private readonly placeOrderButton: Locator;

    // Order confirmation
    private readonly orderConfirmationHeading: Locator;
    private readonly orderNumber: Locator;

    constructor(page: Page) {
        this.page = page;

        // Billing fields — WooCommerce uses id="billing_*" or getByLabel
        this.firstNameInput = page.locator('#billing_first_name, [name="billing_first_name"]')
            .or(page.getByLabel(/first name/i)).first();
        this.lastNameInput  = page.locator('#billing_last_name,  [name="billing_last_name"]')
            .or(page.getByLabel(/last name/i)).first();
        this.addressInput   = page.locator('#billing_address_1,  [name="billing_address_1"]')
            .or(page.getByLabel(/street address/i)).first();
        this.cityInput      = page.locator('#billing_city,       [name="billing_city"]')
            .or(page.getByLabel(/town|city/i)).first();
        this.phoneInput     = page.locator('#billing_phone,      [name="billing_phone"]')
            .or(page.getByLabel(/phone/i)).first();
        this.emailInput     = page.locator('#billing_email,      [name="billing_email"]')
            .or(page.getByLabel(/email/i)).first();

        // Cash on Delivery — configured in setupGuide
        this.cashOnDeliveryRadio = page.locator('input[value="cod"]')
            .or(page.getByLabel(/cash on delivery|cod/i)).first();

        // Place Order button
        this.placeOrderButton = page.getByRole('button', { name: /place order/i }).first();

        // Confirmation page
        this.orderConfirmationHeading = page.getByRole('heading', { name: /order received|thank you|order confirmed/i }).first();
        // WooCommerce standard order number wrapper
        this.orderNumber = page.locator('.woocommerce-order-overview__order strong, [class*="order-number"]').first();
    }

    async navigateToCheckout() {
        await this.page.goto(`${Urls.customerUrl}/checkout`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillContactInfo(data: { email: string; phone: string }) {
        await this.emailInput.fill(data.email);
        await this.phoneInput.fill(data.phone);
    }

    async fillShippingAddress(data: {
        firstName: string;
        lastName:  string;
        address:   string;
        city:      string;
    }) {
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.addressInput.fill(data.address);
        await this.cityInput.fill(data.city);
    }

    async selectPaymentMethod(method: 'cod' | string = 'cod') {
        if (method === 'cod') {
            // Cash on Delivery
            const visible = await this.cashOnDeliveryRadio.isVisible({ timeout: 5000 }).catch(() => false);
            if (visible) await this.cashOnDeliveryRadio.click();
        } else {
            // Generic: click the radio/label matching the method name
            await this.page.getByLabel(new RegExp(method, 'i')).first().click();
        }
    }

    async placeOrder() {
        await this.placeOrderButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyOrderConfirmation() {
        await expect(this.orderConfirmationHeading).toBeVisible({ timeout: 30000 });
    }

    async getOrderId(): Promise<string> {
        await expect(this.orderNumber).toBeVisible({ timeout: 15000 });
        return (await this.orderNumber.textContent()) ?? '';
    }
}
