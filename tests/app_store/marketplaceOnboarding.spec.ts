import { test } from '../fixtures/auth.fixtures';
import { expect } from '@playwright/test';
import { MarketplaceOnboardingPage } from '../../pages/app_store/marketplaceOnboardingPage';

test.describe('App Store - Marketplace Onboarding', () => {
    test('Create Marketplace', async ({ dokanCloudPage }) => {
        // The onboarding redirect can be slow; extend the test timeout.
        test.setTimeout(180000);

        // Initialize page object
        const onboardingPage = new MarketplaceOnboardingPage(dokanCloudPage.page);

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
            marketplaceName: 'AmazonBD2',
            buildKnowledge: 'I know what I want to build,',
            teamSize: '- 100 people',
            businessStatus: 'I haven\'t started a business',
            country: 'Bangladesh',
            address: 'weDevs Academy',
        });

        // Verify redirect to new store's setup guide
        const postOnboardUrlPattern = /https:\/\/.*\.ondokan\.com\/admin\/(welcome|setup-guide)\/?/;
        await expect(dokanCloudPage.page).toHaveURL(postOnboardUrlPattern);
    });
});
