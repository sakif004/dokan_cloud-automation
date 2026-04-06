// pages/app_store/marketplaceOnboardingPage.ts
import { expect, Locator, Page } from '@playwright/test';
import { ChatManager } from '../../pages/common/chatManager';

export class MarketplaceOnboardingPage {
    readonly page: Page;
    readonly chatManager: ChatManager;

    // ── Step 1: Store Type ──────────────────────────────────────────
    private readonly storeTypeHeading: Locator;
    private readonly multivendorMarketplaceRadio: Locator;
    private readonly continueButton: Locator;

    // ── Step 2: Store Details ───────────────────────────────────────
    private readonly storeDetailsHeading: Locator;
    private readonly storeNameInput: Locator;
    private readonly marketplaceAvailableText: Locator;

    // ── Step 3: Store Information ───────────────────────────────────
    private readonly storeInformationHeading: Locator;
    private readonly stageCombobox: Locator;
    private readonly audienceCombobox: Locator;
    private readonly experienceCombobox: Locator;

    // ── Step 4: Store Preference (Address) ─────────────────────────
    private readonly storePreferenceHeading: Locator;
    private readonly countryDropdownTrigger: Locator;
    private readonly addressInput: Locator;
    private readonly divisionDropdownTrigger: Locator;
    private readonly divisionInput: Locator;
    readonly cityInput: Locator;
    private readonly postalCodeInput: Locator;
    private readonly finishSetupButton: Locator;

    // ── Post-finish: Creation Progress ─────────────────────────────
    private readonly holdTightHeading: Locator;

    // ── Post-finish: Congratulations ───────────────────────────────
    private readonly congratsHeading: Locator;
    private readonly goToDashboardButton: Locator;
    private readonly previewStoreLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.chatManager = new ChatManager(page);

        // Step 1: Store Type
        this.storeTypeHeading = page.getByRole('heading', { name: 'Store Type' });
        this.multivendorMarketplaceRadio = page.getByRole('radio', { name: 'Multivendor Marketplace' });
        this.continueButton = page.getByRole('button', { name: 'Continue' });

        // Step 2: Store Details
        this.storeDetailsHeading = page.getByRole('heading', { name: 'Store Details' });
        this.storeNameInput = page.getByRole('textbox', { name: 'Store Name*' });
        this.marketplaceAvailableText = page.getByText('This marketplace name is');

        // Step 3: Store Information
        this.storeInformationHeading = page.getByRole('heading', { name: 'Store Information' });
        this.stageCombobox = page.getByRole('combobox').first();
        this.audienceCombobox = page.getByRole('combobox').nth(1);
        this.experienceCombobox = page.getByRole('combobox').nth(2);

        // Step 4: Store Preference
        // "Store Preferance" is the exact heading text from the UI (typo in the app itself)
        this.storePreferenceHeading = page.getByRole('heading', { name: 'Store Preferance' });
        // Country uses a custom React Select — clicking the visible "United States" div opens a search input
        this.countryDropdownTrigger = page.locator('div').filter({ hasText: /^United States$/ }).nth(2);
        this.addressInput = page.getByRole('textbox', { name: 'Enter address' });
        // State/Division uses a custom dropdown: trigger is an img icon, input is #state
        this.divisionDropdownTrigger = page.getByRole('img').nth(5);
        this.divisionInput = page.locator('#state');
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.postalCodeInput = page.getByRole('textbox', { name: 'Postal Code' });
        this.finishSetupButton = page.getByRole('button', { name: 'Finish Setup' });

        // Post-finish: Creation progress
        this.holdTightHeading = page.getByRole('heading', { name: "Hold tight, we're now" });

        // Post-finish: Congratulations
        this.congratsHeading = page.getByRole('heading', { name: 'Congratulations! Your store' });
        this.goToDashboardButton = page.getByRole('button', { name: 'Go to Dashboard' });
        this.previewStoreLink = page.getByRole('link', { name: 'Preview Store' });
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 1 — Store Type
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verify the Store Type selection page is visible
     */
    async verifyStoreTypePage() {
        await expect(this.storeTypeHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Select "Multivendor Marketplace" and proceed
     */
    async selectStoreType() {
        await this.multivendorMarketplaceRadio.click();
        await this.continueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 2 — Store Details
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verify the Store Details page is visible
     */
    async verifyStoreDetailsPage() {
        await expect(this.storeDetailsHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Fill the store/marketplace name and wait for availability check
     */
    async fillStoreName(name: string) {
        await this.storeNameInput.click();
        await this.storeNameInput.fill(name);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify the "This marketplace name is available" message
     */
    async verifyMarketplaceAvailable() {
        await expect(this.marketplaceAvailableText).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click Continue to proceed to the next step
     */
    async clickContinue() {
        await this.continueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 3 — Store Information
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verify the Store Information (onboarding questions) page is visible
     */
    async verifyStoreInformationPage() {
        await expect(this.storeInformationHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Answer the three onboarding questions using native <select> comboboxes
     */
    async answerOnboardingQuestions(answers: {
        stage: string;
        audience: string;
        experience: string;
    }) {
        // Close optional chat widget if present
        await this.chatManager.closeChat();

        await this.verifyStoreInformationPage();

        // Select answers from native <select> elements
        await this.stageCombobox.selectOption(answers.stage);
        await this.page.waitForTimeout(500);
        await this.audienceCombobox.selectOption(answers.audience);
        await this.page.waitForTimeout(500);
        await this.experienceCombobox.selectOption(answers.experience);
        await this.page.waitForTimeout(500);

        // Proceed to Store Preference step
        await this.continueButton.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    // ═══════════════════════════════════════════════════════════════
    // STEP 4 — Store Preference (Country + Address)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verify the Store Preference page is visible
     */
    async verifyStorePreferencePage() {
        await expect(this.storePreferenceHeading).toBeVisible({ timeout: 10000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Select a country from the custom React Select dropdown.
     * Clicking the trigger opens a search input (dynamic ID); we type into
     * the focused element to avoid relying on the generated ID.
     */
    async fillCountry(country: string) {
        await this.countryDropdownTrigger.click();
        await this.page.waitForTimeout(500);
        // Type into the focused React Select search input
        await this.page.keyboard.type(country, { delay: 50 });
        await this.page.waitForTimeout(500);
        await this.page.getByRole('option', { name: country }).click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Fill the address field, trigger autocomplete selection, and verify
     * City is populated before continuing to division/state filling
     */
    async fillAddress(address: string) {
        await this.addressInput.click();
        await this.addressInput.fill(address);

        // Wait for autocomplete suggestions to appear
        await this.page.waitForTimeout(2000);

        // Select the first suggestion with ArrowDown + Enter
        await this.addressInput.press('ArrowDown');
        await this.page.waitForTimeout(1000);
        await this.addressInput.press('Enter');

        // Wait for address sub-fields to populate, then confirm City is visible
        await this.page.waitForTimeout(2000);
        await this.cityInput.click();
        await expect(this.cityInput).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill State/Division and Postal Code after address autocomplete.
     * City is already verified visible in fillAddress().
     * State uses a custom dropdown (img trigger → #state input → option click).
     * Postal code is filled directly via text input.
     */
    async verifyAddressFieldsPopulated(postalCode: string = '1219') {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Open State/Division dropdown via its img trigger icon
        await this.divisionDropdownTrigger.click();
        await this.page.waitForTimeout(500);

        // Type "Dhaka" into the #state search input and select the option
        await this.divisionInput.fill('Dhaka');
        await this.page.waitForTimeout(500);
        await this.page.getByRole('option', { name: 'Dhaka' }).click();
        await this.page.waitForTimeout(1000);

        // Fill Postal Code
        await this.postalCodeInput.fill(postalCode);
        await this.page.waitForTimeout(500);
    }

    /**
     * Click the Finish Setup button to submit the onboarding form
     */
    async clickFinishSetup() {
        await this.finishSetupButton.click();
    }

    // ═══════════════════════════════════════════════════════════════
    // POST-FINISH — Creation Progress & Congratulations
    // ═══════════════════════════════════════════════════════════════

    /**
     * Verify the "Hold tight" creation-in-progress screen is visible.
     * Uses a long timeout since marketplace provisioning can take time.
     */
    async verifyCreationProgress() {
        await expect(this.holdTightHeading).toBeVisible({ timeout: 60000 });
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Verify the Congratulations page is visible with both action buttons
     */
    async verifyCongratualtionsPage() {
        await expect(this.congratsHeading).toBeVisible({ timeout: 60000 });
        await expect(this.goToDashboardButton).toBeVisible({ timeout: 10000 });
        await expect(this.previewStoreLink).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click "Go to Dashboard" and return the new tab (popup) Page instance.
     * The dashboard opens in a new browser tab.
     */
    async clickGoToDashboard(): Promise<Page> {
        const dashboardPagePromise = this.page.waitForEvent('popup');
        await this.goToDashboardButton.click();
        const dashboardPage = await dashboardPagePromise;
        await dashboardPage.waitForLoadState('domcontentloaded');
        await dashboardPage.waitForLoadState('networkidle');
        await dashboardPage.waitForTimeout(2000);
        return dashboardPage;
    }

    /**
     * Click "Preview Store" and return the new tab (popup) Page instance.
     * The storefront opens in a new browser tab.
     */
    async clickPreviewStore(): Promise<Page> {
        const storePagePromise = this.page.waitForEvent('popup');
        await this.previewStoreLink.click();
        const storePage = await storePagePromise;
        await storePage.waitForLoadState('domcontentloaded');
        await storePage.waitForLoadState('networkidle');
        return storePage;
    }

    // ═══════════════════════════════════════════════════════════════
    // ORCHESTRATOR — Complete Onboarding Flow
    // ═══════════════════════════════════════════════════════════════

    /**
     * Run the full 4-step onboarding flow up to and including clicking
     * "Finish Setup". Call verifyCreationProgress / verifyCongratualtionsPage
     * / clickGoToDashboard separately in the test after this method.
     */
    async completeOnboarding(onboardingData: {
        marketplaceName: string;
        stage: string;
        audience: string;
        experience: string;
        country: string;
        address: string;
    }) {
        // Step 1: Select store type
        await this.verifyStoreTypePage();
        await this.selectStoreType();

        // Step 2: Fill store name
        await this.verifyStoreDetailsPage();
        await this.fillStoreName(onboardingData.marketplaceName);
        await this.verifyMarketplaceAvailable();
        await this.clickContinue();

        // Step 3: Answer onboarding questions
        await this.answerOnboardingQuestions({
            stage: onboardingData.stage,
            audience: onboardingData.audience,
            experience: onboardingData.experience,
        });

        // Step 4: Fill store address and submit
        await this.verifyStorePreferencePage();
        await this.fillCountry(onboardingData.country);
        await this.fillAddress(onboardingData.address);
        await this.verifyAddressFieldsPopulated();
        await this.clickFinishSetup();
    }
}
