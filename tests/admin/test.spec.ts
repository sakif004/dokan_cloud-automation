import { test } from '@playwright/test';
import { AuthenticationPage } from '../../pages/admin/adminAuthPage';
import { VendorPage } from '../../pages/admin/vendorsPage';

test.describe('Admin - Vendor Management', () => {
  test.beforeEach(async ({ page }) => {
    const authPage = new AuthenticationPage(page);
    await authPage.adminLogin(); // logs in using your POM + .env credentials
  });

  test('[CU0002] Create Vendor User', async ({ page }) => {
    const vendorPage = new VendorPage(page);

    await vendorPage.navigateToVendorPage();

    await vendorPage.createVendor({
      firstName: 'Vendor',
      lastName: 'One',
      storeName: 'v_one',
      country: 'United States',
      address: 'abc kitchen',
      email: 'v_one@wedevs.com',
      phone: '01630741571',
      password: 'v_one@wedevs.com',
      plan: 'Free Plan',
    });
  });
});
