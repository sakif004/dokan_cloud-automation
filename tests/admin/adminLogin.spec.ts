import { test, Browser, BrowserContext, Page, chromium } from '@playwright/test';
import { adminAuthenticationPage } from '../../pages/admin/adminAuthPage';

import * as fs from 'fs';

let browser: Browser;
let context: BrowserContext;
let page: Page;

const STORAGE_STATE_PATH = 'tests/fixtures/adminStorageState.json';

test.beforeAll(async () => {
  // ✅ Clear any previous session before starting
  if (fs.existsSync(STORAGE_STATE_PATH)) {
    fs.writeFileSync(STORAGE_STATE_PATH, '{}');
  }

  browser = await chromium.launch();
  context = await browser.newContext();
  page = await context.newPage();

  // Login once using adminAuthenticationPage
  const adminAuthPage = new adminAuthenticationPage(page);
  await adminAuthPage.adminLogin();

  // ✅ Save session (cookies, tokens) for reuse
  await context.storageState({ path: STORAGE_STATE_PATH });
  console.log('✅ Vendor session saved successfully');
});


test('Admin Login', async ({ page }) => {
  const authPage = new adminAuthenticationPage(page);
  await authPage.adminLogin();

  await page.context().storageState({ path: STORAGE_STATE_PATH });
});


// Clear cookies after finishing the test suite
test.afterAll(async () => {
  fs.writeFileSync(STORAGE_STATE_PATH, '{}');
  await browser.close();
  console.log('✅ Browser closed and vendor session cleared');
});