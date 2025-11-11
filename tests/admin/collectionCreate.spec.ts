import { test } from '../fixtures/auth.fixtures';
import { CollectionManagementPage } from '../../pages/admin/productCollectionPage';

test.describe('Admin - Collection Management', () => {
    test('Create Collection', async ({ adminPage }) => {
        const collectionData = {
            name: 'Test Collection',
            description: 'Test Collection Description',
            imageUrl: 'https://img.freepik.com/free-vector/new-collection-lettering-with-gradient-leaves-creative-inscription-leaves-center_1262-13804.jpg'
        };

        // Initialize CollectionManagementPage
        const collectionPage = new CollectionManagementPage(adminPage.page);

        // Create collection
        await collectionPage.createCollection(collectionData);

        // Verify collection was created successfully
        await collectionPage.verifyCollectionCreatedSuccessfully();
    });
});
