import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class AuthenticationPage {
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

    async adminLogin() {
        // Use URL from testData (already includes the base URL)
        await this.page.goto(Urls.adminUrl + '/admin/login');

        // Use values from environment variables (better than hard-coded)
        const adminEmail = Urls.adminEmail;
        const adminPassword = Urls.adminPassword;

        await this.emailInput.fill(adminEmail);
        await this.passwordInput.fill(adminPassword);
        await this.signInButton.click();

        // Wait for dashboard heading (or any reliable element)
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    }
}
