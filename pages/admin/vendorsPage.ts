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
   * Fill vendor address information
   */
  async fillAddress(address: string) {
    await this.addressInput.click();
    await this.addressInput.fill(address);
    await this.page.waitForLoadState('domcontentloaded');

    // Handle address autocomplete - click on the suggestion
    // await this.page.getByText(address).click();
    await this.page.getByText('abc kitchenEast 18th Street,').click();
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
    // addressSuggestion?: string;
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
    //need to wait for auto fill zip and city
    await this.page.waitForTimeout(2000);

    await this.fillContactInfo(vendorData.email, vendorData.phone);
    await this.fillPassword(vendorData.password);
    await this.selectSubscriptionPlan(vendorData.subscriptionPlan);
    await this.submitVendorCreation();

    //want to wait for creation to complete
    await this.page.waitForTimeout(2000);
  }

  /**
     * Verify vendor creation success via notification
     */
  async verifyVendorCreatedSuccessfully() {
    const notificationMessage = this.page
      .getByLabel('Notifications alt+T')
      .getByRole('listitem');

    await expect(notificationMessage).toContainText('Vendor created successfully', {
      timeout: 10000
    });
  }
}