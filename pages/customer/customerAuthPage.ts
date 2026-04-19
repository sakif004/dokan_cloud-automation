// pages/customer/customerAuthPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class CustomerAuthPage {
    readonly page: Page;

    // Login form — confirmed from codegen
    readonly loginLink: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    // Post-login verification
    readonly loginSuccessMessage: Locator;
    readonly accountButton: Locator;       // "Hello Journey" button — opens account dropdown

    // Logout — inside account dropdown
    readonly signOutLink: Locator;

    // Post-logout verification
    readonly pleaseLoginText: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login page — accessed via Login link on homepage
        this.loginLink    = page.getByRole('link', { name: 'Login' });
        this.emailInput   = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign in', exact: true });

        // After login
        this.loginSuccessMessage = page.getByText('Login Successful');
        this.accountButton       = page.getByRole('button', { name: /Hello/i }); // "Hello Journey"

        // Logout dropdown
        this.signOutLink = page.getByRole('link', { name: 'Sign out' });

        // After logout
        this.pleaseLoginText = page.getByText('Please Login');
    }

    /**
     * Navigate to the storefront and click the Login link
     */
    async navigateToLogin() {
        await this.page.goto(Urls.customerUrl + '/', { timeout: 30000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.loginLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Login with email and password
     */
    async login(email: string, password: string) {
        await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.signInButton.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Logout via the account dropdown
     */
    async logout() {
        await this.accountButton.click();
        await this.signOutLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verify customer is logged in — toast + account button visible
     */
    async verifyLoggedIn() {
        await expect(this.loginSuccessMessage).toBeVisible({ timeout: 10000 });
        await expect(this.accountButton).toBeVisible({ timeout: 10000 });
    }

    /**
     * Verify customer is logged out — "Please Login" text visible
     */
    async verifyLoggedOut() {
        await expect(this.pleaseLoginText).toBeVisible({ timeout: 10000 });
    }
}
