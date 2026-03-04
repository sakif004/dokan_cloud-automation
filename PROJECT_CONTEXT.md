# Project Context for AI Agents

## 📋 Project Overview

This is an **end-to-end automation testing framework** for the **Dokan e-commerce platform** using **Playwright** and **TypeScript**. The project follows a **Page Object Model (POM)** architecture with custom fixtures for authentication management across multiple roles and domains.

### Key Features
- **Multi-Domain Testing**: Tests across main Dokan site and Dokan Cloud (app.dokan.co)
- **Role-Based Authentication**: Admin, Vendor, Customer, and Dokan Cloud App user authentication
- **E2E Marketplace Creation**: Complete marketplace onboarding and setup guide automation
- **CRUD Operations**: Full coverage for Products, Categories, Brands, Collections, Vendors, and Customers
- **Session Management**: Persistent authentication states for fast test execution

### Key Technologies
- **Playwright** (^1.56.1) - Testing framework
- **TypeScript** - Programming language
- **dotenv** (^17.2.3) - Environment variable management
- **Node.js** - Runtime environment

---

## 🏗️ Architecture Patterns

### 1. Page Object Model (POM)
All page interactions are encapsulated in Page Object classes located in `pages/` directory.

**Structure:**
- Each page object is a class that contains:
  - `readonly page: Page` - Playwright page instance
  - Locators as `readonly` or `private readonly` properties
  - Methods for page interactions
  - Verification/assertion methods

**Example Pattern:**
```typescript
export class CategoryManagementPage {
    readonly page: Page;
    private readonly productsMenu: Locator;
    private readonly categoriesLink: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.categoriesLink = page.getByRole('link', { name: 'Categories' });
    }
    
    async navigateToCategories() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.categoriesLink.click();
        await this.page.waitForLoadState('networkidle');
    }
}
```

### 2. Custom Fixtures for Authentication
Authentication is handled through custom fixtures in `tests/fixtures/auth.fixtures.ts`.

**Available Fixtures:**
- `adminPage` - Admin role authentication (main Dokan site)
- `vendorPage` - Vendor role authentication (main Dokan site)
- `customerPage` - Customer role authentication (main Dokan site)
- `dokanCloudPage` - Dokan Cloud app user authentication (app.dokan.co)

**Key Points:**
- Uses stored authentication states from `playwright/.auth/` directory
- Each fixture creates a new browser context with saved session state
- Fixtures automatically navigate to relevant URLs to ensure session is loaded
- Dokan Cloud and Customer fixtures are optional - skip gracefully if credentials not configured
- All fixtures include proper waits (`networkidle`, `domcontentloaded`, `waitForTimeout`) for stability

**Usage in Tests:**
```typescript
import { test } from '../fixtures/auth.fixtures';

test('Admin test', async ({ adminPage }) => {
    // adminPage.page is already authenticated and navigated to /admin
    const categoryPage = new CategoryManagementPage(adminPage.page);
    // Use page object methods...
});

test('E2E Marketplace test', async ({ dokanCloudPage }) => {
    // dokanCloudPage.page is already authenticated to app.dokan.co
    const onboardingPage = new MarketplaceOnboardingPage(dokanCloudPage.page);
    // Use page object methods...
});
```

### 3. Authentication Setup
Authentication states are created via `tests/auth.setup.ts` which:
- Logs in as Admin, Vendor, Customer, and Dokan Cloud user
- Saves session states to `playwright/.auth/` directory:
  - `admin.json` - Admin session (main site)
  - `vendor.json` - Vendor session (main site)
  - `customer.json` - Customer session (main site, optional)
  - `dokanCloud.json` - Dokan Cloud session (app.dokan.co, optional)
- All credentials loaded from `.env` file via `utils/testData.ts`
- Customer and Dokan Cloud authentication skip gracefully if credentials not configured
- Run with: `npx playwright test --project=setup`

**Setup Pattern:**
Each authentication setup:
1. Navigates to login page
2. Fills credentials from environment variables
3. Handles optional elements (e.g., Privacy Policy)
4. Waits for successful login
5. Saves authentication state to JSON file

---

## 📁 Project Structure

```
My Dokan Automation/
├── pages/                              # Page Object Models (POM)
│   ├── admin/                          # Admin role page objects (main site)
│   │   ├── adminAuthPage.ts            # Admin login page
│   │   ├── productCategoryPage.ts      # Category management (create, delete)
│   │   ├── productBrandPage.ts         # Brand management (create, delete, image upload)
│   │   ├── productCollectionPage.ts    # Collection management (create, delete, image upload)
│   │   ├── productManagementPage.ts    # Product CRUD operations (search, delete)
│   │   ├── customerManagementPage.ts   # Customer management (create, view)
│   │   ├── vendorsPage.ts              # Vendor management (create, view)
│   │   └── setupGuidePage.ts           # Post-marketplace creation setup guide
│   │                                   #   (General Settings, Brand, Payment, Payout, Shipping)
│   ├── vendor/                         # Vendor role page objects (main site)
│   │   ├── vendorAuthPage.ts           # Vendor login page
│   │   └── productCreatePage.ts        # Product creation (with image upload)
│   ├── app_store/                      # Dokan Cloud (app.dokan.co) page objects
│   │   ├── dokanCloudLoginPage.ts      # Dokan Cloud login page
│   │   └── marketplaceOnboardingPage.ts # Marketplace creation and onboarding flow
│   │                                   #   (handles address autocomplete, optional chat close)
│   ├── common/                         # Shared/common helpers
│   │   └── chatManager.ts              # Handles optional chat widgets across pages
│   └── customer/                       # Customer role page objects (placeholder)
│
├── tests/                              # Test specifications organized by role/area
│   ├── admin/                          # Admin test suites (main site)
│   │   ├── adminLogin.spec.ts          # Admin login verification
│   │   ├── categoryCreate.spec.ts      # Create category
│   │   ├── brandCreate.spec.ts         # Create brand with image
│   │   ├── collectionCreate.spec.ts    # Create collection with image
│   │   ├── vendorCreate.spec.ts        # Create vendor account
│   │   ├── customerManagement.spec.ts  # Customer creation and management
│   │   ├── deleteCategory.spec.ts      # Delete category by name
│   │   ├── deleteBrand.spec.ts         # Delete brand by name
│   │   ├── deleteCollection.spec.ts    # Delete collection by name
│   │   ├── deleteProduct.spec.ts       # Delete product by name
│   │   └── setupGuide.spec.ts          # Complete setup guide after marketplace creation
│   ├── vendor/                         # Vendor test suites (main site)
│   │   ├── vendorLogin.spec.ts         # Vendor login verification
│   │   └── productCreate.spec.ts       # Create product with images and details
│   ├── app_store/                      # Dokan Cloud app onboarding tests
│   │   └── marketplaceOnboarding.spec.ts # Complete marketplace creation flow
│   ├── e2e/                            # End-to-end test suites
│   │   └── e2eDeleteProductRelatedThings.spec.ts  # Serial deletion flow
│   │                                   #   (Product → Category → Brand → Collection)
│   ├── fixtures/                       # Custom test fixtures
│   │   └── auth.fixtures.ts            # Authentication fixtures for all roles
│   │                                   #   (adminPage, vendorPage, customerPage, dokanCloudPage)
│   ├── customer/                       # Customer test suites (placeholder)
│   └── auth.setup.ts                   # Authentication setup script (creates session files)
│
├── utils/                              # Utility files
│   └── testData.ts                     # Environment variables & test data loader
│                                       #   (exports Urls object with all credentials/URLs)
│
├── playwright/                         # Playwright artifacts
│   └── .auth/                          # Stored authentication states (gitignored)
│       ├── admin.json                  # Admin session (main site)
│       ├── vendor.json                 # Vendor session (main site)
│       ├── customer.json               # Customer session (main site, optional)
│       └── dokanCloud.json             # Dokan Cloud session (app.dokan.co, optional)
│
├── playwright.config.ts                # Playwright configuration
│   # Projects: setup, marketplaceSetup, adminPreSetup, vendorProductCreation, cleanup
├── package.json                        # Dependencies and scripts
├── PROJECT_CONTEXT.md                  # This file - comprehensive project documentation
├── tsconfig.json                       # TypeScript configuration
└── .env                                # Environment variables (NOT in repo, user-created)
    # Contains: ADMIN_URL, ADMIN_EMAIL, ADMIN_PASSWORD,
    #           VENDOR_URL, VENDOR_EMAIL, VENDOR_PASSWORD,
    #           CUSTOMER_URL, CUSTOMER_EMAIL, CUSTOMER_PASSWORD,
    #           DOKAN_CLOUD_URL, DOKAN_CLOUD_EMAIL, DOKAN_CLOUD_PASSWORD
```

---

## 🔑 Key Conventions & Patterns

### 1. Naming Conventions

**Page Objects:**
- Class names: `{Feature}ManagementPage` or `{Feature}Page` (e.g., `CategoryManagementPage`, `MarketplaceOnboardingPage`)
- File names: 
  - Admin pages: `product{Feature}Page.ts` (e.g., `productCategoryPage.ts`)
  - App Store pages: `{feature}Page.ts` (e.g., `marketplaceOnboardingPage.ts`)
  - Admin-specific: `setupGuidePage.ts`
- Methods: camelCase with descriptive names (e.g., `navigateToCategories()`, `completeOnboarding()`)

**Test Files:**
- File names: `{action}{entity}.spec.ts` (e.g., `categoryCreate.spec.ts`, `deleteProduct.spec.ts`)
- Test descriptions: `'{Role} - {Feature} Management'` (e.g., `'Admin - Category Management'`)

**Locators:**
- Use `readonly` for public locators
- Use `private readonly` for internal locators
- Prefer semantic locators: `getByRole()`, `getByText()`, `getByPlaceholder()`
- Use `page.locator()` only when semantic locators aren't available

### 2. Method Patterns

**Navigation Methods:**
```typescript
async navigateTo{Feature}() {
    await this.productsMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.{feature}Link.click();
    await this.page.waitForLoadState('networkidle');
}
```

**CRUD Operations:**
- **Create**: `create{Entity}(data: {...})` - Complete flow from navigation to verification
- **Read/Search**: `search{Entity}ByName(name: string)` - Search functionality
- **Update**: `update{Entity}(id: string, data: {...})` - Update operations
- **Delete**: `delete{Entity}ByName(name: string)` - Delete flow with confirmation

**Verification Methods:**
- `verify{Entity}CreatedSuccessfully()` - Check success notification
- `verify{Entity}Deleted()` - Check deletion success message
- `verify{Entity}InList(name: string)` - Verify entity exists in list

### 3. Wait Strategies

**Always use proper waits to handle asynchronous operations:**

```typescript
// After navigation (standard pattern)
await this.page.waitForLoadState('networkidle');  // Wait for network to settle
await this.page.waitForLoadState('domcontentloaded');  // Wait for DOM

// After form submission
await this.submitButton.click();
await this.page.waitForLoadState('networkidle');

// For dynamic content (use sparingly)
await this.page.waitForTimeout(1000); // Only when necessary

// Wait for specific elements
await expect(this.successMessage).toBeVisible({ timeout: 10000 });

// Conditional waits (for optional elements)
const isVisible = await this.chatButton.isVisible({ timeout: 2000 }).catch(() => false);
if (isVisible) {
    await this.chatButton.click();
}
```

**Wait order (recommended pattern):**
1. `networkidle` - Wait for network requests to complete
2. `domcontentloaded` - Wait for DOM to be ready
3. `waitForTimeout()` - Only as last resort for specific timing needs (e.g., animations, transitions)

**Special Cases:**
- **Image uploads**: Wait for "Insert Media" heading to appear after clicking "Add media"
- **Address autocomplete**: Press `ArrowDown` and `Enter`, then verify fields populated
- **Optional elements**: Always check visibility before interacting (e.g., chat close buttons, privacy policy)

### 4. Comments in Code

**Always add comments for:**
- Test file: Purpose of the test, what it validates
- Page object methods: What the method does, any important notes
- Complex operations: Step-by-step explanation
- Test steps: Inline comments explaining each action

**Comment Pattern:**
```typescript
// Initialize page object with authenticated admin page
const categoryPage = new CategoryManagementPage(adminPage.page);

// Target category to delete
const categoryName = 'Test Category';

// Execute delete flow
await categoryPage.deleteCategoryByName(categoryName);

// Assert success message
await categoryPage.verifyCategoryDeleted();
```

---

## 📝 Test File Structure

### Standard Test File Pattern

```typescript
import { test } from '../fixtures/auth.fixtures';
import { {Feature}ManagementPage } from '../../pages/admin/product{Feature}Page';

test.describe('Admin - {Feature} Management', () => {
    test('{Action} {Entity}', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const {feature}Page = new {Feature}ManagementPage(adminPage.page);
        
        // Test data
        const {entity}Data = {
            name: 'Test {Entity}',
            // ... other fields
        };
        
        // Execute action
        await {feature}Page.{action}{Entity}({entity}Data);
        
        // Verify result
        await {feature}Page.verify{Entity}{Action}Successfully();
    });
});
```

### Delete Test Pattern

```typescript
import { test } from '../fixtures/auth.fixtures';
import { {Feature}ManagementPage } from '../../pages/admin/product{Feature}Page';

test.describe('Admin - {Feature} Management', () => {
    test('Delete {Entity} by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const {feature}Page = new {Feature}ManagementPage(adminPage.page);
        
        // Target entity to delete
        const {entity}Name = 'Test {Entity}';
        
        // Execute delete flow
        await {feature}Page.delete{Entity}ByName({entity}Name);
        
        // Assert success message
        await {feature}Page.verify{Entity}Deleted();
    });
});
```

---

## 🔄 Common Workflows

### Creating a New Test Suite

1. **Create Page Object** in `pages/admin/product{Feature}Page.ts`:
   - Define locators in constructor
   - Create navigation methods
   - Create CRUD methods
   - Create verification methods
   - Add comments for all methods

2. **Create Test File** in `tests/admin/{action}{entity}.spec.ts`:
   - Import fixtures and page object
   - Use `adminPage` fixture
   - Follow naming conventions
   - Add inline comments

3. **Follow the Pattern:**
   - Use authenticated fixtures (don't login in tests)
   - Use page object methods (don't interact with page directly)
   - Verify results with page object verification methods

### Refactoring Codegen Tests

When converting Playwright codegen tests to POM:

1. **Extract locators** → Add to page object constructor
2. **Extract actions** → Create methods in page object
3. **Remove hardcoded URLs** → Use `Urls` from `utils/testData.ts`
4. **Remove login steps** → Use `adminPage` fixture
5. **Add comments** → Document all actions
6. **Follow naming** → Use project conventions

---

## 🎯 Environment Configuration

### Environment Variables (.env file)

**Required Variables (Main Site):**
```env
# Admin Configuration (Required)
ADMIN_URL=https://your-dokan-site.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Vendor Configuration (Required)
VENDOR_URL=https://your-dokan-site.com
VENDOR_EMAIL=vendor@example.com
VENDOR_PASSWORD=your_vendor_password
```

**Optional Variables:**
```env
# Customer Configuration (Optional)
CUSTOMER_URL=https://your-dokan-site.com
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=your_customer_password

# Dokan Cloud Configuration (Optional - for app.dokan.co marketplace creation)
DOKAN_CLOUD_URL=https://app.dokan.co
DOKAN_CLOUD_EMAIL=your-email@example.com
DOKAN_CLOUD_PASSWORD=your_password
```

**Access in code:**
```typescript
import { Urls } from '../../utils/testData';

// Use Urls object properties
await page.goto(Urls.adminUrl + '/admin');
await page.fill('#email', Urls.adminEmail);
await page.fill('#password', Urls.adminPassword);
```

**Notes:**
- All URLs should NOT include trailing slashes
- Customer and Dokan Cloud credentials are optional - tests will skip gracefully if not configured
- Never commit `.env` file to version control (add to `.gitignore`)

---

## 🚀 Playwright Configuration

### Project Structure in playwright.config.ts

The configuration defines several test projects for different test execution stages:

#### **1. setup** Project
- **Purpose**: Authentication setup - creates session files for all roles
- **Runs**: `tests/auth.setup.ts`
- **Creates**: 
  - `playwright/.auth/admin.json`
  - `playwright/.auth/vendor.json`
  - `playwright/.auth/customer.json` (if configured)
  - `playwright/.auth/dokanCloud.json` (if configured)
- **Command**: `npx playwright test --project=setup`
- **When to Run**: Before first test run or when credentials change

#### **2. marketplaceSetup** Project
- **Purpose**: E2E marketplace creation and onboarding on app.dokan.co
- **Runs**: `tests/app_store/marketplaceOnboarding.spec.ts`
- **Uses**: Dokan Cloud authentication (`dokanCloudPage` fixture)
- **Creates**: New marketplace on Dokan Cloud platform

#### **3. adminPreSetup** Project
- **Purpose**: Creates prerequisite data (categories, brands, collections, vendors) and completes setup guide
- **Runs**:
  - `tests/admin/vendorCreate.spec.ts`
  - `tests/admin/categoryCreate.spec.ts`
  - `tests/admin/brandCreate.spec.ts`
  - `tests/admin/collectionCreate.spec.ts`
  - `tests/admin/setupGuide.spec.ts` (should run after marketplaceOnboarding)
  - `tests/admin/customerManagement.spec.ts`
- **Uses**: Admin authentication (`adminPage` fixture)

#### **4. vendorProductCreation** Project
- **Purpose**: Vendor product creation and cleanup tests
- **Runs**:
  - `tests/vendor/productCreate.spec.ts`
  - `tests/e2e/e2eDeleteProductRelatedThings.spec.ts`
- **Uses**: Vendor authentication (`vendorPage` fixture) and Admin authentication

#### **5. cleanup** Project
- **Purpose**: Cleanup operations (currently placeholder)
- **Runs**: TBD
- **Note**: Add delete tests here for cleanup workflows

### Test Configuration
- **fullyParallel**: `true` - Tests run in parallel by default
- **retries**: `0` (local), `2` (CI)
- **workers**: `undefined` (local - uses all cores), `1` (CI - sequential)
- **reporter**: `'html'` - HTML report generated after test run
- **trace**: `'on-first-retry'` - Traces collected on retry

### Running Tests

```bash
# Setup authentication (run first)
npx playwright test --project=setup

# Run specific project
npx playwright test --project=marketplaceSetup
npx playwright test --project=adminPreSetup
npx playwright test --project=vendorProductCreation

# Run all tests
npx playwright test

# Run specific test suite
npx playwright test tests/admin/categoryCreate.spec.ts

# Run tests in specific directory
npx playwright test tests/admin

# UI mode (interactive)
npx playwright test --ui

# Debug mode (step-by-step)
npx playwright test --debug

# Headed mode (see browser)
npx playwright test --headed

# Show HTML report
npx playwright show-report
```

### Project Dependencies
- Most projects have setup dependencies commented out
- Run `--project=setup` manually before running other projects
- `marketplaceSetup` should run before `adminPreSetup` if testing full E2E flow

---

## 📋 Page Object Method Patterns

### Create Flow Pattern

```typescript
async create{Entity}({entity}Data: {
    name: string;
    description: string;
    // ... other fields
}) {
    // Navigate to feature page
    await this.navigateTo{Feature}();
    
    // Open create form
    await this.openNew{Entity}Form();
    
    // Fill form fields
    await this.fill{Entity}Name({entity}Data.name);
    await this.fill{Entity}Description({entity}Data.description);
    
    // Submit form
    await this.submit{Entity}Form();
}
```

### Delete Flow Pattern

```typescript
async delete{Entity}ByName({entity}Name: string) {
    // Navigate to feature page
    await this.navigateTo{Feature}();
    
    // Search for entity
    await this.search{Entity}ByNameForDelete({entity}Name);
    
    // Open delete dialog
    await this.openDeleteDialogForFirstResult();
    
    // Confirm deletion
    await this.confirmDelete{Entity}();
    
    // Verify deletion (optional, can be separate)
    await this.verify{Entity}Deleted();
}
```

### Search Pattern

```typescript
async search{Entity}ByNameForDelete({entity}Name: string) {
    // Click search input
    await this.{entity}SearchInput.click();
    
    // Fill search term
    await this.{entity}SearchInput.fill({entity}Name);
    
    // Press Enter to search
    await this.{entity}SearchInput.press('Enter');
    
    // Wait for results
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
}
```

---

## ⚠️ Important Rules

### DO's ✅

1. **Always use fixtures** for authentication (`adminPage`, `vendorPage`, `customerPage`, `dokanCloudPage`)
2. **Always use page objects** - Never interact with `page` directly in tests
3. **Handle optional elements** - Check visibility before clicking (e.g., chat close button, privacy policy)
4. **Add comments** to all methods and test steps (explain what, not how)
5. **Use semantic locators** (`getByRole()`, `getByText()`) when possible
6. **Wait properly** - Use `waitForLoadState()` and appropriate waits before assertions
7. **Follow naming conventions** - Match existing patterns in the codebase
8. **Verify results** - Always add verification methods after actions
9. **Use environment variables** - Never hardcode URLs or credentials
10. **Dynamic URLs** - Always use `Urls` object from `testData.ts` for all URLs
11. **Image upload pattern** - Wait for "Insert Media" heading after clicking "Add media"
12. **Address autocomplete** - Use ArrowDown + Enter, then manually fill if auto-population fails

### DON'Ts ❌

1. **Don't login in tests** - Use fixtures instead (tests should start already authenticated)
2. **Don't hardcode URLs** - Use `Urls.adminUrl`, `Urls.dokanCloudUrl` etc. from `testData.ts`
3. **Don't use `page.goto()` in tests** - Let fixtures handle navigation, or use page object methods
4. **Don't skip waits** - Always wait for network/DOM states to ensure stability
5. **Don't create locators in test files** - All locators belong in page objects
6. **Don't use `test.only` or `test.skip`** in committed code (except for debugging)
7. **Don't commit `.env` file** - Keep credentials secure (add to `.gitignore`)
8. **Don't assume element presence** - Check visibility for optional elements (chat buttons, privacy policy)
9. **Don't use excessive waits** - Prefer explicit waits (`waitForLoadState`, `expect`) over arbitrary `waitForTimeout`
10. **Don't mix domains** - Use correct fixture for correct domain (`adminPage` for main site, `dokanCloudPage` for app.dokan.co)

---

## 🔍 Example: Complete Flow

### Example 1: Category Creation

**Page Object (`productCategoryPage.ts`):**
```typescript
export class CategoryManagementPage {
    readonly page: Page;
    private readonly productsMenu: Locator;
    private readonly categoriesLink: Locator;
    // ... other locators
    
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
    
    async verifyCategoryCreatedSuccessfully() {
        await expect(this.notificationListItem).toContainText('Category', {
            timeout: 10000
        });
    }
}
```

**Test File (`categoryCreate.spec.ts`):**
```typescript
import { test } from '../fixtures/auth.fixtures';
import { CategoryManagementPage } from '../../pages/admin/productCategoryPage';

test.describe('Admin - Category Management', () => {
    test('Create Category', async ({ adminPage }) => {
        const categoryData = {
            name: 'Test Category',
            description: 'Test Category Description'
        };

        // Initialize CategoryManagementPage
        const categoryPage = new CategoryManagementPage(adminPage.page);

        // Create category
        await categoryPage.createCategory(categoryData);

        // Verify category was created successfully
        await categoryPage.verifyCategoryCreatedSuccessfully();
    });
});
```

### Example 2: Product Deletion

**Page Object (`productManagementPage.ts`):**
```typescript
export class ProductManagementPage {
    // ... locators
    
    async deleteProduct(productName: string) {
        await this.navigateToAllProducts();
        await this.searchProductByName(productName);
        await this.selectAllProductsFromResult();
        await this.openDeleteConfirmation();
        await this.confirmDeletion();
    }
    
    async verifyProductDeleted() {
        await expect(this.deleteSuccessMessage).toBeVisible({ timeout: 10000 });
    }
}
```

**Test File (`deleteProduct.spec.ts`):**
```typescript
import { test } from '../fixtures/auth.fixtures';
import { ProductManagementPage } from '../../pages/admin/productManagementPage';

test.describe('Admin - Product Management', () => {
    test('Delete product by name', async ({ adminPage }) => {
        // Initialize page object with authenticated admin page
        const productPage = new ProductManagementPage(adminPage.page);
        
        // Target product to delete
        const productName = 'Test Product';
        
        // Execute delete flow
        await productPage.deleteProduct(productName);
        
        // Assert success message
        await productPage.verifyProductDeleted();
    });
});
```

---

## 📚 Additional Notes

### Serial Tests
For tests that must run in sequence (e.g., cleanup operations), use:
```typescript
test.describe.serial('Test Suite', () => {
    // Tests run sequentially
});
```

### Test Data
- Test data should be defined in test files as constants
- For dynamic data, consider using `@faker-js/faker` (currently commented in `testData.ts`)
- Environment-specific data comes from `.env` via `testData.ts`

### Error Handling
- Use `timeout` options in `expect()` for flaky elements
- Use `waitForLoadState()` before critical operations
- Add appropriate waits after form submissions

---

## 🎓 Learning Resources

When working on this project, refer to:
1. Existing page objects in `pages/admin/` for admin page patterns
2. Existing page objects in `pages/app_store/` for Dokan Cloud (app.dokan.co) patterns
3. Existing test files in `tests/admin/` for admin test structure
4. Existing test files in `tests/e2e/` for E2E test structure
5. `tests/fixtures/auth.fixtures.ts` for fixture usage
6. `playwright.config.ts` for project configuration

---

## 📞 Quick Reference

### Key Files
- **`tests/fixtures/auth.fixtures.ts`** - Authentication fixtures for all roles
  - `adminPage` - Main site admin authentication
  - `vendorPage` - Main site vendor authentication
  - `customerPage` - Main site customer authentication (optional)
  - `dokanCloudPage` - Dokan Cloud app authentication (optional)
  
- **`utils/testData.ts`** - Environment variables loader
  - Exports `Urls` object with all credentials and URLs
  - Loaded from `.env` file via `dotenv`
  
- **`tests/auth.setup.ts`** - Authentication setup script
  - Creates session files for all roles
  - Saves to `playwright/.auth/*.json`
  
- **`playwright.config.ts`** - Playwright configuration
  - Defines test projects: `setup`, `marketplaceSetup`, `adminPreSetup`, `vendorProductCreation`, `cleanup`
  - Test matching patterns, timeouts, reporters
  
- **`pages/app_store/`** - Dokan Cloud (app.dokan.co) page objects
  - `dokanCloudLoginPage.ts` - Login to Dokan Cloud
  - `marketplaceOnboardingPage.ts` - Marketplace creation flow
  
- **`pages/admin/setupGuidePage.ts`** - Post-marketplace setup guide
  - 5-step setup: General Settings, Brand, Payment, Payout, Shipping

### Common Commands

**Setup:**
```bash
# Create .env file with credentials (first time only)
# See "Environment Configuration" section for required variables

# Setup authentication (run first or when credentials change)
npx playwright test --project=setup
```

**Running Tests:**
```bash
# Run all tests
npx playwright test

# Run specific project
npx playwright test --project=marketplaceSetup
npx playwright test --project=adminPreSetup
npx playwright test --project=vendorProductCreation

# Run specific test file
npx playwright test tests/admin/categoryCreate.spec.ts
npx playwright test tests/app_store/marketplaceOnboarding.spec.ts

# Run tests in a directory
npx playwright test tests/admin
npx playwright test tests/vendor

# Run a specific test by name
npx playwright test -g "Create Category"
```

**Interactive Modes:**
```bash
# UI mode (interactive test explorer)
npx playwright test --ui

# Debug mode (step-by-step with Playwright Inspector)
npx playwright test --debug

# Headed mode (see browser while running)
npx playwright test --headed

# Debug specific test
npx playwright test tests/admin/categoryCreate.spec.ts --debug
```

**Reports:**
```bash
# Show HTML report (after test run)
npx playwright show-report

# Generate trace viewer (for failed tests)
npx playwright show-trace trace.zip
```

### Test Execution Flow

**Full E2E Workflow:**
```bash
# 1. Setup authentication
npx playwright test --project=setup

# 2. Create marketplace on Dokan Cloud
npx playwright test --project=marketplaceSetup

# 3. Setup prerequisite data and complete setup guide
npx playwright test --project=adminPreSetup

# 4. Create vendor products
npx playwright test --project=vendorProductCreation

# 5. (Optional) Cleanup
npx playwright test --project=cleanup
```

### Troubleshooting

**Authentication Issues:**
```bash
# Delete auth files and re-authenticate
rm -rf playwright/.auth/*.json
npx playwright test --project=setup
```

**Dokan Cloud Not Working:**
- Check if `DOKAN_CLOUD_EMAIL` and `DOKAN_CLOUD_PASSWORD` are set in `.env`
- If not needed, tests will skip gracefully
- Run setup if credentials added: `npx playwright test --project=setup`

**Tests Failing:**
- Check if URLs in `.env` are correct (no trailing slashes)
- Verify authentication is set up: `ls -la playwright/.auth/`
- Run in headed mode to see browser: `npx playwright test --headed`
- Check HTML report: `npx playwright show-report`

**Timeout Issues:**
- Increase timeout in test: `test.setTimeout(180000)`
- Check network connectivity
- Run in headed mode to debug

---

## 🎓 Learning Resources

When working on this project, refer to:

### Internal Documentation
1. **This file** (`PROJECT_CONTEXT.md`) - Comprehensive project documentation
2. **Existing page objects** in `pages/admin/` - Admin page patterns
3. **Existing page objects** in `pages/app_store/` - Dokan Cloud (app.dokan.co) patterns
4. **Existing test files** in `tests/admin/` - Admin test structure
5. **Existing test files** in `tests/e2e/` - E2E test structure
6. **`tests/fixtures/auth.fixtures.ts`** - Fixture usage patterns
7. **`playwright.config.ts`** - Project configuration and test organization

### External Resources
- [Playwright Documentation](https://playwright.dev/docs/intro) - Official Playwright docs
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright) - API reference
- [Playwright Best Practices](https://playwright.dev/docs/best-practices) - Best practices guide
- [Page Object Model Pattern](https://playwright.dev/docs/pom) - POM in Playwright

### Code Patterns to Study
- **Image upload**: `productBrandPage.ts` → `uploadBrandImageFromURL()`
- **Address autocomplete**: `marketplaceOnboardingPage.ts` → `fillAddress()`
- **Optional elements**: `marketplaceOnboardingPage.ts` → `closeChat()`
- **Delete flow**: `productCategoryPage.ts` → `deleteCategoryByName()`
- **Multi-step flow**: `setupGuidePage.ts` → `completeSetupGuide()`

---

**Last Updated:** January 2025  
**Framework Version:** Playwright 1.56.1  
**Maintainer:** Follow these patterns when adding new features or refactoring existing code

---

## 📝 Notes for AI Agents

When working on this codebase:

1. **Always read existing files** before making changes to understand current patterns
2. **Follow established conventions** - naming, structure, wait patterns
3. **Use fixtures** for authentication - never manually login in tests
4. **Use environment variables** - never hardcode URLs or credentials
5. **Handle optional elements** - always check visibility before interacting
6. **Add comprehensive comments** - explain what and why, not how
7. **Test thoroughly** - verify changes work in both headed and headless modes
8. **Update this file** when making significant architectural changes

**Common Mistakes to Avoid:**
- Hardcoding URLs instead of using `Urls` from `testData.ts`
- Mixing fixtures (e.g., using `adminPage` for app.dokan.co URLs)
- Not waiting for elements properly (causes flaky tests)
- Skipping optional element checks (e.g., chat buttons)
- Creating new patterns instead of following existing ones
- Committing `.env` file or auth files



## 🆕 Recent Updates

### 1. Multi-Domain Authentication (January 2025)
**Added support for Dokan Cloud (app.dokan.co) authentication:**
- New environment variables: `DOKAN_CLOUD_URL`, `DOKAN_CLOUD_EMAIL`, `DOKAN_CLOUD_PASSWORD`
- New `dokanCloudPage` fixture in `auth.fixtures.ts` (optional - skips gracefully if not configured)
- New `authenticate dokan cloud` setup in `auth.setup.ts`
- Session saved to `playwright/.auth/dokanCloud.json`
- Automatic navigation to `/cloud/stores` on fixture initialization

### 2. E2E Marketplace Creation Flow (January 2025)
**Complete marketplace onboarding automation:**

#### App Store Pages (`pages/app_store/`)
- **`dokanCloudLoginPage.ts`**: Handles login to app.dokan.co
  - Navigate to login page
  - Fill credentials
  - Verify successful login to "My Stores" page

- **`marketplaceOnboardingPage.ts`**: Handles marketplace creation flow
  - Complete onboarding form (name, build knowledge, team size, business status)
  - **Address autocomplete logic**: 
    - Attempt auto-population with ArrowDown + Enter
    - Fallback: Manually fill Division and City with "Dhaka" if auto-fill fails
  - **Optional chat handling**: Check visibility before closing chat
  - Verify redirection to setup guide URL

#### Admin Setup Guide (`pages/admin/setupGuidePage.ts`)
- **Post-marketplace creation setup** on the new marketplace subdomain
- **Completes 5-step setup guide**:
  1. **General Settings**: Business Details (phone, postal code)
  2. **Brand Settings**: Upload logo and favicon from URL
  3. **Payment Settings**: Enable Test Gateway and configure Cash On Delivery
  4. **Payout Settings**: Configure Bank Transfer with flat + percentage fees
  5. **Shipping Settings**: Enable shipping settings
- **Dynamic URL**: Uses `Urls.adminUrl` from environment variables
- **Wait for "Insert Media" heading** after clicking "Add media" (consistent with other image uploads)

#### Test Organization
- **`tests/app_store/marketplaceOnboarding.spec.ts`**: 
  - Uses `dokanCloudPage` fixture
  - Creates marketplace through Dokan Cloud app
  - Verifies redirection to setup guide
  
- **`tests/admin/setupGuide.spec.ts`**: 
  - Uses `adminPage` fixture (authenticated to main site)
  - Navigates to setup guide using dynamic URL from environment
  - Completes all 5 setup steps
  - Extended timeout (180s) for slower onboarding operations

### 3. Image Upload Standardization (December 2024)
**Consistent wait pattern across all image uploads:**
- **Pattern**: After clicking "Add media" button, wait for "Insert Media" heading to be visible
- **Applied to**:
  - `productBrandPage.ts` - Brand logo upload
  - `productCollectionPage.ts` - Collection image upload
  - `productCreatePage.ts` - Product image upload
  - `setupGuidePage.ts` - Brand logo and favicon upload
- **Reason**: Ensures media library is fully loaded before proceeding

### 4. Optional Element Handling (January 2025)
**Graceful handling of optional UI elements:**
- **Chat widgets**: Check visibility before clicking close button
  - Applied in `marketplaceOnboardingPage.ts`
  - Applied in `setupGuidePage.ts`
- **Privacy Policy**: Check visibility before accepting
  - Applied in `auth.setup.ts` for all authentication flows
- **Pattern**: 
  ```typescript
  const isVisible = await element.isVisible({ timeout: 2000 }).catch(() => false);
  if (isVisible) {
      await element.click();
  }
  ```

### 5. Address Autocomplete Simplification (January 2025)
**Robust address field handling in marketplace onboarding:**
- **Initial approach**: Press ArrowDown and Enter to trigger autocomplete
- **Verification**: Check if Division and City fields are populated
- **Fallback**: If auto-population fails, manually fill "Dhaka" for both fields
- **Result**: Tests pass reliably even when autocomplete is flaky

### 6. Project Restructuring (December 2024 - January 2025)
**Organized page objects by domain/area:**
- **Created `pages/app_store/`** for Dokan Cloud pages (app.dokan.co)
- **Moved `setupGuidePage.ts`** to `pages/admin/` (admin area of marketplace)
- **Created `tests/app_store/`** for app store onboarding tests
- **Split E2E test**: Separated marketplace creation and setup guide into two focused tests
- **Removed `pages/e2e/`**: No longer needed with better organization

### 7. Fixture Enhancements (January 2025)
**Improved fixture reliability and error handling:**
- **Explicit navigation** on fixture initialization (ensures session is active)
- **Optional credential checks**: Customer and Dokan Cloud fixtures skip if credentials not configured
- **Consistent wait pattern**: All fixtures use `networkidle` + `domcontentloaded` + `waitForTimeout(2000)`
- **Clear error messages**: Informative messages when auth files missing or credentials not configured

### 8. Dynamic URL Support (January 2025)
**Eliminated hardcoded URLs:**
- **All URLs** now use `Urls` object from `utils/testData.ts`
- **Examples**:
  - `setupGuide.spec.ts`: `${Urls.adminUrl}/admin/setup-guide`
  - Fixtures: `Urls.adminUrl`, `Urls.dokanCloudUrl`, etc.
- **Benefits**: Easy environment switching, no hardcoded values

### 9. Test Timeout Management (December 2024 - January 2025)
**Extended timeouts for slow operations:**
- **Marketplace onboarding**: 180s (slow redirects and subdomain provisioning)
- **Setup guide**: 180s (multiple image uploads and settings)
- **Image upload waits**: 10s timeout for "Insert Media" heading visibility
- **Pattern**: Use `test.setTimeout(180000)` at test level, not globally

---