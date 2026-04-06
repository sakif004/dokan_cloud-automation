// tests/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import { Urls } from '../utils/testData';

/**
 * ================================================================================================
 * Auth Setup - Save authentication state for all roles
 * ================================================================================================
 * 
 * এই file এ চারটি role এর login করা হয় এবং তাদের session save করা হয়।
 * প্রতিটি role এর জন্য একটি .json file তৈরি হয়।
 * 
 * URLs এবং credentials .env file থেকে testData.ts দ্বারা load হয়
 * 
 * Files created:
 * - playwright/.auth/admin.json
 * - playwright/.auth/vendor.json
 * - playwright/.auth/customer.json
 * - playwright/.auth/dokanCloud.json
 */

// ================================================================================================
// Admin Authentication Setup
// ================================================================================================
const adminAuthFile = 'playwright/.auth/admin.json';

setup('authenticate admin', async ({ page }) => {
    console.log('🔐 Admin Authentication Starting...');

    // Navigate to admin login page - .env থেকে full URL নিচ্ছি
    await page.goto(Urls.adminUrl + '/admin/login');

    // Wait for page to load
    await page.waitForURL('**/admin/login');
    await page.waitForLoadState('domcontentloaded');

    console.log('📄 Admin login page loaded');

    // Fill in admin email - .env থেকে email নিচ্ছি
    const adminEmail = Urls.adminEmail;
    await page.locator('#login-email').fill(adminEmail);
    console.log(`✍️  Admin email filled: ${adminEmail}`);

    // Fill in admin password - .env থেকে password নিচ্ছি
    const adminPassword = Urls.adminPassword;
    await page.locator('#login-password').fill(adminPassword);
    console.log('✍️  Admin password filled');

    // Accept Privacy Policy if visible
    const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
    if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
        await privacyPolicy.click();
        console.log('✅ Privacy Policy accepted');
    }

    // Click Sign In button
    await expect(page.locator("//button[@type='submit']")).toBeVisible();
    await page.locator("//button[@type='submit']").click();
    console.log('🖱️  Sign In button clicked');

    // Wait for successful login
    await page.waitForURL('**/admin');
    await expect(page).toHaveURL(/\/admin$/);
    console.log('✅ Admin logged in successfully');

    // Save authentication state
    await page.context().storageState({ path: adminAuthFile });
    console.log(`💾 Admin session saved to: ${adminAuthFile}\n`);
});

// ================================================================================================
// Vendor Authentication Setup
// ================================================================================================
const vendorAuthFile = 'playwright/.auth/vendor.json';

setup('authenticate vendor', async ({ page }) => {
    console.log('🔐 Vendor Authentication Starting...');

    // Navigate to vendor login page - .env থেকে full URL নিচ্ছি
    await page.goto(Urls.vendorUrl + '/vendor/login');

    // Wait for page to load
    await page.waitForURL('**/vendor/login');
    await page.waitForLoadState('domcontentloaded');

    console.log('📄 Vendor login page loaded');

    // Fill in vendor email - .env থেকে email নিচ্ছি
    const vendorEmail = Urls.vendorEmail;
    await page.locator('#login-email').fill(vendorEmail);
    console.log(`✍️  Vendor email filled: ${vendorEmail}`);

    // Fill in vendor password - .env থেকে password নিচ্ছি
    const vendorPassword = Urls.vendorPassword;
    await page.locator('#login-password').fill(vendorPassword);
    console.log('✍️  Vendor password filled');

    // Accept Privacy Policy if visible
    const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
    if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
        await privacyPolicy.click();
        console.log('✅ Privacy Policy accepted');
    }

    // Click Sign In button
    await expect(page.locator("//button[@type='submit']")).toBeVisible();
    await page.locator("//button[@type='submit']").click();
    console.log('🖱️  Sign In button clicked');

    // Wait for successful login
    await page.waitForURL('**/vendor');
    await expect(page).toHaveURL(/\/vendor$/);
    console.log('✅ Vendor logged in successfully');

    // Save authentication state
    await page.context().storageState({ path: vendorAuthFile });
    console.log(`💾 Vendor session saved to: ${vendorAuthFile}\n`);
});

// ================================================================================================
// Customer Authentication Setup
// ================================================================================================
const customerAuthFile = 'playwright/.auth/customer.json';

setup('authenticate customer', async ({ page }) => {
    console.log('🔐 Customer Authentication Starting...');

    // Navigate to customer login page - .env থেকে full URL নিচ্ছি (যদি configured থাকে)
    if (Urls.customerUrl) {
        await page.goto(Urls.customerUrl + '/login');

        // Wait for page to load
        await page.waitForURL('**/login');
        await page.waitForLoadState('domcontentloaded');

        console.log('📄 Customer login page loaded');

        // Fill in customer email - .env থেকে email নিচ্ছি (যদি থাকে)
        const customerEmail = Urls.customerEmail || 'customer@example.com';
        await page.locator('#reg-email').fill(customerEmail);
        console.log(`✍️  Customer email filled: ${customerEmail}`);

        // Fill in customer password - .env থেকে password নিচ্ছি (যদি থাকে)
        const customerPassword = Urls.customerPassword || 'password';
        await page.locator('#login-password').fill(customerPassword);
        console.log('✍️  Customer password filled');

        // Accept Privacy Policy if visible
        const privacyPolicy = page.locator("(//button[@type='button'][text()='Accept'])[1]");
        if (await privacyPolicy.isVisible({ timeout: 2000 }).catch(() => false)) {
            await privacyPolicy.click();
            console.log('✅ Privacy Policy accepted');
        }

        // Click Sign In button
        await expect(page.locator("//button[normalize-space(text())='Sign in']")).toBeVisible();
        await page.locator("//button[normalize-space(text())='Sign in']").click();
        console.log('🖱️  Sign In button clicked');

        // Wait for successful login
        await page.waitForURL('**/customers/account');
        await expect(page).toHaveURL(/\/customers\/account$/);
        console.log('✅ Customer logged in successfully');

        // Save authentication state
        await page.context().storageState({ path: customerAuthFile });
        console.log(`💾 Customer session saved to: ${customerAuthFile}\n`);
    } else {
        console.log('⚠️  Customer URL not configured in .env, skipping customer setup');
    }
});

// ================================================================================================
// Dokan Cloud Authentication Setup
// ================================================================================================
const dokanCloudAuthFile = 'playwright/.auth/dokanCloud.json';

setup('authenticate dokan cloud', async ({ page }) => {
    console.log('🔐 Dokan Cloud Authentication Starting...');

    // Check if credentials are configured (similar to customer pattern)
    if (!Urls.dokanCloudEmail || !Urls.dokanCloudPassword) {
        console.log('⚠️  Dokan Cloud credentials not configured in .env, skipping Dokan Cloud setup');
        return;
    }

    // Navigate to Dokan Cloud login page - .env থেকে full URL নিচ্ছি
    const dokanCloudUrl = Urls.dokanCloudUrl || 'https://app.dokan.co';
    await page.goto(dokanCloudUrl + '/login');

    // Wait for page to load
    await page.waitForURL('**/login');
    await page.waitForLoadState('domcontentloaded');

    console.log('📄 Dokan Cloud login page loaded');

    // Fill in Dokan Cloud email - .env থেকে email নিচ্ছি
    const dokanCloudEmail = Urls.dokanCloudEmail;
    await page.getByRole('textbox', { name: 'Enter your email' }).click();
    await page.getByRole('textbox', { name: 'Enter your email' }).fill(dokanCloudEmail);
    console.log(`✍️  Dokan Cloud email filled: ${dokanCloudEmail}`);

    // Fill in Dokan Cloud password - .env থেকে password নিচ্ছি
    const dokanCloudPassword = Urls.dokanCloudPassword;
    await page.getByRole('textbox', { name: 'Write your password' }).click();
    await page.getByRole('textbox', { name: 'Write your password' }).fill(dokanCloudPassword);
    console.log('✍️  Dokan Cloud password filled');

    // Click Sign In button
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    console.log('🖱️  Sign In button clicked');

    // Wait for successful login by checking for "My Stores" heading (more reliable than networkidle)
    // This waits for the key content to appear instead of waiting for all network activity to complete
    await expect(page.getByRole('heading', { name: 'My Stores' })).toBeVisible({ timeout: 30000 });
    console.log('✅ Dokan Cloud logged in successfully');

    // Wait for page to be fully interactive (DOM ready) before saving state
    await page.waitForLoadState('domcontentloaded');

    // Optional: Brief wait for any critical JS to execute
    await page.waitForTimeout(1000);

    // Save authentication state
    await page.context().storageState({ path: dokanCloudAuthFile });
    console.log(`💾 Dokan Cloud session saved to: ${dokanCloudAuthFile}\n`);
});

/**
 * ================================================================================================
 * Summary
 * ================================================================================================
 * 
 * When you run: npx playwright test --project=setup
 * 
 * এটি চারটি setup test চালায়:
 * 1. authenticate admin - .env এর ADMIN_URL, ADMIN_EMAIL, ADMIN_PASSWORD use করে
 * 2. authenticate vendor - .env এর VENDOR_URL, VENDOR_EMAIL, VENDOR_PASSWORD use করে
 * 3. authenticate customer - .env এর CUSTOMER_URL, CUSTOMER_EMAIL, CUSTOMER_PASSWORD use করে
 * 4. authenticate dokan cloud - .env এর DOKAN_CLOUD_URL, DOKAN_CLOUD_EMAIL, DOKAN_CLOUD_PASSWORD use করে
 * 
 * প্রতিটি setup test এর পর একটি .json file তৈরি হয়:
 * - playwright/.auth/admin.json (Admin এর cookies + localStorage)
 * - playwright/.auth/vendor.json (Vendor এর cookies + localStorage)
 * - playwright/.auth/customer.json (Customer এর cookies + localStorage)
 * - playwright/.auth/dokanCloud.json (Dokan Cloud এর cookies + localStorage)
 * 
 * এই files গুলো fixtures দ্বারা use করা হয় tests run করার সময়।
 */