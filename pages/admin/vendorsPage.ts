// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//     await page.goto('https://birdseye.staging.dokandev.com/admin/login');
//     await page.getByRole('textbox', { name: 'Email Address' }).click();
//     await page.getByRole('textbox', { name: 'Email Address' }).fill('sakifur@wedevs.com');
//     await page.getByRole('textbox', { name: 'Password' }).click();
//     await page.getByRole('textbox', { name: 'Password' }).fill('sakifur@wedevs.com');
//     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
//     await page.getByRole('link', { name: 'Vendors' }).click();
//     await page.getByRole('button', { name: 'Create Vendor' }).click();
//     await page.getByRole('textbox', { name: 'First Name *' }).click();
//     await page.getByRole('textbox', { name: 'First Name *' }).fill('vedor');
//     await page.getByRole('textbox', { name: 'Last Name *' }).click();
//     await page.getByRole('textbox', { name: 'Last Name *' }).fill('One');
//     await page.getByRole('textbox', { name: 'Store Name *' }).click();
//     await page.getByRole('textbox', { name: 'Store Name *' }).fill('v_one');
//     await page.getByRole('combobox', { name: 'Country *' }).click();
//     await page.getByRole('combobox', { name: 'Country *' }).fill('united');
//     await page.getByRole('option', { name: 'United States' }).click();
//     await page.getByRole('textbox', { name: 'Address *' }).click();
//     await page.getByRole('textbox', { name: 'Address *' }).fill('abc');
//     await page.getByText('abc kitchen').click();
//     await page.getByRole('textbox', { name: 'Email *' }).click();
//     await page.getByRole('textbox', { name: 'Email *' }).fill('v_one@wedevs.com');
//     await page.getByRole('textbox', { name: 'Phone Number' }).click();
//     await page.getByRole('textbox', { name: 'Phone Number' }).fill('01630741571');
//     await page.getByRole('textbox', { name: 'Password *' }).click();
//     await page.getByRole('textbox', { name: 'Password *' }).fill('v_one@wedevs.com');
//     await page.getByRole('combobox', { name: 'Subscription Plan *' }).click();
//     await page.getByRole('combobox', { name: 'Subscription Plan *' }).click();
//     await page.getByRole('option', { name: 'Free Plan' }).click();
//     await page.getByRole('button', { name: 'Create Vendor' }).click();
// });


import { expect, Locator, Page } from '@playwright/test';

export class VendorPage {
  readonly page: Page;

  // Locators
  readonly vendorsLink: Locator;
  readonly createVendorButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly storeNameInput: Locator;
  readonly countryDropdown: Locator;
  readonly addressInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  readonly subscriptionDropdown: Locator;
  readonly createButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.vendorsLink = page.getByRole('link', { name: 'Vendors' });
    this.createVendorButton = page.getByRole('button', { name: 'Create Vendor' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name *' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name *' });
    this.storeNameInput = page.getByRole('textbox', { name: 'Store Name *' });
    this.countryDropdown = page.getByRole('combobox', { name: 'Country *' });
    this.addressInput = page.getByRole('textbox', { name: 'Address *' });
    this.emailInput = page.getByRole('textbox', { name: 'Email *' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password *' });
    this.subscriptionDropdown = page.getByRole('combobox', { name: 'Subscription Plan *' });
    this.createButton = page.getByRole('button', { name: 'Create Vendor' });
  }

  async navigateToVendorPage() {
    await this.vendorsLink.click();
    await expect(this.page).toHaveURL(/\/admin\/vendors/);
  }

  async createVendor(vendorData: {
    firstName: string;
    lastName: string;
    storeName: string;
    country: string;
    address: string;
    email: string;
    phone: string;
    password: string;
    plan: string;
  }) {
    await this.createVendorButton.click();

    await this.firstNameInput.fill(vendorData.firstName);
    await this.lastNameInput.fill(vendorData.lastName);
    await this.storeNameInput.fill(vendorData.storeName);

    await this.countryDropdown.click();
    await this.countryDropdown.fill(vendorData.country);
    await this.page.getByRole('option', { name: vendorData.country }).click();

    await this.addressInput.fill(vendorData.address);
    await this.page.getByText(vendorData.address, { exact: false }).first().click();

    await this.emailInput.fill(vendorData.email);
    await this.phoneInput.fill(vendorData.phone);
    await this.passwordInput.fill(vendorData.password);

    await this.subscriptionDropdown.click();
    await this.page.getByRole('option', { name: vendorData.plan }).click();

    await this.createButton.click();

    // Validate success (adjust selector to your app’s success toast/message)
    await expect(this.page.getByText('Vendor created successfully')).toBeVisible();
  }
}
