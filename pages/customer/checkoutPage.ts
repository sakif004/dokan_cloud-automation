// pages/customer/checkoutPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

/**
 * FlyCommerce storefront checkout — multi-step wizard (Contact/Shipping → Orders → Payment).
 * Locators match Playwright codegen against amazonbd2.flycom.shop.
 */
export class CheckoutPage {
    readonly page: Page;

    private readonly placeOrderButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    }

    async navigateToCheckout() {
        await this.page.goto(`${Urls.customerUrl}/checkout`);
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Assert logged-in contact block shows the customer email (session from storage state).
     */
    async verifyContactInformationVisible(email: string) {
        await expect(this.page.getByRole('heading', { name: 'Contact information' })).toBeVisible({
            timeout: 15000,
        });
        await expect(this.page.getByText(email)).toBeVisible();
    }

    /**
     * Shipping step: name, country, address (with autocomplete), phone — then Continue to Orders.
     */
    async fillShippingStep(data: {
        firstName: string;
        lastName: string;
        /** e.g. "bangladesh" to filter the country combobox */
        countrySearch: string;
        /** e.g. "Bangladesh" — option label */
        countryOption: string;
        /** First line; autocomplete may need ArrowDown + Enter (Dhaka marketplace). */
        addressLine: string;
        phone: string;
    }) {
        await expect(this.page.getByRole('heading', { name: 'Shipping Address' })).toBeVisible({
            timeout: 15000,
        });

        await this.page.getByRole('textbox', { name: 'First Name *' }).fill(data.firstName);
        await this.page.getByRole('textbox', { name: 'Last Name *' }).fill(data.lastName);

        await this.page.getByText('Country *Select Country').click();
        await this.page.getByRole('combobox', { name: 'Country *' }).fill(data.countrySearch);
        await this.page.getByRole('option', { name: data.countryOption }).click();

        const addressInput = this.page.getByRole('textbox', { name: 'Address *' });
        await addressInput.fill(data.addressLine);
        // Wait for autocomplete suggestions to appear
        await this.page.waitForTimeout(2000);
        await addressInput.press('ArrowDown');
        await this.page.waitForTimeout(1000);
        await addressInput.press('Enter');
        await this.page.waitForTimeout(2000);

        await this.page.getByRole('textbox', { name: 'Phone *' }).fill(data.phone);

        await this.page.getByRole('button', { name: 'Continue to Orders' }).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Orders step: shipping method → Continue to Payment */
    async selectShippingAndContinueToPayment() {
        await expect(this.page.getByRole('heading', { name: 'Orders' })).toBeVisible({ timeout: 15000 });
        await this.page.getByRole('radio', { name: 'Free Estimated Delivery:' }).click();
        await this.page.getByRole('button', { name: 'Continue to Payment' }).click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** Payment: COD → Place Order */
    async selectCashOnDeliveryAndPlaceOrder() {
        await expect(this.page.getByRole('heading', { name: 'Payment' })).toBeVisible({ timeout: 15000 });
        await this.page.getByText('Cash On Delivery').click();

        await expect(this.page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
        await expect(this.placeOrderButton).toBeVisible();

        await this.placeOrderButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async verifyOrderReceived() {
        await expect(this.page.getByText('Your order is received')).toBeVisible({ timeout: 60000 });
    }

    /**
     * Best-effort order reference from confirmation UI (structure may vary).
     */
    async getOrderId(): Promise<string> {
        const main = this.page.getByRole('main');
        const text = await main.textContent().catch(() => '');
        const match = text?.match(/#?\s*(\d{4,})/);
        return match?.[1] ?? '';
    }

    async goToMyOrders() {
        await this.page.getByRole('link', { name: 'My Orders' }).click();
        await expect(this.page.getByRole('heading', { name: 'My Orders' })).toBeVisible({
            timeout: 15000,
        });
    }
}
