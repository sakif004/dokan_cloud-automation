# Project Context for AI Agents

## 📋 Project Overview

This is an **end-to-end automation testing framework** for a **Dokan e-commerce platform** using **Playwright** and **TypeScript**. The project follows a **Page Object Model (POM)** architecture with custom fixtures for authentication management.

### Key Technologies
- **Playwright** (^1.56.1) - Testing framework
- **TypeScript** - Programming language
- **dotenv** - Environment variable management
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

**Key Points:**
- Uses stored authentication states from `playwright/.auth/` directory
- Provides pre-authenticated page instances: `adminPage`, `vendorPage`, `customerPage`, `dokanCloudPage`
- Each fixture creates a new browser context with saved session state
- Dokan Cloud fixture is optional - skips gracefully if credentials not configured

**Usage in Tests:**
```typescript
import { test } from '../fixtures/auth.fixtures';

test('Admin test', async ({ adminPage }) => {
    // adminPage.page is already authenticated
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
- Saves session states to `playwright/.auth/admin.json`, `vendor.json`, `customer.json`, `dokanCloud.json`
- All credentials loaded from `.env` file via `utils/testData.ts`
- Run with: `npx playwright test --project=setup`

---

## 📁 Project Structure

```
My Dokan Automation/
├── pages/                              # Page Object Models
│   ├── admin/                          # Admin role page objects
│   │   ├── adminAuthPage.ts            # Admin login page
│   │   ├── productCategoryPage.ts      # Category management
│   │   ├── productBrandPage.ts         # Brand management
│   │   ├── productCollectionPage.ts    # Collection management
│   │   ├── productManagementPage.ts    # Product CRUD operations
│   │   ├── customerManagementPage.ts   # Customer management
│   │   ├── setupGuidePage.ts           # Setup guide (post-marketplace creation)
│   │   └── vendorsPage.ts              # Vendor management
│   ├── vendor/                         # Vendor role page objects
│   │   ├── vendorAuthPage.ts
│   │   └── productCreatePage.ts
│   ├── app_store/                      # Dokan Cloud (app.dokan.co) page objects
│   │   ├── dokanCloudLoginPage.ts      # Dokan Cloud login page
│   │   └── marketplaceOnboardingPage.ts # Marketplace creation/onboarding
│   └── common/                         # Shared/common helpers
│       └── chatManager.ts              # Handles optional chat widgets
│
├── tests/                              # Test specifications
│   ├── admin/                          # Admin test suites
│   │   ├── adminLogin.spec.ts
│   │   ├── categoryCreate.spec.ts
│   │   ├── brandCreate.spec.ts
│   │   ├── collectionCreate.spec.ts
│   │   ├── vendorCreate.spec.ts
│   │   ├── deleteCategory.spec.ts
│   │   ├── deleteBrand.spec.ts
│   │   ├── deleteCollection.spec.ts
│   │   ├── deleteProduct.spec.ts
│   │   ├── customerManagement.spec.ts
│   │   └── setupGuide.spec.ts
│   ├── vendor/                         # Vendor test suites
│   │   ├── vendorLogin.spec.ts
│   │   └── productCreate.spec.ts
│   ├── app_store/                      # Dokan Cloud onboarding tests
│   │   └── marketplaceOnboarding.spec.ts
│   ├── e2e/                            # End-to-end test suites
│   │   ├── e2eCreateMarketplace.spec.ts        # Full marketplace creation flow
│   │   └── e2eDeleteProductRelatedThings.spec.ts
│   ├── fixtures/                       # Custom test fixtures
│   │   └── auth.fixtures.ts            # Authentication fixtures
│   └── auth.setup.ts                   # Authentication setup script
│
├── utils/                              # Utility files
│   └── testData.ts                     # Environment variables & test data
│
├── playwright/                         # Playwright artifacts
│   └── .auth/                          # Stored authentication states
│       ├── admin.json
│       ├── vendor.json
│       ├── customer.json
│       └── dokanCloud.json
│
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Dependencies
└── .env                                # Environment variables (not in repo)
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

**Always use proper waits:**
```typescript
// After navigation
await this.page.waitForLoadState('networkidle');
await this.page.waitForLoadState('domcontentloaded');

// After form submission
await this.page.waitForLoadState('networkidle');

// For dynamic content (use sparingly)
await this.page.waitForTimeout(1000); // Only when necessary
```

**Wait order:**
1. `networkidle` - Wait for network requests to complete
2. `domcontentloaded` - Wait for DOM to be ready
3. `waitForTimeout()` - Only as last resort for specific timing needs

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

```env
# Admin Configuration
ADMIN_URL=https://your-dokan-site.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Vendor Configuration
VENDOR_URL=https://your-dokan-site.com
VENDOR_EMAIL=vendor@example.com
VENDOR_PASSWORD=your_vendor_password

# Customer Configuration (Optional)
CUSTOMER_URL=https://your-dokan-site.com
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=your_customer_password

# Dokan Cloud Configuration (app.dokan.co)
DOKAN_CLOUD_URL=https://app.dokan.co
DOKAN_CLOUD_EMAIL=your-email@example.com
DOKAN_CLOUD_PASSWORD=your_password
```

**Access in code:**
```typescript
import { Urls } from '../../utils/testData';

// Use Urls.adminUrl, Urls.adminEmail, etc.
```

---

## 🚀 Playwright Configuration

### Project Structure in playwright.config.ts

- **setup**: Authentication setup project (runs `auth.setup.ts`)
  - Authenticates Admin, Vendor, Customer, and Dokan Cloud
  - Saves session states to `playwright/.auth/` directory
- **marketplaceSetup**: E2E marketplace creation tests
  - Uses `dokanCloudPage` fixture for app.dokan.co authentication
- **adminPreSetup**: Creates prerequisite data (categories, brands, collections, vendors)
- **vendorProductCreation**: Vendor product creation tests
- **cleanup**: (Placeholder) For cleanup operations

### Running Tests

```bash
# Setup authentication
npx playwright test --project=setup

# Run all tests
npx playwright test

# Run specific suite
npx playwright test tests/admin

# Run specific test
npx playwright test tests/admin/categoryCreate.spec.ts

# UI mode
npx playwright test --ui

# Debug mode
npx playwright test --debug
```

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
3. **Handle optional elements** - Check visibility before clicking (e.g., chat close button)
3. **Add comments** to all methods and test steps
4. **Use semantic locators** (`getByRole()`, `getByText()`) when possible
5. **Wait properly** - Use `waitForLoadState()` before assertions
6. **Follow naming conventions** - Match existing patterns
7. **Verify results** - Always add verification methods
8. **Use environment variables** - Never hardcode URLs or credentials

### DON'Ts ❌

1. **Don't login in tests** - Use fixtures instead
2. **Don't hardcode URLs** - Use `Urls` from `testData.ts`
3. **Don't use `page.goto()` in tests** - Use page object navigation methods
4. **Don't skip waits** - Always wait for network/DOM states
5. **Don't create locators in test files** - All locators belong in page objects
6. **Don't use `test.only` or `test.skip`** in committed code
7. **Don't commit `.env` file** - Keep credentials secure

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

**Key Files:**
- `tests/fixtures/auth.fixtures.ts` - Authentication fixtures (admin, vendor, customer, dokanCloud)
- `utils/testData.ts` - Environment variables (loads from .env)
- `tests/auth.setup.ts` - Authentication setup (creates session files)
- `playwright.config.ts` - Playwright configuration (projects, test matching)
- `pages/app_store/` - Dokan Cloud page objects (app.dokan.co)
- `pages/admin/setupGuidePage.ts` - Post-marketplace creation setup guide

**Common Commands:**
- Setup authentication: `npx playwright test --project=setup`
- Run all tests: `npx playwright test`
- Run E2E marketplace test: `npx playwright test tests/e2e/e2eCreateMarketplace.spec.ts`
- UI mode: `npx playwright test --ui`
- Show report: `npx playwright show-report`

---

## 🆕 Recent Updates

### E2E Marketplace Creation Flow
- **Page Objects**: `pages/app_store/` folder for Dokan Cloud (app.dokan.co) pages
  - `dokanCloudLoginPage.ts` - Handles login to app.dokan.co
  - `marketplaceOnboardingPage.ts` - Handles marketplace creation and onboarding flow
- **Admin Setup Guide**: `pages/admin/setupGuidePage.ts` - Handles post-creation setup (General Settings, Brand, Payment, Payout, Shipping)
- **Authentication**: Added Dokan Cloud authentication support
  - `DOKAN_CLOUD_URL`, `DOKAN_CLOUD_EMAIL`, `DOKAN_CLOUD_PASSWORD` in `.env`
  - `dokanCloudPage` fixture in `auth.fixtures.ts` (optional - skips gracefully if credentials not configured)
  - `authenticate dokan cloud` setup in `auth.setup.ts`
  - Session saved to `playwright/.auth/dokanCloud.json`

### Key Patterns for E2E Tests
- Use `dokanCloudPage` fixture for app.dokan.co authentication
- Handle optional elements (e.g., chat close button) with visibility checks before clicking
- Use simplified address autocomplete with manual fallback for Division/City fields
- Extended timeouts for slow onboarding redirects (120s+ for marketplace creation)
- Wait for "Insert Media" heading after clicking "Add media" button (consistent pattern across all image uploads)

### Project Structure Changes
- Removed `pages/e2e/` folder (no longer needed)
- Added `pages/app_store/` for Dokan Cloud pages
- Moved `setupGuidePage.ts` to `pages/admin/` (admin page)

---

**Last Updated:** December 2024
**Maintainer:** Follow these patterns when adding new features or refactoring existing code

