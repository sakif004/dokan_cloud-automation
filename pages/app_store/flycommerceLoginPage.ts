// dokanCloudLoginPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class DokanCloudLoginPage {
    readonly page: Page;

    // Login Form Locators
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;

    // Post-Login Locators
    readonly myStoresHeading: Locator;
    readonly createNewStoreButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Login Form
        this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign In', exact: true });

        // Post-Login
        this.myStoresHeading = page.getByRole('heading', { name: 'My Stores' });
        this.createNewStoreButton = page.getByRole('button', { name: 'Create New Store' });
    }

    /**
     * Navigate to Dokan Cloud login page
     */
    async goto() {
        await this.page.goto('https://app.dokan.co/login');
    }

    /**
     * Fill email address
     */
    async fillEmail(email: string) {
        await this.emailInput.click();
        await this.emailInput.fill(email);
    }

    /**
     * Fill password
     */
    async fillPassword(password: string) {
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
    }

    /**
     * Click Sign In button
     */
    async clickSignIn() {
        await this.signInButton.click();
    }

    /**
     * Login with credentials
     */
    async login(email: string, password: string) {
        await this.goto();
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.clickSignIn();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify successful login by checking My Stores heading
     */
    async verifyLoggedIn() {
        await expect(this.myStoresHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click Create New Store button
     */
    async clickCreateNewStore() {
        await this.createNewStoreButton.click();
    }
}

