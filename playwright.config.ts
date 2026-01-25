import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // ========== SETUP PROJECT - Auth credentials save করবে ==========
    {
      name: 'setup',
      testMatch: /.*auth\.setup\.ts/,
    },

    // ========== CHROMIUM PROJECT - Main test runner ==========
    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     storageState: 'playwright/.auth/admin.json',
    //   },
    //   // dependencies: ['setup'],
    // },

    // ========== E2E Setup Project - Create Marketplace ==========
    {
      name: "marketplaceSetup",
      testMatch: [
        'tests/app_store/marketplaceOnboarding.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'playwright/.auth/admin.json',
      },
      // dependencies: ['setup'],
    },

    // ========== ADMIN PRE SETUP - Category, Brand, Collection create করবে ==========
    {
      name: "adminPreSetup",
      testMatch: [
        'tests/admin/vendorCreate.spec.ts',
        'tests/admin/categoryCreate.spec.ts',
        'tests/admin/brandCreate.spec.ts',
        'tests/admin/collectionCreate.spec.ts',
        // 'tests/admin/deleteProduct.spec.ts',
        // 'tests/admin/deleteCategory.spec.ts',
        // 'tests/admin/deleteCollection.spec.ts',
        // 'tests/admin/deleteBrand.spec.ts',
        // Note: setupGuide.spec.ts should be run after marketplaceOnboarding.spec.ts
        'tests/admin/setupGuide.spec.ts',
        'tests/admin/test.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'playwright/.auth/admin.json',
      },
      // dependencies: ['setup'],
    },
    {
      name: "vendorProductCreation",
      testMatch: [
        'productCreate.spec.ts',
        'tests/e2e/e2eDeleteProductRelatedThings.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'playwright/.auth/admin.json',
      },
      // dependencies: ['setup'],
    },

    // ========== CLEANUP PROJECT - সব delete করবে ==========
    {
      name: "cleanup",
      testMatch: [
        //TODO: Add more tests here''
      ],
      use: {
        ...devices['Desktop Chrome'],
        // storageState: 'playwright/.auth/admin.json',
      },
      // // dependencies: ['setup'],
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
