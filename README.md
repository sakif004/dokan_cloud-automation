# My Dokan Automation

> **Comprehensive End-to-End Testing Framework for Dokan E-commerce Platform**

A production-ready automation testing framework built with **Playwright** and **TypeScript**, featuring multi-domain authentication, E2E marketplace creation flows, and robust Page Object Model architecture.

[![Playwright](https://img.shields.io/badge/Playwright-1.56.1-45ba4b?logo=playwright)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-339933?logo=node.js)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Architecture](#-architecture)
- [Test Organization](#-test-organization)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Capabilities
- **Multi-Domain Testing**: Test across main Dokan site and Dokan Cloud (app.dokan.co)
- **Role-Based Authentication**: Admin, Vendor, Customer, and Dokan Cloud app user authentication
- **Session Persistence**: Fast test execution with reusable authentication states
- **E2E Marketplace Creation**: Complete marketplace onboarding and setup guide automation
- **CRUD Operations**: Full coverage for Products, Categories, Brands, Collections, Vendors, Customers

### 🏗️ Architecture Highlights
- **Page Object Model (POM)**: Maintainable and scalable test architecture
- **Custom Fixtures**: Pre-authenticated browser contexts for all roles
- **Dynamic URLs**: Environment-based configuration for easy deployment switching
- **Optional Elements**: Robust handling of conditional UI elements (chat widgets, privacy policies)
- **Image Upload Automation**: Standardized media upload with proper wait strategies

### 🚀 Test Coverage
- **Admin Operations**: Product management, vendor creation, customer management, setup guide
- **Vendor Operations**: Product creation with images and details
- **App Store Operations**: Marketplace onboarding on Dokan Cloud
- **E2E Workflows**: Complete marketplace creation and configuration flows
- **Cleanup Operations**: Automated deletion of test data

---

## 🚀 Quick Start

```bash
# 1. Clone and install
git clone <repository-url>
cd "My Dokan Automation"
npm install
npx playwright install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Setup authentication
npx playwright test --project=setup

# 4. Run tests
npx playwright test

# 5. View report
npx playwright show-report
```

---

## 📁 Project Structure

```
My Dokan Automation/
├── pages/                              # Page Object Models (POM)
│   ├── admin/                          # Admin role pages (main site)
│   │   ├── adminAuthPage.ts            # Admin login
│   │   ├── productCategoryPage.ts      # Category management
│   │   ├── productBrandPage.ts         # Brand management
│   │   ├── productCollectionPage.ts    # Collection management
│   │   ├── productManagementPage.ts    # Product CRUD
│   │   ├── customerManagementPage.ts   # Customer management
│   │   ├── vendorsPage.ts              # Vendor management
│   │   └── setupGuidePage.ts           # Post-marketplace setup guide
│   ├── vendor/                         # Vendor role pages (main site)
│   │   ├── vendorAuthPage.ts           # Vendor login
│   │   └── productCreatePage.ts        # Product creation
│   ├── app_store/                      # Dokan Cloud pages (app.dokan.co)
│   │   ├── dokanCloudLoginPage.ts      # Dokan Cloud login
│   │   └── marketplaceOnboardingPage.ts # Marketplace creation flow
│   ├── common/                         # Shared helpers
│   │   └── chatManager.ts              # Chat widget handler
│   └── customer/                       # Customer pages (placeholder)
│
├── tests/                              # Test specifications
│   ├── admin/                          # Admin test suites
│   │   ├── adminLogin.spec.ts
│   │   ├── categoryCreate.spec.ts
│   │   ├── brandCreate.spec.ts
│   │   ├── collectionCreate.spec.ts
│   │   ├── vendorCreate.spec.ts
│   │   ├── customerManagement.spec.ts
│   │   ├── deleteCategory.spec.ts
│   │   ├── deleteBrand.spec.ts
│   │   ├── deleteCollection.spec.ts
│   │   ├── deleteProduct.spec.ts
│   │   └── setupGuide.spec.ts
│   ├── vendor/                         # Vendor test suites
│   │   ├── vendorLogin.spec.ts
│   │   └── productCreate.spec.ts
│   ├── app_store/                      # Dokan Cloud tests
│   │   └── marketplaceOnboarding.spec.ts
│   ├── e2e/                            # End-to-end workflows
│   │   └── e2eDeleteProductRelatedThings.spec.ts
│   ├── fixtures/                       # Custom test fixtures
│   │   └── auth.fixtures.ts            # Authentication fixtures
│   ├── customer/                       # Customer tests (placeholder)
│   └── auth.setup.ts                   # Authentication setup script
│
├── utils/                              # Utilities
│   └── testData.ts                     # Environment variables loader
│
├── playwright/                         # Playwright artifacts
│   └── .auth/                          # Stored authentication states
│       ├── admin.json
│       ├── vendor.json
│       ├── customer.json              # Optional
│       └── dokanCloud.json            # Optional
│
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Dependencies
├── PROJECT_CONTEXT.md                  # Detailed documentation
└── README.md                           # This file
```

---

## 📦 Installation

### Prerequisites

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** (optional, for cloning)

### Steps

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd "My Dokan Automation"
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

4. **Verify installation**:
   ```bash
   npx playwright --version
   # Should output: Version 1.56.1
   ```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# ========================================
# Main Site Configuration (Required)
# ========================================

# Admin Configuration
ADMIN_URL=https://your-dokan-site.com
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password

# Vendor Configuration
VENDOR_URL=https://your-dokan-site.com
VENDOR_EMAIL=vendor@example.com
VENDOR_PASSWORD=your_vendor_password

# ========================================
# Optional Configurations
# ========================================

# Customer Configuration (Optional)
CUSTOMER_URL=https://your-dokan-site.com
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=your_customer_password

# Dokan Cloud Configuration (Optional - for marketplace creation)
DOKAN_CLOUD_URL=https://app.dokan.co
DOKAN_CLOUD_EMAIL=your-email@example.com
DOKAN_CLOUD_PASSWORD=your_password
```

**Important Notes:**
- ✅ **DO NOT** include trailing slashes in URLs
- ✅ **DO NOT** commit `.env` file to version control (already in `.gitignore`)
- ✅ Customer and Dokan Cloud credentials are optional - tests will skip gracefully if not configured
- ✅ All URLs should use HTTPS

### Playwright Configuration

The project uses a **multi-project setup** in `playwright.config.ts`:

| Project | Purpose | Runs |
|---------|---------|------|
| **setup** | Authentication setup | Creates session files for all roles |
| **marketplaceSetup** | E2E marketplace creation | Marketplace onboarding on app.dokan.co |
| **adminPreSetup** | Prerequisite data creation | Categories, brands, collections, vendors, setup guide |
| **vendorProductCreation** | Vendor tests | Product creation and deletion |
| **cleanup** | Cleanup operations | TBD |

---

## 🚀 Running Tests

### 1️⃣ Setup Authentication (First Time)

**Run this before your first test:**

```bash
npx playwright test --project=setup
```

This creates authentication state files in `playwright/.auth/`:
- ✅ `admin.json` - Admin session
- ✅ `vendor.json` - Vendor session
- ✅ `customer.json` - Customer session (if configured)
- ✅ `dokanCloud.json` - Dokan Cloud session (if configured)

**When to re-run:**
- When credentials change in `.env`
- When authentication issues occur
- After clearing `playwright/.auth/` directory

---

### 2️⃣ Run Tests

#### Run All Tests
```bash
npx playwright test
```

#### Run Specific Project
```bash
# Marketplace creation
npx playwright test --project=marketplaceSetup

# Admin prerequisite setup
npx playwright test --project=adminPreSetup

# Vendor product tests
npx playwright test --project=vendorProductCreation
```

#### Run Specific Test Suite
```bash
# All admin tests
npx playwright test tests/admin

# All vendor tests
npx playwright test tests/vendor

# All app store tests
npx playwright test tests/app_store

# Specific test file
npx playwright test tests/admin/categoryCreate.spec.ts
```

#### Run Specific Test by Name
```bash
npx playwright test -g "Create Category"
npx playwright test -g "Delete product"
```

---

### 3️⃣ Interactive Test Modes

#### UI Mode (Recommended for Development)
```bash
npx playwright test --ui
```
- ✨ Interactive test explorer
- 🔍 Watch mode with auto-rerun
- 🎬 Time-travel debugging
- 📊 Visual test results

#### Debug Mode (Step-by-Step)
```bash
npx playwright test --debug
npx playwright test tests/admin/categoryCreate.spec.ts --debug
```
- ⏯️ Playwright Inspector
- 🔍 Step through test execution
- 🎯 Inspect selectors in real-time

#### Headed Mode (See Browser)
```bash
npx playwright test --headed
```
- 👀 Watch browser during test execution
- 🐛 Debug visual issues

---

### 4️⃣ View Test Reports

```bash
# Show HTML report (after test run)
npx playwright show-report

# Show trace viewer (for failed tests)
npx playwright show-trace trace.zip
```

---

### 5️⃣ Full E2E Workflow Example

```bash
# Complete marketplace creation and setup workflow

# Step 1: Setup authentication
npx playwright test --project=setup

# Step 2: Create marketplace on Dokan Cloud
npx playwright test --project=marketplaceSetup

# Step 3: Setup prerequisite data and complete setup guide
npx playwright test --project=adminPreSetup

# Step 4: Create vendor products
npx playwright test --project=vendorProductCreation

# Step 5: View results
npx playwright show-report
```

---

## 🏗️ Architecture

### Page Object Model (POM)

The project follows the **Page Object Model** pattern for maintainability and scalability:

```typescript
// Example: CategoryManagementPage

export class CategoryManagementPage {
    readonly page: Page;
    private readonly productsMenu: Locator;
    private readonly categoriesLink: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.categoriesLink = page.getByRole('link', { name: 'Categories' });
    }
    
    async createCategory(data: { name: string; description: string }) {
        await this.navigateToCategories();
        await this.fillCategoryForm(data);
        await this.submitForm();
    }
    
    async verifyCategoryCreated() {
        await expect(this.successMessage).toBeVisible({ timeout: 10000 });
    }
}
```

**Benefits:**
- ✅ Encapsulates page-specific logic
- ✅ Reusable across multiple tests
- ✅ Easy to maintain when UI changes
- ✅ Clear separation of concerns

---

### Custom Fixtures (Authentication)

Custom fixtures provide **pre-authenticated browser contexts** for all roles:

```typescript
import { test } from '../fixtures/auth.fixtures';

// ✅ Page is already authenticated - no login needed!
test('Admin test', async ({ adminPage }) => {
    const categoryPage = new CategoryManagementPage(adminPage.page);
    await categoryPage.createCategory({ name: 'Test', description: 'Test' });
});

test('Vendor test', async ({ vendorPage }) => {
    const productPage = new ProductCreatePage(vendorPage.page);
    await productPage.createProduct({ name: 'Test Product' });
});

test('Dokan Cloud test', async ({ dokanCloudPage }) => {
    const onboardingPage = new MarketplaceOnboardingPage(dokanCloudPage.page);
    await onboardingPage.completeOnboarding({ marketplaceName: 'Test Store' });
});
```

**Available Fixtures:**
- `adminPage` - Main site admin (authenticated to `/admin`)
- `vendorPage` - Main site vendor (authenticated to `/vendor`)
- `customerPage` - Main site customer (optional)
- `dokanCloudPage` - Dokan Cloud app (authenticated to `/cloud/stores`)

**How it works:**
1. `auth.setup.ts` logs in each role and saves session to JSON
2. Fixtures load saved session and create authenticated browser context
3. Tests start already logged in - **no login overhead**

---

### Wait Strategies

The framework uses **intelligent wait strategies** for stability:

```typescript
// ✅ Standard pattern after navigation
await this.page.waitForLoadState('networkidle');
await this.page.waitForLoadState('domcontentloaded');

// ✅ Wait for specific elements
await expect(this.successMessage).toBeVisible({ timeout: 10000 });

// ✅ Conditional waits for optional elements
const isVisible = await this.chatButton.isVisible({ timeout: 2000 }).catch(() => false);
if (isVisible) {
    await this.chatButton.click();
}

// ✅ Image upload pattern (wait for media library)
await this.addMediaButton.click();
await expect(this.insertMediaHeading).toBeVisible({ timeout: 10000 });

// ⚠️ Use timeouts sparingly (only for animations/transitions)
await this.page.waitForTimeout(1000);
```

---

### Dynamic URLs

All URLs use **environment variables** for easy configuration switching:

```typescript
import { Urls } from '../../utils/testData';

// ✅ Dynamic URL from environment
await page.goto(`${Urls.adminUrl}/admin/products`);

// ❌ Never hardcode URLs
await page.goto('https://example.com/admin/products'); // DON'T DO THIS
```

---

## 📝 Test Organization

### Admin Tests (`tests/admin/`)

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `adminLogin.spec.ts` | Admin authentication | Login verification |
| `categoryCreate.spec.ts` | Category management | Create categories |
| `brandCreate.spec.ts` | Brand management | Create brands with images |
| `collectionCreate.spec.ts` | Collection management | Create collections with images |
| `vendorCreate.spec.ts` | Vendor management | Create vendor accounts |
| `customerManagement.spec.ts` | Customer management | Create and manage customers |
| `setupGuide.spec.ts` | Setup guide completion | 5-step marketplace setup |
| `deleteCategory.spec.ts` | Category deletion | Delete by name with search |
| `deleteBrand.spec.ts` | Brand deletion | Delete by name with search |
| `deleteCollection.spec.ts` | Collection deletion | Delete by name with search |
| `deleteProduct.spec.ts` | Product deletion | Delete by name with search |

### Vendor Tests (`tests/vendor/`)

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `vendorLogin.spec.ts` | Vendor authentication | Login verification |
| `productCreate.spec.ts` | Product creation | Full product with images and details |

### App Store Tests (`tests/app_store/`)

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `marketplaceOnboarding.spec.ts` | Marketplace creation | Complete onboarding flow on app.dokan.co |

### E2E Tests (`tests/e2e/`)

| Test File | Purpose | Coverage |
|-----------|---------|----------|
| `e2eDeleteProductRelatedThings.spec.ts` | Serial deletion | Product → Category → Brand → Collection |

---

## 🎯 Best Practices

### ✅ DO's

1. **Use fixtures** for authentication - never manually login in tests
2. **Use page objects** - never interact with `page` directly in tests
3. **Handle optional elements** - check visibility before clicking
4. **Use semantic locators** - `getByRole()`, `getByText()` over CSS/XPath
5. **Add comments** - explain what and why, not how
6. **Use environment variables** - never hardcode URLs or credentials
7. **Wait properly** - use `waitForLoadState()` and explicit waits
8. **Follow naming conventions** - match existing patterns

### ❌ DON'Ts

1. **Don't login in tests** - use fixtures instead
2. **Don't hardcode URLs** - use `Urls` from `testData.ts`
3. **Don't skip waits** - always wait for network/DOM states
4. **Don't commit `.env`** - keep credentials secure
5. **Don't assume element presence** - check visibility for optional elements
6. **Don't use `test.only` or `test.skip`** in committed code

---

## 🐛 Troubleshooting

### Authentication Issues

**Problem**: Tests fail with "not authenticated" errors

**Solution**:
```bash
# Delete old auth files
rm -rf playwright/.auth/*.json

# Re-authenticate
npx playwright test --project=setup

# Verify auth files created
ls -la playwright/.auth/
```

---

### Dokan Cloud Tests Not Running

**Problem**: Dokan Cloud tests are skipped

**Solution**:
1. Check if `DOKAN_CLOUD_EMAIL` and `DOKAN_CLOUD_PASSWORD` are set in `.env`
2. If not needed, this is expected behavior (tests skip gracefully)
3. If needed, add credentials and run: `npx playwright test --project=setup`

---

### Timeout Errors

**Problem**: Tests fail with "Test timeout exceeded"

**Solution**:
```typescript
// Increase timeout for slow operations
test.setTimeout(180000); // 180 seconds

// Or in playwright.config.ts
timeout: 180000
```

---

### Environment Variable Not Found

**Problem**: `Error: ADMIN_URL is not defined`

**Solution**:
1. Check `.env` file exists in project root
2. Verify variable names match exactly (case-sensitive)
3. Restart terminal/IDE after creating `.env`
4. Check `.env` format (no spaces around `=`)

---

### Tests Failing Randomly

**Problem**: Tests pass sometimes, fail other times (flaky)

**Solution**:
1. Add proper waits: `waitForLoadState('networkidle')`
2. Increase element timeouts: `{ timeout: 10000 }`
3. Run in headed mode to debug: `npx playwright test --headed`
4. Check network connectivity and application stability

---

### Can't See Browser During Tests

**Problem**: Want to watch test execution

**Solution**:
```bash
# Run in headed mode
npx playwright test --headed

# Or use UI mode (better)
npx playwright test --ui
```

---

## 📚 Additional Resources

### Documentation
- **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)** - Comprehensive technical documentation
- **[Playwright Docs](https://playwright.dev/docs/intro)** - Official Playwright documentation
- **[TypeScript Docs](https://www.typescriptlang.org/docs/)** - TypeScript language reference

### Useful Commands
```bash
# Update Playwright
npm install @playwright/test@latest
npx playwright install

# Generate tests with Codegen
npx playwright codegen https://your-dokan-site.com

# Run tests in Chrome only
npx playwright test --project=chromium

# Run tests with retries
npx playwright test --retries=2

# Run tests in parallel workers
npx playwright test --workers=4
```

---

## 🤝 Contributing

### Code Style
- Follow existing patterns in `pages/` and `tests/`
- Use TypeScript strict mode
- Add comments for complex logic
- Use semantic locators when possible

### Adding New Tests
1. Create page object in appropriate `pages/` subdirectory
2. Create test file in appropriate `tests/` subdirectory
3. Use fixtures for authentication
4. Follow naming conventions
5. Add verification methods
6. Update this README if needed

### Pull Request Guidelines
- Write clear commit messages
- Update documentation if architecture changes
- Ensure all tests pass locally
- Add comments to complex code

---

## 📄 License

**ISC License**

---

## 👤 Author & Maintainer

**Project Team**

Maintained for comprehensive automation testing of Dokan e-commerce platform.

---

## 📞 Support

For issues, questions, or contributions:
1. Check [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for detailed documentation
2. Review this README's [Troubleshooting](#-troubleshooting) section
3. Check test reports: `npx playwright show-report`
4. Run in debug mode: `npx playwright test --debug`

---

**🎉 Happy Testing!**

---

**Last Updated:** March 2026 
**Framework Version:** Playwright 1.56.1  
**TypeScript Version:** 5.x
