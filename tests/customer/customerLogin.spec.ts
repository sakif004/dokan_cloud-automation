import { test, expect } from '../fixtures/auth.fixtures';
import { CustomerAuthPage } from '../../pages/customer/customerAuthPage';
import { SeedData } from '../../utils/testData';

test.describe('Customer Authentication', () => {

    // CL001: Verify session is active — fixture already navigated to storefront
    test('CL001: validateSuccessfulLogin', async ({ customerPage }) => {
        // Initialize page object
        const authPage = new CustomerAuthPage(customerPage.page);

        // Fixture navigates to Urls.customerUrl — verify session is active by going to account
        await customerPage.page.goto(`${process.env.CUSTOMER_URL}/customers/account`);
        await customerPage.page.waitForLoadState('networkidle');

        // Session should be active — no redirect to login page
        await authPage.verifyLoggedIn();
    });

    // CL002: Verify logout flow
    test('CL002: customerLogout', async ({ customerPage }) => {
        // Initialize page object
        const authPage = new CustomerAuthPage(customerPage.page);

        // Navigate to account page
        await customerPage.page.goto(`${process.env.CUSTOMER_URL}/customers/account`);
        await customerPage.page.waitForLoadState('networkidle');

        // Logout
        await authPage.logout();

        // Verify logged out — login form visible
        await authPage.verifyLoggedOut();
    });

    // CL003: Login with valid credentials
    test('CL003: loginWithEmail', async ({ customerPage }) => {
        // Initialize page object
        const authPage = new CustomerAuthPage(customerPage.page);

        // Navigate to login page
        await authPage.navigateToLogin();

        // Login with journey customer credentials (from .env via SeedData)
        await authPage.login(SeedData.customer.email, SeedData.customer.password);

        // Verify successful login
        await authPage.verifyLoggedIn();
    });

    // CL004: Validate account button visible after login
    test('CL004: validateAccountPage', async ({ customerPage }) => {
        const authPage = new CustomerAuthPage(customerPage.page);

        // Navigate to login and authenticate
        await authPage.navigateToLogin();
        await authPage.login(SeedData.customer.email, SeedData.customer.password);

        // Verify account button ("Hello Journey") is visible — confirms successful login
        await authPage.verifyLoggedIn();
    });

});
