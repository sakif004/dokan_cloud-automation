import { test } from '../fixtures/auth.fixtures';
import { AttributeManagementPage } from '../../pages/admin/productAttributePage';
import { randomAttributeName } from '../../utils/fakerData';

/**
 * Shared state for the 4 sequential CRUD tests.
 * attributeName is set by 'Create' and used by all subsequent tests.
 * updatedName holds the uppercase version used after the Edit step.
 */
const shared = {
    attributeName: '',
    updatedName: '',
};

test.describe.serial('Admin - Attribute Management (CRUD)', () => {

    // ─── Create ──────────────────────────────────────────────────────────────
    test('Create Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Generate a unique attribute name to avoid conflicts on repeated runs
        shared.attributeName = randomAttributeName();
        shared.updatedName = shared.attributeName.toUpperCase();

        // Create attribute with Multiselect type and initial options S, M, L
        await attributePage.createAttribute({
            name: shared.attributeName,
            type: 'Multiselect',
            options: ['S', 'M', 'L'],
        });
    });

    // ─── Read / Search ────────────────────────────────────────────────────────
    test('Search and verify Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Navigate to attributes list
        await attributePage.navigateToAttributes();

        // Search by lowercase name (search is case-insensitive)
        await attributePage.searchAttribute(shared.attributeName.toLowerCase());

        // Verify the attribute appears in the list
        await attributePage.verifyAttributeInList(shared.attributeName);
    });

    // ─── Update ───────────────────────────────────────────────────────────────
    test('Edit Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Navigate and find the created attribute
        await attributePage.navigateToAttributes();
        await attributePage.searchAttribute(shared.attributeName.toLowerCase());

        // Edit: rename to uppercase, add option XL, set default to M
        await attributePage.editAttribute({
            name: shared.updatedName,
            newOptions: ['XL'],
            defaultOption: 'M',
        });

        // Verify the updated name appears in the list
        await attributePage.searchAttribute(shared.updatedName.toLowerCase());
        await attributePage.verifyAttributeInList(shared.updatedName);
    });

    // ─── Delete ───────────────────────────────────────────────────────────────
    test('Delete Attribute', async ({ adminPage }) => {
        // Initialize page object
        const attributePage = new AttributeManagementPage(adminPage.page);

        // Navigate and find the updated attribute
        await attributePage.navigateToAttributes();
        await attributePage.searchAttribute(shared.updatedName.toLowerCase());

        // Delete and confirm
        await attributePage.deleteAttribute();
    });

});
