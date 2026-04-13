import { expect, Locator, Page } from '@playwright/test';
import { ChatManager } from '../../pages/common/chatManager';


export class CustomerManagementPage {
    readonly page: Page;
    readonly chatManager: ChatManager;


    // Customers List Page Locators
    readonly customersHeading: Locator;
    readonly addCustomerButton: Locator;
    readonly searchCustomersInput: Locator;

    // Add Customer Modal Locators
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly generatePasswordText: Locator;
    readonly generatePasswordButton: Locator;
    readonly createPasswordInput: Locator;       // password field in Add Customer modal (placeholder: ******** )
    readonly createConfirmPasswordInput: Locator; // confirm password field in Add Customer modal
    readonly createButton: Locator;
    readonly customerCreatedMessage: Locator;

    // View Customer Page Locators
    readonly customerNameHeading: Locator;
    readonly editButton: Locator;
    readonly updateCustomerHeading: Locator;
    readonly updateButton: Locator;
    readonly customerUpdatedMessage: Locator;
    readonly resetButton: Locator;

    // Reset Password Modal Locators
    readonly passwordHeading: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly updatePasswordButton: Locator;
    readonly passwordUpdatedMessage: Locator;

    // Customer Actions Locators
    readonly actionButton: Locator;
    readonly tableActionButton: Locator;
    readonly deactiveButton: Locator;
    readonly customerInactiveCell: Locator;
    readonly updateSuccessfullyMessage: Locator;
    readonly testCustomerCell: Locator;
    readonly markAsTestButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.chatManager = new ChatManager(page);


        // Customers List Page
        this.customersHeading = page.locator('//h1[text()="Customers"]');
        this.addCustomerButton = page.getByRole('button', { name: 'Add Customer' });
        this.searchCustomersInput = page.getByRole('textbox', { name: 'Search Customers...' });

        // Add Customer Modal
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
        this.generatePasswordText = page.getByText('PasswordGenerate Password');
        this.generatePasswordButton = page.getByText('Generate Password');
        // Placeholder is literal asterisks — the field has no accessible label other than placeholder
        this.createPasswordInput = page.getByRole('textbox', { name: '********' });
        this.createConfirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.customerCreatedMessage = page.getByText('Customer created successfully');

        // View Customer Page
        this.customerNameHeading = page.getByRole('heading', { name: /.*/ });
        this.editButton = page.locator("(//h4[text()='Overview']/following-sibling::button)[1]");
        this.updateCustomerHeading = page.getByRole('heading', { name: 'Update Customer' });
        this.updateButton = page.getByRole('button', { name: 'Update' });
        this.customerUpdatedMessage = page.getByText('Customer updated successfully');
        this.resetButton = page.getByRole('button', { name: 'Reset' });

        // Reset Password Modal
        this.passwordHeading = page.getByRole('heading', { name: 'Password' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
        this.updatePasswordButton = page.getByRole('button', { name: 'Update' });
        this.passwordUpdatedMessage = page.getByText('Customer password updated');

        // Customer Actions
        this.actionButton = page.locator("(//table//tr//td//div//button)[1]");
        // Scoped to the table — finds the icon-only action button in the first result row
        this.tableActionButton = page.getByRole('table').getByRole('button').filter({ hasText: /^$/ }).first();
        this.deactiveButton = page.getByRole('button', { name: 'Deactive' });
        this.customerInactiveCell = page.getByRole('cell', { name: 'Inactive' });
        this.updateSuccessfullyMessage = page.getByText('Updated successfully');
        this.testCustomerCell = page.getByRole('cell').filter({ hasText: /^$/ });
        this.markAsTestButton = page.locator("(//input[@type='submit'])[1]");
    }

    /**
     * Navigate to Customers page
     */
    async navigateToCustomers() {
        await this.page.getByRole('link', { name: 'Customers' }).click();
        await expect(this.customersHeading).toBeVisible({ timeout: 10000 });

        // Close chat using ChatManager
        await this.chatManager.closeChat();
    }

    /**
     * Create customer with provided details.
     *
     * @param customerData.password — optional. If provided, fills the password field directly
     *   (used by seedData.spec.ts to set known credentials for journey customer account).
     *   If omitted, clicks "Generate Password" to auto-generate (used by CRUD tests).
     */
    async createCustomer(customerData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password?: string;
    }) {
        // Click Add Customer button
        await this.addCustomerButton.click();

        // Fill customer details
        await this.firstNameInput.click();
        await this.firstNameInput.fill(customerData.firstName);

        await this.lastNameInput.click();
        await this.lastNameInput.fill(customerData.lastName);

        await this.emailInput.click();
        await this.emailInput.fill(customerData.email);

        await this.phoneInput.click();
        await this.phoneInput.fill(customerData.phone);

        // Password: fill explicitly if provided (journey account), otherwise auto-generate
        await expect(this.generatePasswordText).toBeVisible();
        if (customerData.password) {
            // Fill both password + confirm password — sets known credentials for later auth setup
            await this.createPasswordInput.click();
            await this.createPasswordInput.fill(customerData.password);
            await this.createConfirmPasswordInput.click();
            await this.createConfirmPasswordInput.fill(customerData.password);
        } else {
            // Auto-generate password (CRUD test path — no need to know the actual value)
            await this.generatePasswordButton.click();
        }

        // Create customer
        await this.createButton.click();
    }

    /**
     * Verify customer was created successfully via toast notification
     */
    async verifyCustomerCreatedSuccessfully() {
        await expect(this.customerCreatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search customer by email
     */
    async searchCustomer(searchTerm: string) {
        await this.searchCustomersInput.click();
        await this.searchCustomersInput.fill(searchTerm);
        await this.searchCustomersInput.press('Enter');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify customer appears in list
     */
    async verifyCustomerInList(customerName: string) {
        await expect(this.page.getByRole('cell', { name: customerName })).toBeVisible({ timeout: 10000 });
    }

    /**
     * View customer details
     */
    async viewCustomer() {
        // Click the action button in the table row to reveal the dropdown menu
        await this.tableActionButton.click();
        await this.page.waitForTimeout(300);
        await this.page.getByRole('link', { name: 'View Customer' }).click();
    }

    /**
     * Verify customer details page
     */
    async verifyCustomerDetailsPage(customerName: string) {
        await expect(this.page.getByRole('heading', { name: customerName })).toBeVisible({ timeout: 10000 });
    }

    /**
     * Edit customer details
     */
    async editCustomerDetails(updates: {
        email: string;
        phone: string;
    }) {
        // Click edit button
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await this.editButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await expect(this.updateCustomerHeading).toBeVisible();

        // Update email
        await this.emailInput.click();
        await this.emailInput.fill(updates.email);

        // Update phone
        await this.phoneInput.click();
        await this.phoneInput.fill(updates.phone);

        // Update customer
        await this.updateButton.click();
        await expect(this.customerUpdatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Reset customer password
     */
    async resetPassword(newPassword: string) {
        await this.resetButton.click();
        await expect(this.passwordHeading).toBeVisible();

        // Fill password
        await this.passwordInput.click();
        await this.passwordInput.fill(newPassword);

        // Fill confirm password
        await this.confirmPasswordInput.click();
        await this.confirmPasswordInput.fill(newPassword);

        // Update password
        await this.updatePasswordButton.click();
        await expect(this.passwordUpdatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Mark customer as test
     */
    async markAsTest() {
        // Click the action button in the table row to reveal the dropdown menu
        await this.tableActionButton.click();
        await this.page.waitForTimeout(300);
        await this.markAsTestButton.click();
        await expect(this.updateSuccessfullyMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Deactivate customer
     */
    async deactivateCustomer() {
        // Click the action button in the table row to reveal the dropdown menu
        await this.tableActionButton.click();
        await this.page.waitForTimeout(300);
        await this.deactiveButton.click();
        await expect(this.customerUpdatedMessage).toBeVisible({ timeout: 10000 });
        await expect(this.customerInactiveCell).toBeVisible({ timeout: 10000 });
    }

    /**
     * Complete full customer workflow
     */
    async completeCustomerWorkflow(customerData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        updatedEmail: string;
        updatedPhone: string;
        password: string;
    }) {
        // Navigate and create customer
        await this.navigateToCustomers();
        await this.createCustomer({
            firstName: customerData.firstName,
            lastName: customerData.lastName,
            email: customerData.email,
            phone: customerData.phone,
        });
        await this.verifyCustomerCreatedSuccessfully();

        // Search and view customer by email (unique identifier)
        await this.searchCustomer(customerData.email);
        await this.verifyCustomerInList(`${customerData.firstName} ${customerData.lastName}`);
        await this.viewCustomer();

        // Verify and edit customer
        await this.verifyCustomerDetailsPage(`${customerData.firstName} ${customerData.lastName}`);
        await this.editCustomerDetails({
            email: customerData.updatedEmail,
            phone: customerData.updatedPhone,
        });

        // Reset password
        await this.resetPassword(customerData.password);

        // Mark as test — search by updatedEmail since email was changed in the edit step
        await this.navigateToCustomers();
        await this.searchCustomer(customerData.updatedEmail);
        await this.markAsTest();

        // Deactivate customer — navigate back and re-search to ensure clean page state
        // (avoids stale dropdown from the markAsTest action button click)
        await this.navigateToCustomers();
        await this.searchCustomer(customerData.updatedEmail);
        await this.deactivateCustomer();
    }
}