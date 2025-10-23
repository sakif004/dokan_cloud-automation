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
        await this.page.waitForLoadState('domcontentloaded');
    }

    /**
     * Fill category name
     */
    async fillCategoryName(name: string) {
        await this.nameInput.click();
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
}