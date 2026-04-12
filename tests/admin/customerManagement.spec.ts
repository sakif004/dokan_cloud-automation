import { test } from '../fixtures/auth.fixtures';
import { CustomerManagementPage } from '../../pages/admin/customerManagementPage';
import { generateCustomerData, randomEmail, randomPhone } from '../../utils/fakerData';

/**
 * Shared state for the 6 sequential individual tests.
 * Set by 'Create customer', read by all subsequent tests so they always
 * target the exact customer created in that run — even when multiple
 * customers exist in the list from previous runs.
 */
const shared = {
  firstName: '',
  lastName: '',
  email: '',
  updatedEmail: '',
  fullName: () => `${shared.firstName} ${shared.lastName}`,  // used for verifyCustomerInList
};

test.describe('Admin - Customer Management', () => {

  // ─── Self-contained workflow (independent of shared state) ────────────────
  test('Complete customer workflow - Create, Update, Reset Password, Mark as Test, Deactivate', async ({ adminPage }) => {
    // Extend timeout — this workflow has 12+ sequential steps with network waits
    test.setTimeout(90000);

    // Initialize page object with authenticated admin page
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Fully random customer — unique per run, no conflicts
    const { firstName, lastName, email, phone, password } = generateCustomerData();
    const customerData = {
      firstName,
      lastName,
      email,
      phone,
      updatedEmail: randomEmail(),    // different random email for the edit step
      updatedPhone: randomPhone(),
      password,
    };

    // Execute complete customer workflow
    await customerPage.completeCustomerWorkflow(customerData);
  });

  // ─── Sequential individual tests — share the customer created below ────────
  test.describe.serial('Individual customer lifecycle', () => {

    test('Create customer', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Generate a fully unique customer for this run
      // Name is random so searches below always find exactly this customer
      const { firstName, lastName, email, phone } = generateCustomerData();

      // Save to shared so all subsequent tests target this exact customer
      shared.firstName = firstName;
      shared.lastName = lastName;
      shared.email = email;

      const customerData = { firstName, lastName, email, phone };

      // Navigate and create customer
      await customerPage.navigateToCustomers();
      await customerPage.createCustomer(customerData);
    });

    test('Search and view customer', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Navigate to customers
      await customerPage.navigateToCustomers();

      // Search by email — unique, returns exactly this customer
      await customerPage.searchCustomer(shared.email);

      // Verify customer in list
      await customerPage.verifyCustomerInList(shared.fullName());

      // View customer
      await customerPage.viewCustomer();

      // Verify customer details page
      await customerPage.verifyCustomerDetailsPage(shared.fullName());
    });

    test('Edit customer details', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Navigate and search customer by original email (before edit)
      await customerPage.navigateToCustomers();
      await customerPage.searchCustomer(shared.email);
      await customerPage.viewCustomer();

      // Generate updated email and save to shared — Reset/Mark/Deactivate tests will use this
      shared.updatedEmail = randomEmail();
      const updates = {
        email: shared.updatedEmail,
        phone: randomPhone(),
      };

      // Edit customer details
      await customerPage.editCustomerDetails(updates);
    });

    test('Reset customer password', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Navigate and search by updatedEmail — email was changed in the Edit test
      await customerPage.navigateToCustomers();
      await customerPage.searchCustomer(shared.updatedEmail);
      await customerPage.viewCustomer();

      // Reset password using the updated email set in the Edit test
      await customerPage.resetPassword(shared.updatedEmail);
    });

    test('Mark customer as test', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Navigate and search by updatedEmail — email was changed in the Edit test
      await customerPage.navigateToCustomers();
      await customerPage.searchCustomer(shared.updatedEmail);

      // Mark as test
      await customerPage.markAsTest();
    });

    test('Deactivate customer', async ({ adminPage }) => {
      // Initialize page object
      const customerPage = new CustomerManagementPage(adminPage.page);

      // Navigate and search by updatedEmail — email was changed in the Edit test
      await customerPage.navigateToCustomers();
      await customerPage.searchCustomer(shared.updatedEmail);

      // Deactivate customer
      await customerPage.deactivateCustomer();
    });

  });

});
