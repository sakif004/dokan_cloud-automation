import { test } from '../fixtures/auth.fixtures';
import { SetupGuidePage } from '../../pages/admin/setupGuidePage';

test.describe('Admin - Setup Guide', () => {
    test('Complete Setup Guide', async ({ adminPage }) => {
        // The setup guide can take time; extend the test timeout.
        test.setTimeout(180000);

        // Navigate directly to the setup guide page
        const setupGuideUrl = 'https://amazonbd2.ondokan.com/admin/setup-guide';
        await adminPage.page.goto(setupGuideUrl, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });
        await adminPage.page.waitForLoadState('networkidle');
        await adminPage.page.waitForTimeout(2000);

        // Initialize page object
        const setupGuidePage = new SetupGuidePage(adminPage.page);

        // Complete setup guide
        await setupGuidePage.completeSetupGuide({
            phoneNo: '01970741571',
            postalCode: '1216',
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
