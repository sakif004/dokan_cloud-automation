// vendorAuthPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class VendorAuthenticationPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });
    }

    /**
     * Vendor login
     */
    async vendorLogin() {
        // Navigate to vendor login page
        await this.page.goto(Urls.vendorUrl + '/vendor/login');

        // Use values from environment variables or testData
        const vendorEmail = Urls.vendorEmail;
        const vendorPassword = Urls.vendorPassword;

        await this.emailInput.fill(vendorEmail);
        await this.passwordInput.fill(vendorPassword);
        await this.signInButton.click();

        // Wait for dashboard to load
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    }
}