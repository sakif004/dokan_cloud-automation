// marketplaceOnboardingPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { Urls } from '../../utils/testData';
import { ChatManager } from '../../pages/common/chatManager';

export class MarketplaceOnboardingPage {
    readonly page: Page;
    readonly chatManager: ChatManager;

    // Setup Marketplace Page Locators
    readonly setupMarketplaceHeading: Locator;
    readonly marketplaceNameInput: Locator;
    readonly marketplaceAvailableText: Locator;
    readonly startCreatingMarketplaceButton: Locator;

    // Onboarding Questions Locators
    readonly dropdownImages: Locator;
    readonly nextButton: Locator;

    // Store Address Page Locators
    readonly storeAddressHeading: Locator;
    readonly countryCombobox: Locator;
    readonly addressInput: Locator;
    readonly divisionCombobox: Locator;
    readonly cityInput: Locator;
    readonly postalCodeInput: Locator;
    readonly finishButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.chatManager = new ChatManager(page);

        // Setup Marketplace
        this.setupMarketplaceHeading = page.getByRole('heading', { name: 'Setup your Marketplace' });
        this.marketplaceNameInput = page.getByRole('textbox', { name: 'Marketplace Name' });
        this.marketplaceAvailableText = page.locator('div').filter({ hasText: /^Marketplace Available$/ });
        this.startCreatingMarketplaceButton = page.getByRole('button', { name: 'Start Creating Marketplace' });

        // Onboarding Questions
        this.dropdownImages = page.getByRole('img');
        this.nextButton = page.getByRole('button', { name: 'Next' });

        // Store Address
        this.storeAddressHeading = page.getByRole('heading', { name: 'Store Address' });
        this.countryCombobox = page.getByRole('combobox', { name: 'Country' });
        this.addressInput = page.locator('#address');
        this.divisionCombobox = page.getByRole('combobox', { name: 'Division' });
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
     * Answer onboarding questions
     */
    async answerOnboardingQuestions(answers: {
        buildKnowledge: string;
        teamSize: string;
        businessStatus: string;
    }) {
        // Close chat using ChatManager
        await this.chatManager.closeChat();

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
        // Fill address
        await this.addressInput.click();
        await this.addressInput.fill(address);

        // Wait for autocomplete suggestions to appear
        await this.page.waitForTimeout(2000);

        // Select first suggestion using ArrowDown and Enter
        await this.addressInput.press('ArrowDown');
        await this.page.waitForTimeout(1000);
        await this.addressInput.press('Enter');

        // Wait for address selection to process
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify address fields are populated, fill manually if needed
     */
    async verifyAddressFieldsPopulated() {
        // Wait for page to settle
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);

        // Check if Division field has a value
        let divisionValue = '';
        try {
            divisionValue = await this.divisionCombobox.inputValue();
        } catch (e) {
            // Try alternative method
            try {
                divisionValue = await this.divisionCombobox.evaluate((el: HTMLElement) => {
                    const input = el as HTMLInputElement;
                    return input.value || '';
                });
            } catch (e2) {
                divisionValue = '';
            }
        }

        // Check if City field has a value
        let cityValue = '';
        try {
            cityValue = await this.cityInput.inputValue();
        } catch (e) {
            cityValue = '';
        }

        // If fields are not auto-populated, fill them manually
        if (!divisionValue || divisionValue.trim() === '') {
            console.log('⚠️  Division not auto-filled, filling manually with "Dhaka"');
            await this.divisionCombobox.click();
            await this.page.waitForTimeout(1000);
            await this.divisionCombobox.fill('Dhaka');
            await this.page.waitForTimeout(500);
            // Try to select the option if it appears
            const dhakaOption = this.page.getByRole('option', { name: /Dhaka/i });
            const optionVisible = await dhakaOption.isVisible({ timeout: 2000 }).catch(() => false);
            if (optionVisible) {
                await dhakaOption.click();
            } else {
                // If no option, just press Enter to confirm
                await this.divisionCombobox.press('Enter');
            }
            await this.page.waitForTimeout(1000);
        }

        if (!cityValue || cityValue.trim() === '') {
            console.log('⚠️  City not auto-filled, filling manually with "Dhaka"');
            await this.cityInput.click();
            await this.cityInput.fill('Dhaka');
            await this.page.waitForTimeout(1000);
        }

        // Verify fields are visible
        await expect(this.divisionCombobox).toBeVisible({ timeout: 10000 });
        await expect(this.cityInput).toBeVisible({ timeout: 10000 });
        await expect(this.postalCodeInput).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click Finish button and wait for redirect
     */
    async clickFinish() {
        await this.finishButton.click();

        // Extract the domain from adminUrl to create a dynamic URL pattern
        // For production: https://amazonbd2.ondokan.com → pattern: /https:\/\/amazonbd2\.ondokan\.com\/admin\/(welcome|setup-guide)\/?/
        // For staging: https://amazonbd2.staging.dokandev.com → pattern: /https:\/\/amazonbd2\.staging\.dokandev\.com\/admin\/(welcome|setup-guide)\/?/

        const baseUrl = new URL(Urls.adminUrl).hostname.replace(/\./g, '\\.');
        const postOnboardUrlPattern = new RegExp(`https:\\/\\/${baseUrl}\\/admin\\/(welcome|setup-guide)\\/?`);
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

