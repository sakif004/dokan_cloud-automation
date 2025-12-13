import { test } from '@playwright/test';
import { DokanCloudLoginPage } from '../../pages/e2e/dokanCloudLoginPage';
import { MarketplaceOnboardingPage } from '../../pages/e2e/marketplaceOnboardingPage';
import { SetupGuidePage } from '../../pages/e2e/setupGuidePage';

test.describe('E2E - Marketplace Creation', () => {
    test('Create Marketplace and Complete Setup Guide', async ({ page }) => {
        // The onboarding redirect can be slow; extend the test timeout.
        test.setTimeout(180000);

        // Initialize page objects
        const loginPage = new DokanCloudLoginPage(page);
        const onboardingPage = new MarketplaceOnboardingPage(page);
        const setupGuidePage = new SetupGuidePage(page);

        // Login to Dokan Cloud
        // TODO: Move credentials to .env file (DOKAN_CLOUD_EMAIL, DOKAN_CLOUD_PASSWORD)
        await loginPage.login('sakifur@wedevs.com', 'sakifur@wedevs.com');
        await loginPage.verifyLoggedIn();

        // Start marketplace creation
        await loginPage.clickCreateNewStore();

        // Complete onboarding flow
        await onboardingPage.completeOnboarding({
            marketplaceName: 'AmazonBD',
            buildKnowledge: 'I know what I want to build,',
            teamSize: '- 100 people',
            businessStatus: 'I haven\'t started a business',
            country: 'Bangladesh',
            address: 'weDevs Academy',
        });

        // Complete setup guide
        await setupGuidePage.completeSetupGuide({
            phoneNo: '01970741571',
            brand: {
                logoUrl: 'https://cdn.techinasia.com/wp-content/uploads/2016/12/resized-750x545.jpg',
                faviconUrl: 'https://img.freepik.com/free-vector/abstract-company-logo_53876-120501.jpg?semt=ais_hybrid&w=740&q=80',
            },
            payment: {
                title: 'Cash On Delivery',
                description: 'COD Description',
            },
            payout: {
                flat: '2',
                percentage: '0.5',
            },
        });
    });
});
