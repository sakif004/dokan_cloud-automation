// pages/admin/productAttributePage.ts
import { expect, Locator, Page } from '@playwright/test';

export class AttributeManagementPage {
    readonly page: Page;

    // ─── Navigation ───────────────────────────────────────────────────────────
    readonly productsMenu: Locator;
    readonly attributesLink: Locator;
    readonly attributesHeading: Locator;

    // ─── Attribute List ───────────────────────────────────────────────────────
    readonly createAttributeButton: Locator;
    readonly searchInput: Locator;

    // ─── Table Action ─────────────────────────────────────────────────────────
    // Scoped to table to avoid matching other empty buttons on the page
    readonly tableActionButton: Locator;

    // ─── Create / Update Form ─────────────────────────────────────────────────
    readonly createAttributeHeading: Locator;
    readonly updateAttributeHeading: Locator;
    readonly nameInput: Locator;
    readonly typeDropdownTrigger: Locator;    // React Select — defaults to 'Text'
    readonly optionsInput: Locator;
    readonly defaultOptionsDropdown: Locator; // React Select — for default option
    readonly createButton: Locator;
    readonly updateButton: Locator;

    // ─── Action Buttons (dropdown) ────────────────────────────────────────────
    readonly editButton: Locator;
    readonly deleteButton: Locator;

    // ─── Confirm Delete Dialog ────────────────────────────────────────────────
    readonly deleteConfirmText: Locator;

    // ─── Success Messages ─────────────────────────────────────────────────────
    readonly attributeCreatedMessage: Locator;
    readonly attributeUpdatedMessage: Locator;
    readonly attributeDeletedMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.attributesLink = page.getByRole('link', { name: 'Attributes' });
        this.attributesHeading = page.getByRole('heading', { name: 'Attributes' });

        // Attribute list
        this.createAttributeButton = page.getByRole('button', { name: 'Create Attribute' });
        this.searchInput = page.getByRole('textbox', { name: 'Press enter to search...' });

        // Table action button (three-dot / kebab menu per row)
        this.tableActionButton = page.getByRole('table').getByRole('button').filter({ hasText: /^$/ }).first();

        // Create / Update form
        this.createAttributeHeading = page.getByRole('heading', { name: 'Create Attribute' });
        this.updateAttributeHeading = page.getByRole('heading', { name: 'Update Attribute' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        // React Select for type — codegen uses nth(5) on the 'Text' div; fragile if layout changes
        this.typeDropdownTrigger = page.locator('div').filter({ hasText: 'Text' }).nth(5);
        this.optionsInput = page.getByRole('textbox', { name: 'Options' });
        // React Select for default option — combined label + placeholder text
        this.defaultOptionsDropdown = page.getByText('Default OptionsSelect type');
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.updateButton = page.getByRole('button', { name: 'Update' });

        // Dropdown actions
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.deleteButton = page.getByRole('button', { name: 'Delete' });

        // Confirm dialog
        this.deleteConfirmText = page.getByText('Are you sure want to delete');

        // Success messages
        this.attributeCreatedMessage = page.getByText('Attribute Created Successfully');
        this.attributeUpdatedMessage = page.getByText('Attribute Updated Successfully');
        this.attributeDeletedMessage = page.getByText('Attribute deleted successfully');
    }

    // ─── Navigation ───────────────────────────────────────────────────────────

    async navigateToAttributes() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.attributesLink).toBeVisible({ timeout: 10000 });
        await this.attributesLink.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.attributesHeading).toBeVisible({ timeout: 10000 });
    }

    // ─── Search ───────────────────────────────────────────────────────────────

    async searchAttribute(searchTerm: string) {
        await this.searchInput.click();
        await this.searchInput.fill(searchTerm);
        await this.searchInput.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(500);
    }

    async verifyAttributeInList(attributeName: string) {
        await expect(this.page.getByRole('cell', { name: attributeName })).toBeVisible({ timeout: 10000 });
    }

    // ─── Create ───────────────────────────────────────────────────────────────

    async openCreateAttributeForm() {
        await this.createAttributeButton.click();
        await expect(this.createAttributeHeading).toBeVisible({ timeout: 10000 });
    }

    async fillAttributeName(name: string) {
        await this.nameInput.click();
        await this.nameInput.fill(name);
    }

    async selectAttributeType(type: string) {
        // Click the React Select trigger (shows current value) then pick the option
        await this.typeDropdownTrigger.click();
        await this.page.waitForTimeout(300);
        await this.page.getByRole('option', { name: type }).click();
    }

    async addOption(option: string) {
        await this.optionsInput.click();
        await this.optionsInput.fill(option);
        await this.optionsInput.press('Enter');
    }

    async addOptions(options: string[]) {
        for (const option of options) {
            await this.addOption(option);
        }
    }

    async submitCreateForm() {
        await this.createButton.click();
        await expect(this.attributeCreatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Full create attribute flow: navigate → open form → fill → submit.
     */
    async createAttribute(data: { name: string; type: string; options: string[] }) {
        await this.navigateToAttributes();
        await this.openCreateAttributeForm();
        await this.fillAttributeName(data.name);
        await this.selectAttributeType(data.type);
        await this.addOptions(data.options);
        await this.submitCreateForm();
    }

    // ─── Edit ─────────────────────────────────────────────────────────────────

    async openEditForm() {
        await this.tableActionButton.click();
        await this.page.waitForTimeout(300);
        await this.editButton.click();
        await expect(this.updateAttributeHeading).toBeVisible({ timeout: 10000 });
    }

    async setDefaultOption(option: string) {
        await this.defaultOptionsDropdown.click();
        await this.page.waitForTimeout(300);
        await this.page.getByRole('option', { name: option }).click();
    }

    async submitUpdateForm() {
        await this.updateButton.click();
        await expect(this.attributeUpdatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Opens the edit form for the first row, updates name / adds options /
     * sets default option, then submits.
     */
    async editAttribute(updates: {
        name: string;
        newOptions?: string[];
        defaultOption?: string;
    }) {
        await this.openEditForm();
        await this.fillAttributeName(updates.name);
        if (updates.newOptions) {
            await this.addOptions(updates.newOptions);
        }
        if (updates.defaultOption) {
            await this.setDefaultOption(updates.defaultOption);
        }
        await this.submitUpdateForm();
    }

    // ─── Delete ───────────────────────────────────────────────────────────────

    /**
     * Clicks the row action menu → Delete → confirms in the modal.
     */
    async deleteAttribute() {
        await this.tableActionButton.click();
        await this.page.waitForTimeout(300);
        await this.deleteButton.click();
        // Confirm dialog appears — wait for it then confirm
        await expect(this.deleteConfirmText).toBeVisible({ timeout: 10000 });
        await this.deleteButton.click();
        await expect(this.attributeDeletedMessage).toBeVisible({ timeout: 10000 });
    }
}
