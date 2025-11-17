// adminCategoryPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class CategoryManagementPage {
    readonly page: Page;

    // Products Menu & Navigation
    readonly productsMenu: Locator;
    readonly categoriesLink: Locator;
    readonly newCategoryLink: Locator;

    // Category Form Locators
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly saveChangesButton: Locator;

    // Notification
    readonly notificationRegion: Locator;
    readonly notificationListItem: Locator;

    // Category list & delete controls
    readonly categorySearchInput: Locator;
    readonly categoryRowActionButton: Locator;
    readonly deleteButton: Locator;
    readonly deleteConfirmHeading: Locator;
    readonly yesDeleteButton: Locator;
    readonly deleteSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.categoriesLink = page.getByRole('link', { name: 'Categories' });
        this.newCategoryLink = page.getByRole('link', { name: 'New Category' });

        // Category Form
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
        this.saveChangesButton = page.getByRole('button', { name: 'Save Changes' });

        // Notification
        this.notificationRegion = page.getByRole('region', { name: 'Notifications alt+T' });
        this.notificationListItem = this.notificationRegion.getByRole('listitem');

        // Category list & delete controls (used for delete flow)
        this.categorySearchInput = page.getByRole('textbox', { name: 'Search Categories...' });
        this.categoryRowActionButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
        this.deleteButton = page.getByRole('button', { name: 'Delete' });
        this.deleteConfirmHeading = page.getByRole('heading', { name: 'Are you sure want to delete' });
        this.yesDeleteButton = page.getByRole('button', { name: 'Yes, Delete' });
        this.deleteSuccessMessage = page.getByText('Category deleted.');
    }

    /**
     * Navigate to Categories page
     */
    async navigateToCategories() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.categoriesLink.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Click New Category button to open form
     */
    async openNewCategoryForm() {
        await this.newCategoryLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000); // Wait for form to be fully interactive
    }

    /**
     * Fill category name
     */
    async fillCategoryName(name: string) {
        // await this.nameInput.click();
        await this.nameInput.fill(name);
    }

    /**
     * Fill category description
     */
    async fillCategoryDescription(description: string) {
        await this.descriptionInput.click();
        await this.descriptionInput.fill(description);
    }

    /**
     * Submit category form
     */
    async submitCategoryForm() {
        await this.saveChangesButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify category creation success via notification
     */
    async verifyCategoryCreatedSuccessfully() {
        await expect(this.notificationListItem).toContainText('Category', {
            timeout: 10000
        });
    }

    /**
     * Create category with complete information (convenience method)
     */
    async createCategory(categoryData: {
        name: string;
        description: string;
    }) {
        await this.navigateToCategories();
        await this.openNewCategoryForm();
        await this.fillCategoryName(categoryData.name);
        await this.fillCategoryDescription(categoryData.description);
        await this.submitCategoryForm();
    }

    /**
     * Verify on categories list page
     */
    async verifyOnCategoriesListPage() {
        const categoriesHeading = this.page.getByRole('heading', { name: /Categories/i });
        await expect(categoriesHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search for category in the list
     */
    async searchCategoryByName(categoryName: string) {
        const searchInput = this.page.getByPlaceholder(/search/i).first();
        await searchInput.fill(categoryName);
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify category exists in the list
     */
    async verifyCategoryInList(categoryName: string) {
        const categoryRow = this.page.locator(`text=${categoryName}`);
        await expect(categoryRow).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search category by name using the categories search bar (for delete flow)
     */
    async searchCategoryByNameForDelete(categoryName: string) {
        await this.categorySearchInput.click();
        await this.categorySearchInput.fill(categoryName);
        await this.categorySearchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Open delete confirmation dialog for the first category in the result list
     */
    async openDeleteDialogForFirstResult() {
        await this.categoryRowActionButton.click();
        await this.deleteButton.click();
        await expect(this.deleteConfirmHeading).toBeVisible();
    }

    /**
     * Confirm category deletion
     */
    async confirmDeleteCategory() {
        await this.yesDeleteButton.click();
    }

    /**
     * Verify category deletion success message
     */
    async verifyCategoryDeleted() {
        await expect(this.deleteSuccessMessage).toBeVisible();
    }

    /**
     * Full delete flow: search, open dialog, confirm, verify
     */
    async deleteCategoryByName(categoryName: string) {
        await this.navigateToCategories();
        await this.searchCategoryByNameForDelete(categoryName);
        await this.openDeleteDialogForFirstResult();
        await this.confirmDeleteCategory();
        await this.verifyCategoryDeleted();
    }
}