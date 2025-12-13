// marketplaceOnboardingPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class MarketplaceOnboardingPage {
    readonly page: Page;

    // Setup Marketplace Page Locators
    readonly setupMarketplaceHeading: Locator;
    readonly marketplaceNameInput: Locator;
    readonly marketplaceAvailableText: Locator;
    readonly startCreatingMarketplaceButton: Locator;
    readonly closeChatButton: Locator;

    // Onboarding Questions Locators
    readonly dropdownImages: Locator;
    readonly nextButton: Locator;

    // Store Address Page Locators
    readonly storeAddressHeading: Locator;
    readonly countryCombobox: Locator;
    readonly addressInput: Locator;
    readonly divisionText: Locator;
    readonly cityInput: Locator;
    readonly postalCodeInput: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Setup Marketplace
        this.setupMarketplaceHeading = page.getByRole('heading', { name: 'Setup your Marketplace' });
        this.marketplaceNameInput = page.getByRole('textbox', { name: 'Marketplace Name' });
        this.marketplaceAvailableText = page.locator('div').filter({ hasText: /^Marketplace Available$/ });
        this.startCreatingMarketplaceButton = page.getByRole('button', { name: 'Start Creating Marketplace' });
        this.closeChatButton = page.getByRole('button', { name: 'Close chat' });

        // Onboarding Questions
        this.dropdownImages = page.getByRole('img');
        this.nextButton = page.getByRole('button', { name: 'Next' });

        // Store Address
        this.storeAddressHeading = page.getByRole('heading', { name: 'Store Address' });
        this.countryCombobox = page.getByRole('combobox', { name: 'Country' });
        this.addressInput = page.locator('#address');
        this.divisionText = page.getByText('Division Dhaka');
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.postalCodeInput = page.getByRole('textbox', { name: 'Postal Code (Optional)' });
        this.finishButton = page.getByRole('button', { name: 'Finish' });
    }

    /**
     * Verify Setup Marketplace page is visible
     */
    async verifySetupMarketplacePage() {
        await expect(this.setupMarketplaceHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Fill marketplace name
     */
    async fillMarketplaceName(name: string) {
        await expect(this.page.getByText('Marketplace Name')).toBeVisible();
        await this.marketplaceNameInput.click();
        await this.marketplaceNameInput.fill(name);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify marketplace is available
     */
    async verifyMarketplaceAvailable() {
        await expect(this.marketplaceAvailableText).toBeVisible();
    }

    /**
     * Click Start Creating Marketplace button
     */
    async clickStartCreatingMarketplace() {
        await this.startCreatingMarketplaceButton.click();
    }

    /**
     * Close chat if visible
     */
    async closeChat() {
        await this.closeChatButton.click();
    }

    /**
     * Answer onboarding questions
     */
    async answerOnboardingQuestions(answers: {
        buildKnowledge: string;
        teamSize: string;
        businessStatus: string;
    }) {
        // Close chat first
        await this.closeChat();

        // First question: Build knowledge
        await this.dropdownImages.nth(2).click();
        await this.page.getByRole('option', { name: answers.buildKnowledge }).click();

        // Second question: Team size
        await this.dropdownImages.nth(3).click();
        await this.page.getByRole('option', { name: answers.teamSize }).click();

        // Third question: Business status
        await this.dropdownImages.nth(4).click();
        await this.page.getByRole('option', { name: answers.businessStatus }).click();

        // Click Next
        await this.nextButton.click();
    }

    /**
     * Verify Store Address page is visible
     */
    async verifyStoreAddressPage() {
        await expect(this.storeAddressHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill country
     */
    async fillCountry(country: string) {
        await this.dropdownImages.nth(2).click();
        await this.countryCombobox.fill(country);
        await this.page.getByRole('option', { name: country }).click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Fill address with autocomplete
     */
    async fillAddress(address: string) {
        await this.addressInput.fill(address);
        await this.page.waitForTimeout(3000);
        await this.addressInput.press('ArrowDown');
        await this.addressInput.press('Enter');
    }

    /**
     * Verify address fields are populated
     */
    async verifyAddressFieldsPopulated() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
        await expect(this.divisionText).toBeVisible();
        await expect(this.cityInput).toBeVisible();
        await expect(this.postalCodeInput).toBeVisible();
    }

    /**
     * Click Finish button and wait for redirect
     */
    async clickFinish() {
        await this.finishButton.click();

        // Wait for redirect to the new store (welcome → setup-guide). Accept optional trailing slash.
        const postOnboardUrlPattern = /https:\/\/.*\.ondokan\.com\/admin\/(welcome|setup-guide)\/?/;
        await this.page.waitForURL(postOnboardUrlPattern, { waitUntil: 'load', timeout: 120000 });
        await expect(this.page).toHaveURL(postOnboardUrlPattern);
    }

    /**
     * Complete full onboarding flow
     */
    async completeOnboarding(onboardingData: {
        marketplaceName: string;
        buildKnowledge: string;
        teamSize: string;
        businessStatus: string;
        country: string;
        address: string;
    }) {
        await this.verifySetupMarketplacePage();
        await this.fillMarketplaceName(onboardingData.marketplaceName);
        await this.verifyMarketplaceAvailable();
        await this.clickStartCreatingMarketplace();
        await this.answerOnboardingQuestions({
            buildKnowledge: onboardingData.buildKnowledge,
            teamSize: onboardingData.teamSize,
            businessStatus: onboardingData.businessStatus,
        });
        await this.verifyStoreAddressPage();
        await this.fillCountry(onboardingData.country);
        await this.fillAddress(onboardingData.address);
        await this.verifyAddressFieldsPopulated();
        await this.clickFinish();
    }
}

