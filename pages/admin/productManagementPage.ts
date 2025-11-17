import { expect, Locator, Page } from '@playwright/test';

export class ProductManagementPage {
    readonly page: Page;

    private readonly productsMenu: Locator;
    private readonly allProductsLink: Locator;
    private readonly searchInput: Locator;
    private readonly allProductsSelectCheckbox: Locator;
    private readonly deleteButton: Locator;
    private readonly deleteConfirmationText: Locator;
    private readonly deleteSuccessMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation controls
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.allProductsLink = page.getByRole('link', { name: 'All Products' });

        // Product search
        this.searchInput = page.getByRole('textbox', { name: 'Search Products...' });

        // Bulk actions
        this.allProductsSelectCheckbox = page.locator('input#check-all-products');

        // Delete actions and confirmation
        this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
        this.deleteConfirmationText = page.locator('body');
        this.deleteSuccessMessage = page.getByText('Products deleted successfully.', { exact: true });
    }

    async navigateToAllProducts() {
        // Open Products menu in sidebar
        await this.productsMenu.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');

        // Navigate to All Products page
        await this.allProductsLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    async searchProductByName(productName: string) {
        // Focus on search box
        await this.searchInput.click();
        // Enter product name
        await this.searchInput.fill(productName);
        // Trigger search results
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async selectAllProductsFromResult() {
        // Select all search results
        await this.allProductsSelectCheckbox.check();
    }

    async openDeleteConfirmation() {
        // Click Delete button to open confirmation dialog
        await this.deleteButton.click();
        // Validate confirmation appears
        await expect(this.deleteConfirmationText).toContainText('Delete');
    }

    async confirmDeletion() {
        // Confirm deletion within dialog
        await this.deleteButton.click();
    }

    async verifyProductDeleted() {
        // Ensure success toast/message appears
        await expect(this.deleteSuccessMessage).toBeVisible({ timeout: 10000 });
    }

    async deleteProduct(productName: string) {
        // Navigate to All Products list
        await this.navigateToAllProducts();
        // Search for target product
        await this.searchProductByName(productName);
        // Select products from search result
        await this.selectAllProductsFromResult();
        // Open confirmation modal
        await this.openDeleteConfirmation();
        // Confirm deletion
        await this.confirmDeletion();
    }
}