// adminBrandPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class BrandManagementPage {
    readonly page: Page;

    // Products Menu & Navigation
    readonly productsMenu: Locator;
    readonly brandsLink: Locator;
    readonly createBrandLink: Locator;

    // Brand Form Locators
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly uploadImageButton: Locator;
    readonly uploadFilesButton: Locator;
    readonly addFromURLButton: Locator;
    readonly urlInput: Locator;
    readonly addMediaButton: Locator;
    readonly insertMediaHeading: Locator;
    readonly selectImageButton: Locator;
    readonly saveChangesButton: Locator;

    // Notification
    readonly successNotification: Locator;

    // Brand list & delete controls
    readonly brandSearchInput: Locator;
    readonly brandRowActionButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteConfirmHeading: Locator;
    readonly yesDeleteButton: Locator;
    readonly deleteSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.brandsLink = page.getByRole('link', { name: 'Brands' });
        this.createBrandLink = page.getByRole('link', { name: 'Create Brand' });

        // Brand Form
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.uploadImageButton = page.getByRole('button', { name: 'Upload Image' });
        this.uploadFilesButton = page.getByRole('button', { name: 'Upload Files' });
        this.addFromURLButton = page.getByRole('button', { name: 'Add from URL' });
        this.urlInput = page.getByRole('textbox', { name: 'https://' });
        this.addMediaButton = page.getByRole('button', { name: 'Add media' });
        this.insertMediaHeading = page.getByRole('heading', { name: 'Insert Media' });
        this.selectImageButton = page.getByRole('button', { name: 'Select' });
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });

        // Notification
        this.successNotification = page.getByText('Brand created successfully.');

        // Brand list & delete controls
        this.brandSearchInput = page.getByRole('textbox', { name: 'Search Brand...' });
        this.brandRowActionButton = page.getByRole('table').getByRole('button').filter({ hasText: /^$/ });
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.deleteConfirmHeading = page.getByRole('heading', { name: 'Are you sure you want to' });
        this.yesDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
        this.deleteSuccessMessage = page.getByText('Brand deleted successfully.');
    }

    /**
     * Navigate to Brands page
     */
    async navigateToBrands() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.brandsLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click Create Brand button to open form
     */
    async openCreateBrandForm() {
        await this.createBrandLink.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Fill brand name
     */
    async fillBrandName(name: string) {
        await this.nameInput.click();
        await this.nameInput.fill(name);
    }

    /**
     * Fill brand description
     */
    async fillBrandDescription(description: string) {
        await this.descriptionInput.click();
        await this.descriptionInput.fill(description);
    }

    /**
     * Upload brand image from URL
     */
    async uploadBrandImageFromURL(imageUrl: string) {
        // Click Upload Image button
        await this.uploadImageButton.click();
        await this.page.waitForLoadState('domcontentloaded');

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

        // Wait for Insert Media heading
        await expect(this.insertMediaHeading).toBeVisible({ timeout: 10000 });

        // Select the image
        await this.selectImageButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Submit brand form
     */
    async submitBrandForm() {
        await this.saveChangesButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify brand creation success via notification
     */
    async verifyBrandCreatedSuccessfully() {
        await expect(this.successNotification).toBeVisible({ timeout: 10000 });
    }

    /**
     * Create brand with complete information (convenience method)
     */
    async createBrand(brandData: {
        name: string;
        description: string;
        imageUrl: string;
    }) {
        await this.navigateToBrands();
        await this.openCreateBrandForm();
        await this.fillBrandName(brandData.name);
        await this.fillBrandDescription(brandData.description);
        await this.uploadBrandImageFromURL(brandData.imageUrl);
        await this.submitBrandForm();
    }

    /**
     * Verify on brands list page
     */
    async verifyOnBrandsListPage() {
        const brandsHeading = this.page.getByRole('heading', { name: /Brands/i });
        await expect(brandsHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search for brand in the list
     */
    async searchBrandByName(brandName: string) {
        const searchInput = this.page.getByPlaceholder(/search/i).first();
        await searchInput.fill(brandName);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify brand exists in the list
     */
    async verifyBrandInList(brandName: string) {
        const brandRow = this.page.locator(`text=${brandName}`);
        await expect(brandRow).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search brand by name using the search bar (for delete flow)
     */
    async searchBrandByNameForDelete(brandName: string) {
        await this.brandSearchInput.click();
        await this.brandSearchInput.fill(brandName);
        await this.brandSearchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Open delete confirmation dialog for the first brand in the result list
     */
    async openDeleteDialogForFirstResult() {
        await this.brandRowActionButton.first().click();
        await this.deleteButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.deleteConfirmHeading).toBeVisible();
    }

    /**
     * Confirm brand deletion
     */
    async confirmDeleteBrand() {
        await this.yesDeleteButton.click();
    }

    /**
     * Verify brand deletion success message
     */
    async verifyBrandDeleted() {
        await expect(this.deleteSuccessMessage).toBeVisible();
    }

    /**
     * Full delete flow: search, open dialog, confirm, verify
     */
    async deleteBrandByName(brandName: string) {
        await this.navigateToBrands();
        await this.searchBrandByNameForDelete(brandName);
        await this.openDeleteDialogForFirstResult();
        await this.confirmDeleteBrand();
        await this.verifyBrandDeleted();
    }
}