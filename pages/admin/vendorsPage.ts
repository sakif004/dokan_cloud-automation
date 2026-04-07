// adminVendorPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class VendorManagementPage {
  readonly page: Page;

  // Vendor List Page Locators
  readonly vendorsLink: Locator;
  readonly createVendorButton: Locator;

  // Vendor Creation Form Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly storeNameInput: Locator;
  readonly countryCombobox: Locator;
  readonly addressInput: Locator;
  readonly stateCombobox: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly passwordInput: Locator;
  readonly subscriptionPlanCombobox: Locator;
  readonly createVendorSubmitButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Vendor List Page
    this.vendorsLink = page.getByRole('link', { name: 'Vendors' });
    this.createVendorButton = page.getByRole('button', { name: 'Create Vendor' }).first();

    // Vendor Creation Form
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.storeNameInput = page.getByRole('textbox', { name: 'Store Name *' });
    this.countryCombobox = page.getByRole('combobox', { name: 'Country *' });
    this.addressInput = page.getByRole('textbox', { name: 'Address *' });
    this.stateCombobox = page.getByRole('combobox', { name: 'State *' });
    this.cityInput = page.getByRole('textbox', { name: 'City *' });
    this.zipCodeInput = page.getByRole('textbox', { name: 'ZIP Code *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.phoneNumberInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.subscriptionPlanCombobox = page.getByRole('combobox', { name: 'Subscription Plan *' });
    this.createVendorSubmitButton = page.getByRole('button', { name: 'Create Vendor' }).last();
  }

  /**
   * Navigate to Vendors management page
   */
  async navigateToVendors() {
    await this.vendorsLink.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click Create Vendor button to open form
   */
  async openCreateVendorForm() {
    await this.createVendorButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Fill vendor basic information
   */
  async fillVendorBasicInfo(firstName: string, lastName: string, storeName: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.storeNameInput.fill(storeName);
  }

  /**
   * Select country from combobox
   */
  async selectCountry(countryName: string) {
    await this.countryCombobox.click();
    await this.countryCombobox.fill(countryName);
    await this.page.getByRole('option', { name: new RegExp(countryName, 'i') }).first().click();
  }

  /**
   * Fill vendor address via Google Places autocomplete.
   * Uses keyboard navigation (ArrowDown + Enter) to select the first suggestion,
   * which avoids the race condition of clicking an asynchronous overlay element.
   * Falls back gracefully if no suggestion appears.
   */
  async fillAddress(address: string) {
    await this.addressInput.click();
    await this.addressInput.fill(address);

    // Wait for Google Places autocomplete dropdown to appear
    const firstSuggestion = this.page.locator('.pac-item').first();
    const hasSuggestion = await firstSuggestion.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasSuggestion) {
      await this.addressInput.press('ArrowDown');
      await this.addressInput.press('Enter');
      // Allow time for State / City / ZIP to auto-populate
      await this.page.waitForTimeout(1500);
    }
  }

  /**
   * Fill State, City, and ZIP Code manually.
   * Call this after fillAddress() if autocomplete did not auto-populate the fields.
   */
  async fillAddressDetails(state: string, city: string, zipCode: string) {
    const stateEmpty = (await this.stateCombobox.inputValue().catch(() => '')).trim() === '';
    if (stateEmpty) {
      await this.stateCombobox.click();
      await this.page.getByRole('option', { name: new RegExp(state, 'i') }).first().click();
    }

    const cityEmpty = (await this.cityInput.inputValue()).trim() === '';
    if (cityEmpty) {
      await this.cityInput.fill(city);
    }

    const zipEmpty = (await this.zipCodeInput.inputValue()).trim() === '';
    if (zipEmpty) {
      await this.zipCodeInput.fill(zipCode);
    }
  }

  /**
   * Fill vendor contact information
   */
  async fillContactInfo(email: string, phone: string) {
    await this.emailInput.fill(email);
    await this.phoneNumberInput.fill(phone);
  }

  /**
   * Fill vendor password
   */
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  /**
   * Select subscription plan
   */
  async selectSubscriptionPlan(planName: string) {
    await this.subscriptionPlanCombobox.click();
    await this.page.getByRole('option', { name: planName }).click();
  }

  /**
   * Submit vendor creation form
   */
  async submitVendorCreation() {
    await this.createVendorSubmitButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Create vendor with complete information (convenience method)
   */
  async createVendor(vendorData: {
    firstName: string;
    lastName: string;
    storeName: string;
    country: string;
    address: string;
    state: string;
    city: string;
    zipCode: string;
    email: string;
    phone: string;
    password: string;
    subscriptionPlan: string;
  }) {
    await this.navigateToVendors();
    await this.openCreateVendorForm();

    await this.fillVendorBasicInfo(vendorData.firstName, vendorData.lastName, vendorData.storeName);
    await this.selectCountry(vendorData.country);
    await this.fillAddress(vendorData.address);
    // Fill State/City/ZIP manually if autocomplete did not populate them
    await this.fillAddressDetails(vendorData.state, vendorData.city, vendorData.zipCode);

    await this.fillContactInfo(vendorData.email, vendorData.phone);
    await this.fillPassword(vendorData.password);
    await this.selectSubscriptionPlan(vendorData.subscriptionPlan);
    await this.submitVendorCreation();

    await this.page.waitForTimeout(2000);
  }

  /**
     * Verify vendor creation success via notification
     */
  async verifyVendorCreatedSuccessfully() {
    await expect(this.page.getByText('Vendor created successfully')).toBeVisible({ timeout: 10000 });
  }
}