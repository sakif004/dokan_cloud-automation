import { test, expect } from '../fixtures/auth.fixtures';
import { MarketplaceOnboardingPage } from '../../pages/app_store/marketplaceOnboardingPage';

test.describe('App Store - Marketplace Onboarding', () => {
    test('Create Marketplace', async ({ dokanCloudPage }) => {
        // Marketplace provisioning can be slow; extend the test timeout
        test.setTimeout(180000);

        // Initialize page object
        const onboardingPage = new MarketplaceOnboardingPage(dokanCloudPage.page);

        // Verify we're authenticated and on the My Stores page
        await dokanCloudPage.page.waitForLoadState('domcontentloaded');
        await dokanCloudPage.page.waitForLoadState('networkidle');
        await dokanCloudPage.page.waitForTimeout(1000);
        const myStoresHeading = dokanCloudPage.page.getByRole('heading', { name: 'My Stores' });
        await myStoresHeading.waitFor({ state: 'visible', timeout: 10000 });

        // Open the marketplace creation wizard
        await dokanCloudPage.page.getByRole('button', { name: 'Create New Store' }).click();

        // Complete the 4-step onboarding form and click "Finish Setup"
        await onboardingPage.completeOnboarding({
            marketplaceName: 'AmazonBD2',
            // Step 3 — exact option values from the <select> elements
            stage: "I haven't yet decided what I'm going to build",
            audience: '1 - 100 people',
            experience: "I haven't started a business before",
            country: 'Bangladesh',
            address: 'weDevs Academy',
        });

        // Verify the creation-in-progress screen ("Hold tight...")
        await onboardingPage.verifyCreationProgress();

        // Verify the Congratulations page with both action buttons
        await onboardingPage.verifyCongratualtionsPage();

        // Click "Go to Dashboard" — opens the setup guide in a new tab
        const dashboardPage = await onboardingPage.clickGoToDashboard();

        // Verify the setup guide loaded in the new tab
        await expect(
            dashboardPage.getByRole('heading', { name: 'Setup Guide', level: 4 })
        ).toBeVisible({ timeout: 30000 });

        // Click "Preview Store" — opens the storefront in another new tab
        const storePage = await onboardingPage.clickPreviewStore();

        // Verify the storefront URL matches the flycom.shop domain (subdomain is dynamic)
        await expect(storePage).toHaveURL(/\.flycom\.shop\/?$/, { timeout: 30000 });
    });
});
