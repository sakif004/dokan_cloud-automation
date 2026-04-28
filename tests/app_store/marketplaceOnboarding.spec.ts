import { test, expect } from '../fixtures/auth.fixtures';
import { MarketplaceOnboardingPage } from '../../pages/app_store/marketplaceOnboardingPage';
import { Urls } from '../../utils/testData';
import { ciStep } from '../../utils/ciLogger';

test.describe('App Store - Marketplace Onboarding', () => {
    test('Create Marketplace', async ({ flycommercePage }) => {
        // Marketplace provisioning can be slow; extend the test timeout
        test.setTimeout(180000);
        ciStep('marketplaceSetup', 'Starting marketplace onboarding');

        // Initialize page object
        const onboardingPage = new MarketplaceOnboardingPage(flycommercePage.page);

        // Verify we're authenticated and on the My Stores page
        await flycommercePage.page.waitForLoadState('domcontentloaded');
        await flycommercePage.page.waitForLoadState('networkidle');
        await flycommercePage.page.waitForTimeout(1000);
        const myStoresHeading = flycommercePage.page.getByRole('heading', { name: 'My Stores' });
        await myStoresHeading.waitFor({ state: 'visible', timeout: 100000 });
        ciStep('marketplaceSetup', 'My Stores page ready');

        // Open the marketplace creation wizard
        await flycommercePage.page.getByRole('button', { name: 'Create New Store' }).click();
        ciStep('marketplaceSetup', 'Create New Store clicked');

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
        ciStep('marketplaceSetup', 'Onboarding form submitted');

        // Verify the creation-in-progress screen ("Hold tight...")
        await onboardingPage.verifyCreationProgress();
        ciStep('marketplaceSetup', 'Creation progress screen verified');

        // Verify the Congratulations page with both action buttons
        await onboardingPage.verifyCongratualtionsPage();
        ciStep('marketplaceSetup', 'Congratulations screen verified');

        // Click "Go to Dashboard" — opens the setup guide in a new tab
        const dashboardPage = await onboardingPage.clickGoToDashboard();
        ciStep('marketplaceSetup', 'Dashboard tab opened');

        // Verify the setup guide loaded in the new tab
        await expect(
            dashboardPage.getByRole('heading', { name: 'Setup Guide', level: 4 })
        ).toBeVisible({ timeout: 30000 });

        // Click "Preview Store" — opens the storefront in another new tab
        const storePage = await onboardingPage.clickPreviewStore();
        ciStep('marketplaceSetup', 'Preview Store tab opened');

        // Verify storefront opens on the configured environment host (prod/staging).
        const expectedHost = new URL(Urls.customerUrl).host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(storePage).toHaveURL(new RegExp(`^https?://${expectedHost}/?$`), { timeout: 30000 });
        ciStep('marketplaceSetup', `Storefront URL verified: ${expectedHost}`);
    });
});
