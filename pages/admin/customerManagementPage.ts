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
     * Create customer with provided details
     */
    async createCustomer(customerData: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
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

        // Generate password
        await expect(this.generatePasswordText).toBeVisible();
        await this.generatePasswordButton.click();

        // Create customer
        await this.createButton.click();
        await expect(this.customerCreatedMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Search customer by name
     */
    async searchCustomer(searchTerm: string) {
        await this.searchCustomersInput.click();
        await this.searchCustomersInput.fill(searchTerm);
        await this.searchCustomersInput.press('Enter');
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
        // await this.page.waitForLoadState('networkidle');
        // await this.page.waitForLoadState('domcontentloaded');
        // await this.page.waitForTimeout(1000);
        // await this.actionButton.click();
        await this.testCustomerCell.click();
        // await this.page.locator("(//table//tr//td//div//button)[1]").click();
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
        await this.testCustomerCell.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        await this.markAsTestButton.click();
        await expect(this.updateSuccessfullyMessage).toBeVisible({ timeout: 10000 });
    }

    /**
     * Deactivate customer
     */
    async deactivateCustomer() {
        // await this.actionButton.click();
        await this.testCustomerCell.click();
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

        // Search and view customer
        const searchTerm = customerData.lastName;
        await this.searchCustomer(searchTerm);
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

        // Mark as test
        await this.navigateToCustomers();
        await this.searchCustomer(searchTerm);
        await this.markAsTest();

        // Deactivate customer
        await this.deactivateCustomer();
    }
}