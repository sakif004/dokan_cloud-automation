// adminVendorPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class VendorManagementPage {
  readonly page: Page;

  // Vendor List Page Locators
  readonly vendorsLink: Locator;
  readonly createVendorButton: Locator;
  readonly vendorsHeading: Locator;

  // Vendor Creation Form Locators
  readonly createVendorHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly storeNameInput: Locator;
  readonly countryCombobox: Locator;
  readonly addressInput: Locator;
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
    this.vendorsHeading = page.getByRole('heading', { name: 'Vendors' });

    // Vendor Creation Form
    this.createVendorHeading = page.getByRole('heading', { name: 'Create Vendor' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.storeNameInput = page.getByRole('textbox', { name: 'Store Name *' });
    this.countryCombobox = page.getByRole('combobox', { name: 'Country *' });
    this.addressInput = page.getByRole('textbox', { name: 'Address *' });
    this.cityInput = page.getByRole('textbox', { name: 'City *' });
    this.zipCodeInput = page.getByRole('textbox', { name: 'ZIP Code *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.phoneNumberInput = page.getByRole('textbox', { name: 'Phone Number *' });
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
    await expect(this.vendorsHeading).toBeVisible({ timeout: 10000 });
  }

  /**
   * Click Create Vendor button to open form
   */
  async openCreateVendorForm() {
    await this.createVendorButton.click();
    await expect(this.createVendorHeading).toBeVisible({ timeout: 10000 });
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
   * Select country from React Select combobox.
   * Clicks the input to open the dropdown, then filters by typing.
   */
  async selectCountry(countryName: string) {
    await this.countryCombobox.click();
    await this.page.waitForTimeout(300);
    await this.countryCombobox.fill(countryName);
    await this.page.getByRole('option', { name: new RegExp(countryName, 'i') }).first().click();
  }

  /**
   * Fill the address field and trigger autocomplete selection.
   * Same pattern as MarketplaceOnboardingPage.fillAddress():
   *  - wait 2s for suggestions to load
   *  - ArrowDown → wait 1s → Enter to pick the first suggestion
   *  - wait 2s for Division / City to auto-populate
   */
  async fillAddress(address: string) {
    await this.addressInput.click();
    await this.addressInput.fill(address);

    // Wait for Google Places suggestions to appear
    await this.page.waitForTimeout(2000);

    await this.addressInput.press('ArrowDown');
    await this.page.waitForTimeout(1000);
    await this.addressInput.press('Enter');

    // Wait for Division / City to auto-populate after selection
    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify Division auto-populated and fill City if needed.
   * Same pattern as MarketplaceOnboardingPage.verifyAddressFieldsPopulated():
   *  - Bangladesh addresses auto-fill Division to 'Dhaka' — wait for confirmation text
   *  - City is a plain textbox — fill if still empty
   *
   * @param division - expected auto-filled value, e.g. 'Dhaka'
   * @param city     - fallback city if not auto-filled, e.g. 'Dhaka'
   * @param zipCode  - optional, filled if provided and still empty
   */
  async fillAddressDetails(division: string, city: string, zipCode?: string) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);

    // Division auto-populates for Bangladesh addresses — wait for confirmation
    // e.g. the form container shows combined text "Division *Dhaka"
    const divisionAutoFilled = await this.page
      .getByText(`Division *${division}`)
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!divisionAutoFilled) {
      // Fallback: Division did not auto-fill — interact with the img trigger
      // (same technique as marketplaceOnboardingPage: img icon opens the React Select)
      const dialog = this.page.getByRole('dialog', { name: 'Create Vendor' });
      const divisionTrigger = dialog
        .locator('div')
        .filter({ has: this.page.getByRole('combobox', { name: 'State *' }) })
        .locator('img')
        .last();
      await divisionTrigger.click();
      await this.page.waitForTimeout(500);
      await this.page.keyboard.type(division);
      await this.page.waitForTimeout(500);
      await this.page.getByRole('option', { name: new RegExp(division, 'i') }).first().click();
      await this.page.waitForTimeout(500);
    }

    // City is a plain textbox — fill if autocomplete left it empty
    const cityEmpty = (await this.cityInput.inputValue().catch(() => '')).trim() === '';
    if (cityEmpty) {
      await this.cityInput.fill(city);
    }

    if (zipCode) {
      const zipEmpty = (await this.zipCodeInput.inputValue().catch(() => '')).trim() === '';
      if (zipEmpty) {
        await this.zipCodeInput.fill(zipCode);
      }
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
   * Select subscription plan from React Select combobox
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
   * Create vendor with complete information (convenience method).
   *
   * division / city are required as fallback values — Google Places autocomplete
   * is unreliable and slow for Bangladesh addresses, so we always check and fill
   * them manually if autocomplete left them empty.
   */
  async createVendor(vendorData: {
    firstName: string;
    lastName: string;
    storeName: string;
    country: string;
    address: string;
    division: string;
    city: string;
    zipCode?: string;
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

    // Always check and fill Division/City — handles slow or failed autocomplete
    await this.fillAddressDetails(vendorData.division, vendorData.city, vendorData.zipCode);

    await this.fillContactInfo(vendorData.email, vendorData.phone);
    await this.fillPassword(vendorData.password);
    await this.selectSubscriptionPlan(vendorData.subscriptionPlan);
    await this.submitVendorCreation();

    await this.page.waitForTimeout(2000);
  }

  /**
   * Verify vendor creation success via toast notification
   */
  async verifyVendorCreatedSuccessfully() {
    await expect(this.page.getByText('Vendor created successfully')).toBeVisible({ timeout: 10000 });
  }
}
