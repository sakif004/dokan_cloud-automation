// adminCollectionPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class CollectionManagementPage {
    readonly page: Page;

    // Products Menu & Navigation
    readonly productsMenu: Locator;
    readonly collectionsLink: Locator;
    readonly createCollectionLink: Locator;

    // Collection Form Locators
    readonly newCollectionHeading: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly uploadImageButton: Locator;
    readonly insertMediaHeading: Locator;
    readonly uploadFilesButton: Locator;
    readonly addFromURLButton: Locator;
    readonly urlInput: Locator;
    readonly addMediaButton: Locator;
    readonly selectImageButton: Locator;
    readonly createCollectionButton: Locator;

    // Notification
    readonly successNotification: Locator;

    // Collection list & delete controls
    readonly collectionSearchInput: Locator;
    readonly collectionRowActionButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteConfirmHeading: Locator;
    readonly yesDeleteButton: Locator;
    readonly deleteSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.collectionsLink = page.getByRole('link', { name: 'Collections' });
        this.createCollectionLink = page.getByRole('link', { name: 'Create Collection' });

        // Collection Form
        this.newCollectionHeading = page.getByRole('heading', { name: 'New Collection' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.uploadImageButton = page.getByRole('button', { name: 'Upload Image' });
        this.insertMediaHeading = page.getByRole('heading', { name: 'Insert Media' });
        this.uploadFilesButton = page.getByRole('button', { name: 'Upload Files' });
        this.addFromURLButton = page.getByRole('button', { name: 'Add from URL' });
        this.urlInput = page.getByRole('textbox', { name: 'https://' });
        this.addMediaButton = page.getByRole('button', { name: 'Add media' });
        this.selectImageButton = page.getByRole('button', { name: 'Select' });
        this.createCollectionButton = page.getByRole('button', { name: 'Create Collection' });

        // Notification
        this.successNotification = page.getByText('Created Successfully');

        // Collection list & delete controls
        this.collectionSearchInput = page.getByRole('textbox', { name: 'Search Collections...' });
        this.collectionRowActionButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.deleteConfirmHeading = page.getByRole('heading', { name: 'Are you sure want to delete' });
        this.yesDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
        this.deleteSuccessMessage = page.getByText('Collection has been deleted.');
    }

    /**
     * Navigate to Collections page
     */
    async navigateToCollections() {
        await this.page.waitForLoadState('domcontentloaded');
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.collectionsLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click Create Collection button to open form
     */
    async openCreateCollectionForm() {
        await this.createCollectionLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.newCollectionHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill collection name
     */
    async fillCollectionName(name: string) {
        await this.nameInput.click();
        await this.nameInput.fill(name);
    }

    /**
     * Fill collection description
     */
    async fillCollectionDescription(description: string) {
        await this.descriptionInput.click();
        await this.descriptionInput.fill(description);
    }

    /**
     * Upload collection image from URL
     */
    async uploadCollectionImageFromURL(imageUrl: string) {
        // Click Upload Image button
        await this.uploadImageButton.click();
        await expect(this.insertMediaHeading).toBeVisible({ timeout: 10000 });

        // Click Upload Files button
        await this.uploadFilesButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Click Add from URL
        await this.addFromURLButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Fill URL
        await this.urlInput.fill(imageUrl);

        // Click Add media button
        await this.addMediaButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Select the image
        await this.selectImageButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Submit collection form
     */
    async submitCollectionForm() {
        await this.createCollectionButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify collection creation success via notification
     */
    async verifyCollectionCreatedSuccessfully() {
        await expect(this.successNotification).toBeVisible({ timeout: 10000 });
    }

    /**
     * Create collection with complete information (convenience method)
     */
    async createCollection(collectionData: {
        name: string;
        description: string;
        imageUrl: string;
    }) {
        await this.navigateToCollections();
        await this.openCreateCollectionForm();
        await this.fillCollectionName(collectionData.name);
        await this.fillCollectionDescription(collectionData.description);
        await this.uploadCollectionImageFromURL(collectionData.imageUrl);
        await this.submitCollectionForm();
    }

    /**
     * Verify on collections list page
     */
    async verifyOnCollectionsListPage() {
        const collectionsHeading = this.page.getByRole('heading', { name: /Collections/i });
        await expect(collectionsHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search for collection in the list
     */
    async searchCollectionByName(collectionName: string) {
        const searchInput = this.page.getByPlaceholder(/search/i).first();
        await searchInput.fill(collectionName);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify collection exists in the list
     */
    async verifyCollectionInList(collectionName: string) {
        const collectionRow = this.page.locator(`text=${collectionName}`);
        await expect(collectionRow).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search collection by name using search bar (for delete flow)
     */
    async searchCollectionByNameForDelete(collectionName: string) {
        await this.collectionSearchInput.click();
        await this.collectionSearchInput.fill(collectionName);
        await this.collectionSearchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Open delete dialog for the first collection in the result list
     */
    async openDeleteDialogForFirstResult() {
        await this.collectionRowActionButton.click();
        await this.deleteButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.deleteConfirmHeading).toBeVisible();
    }

    /**
     * Confirm collection deletion
     */
    async confirmDeleteCollection() {
        await this.yesDeleteButton.click();
    }

    /**
     * Verify collection deletion success message
     */
    async verifyCollectionDeleted() {
        await expect(this.deleteSuccessMessage).toBeVisible();
    }

    /**
     * Full delete flow: search, open dialog, confirm, verify
     */
    async deleteCollectionByName(collectionName: string) {
        await this.navigateToCollections();
        await this.searchCollectionByNameForDelete(collectionName);
        await this.openDeleteDialogForFirstResult();
        await this.confirmDeleteCollection();
        await this.verifyCollectionDeleted();
    }
}