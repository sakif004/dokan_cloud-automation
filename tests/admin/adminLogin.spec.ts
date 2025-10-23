import { test, expect } from '@playwright/test';
import { AuthenticationPage } from '../../pages/admin/adminAuthPage';

test('Admin Login', async ({ page }) => {
  const authPage = new AuthenticationPage(page);
  await authPage.adminLogin();

  await page.context().storageState({ path: 'adminStorageState.json' });
});