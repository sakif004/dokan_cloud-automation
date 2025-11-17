import { test } from '../fixtures/auth.fixtures';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';

test.describe('Admin - Collection Management', () => {
    test('Delete collection by name', async ({ adminPage }) => {
        const collectionPage = new CollectionManagementPage(adminPage.page);
        const collectionName = 'Test Collection';

        await collectionPage.deleteCollectionByName(collectionName);
    });
});