import { test } from '../fixtures/auth.fixtures';
import { CustomerManagementPage } from '../../pages/admin/customerManagementPage';

test.describe('Admin - Customer Management', () => {
  test('Complete customer workflow - Create, Update, Reset Password, Mark as Test, Deactivate', async ({ adminPage }) => {
    // Initialize page object with authenticated admin page
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Customer data for the workflow
    const customerData = {
      firstName: 'Test Customer',
      lastName: 'From Admin',
      email: 'testcustomerfromadmin@gmail.com',
      phone: '0123456789',
      updatedEmail: 'testcustomerfromadmin+1@gmail.com',
      updatedPhone: '01234567890',
      password: 'testcustomerfromadmin+1@gmail.com',
    };

    // Execute complete customer workflow
    await customerPage.completeCustomerWorkflow(customerData);
  });

  test('Create customer', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Customer data
    const customerData = {
      firstName: 'Test Customer',
      lastName: 'From Admin',
      email: 'testcustomerfromadmin@gmail.com',
      phone: '0123456789',
    };

    // Navigate and create customer
    await customerPage.navigateToCustomers();
    await customerPage.createCustomer(customerData);
  });

  test('Search and view customer', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Navigate to customers
    await customerPage.navigateToCustomers();

    // Search customer
    await customerPage.searchCustomer('from admin');

    // Verify customer in list
    await customerPage.verifyCustomerInList('Test Customer From Admin');

    // View customer
    await customerPage.viewCustomer();

    // Verify customer details page
    await customerPage.verifyCustomerDetailsPage('Test Customer From Admin');
  });

  test('Edit customer details', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Navigate and search customer
    await customerPage.navigateToCustomers();
    await customerPage.searchCustomer('from admin');
    await customerPage.viewCustomer();

    // Edit customer details
    const updates = {
      email: 'testcustomerfromadmin+1@gmail.com',
      phone: '01234567890',
    };
    await customerPage.editCustomerDetails(updates);
  });

  test('Reset customer password', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Navigate and search customer
    await customerPage.navigateToCustomers();
    await customerPage.searchCustomer('from admin');
    await customerPage.viewCustomer();

    // Reset password
    await customerPage.resetPassword('testcustomerfromadmin+1@gmail.com');
  });

  test('Mark customer as test', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Navigate and search customer
    await customerPage.navigateToCustomers();
    await customerPage.searchCustomer('from admin');

    // Mark as test
    await customerPage.markAsTest();
  });

  test('Deactivate customer', async ({ adminPage }) => {
    // Initialize page object
    const customerPage = new CustomerManagementPage(adminPage.page);

    // Navigate and search customer
    await customerPage.navigateToCustomers();
    await customerPage.searchCustomer('from admin');

    // Deactivate customer
    await customerPage.deactivateCustomer();
  });
});