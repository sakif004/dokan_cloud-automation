// pages/customer/customerAuthPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';

export class CustomerAuthPage {
    readonly page: Page;

    // Login form
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly privacyPolicyButton: Locator;

    // Post-login verification
    private readonly accountHeading: Locator;

    // Logout
    private readonly logoutLink: Locator;

    // Post-logout verification
    private readonly loginFormHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login form — matches locators from auth.setup.ts (custom React login)
        this.emailInput   = page.locator('#reg-email');
        this.passwordInput = page.locator('#login-password');
        this.signInButton = page.locator("//button[normalize-space(text())='Sign in']");
        this.privacyPolicyButton = page.locator("(//button[@type='button'][text()='Accept'])[1]");

        // Customer account dashboard
        this.accountHeading = page.getByRole('heading', { name: /my account|account/i }).first();

        // Logout
        this.logoutLink = page.getByRole('link', { name: /log out|logout|sign out/i }).first();

        // After logout — login form is visible again
        this.loginFormHeading = page.locator('#reg-email');
    }

    async navigateToLogin() {
        await this.page.goto(`${Urls.customerUrl}/login`);
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async login(email: string, password: string) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        // Accept Privacy Policy if visible
        const privacyVisible = await this.privacyPolicyButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (privacyVisible) await this.privacyPolicyButton.click();

        await this.signInButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async logout() {
        await this.logoutLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    async verifyLoggedIn() {
        // After login, URL redirects to /customers/account
        await expect(this.page).toHaveURL(/\/customers\/account/, { timeout: 15000 });
    }

    async verifyLoggedOut() {
        // After logout, login form (#reg-email) is visible again
        await expect(this.loginFormHeading).toBeVisible({ timeout: 10000 });
    }
}
