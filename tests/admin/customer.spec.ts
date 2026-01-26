import { test, expect } from '@playwright/test';

test('Customer page all testcases', async ({ page }) => {
    await page.goto('https://amazonbd2.staging.dokandev.com/admin/login');
    await page.getByRole('textbox', { name: 'Email Address' }).click();
    await page.getByRole('textbox', { name: 'Email Address' }).fill('sakifur@wedevs.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('FahimTest004');
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.getByRole('link', { name: 'Customers' }).click();
    await expect(page.locator('//h1[text()="Customers"]')).toBeVisible();

    //create customer from admin panel and it workes
    // await page.getByRole('button', { name: 'Add Customer' }).click();
    // await page.getByRole('textbox', { name: 'First Name' }).click();
    // await page.getByRole('textbox', { name: 'First Name' }).fill('Test Customer');
    // await page.getByRole('textbox', { name: 'Last Name' }).click();
    // await page.getByRole('textbox', { name: 'Last Name' }).fill('From Admin');
    // await page.getByRole('textbox', { name: 'Email' }).click();
    // await page.getByRole('textbox', { name: 'Email' }).fill('testcustomerfromadmin@gmail.com');
    // await page.getByRole('textbox', { name: 'Phone' }).click();
    // await page.getByRole('textbox', { name: 'Phone' }).fill('0123456789');
    // await expect(page.getByText('PasswordGenerate Password')).toBeVisible();
    // await page.getByText('Generate Password').click();
    // await page.getByRole('button', { name: 'Create' }).click();
    // await expect(page.getByText('Customer created successfully')).toBeVisible();



    //not working for view customer locator
    // await page.getByRole('textbox', { name: 'Search Customers...' }).click();
    // await page.getByRole('textbox', { name: 'Search Customers...' }).fill('from admin');
    // await page.getByRole('textbox', { name: 'Search Customers...' }).press('Enter');
    // await expect(page.getByRole('cell', { name: 'Test Customer From Admin' })).toBeVisible();


    // await page.locator("//button[contains(@class,'hover:bg-primary-50 flex')]").click();
    // await page.waitForLoadState('domcontentloaded');
    // await page.waitForTimeout(1000);
    // await page.locator("//div[contains(@class,'reset z-50')]//a[1]").click();


    // await expect(page.getByRole('heading', { name: 'Test Customer From Admin' })).toBeVisible();
    // await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
    // await expect(page.getByRole('heading', { name: 'Update Customer' })).toBeVisible();
    // await expect(page.getByLabel('Update Customer')).toMatchAriaSnapshot(`
    //   - text: First Name
    //   - textbox "First Name":
    //     - /placeholder: john
    //     - text: Test Customer
    //   - text: Last Name
    //   - textbox "Last Name":
    //     - /placeholder: doe
    //     - text: From Admin
    //   - text: Email
    //   - textbox "Email":
    //     - /placeholder: john@doe.com
    //     - text: testcustomerfromadmin@gmail.com
    //   - text: Phone
    //   - textbox "Phone":
    //     - /placeholder: "+123456789"
    //     - text: /\\d+/
    //   - button "Cancel"
    //   - button "Update"
    //   `);

    // await page.getByRole('textbox', { name: 'Email' }).click();
    // await page.getByRole('textbox', { name: 'Email' }).fill('testcustomerfromadmin+1@gmail.com');
    // await page.getByRole('textbox', { name: 'Phone' }).click();
    // await page.getByRole('textbox', { name: 'Phone' }).fill('01234567890');
    // await page.getByRole('button', { name: 'Update' }).click();
    // await expect(page.getByText('Customer updated successfully')).toBeVisible();
    // await page.getByRole('button', { name: 'Reset' }).click();
    // await expect(page.getByRole('heading', { name: 'Password' })).toBeVisible();
    // await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    // await page.getByRole('textbox', { name: 'Password', exact: true }).fill('testcustomerfromadmin+1@gmail.com');
    // await page.getByRole('textbox', { name: 'Confirm Password' }).click();
    // await page.getByRole('textbox', { name: 'Confirm Password' }).fill('testcustomerfromadmin+1@gmail.com');
    // await page.getByRole('button', { name: 'Update' }).click();
    // await expect(page.getByText('Customer password updated')).toBeVisible();



    //not working for mark as test locator
    // await page.getByRole('link', { name: 'Customers' }).click();
    // await page.getByRole('textbox', { name: 'Search Customers...' }).click();
    // await page.getByRole('textbox', { name: 'Search Customers...' }).fill('from admin');
    // await page.getByRole('textbox', { name: 'Search Customers...' }).press('Enter');
    // await expect(page.getByRole('cell', { name: 'Test Customer From Admin' })).toBeVisible();
    // await page.getByRole('cell').filter({ hasText: /^$/ }).click();
    // await page.locator("(//input[@type='submit'])[1]").click();
    // await expect(page.getByText('Updated successfully')).toBeVisible();
    // await expect(page.getByRole('cell', { name: 'Test Customer From Admin Test' })).toBeVisible();



    //it works
    await page.getByRole('textbox', { name: 'Search Customers...' }).click();
    await page.getByRole('textbox', { name: 'Search Customers...' }).fill('from admin');
    await expect(page.getByRole('cell', { name: 'Test Customer From Admin' })).toBeVisible();
    await page.getByRole('cell').filter({ hasText: /^$/ }).click();
    await page.getByRole('button', { name: 'Deactive' }).click();
    await expect(page.getByText('Customer updated successfully')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Inactive' })).toBeVisible();
});