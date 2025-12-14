// setupGuidePage.ts
import { expect, Locator, Page } from '@playwright/test';

export class SetupGuidePage {
    readonly page: Page;

    // Welcome/Setup Guide Locators
    readonly loggedInSuccessMessage: Locator;
    readonly welcomeHeading: Locator;
    readonly setupGuideHeading: Locator;
    readonly setupGeneralSettingsText: Locator;
    readonly generalSettingsButton: Locator;
    readonly completedButton: Locator;

    // General Settings Locators
    readonly generalSettingsHeading: Locator;
    readonly businessDetailsLink: Locator;
    readonly phoneNoInput: Locator;
    readonly saveButton: Locator;
    readonly businessDetailsUpdatedMessage: Locator;

    // Brand Settings Locators
    readonly brandLink: Locator;
    readonly brandElementsHeading: Locator;
    readonly uploadImageButtons: Locator;
    readonly insertMediaHeading: Locator;
    readonly uploadFilesButton: Locator;
    readonly dragAndDropText: Locator;
    readonly addFromURLButton: Locator;
    readonly addMediaFromURLText: Locator;
    readonly urlInput: Locator;
    readonly addMediaButton: Locator;
    readonly mediaUploadedSuccessMessage: Locator;
    readonly selectButton: Locator;
    readonly brandSaveButton: Locator;
    readonly brandSettingsSavedMessage: Locator;

    // Payment Settings Locators
    readonly setupPaymentLink: Locator;
    readonly paymentSettingsHeading: Locator;
    readonly manualPaymentsHeading: Locator;
    readonly cashOnDeliveryButton: Locator;
    readonly cashOnDeliverySettingsHeading: Locator;
    readonly titleInput: Locator;
    readonly descriptionInput: Locator;
    readonly enabledSwitch: Locator;
    readonly enabledText: Locator;
    readonly saveChangesButton: Locator;
    readonly paymentSettingsSavedMessage: Locator;

    // Payout Settings Locators
    readonly setupPayoutLink: Locator;
    readonly payoutSettingsHeading: Locator;
    readonly manageButton: Locator;
    readonly manageBankTransferText: Locator;
    readonly disabledSwitch: Locator;
    readonly flatInput: Locator;
    readonly percentageInput: Locator;
    readonly payoutSaveButton: Locator;
    readonly payoutSettingSavedMessage: Locator;

    // Shipping Settings Locators
    readonly setupShippingLink: Locator;
    readonly shippingSettingsHeading: Locator;
    readonly shippingDisabledSwitch: Locator;
    readonly shippingSaveButton: Locator;
    readonly shippingSettingsUpdatedMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Welcome/Setup Guide
        this.loggedInSuccessMessage = page.getByText('Logged In Successfully!');
        this.welcomeHeading = page.getByRole('heading', { name: /Welcome|Setup Guide/i });
        this.setupGuideHeading = page.getByRole('heading', { name: 'Setup Guide' });
        this.setupGeneralSettingsText = page.getByText('Set up general settings');
        this.generalSettingsButton = page.getByRole('button', { name: 'General Settings' });
        this.completedButton = page.getByRole('button', { name: /\/\d+ completed/ });

        // General Settings
        this.generalSettingsHeading = page.getByRole('heading', { name: 'General Settings' });
        this.businessDetailsLink = page.getByRole('link', { name: 'Business Details' });
        this.phoneNoInput = page.getByRole('textbox', { name: 'Phone No' });
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.businessDetailsUpdatedMessage = page.getByText('Business details updated');

        // Brand Settings
        this.brandLink = page.getByRole('link', { name: 'Brand', exact: true });
        this.brandElementsHeading = page.getByRole('heading', { name: 'Brand Elements' });
        this.uploadImageButtons = page.getByRole('button', { name: 'Upload Image' });
        this.insertMediaHeading = page.getByRole('heading', { name: 'Insert Media' });
        this.uploadFilesButton = page.getByRole('button', { name: 'Upload Files' });
        this.dragAndDropText = page.getByText('Drag and drop images and files');
        this.addFromURLButton = page.getByRole('button', { name: 'Add from URL' });
        this.addMediaFromURLText = page.getByText('Add media from URL');
        this.urlInput = page.getByRole('textbox', { name: 'https://' });
        this.addMediaButton = page.getByRole('button', { name: 'Add media' });
        this.mediaUploadedSuccessMessage = page.getByText('Media uploaded successfully');
        this.selectButton = page.getByRole('button', { name: 'Select' });
        this.brandSaveButton = page.getByRole('button', { name: 'Save' });
        this.brandSettingsSavedMessage = page.getByText('Brand Settings saved');

        // Payment Settings
        this.setupPaymentLink = page.getByRole('link', { name: 'Set up payment' });
        this.paymentSettingsHeading = page.getByRole('heading', { name: 'Payment Settings' });
        this.manualPaymentsHeading = page.getByRole('heading', { name: 'Manual Payments' });
        this.cashOnDeliveryButton = page.locator('.flex.justify-end > .gap-2');
        this.cashOnDeliverySettingsHeading = page.getByRole('heading', { name: 'Cash on Delivery Settings' });
        this.titleInput = page.getByRole('textbox', { name: 'Title' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.enabledSwitch = page.getByRole('switch');
        this.enabledText = page.getByText('Enabled');
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });
        this.paymentSettingsSavedMessage = page.getByText('Payment settings saved.');

        // Payout Settings
        this.setupPayoutLink = page.getByRole('link', { name: 'Set up payout' });
        this.payoutSettingsHeading = page.getByRole('heading', { name: 'Payout Settings' });
        this.manageButton = page.getByRole('button', { name: 'Manage' });
        this.manageBankTransferText = page.getByText('Manage Bank Transfer');
        this.disabledSwitch = page.getByRole('switch', { name: 'Disabled' });
        this.flatInput = page.getByRole('textbox', { name: 'Flat' });
        this.percentageInput = page.getByRole('textbox', { name: 'Percentage' });
        this.payoutSaveButton = page.getByRole('button', { name: 'Save' });
        this.payoutSettingSavedMessage = page.getByText('Payout Setting saved');

        // Shipping Settings
        this.setupShippingLink = page.getByRole('link', { name: 'Set up shipping' });
        this.shippingSettingsHeading = page.getByRole('heading', { name: 'Shipping Settings' });
        this.shippingDisabledSwitch = page.getByRole('switch', { name: 'Disabled' });
        this.shippingSaveButton = page.getByRole('button', { name: 'Save' });
        this.shippingSettingsUpdatedMessage = page.getByText('Shipping Settings updated.');
    }

    /**
     * Verify welcome page after redirect
     */
    async verifyWelcomePage() {
        await expect(this.loggedInSuccessMessage).toBeVisible();
        await expect(this.welcomeHeading).toBeVisible({ timeout: 60000 });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify setup guide page elements
     */
    async verifySetupGuidePage() {
        await expect(this.page.getByRole('heading', { name: 'Congrats on the new' })).toBeVisible();
        await expect(this.setupGeneralSettingsText).toBeVisible();
    }

    /**
     * Click General Settings button
     */
    async clickGeneralSettings() {
        await this.generalSettingsButton.click();
    }

    /**
     * Verify General Settings page
     */
    async verifyGeneralSettingsPage() {
        await expect(this.generalSettingsHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill business details
     */
    async fillBusinessDetails(phoneNo: string) {
        await this.businessDetailsLink.click();
        await this.phoneNoInput.click();
        await this.phoneNoInput.fill(phoneNo);
        await this.saveButton.click();
        await expect(this.businessDetailsUpdatedMessage).toBeVisible();
    }

    /**
     * Upload image from URL (reusable method)
     */
    async uploadImageFromURL(imageUrl: string, buttonIndex: number = 0) {
        // Wait for Upload Image button to be available and visible
        const uploadButton = this.uploadImageButtons.nth(buttonIndex);
        await expect(uploadButton).toBeVisible({ timeout: 10000 });
        await uploadButton.click();
        await expect(this.insertMediaHeading).toBeVisible();

        // Click Upload Files button
        await this.uploadFilesButton.click();
        await expect(this.dragAndDropText).toBeVisible();

        // Click Add from URL
        await this.addFromURLButton.click();
        await expect(this.addMediaFromURLText).toBeVisible();

        // Fill URL
        await this.urlInput.click();
        await this.urlInput.fill(imageUrl);

        // Click Add media button
        await this.addMediaButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.mediaUploadedSuccessMessage).toBeVisible();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Select the image
        await this.selectButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Configure brand settings
     */
    async configureBrandSettings(brandData: {
        logoUrl: string;
        faviconUrl: string;
    }) {
        await this.brandLink.click();
        await expect(this.brandElementsHeading).toBeVisible();

        // Upload logo (first Upload Image button)
        await this.uploadImageFromURL(brandData.logoUrl, 0);

        // Wait for page to be ready after first image selection
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);

        // Ensure we're still on the Brand Elements page
        await expect(this.brandElementsHeading).toBeVisible({ timeout: 10000 });

        // Wait for all Upload Image buttons to be available
        const allUploadButtons = this.page.getByRole('button', { name: 'Upload Image' });
        const buttonCount = await allUploadButtons.count();

        // If there are multiple buttons, use the second one (index 1), otherwise use the first one (index 0)
        const buttonIndex = buttonCount > 1 ? 1 : 0;

        // Wait for the target button to be visible
        const targetButton = allUploadButtons.nth(buttonIndex);
        await expect(targetButton).toBeVisible({ timeout: 10000 });

        // Upload favicon
        await this.uploadImageFromURL(brandData.faviconUrl, buttonIndex);

        // Save brand settings
        await this.brandSaveButton.click();
        await expect(this.brandSettingsSavedMessage).toBeVisible();
    }

    /**
     * Navigate back to setup guide
     */
    async navigateToSetupGuide() {
        await this.completedButton.click();
        await expect(this.setupGuideHeading).toBeVisible();
    }

    /**
     * Configure payment settings
     */
    async configurePaymentSettings(paymentData: {
        title: string;
        description: string;
    }) {
        await this.setupPaymentLink.click();
        await expect(this.paymentSettingsHeading).toBeVisible();
        await expect(this.manualPaymentsHeading).toBeVisible();

        // Click Cash on Delivery button
        await this.cashOnDeliveryButton.click();
        await expect(this.cashOnDeliverySettingsHeading).toBeVisible();

        // Fill payment details
        await this.titleInput.click();
        await this.titleInput.fill(paymentData.title);
        await this.descriptionInput.click();
        await this.descriptionInput.fill(paymentData.description);

        // Enable payment method
        await this.enabledSwitch.click();
        await expect(this.enabledText).toBeVisible();

        // Save changes
        await this.saveChangesButton.click();
        await expect(this.paymentSettingsSavedMessage).toBeVisible();
    }

    /**
     * Configure payout settings
     */
    async configurePayoutSettings(payoutData: {
        flat: string;
        percentage: string;
    }) {
        await this.setupPayoutLink.click();
        await expect(this.payoutSettingsHeading).toBeVisible();

        // Click Manage button
        await this.manageButton.first().click();
        await expect(this.manageBankTransferText).toBeVisible();

        // Enable payout method
        await this.disabledSwitch.click();
        await expect(this.page.getByLabel('Manage Bank Transfer').getByText('Enabled')).toBeVisible();

        // Fill payout details
        await this.flatInput.click();
        await this.flatInput.fill(payoutData.flat);
        await this.percentageInput.click();
        await this.percentageInput.fill(payoutData.percentage);

        // Save
        await this.payoutSaveButton.click();
        await expect(this.payoutSettingSavedMessage).toBeVisible();
    }

    /**
     * Configure shipping settings
     */
    async configureShippingSettings() {
        await this.setupShippingLink.click();
        await expect(this.shippingSettingsHeading).toBeVisible();

        // Enable shipping
        await this.shippingDisabledSwitch.click();
        await expect(this.enabledText).toBeVisible();

        // Save
        await this.shippingSaveButton.click();
        await expect(this.shippingSettingsUpdatedMessage).toBeVisible();
    }

    /**
     * Complete full setup guide flow
     */
    async completeSetupGuide(setupData: {
        phoneNo: string;
        brand: {
            logoUrl: string;
            faviconUrl: string;
        };
        payment: {
            title: string;
            description: string;
        };
        payout: {
            flat: string;
            percentage: string;
        };
    }) {
        await this.verifyWelcomePage();
        await this.verifySetupGuidePage();

        // General Settings
        await this.clickGeneralSettings();
        await this.verifyGeneralSettingsPage();
        await this.fillBusinessDetails(setupData.phoneNo);

        // Brand Settings
        await this.configureBrandSettings(setupData.brand);
        await this.navigateToSetupGuide();

        // Payment Settings
        await this.configurePaymentSettings(setupData.payment);
        await this.navigateToSetupGuide();

        // Payout Settings
        await this.configurePayoutSettings(setupData.payout);
        await this.navigateToSetupGuide();

        // Shipping Settings
        await this.configureShippingSettings();
    }
}

