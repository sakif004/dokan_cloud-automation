import { test } from '../fixtures/auth.fixtures';
import { MarketplaceOnboardingPage } from '../../pages/e2e/marketplaceOnboardingPage';
import { SetupGuidePage } from '../../pages/e2e/setupGuidePage';

test.describe('E2E - Marketplace Creation', () => {
    test('Create Marketplace and Complete Setup Guide', async ({ dokanCloudPage }) => {
        // The onboarding redirect can be slow; extend the test timeout.
        test.setTimeout(180000);

        // Initialize page objects
        const onboardingPage = new MarketplaceOnboardingPage(dokanCloudPage.page);
        const setupGuidePage = new SetupGuidePage(dokanCloudPage.page);

        // Verify we're logged in and on My Stores page
        await dokanCloudPage.page.waitForLoadState('domcontentloaded');
        await dokanCloudPage.page.waitForLoadState('networkidle');
        await dokanCloudPage.page.waitForTimeout(1000);
        const myStoresHeading = dokanCloudPage.page.getByRole('heading', { name: 'My Stores' });
        await myStoresHeading.waitFor({ state: 'visible', timeout: 10000 });

        // Start marketplace creation
        await dokanCloudPage.page.getByRole('button', { name: 'Create New Store' }).click();

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
