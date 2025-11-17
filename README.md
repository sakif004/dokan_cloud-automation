# My Dokan Automation

A comprehensive end-to-end testing framework for Dokan e-commerce platform using Playwright. This project automates testing for Admin, Vendor, and Customer roles with a well-structured Page Object Model (POM) architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Architecture](#architecture)
- [Test Organization](#test-organization)
- [Dependencies](#dependencies)

## 🎯 Overview

This automation project provides comprehensive test coverage for a Dokan-based e-commerce platform, including:

- **Admin Operations**: Product management (categories, brands, collections), vendor management, product deletion
- **Vendor Operations**: Product creation, vendor authentication
- **Customer Operations**: (Placeholder for future implementation)
- **Authentication**: Centralized authentication setup with session persistence

## 📁 Project Structure

```
My Dokan Automation/
├── pages/                    # Page Object Models
│   ├── admin/               # Admin page objects
│   │   ├── adminAuthPage.ts
│   │   ├── productBrandPage.ts
│   │   ├── productCategoryPage.ts
│   │   ├── productCollectionPage.ts
│   │   └── vendorsPage.ts
│   ├── vendor/              # Vendor page objects
│   │   ├── productCreatePage.ts
│   │   └── vendorAuthPage.ts
│   └── customer/            # Customer page objects (placeholder)
│
├── tests/                    # Test specifications
│   ├── admin/               # Admin test suites
│   │   ├── adminLogin.spec.ts
│   │   ├── brandCreate.spec.ts
│   │   ├── categoryCreate.spec.ts
│   │   ├── collectionCreate.spec.ts
│   │   ├── deleteProduct.spec.ts
│   │   └── vendorCreate.spec.ts
│   ├── vendor/              # Vendor test suites
│   │   ├── productCreate.spec.ts
│   │   └── vendorLogin.spec.ts
│   ├── customer/            # Customer test suites (placeholder)
│   ├── fixtures/            # Custom test fixtures
│   │   └── auth.fixtures.ts
│   └── auth.setup.ts        # Authentication setup
│
├── utils/                    # Utility files
│   └── testData.ts          # Test data and environment configuration
│
├── playwright/              # Playwright artifacts
│   └── .auth/              # Stored authentication states
│       ├── admin.json
│       ├── vendor.json
│       └── customer.json
│
├── playwright-report/       # Test reports
├── playwright.config.ts      # Playwright configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git** (for cloning the repository)

## 📦 Installation

1. **Clone the repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd "My Dokan Automation"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Playwright browsers**:
   ```bash
   npx playwright install
   ```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

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
```

The environment variables are loaded via `dotenv` and accessed through `utils/testData.ts`.

### Playwright Configuration

The project uses a multi-project setup in `playwright.config.ts`:

- **setup**: Runs authentication setup to save session states
- **adminPreSetup**: Creates prerequisite data (categories, brands, collections)
- **vendorProductCreation**: Tests vendor product creation
- **cleanup**: (Commented out) For cleanup operations

## 🚀 Running Tests

### 1. Setup Authentication

First, run the authentication setup to save session states:

```bash
npx playwright test --project=setup
```

This will create authentication state files in `playwright/.auth/`:
- `admin.json`
- `vendor.json`
- `customer.json`

### 2. Run All Tests

```bash
npx playwright test
```

### 3. Run Specific Test Suites

**Admin tests:**
```bash
npx playwright test tests/admin
```

**Vendor tests:**
```bash
npx playwright test tests/vendor
```

**Specific test file:**
```bash
npx playwright test tests/admin/categoryCreate.spec.ts
```

### 4. Run Tests in UI Mode

```bash
npx playwright test --ui
```

### 5. Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### 6. Run Tests with Specific Project

```bash
npx playwright test --project=adminPreSetup
```

### 7. View Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## 🏗️ Architecture

### Page Object Model (POM)

The project follows the Page Object Model pattern for better maintainability:

- **Page Objects** (`pages/`): Encapsulate page-specific logic and locators
- **Test Files** (`tests/`): Contain test cases using page objects
- **Fixtures** (`tests/fixtures/`): Provide reusable test fixtures with authentication

### Authentication Strategy

1. **Setup Phase**: `auth.setup.ts` authenticates all roles and saves session states
2. **Test Execution**: Tests use stored authentication states via fixtures
3. **Session Persistence**: Authentication states are stored in `playwright/.auth/` directory

### Custom Fixtures

The project uses custom fixtures (`auth.fixtures.ts`) that provide:
- `adminPage`: Pre-authenticated admin page instance
- `vendorPage`: Pre-authenticated vendor page instance
- `customerPage`: Pre-authenticated customer page instance

Example usage:
```typescript
import { test } from '../fixtures/auth.fixtures';

test('Admin test', async ({ adminPage }) => {
    // Use adminPage.page to interact with the page
    await adminPage.page.goto('/admin/products');
});
```

## 📝 Test Organization

### Admin Tests

- `adminLogin.spec.ts`: Admin authentication tests
- `categoryCreate.spec.ts`: Product category creation
- `brandCreate.spec.ts`: Product brand creation
- `collectionCreate.spec.ts`: Product collection creation
- `vendorCreate.spec.ts`: Vendor creation by admin
- `deleteProduct.spec.ts`: Product deletion

### Vendor Tests

- `vendorLogin.spec.ts`: Vendor authentication tests
- `productCreate.spec.ts`: Product creation by vendor

### Test Data

Test data and environment configuration are centralized in `utils/testData.ts`, which:
- Loads environment variables from `.env`
- Exports `Urls` object with all configuration
- Provides a single source of truth for test data

## 📦 Dependencies

### Core Dependencies

- **@playwright/test** (^1.56.1): Playwright testing framework
- **dotenv** (^17.2.3): Environment variable management
- **@types/node** (^24.8.1): TypeScript type definitions for Node.js

### Development Dependencies

All dependencies are listed in `package.json` as devDependencies.

## 🔍 Best Practices

1. **Page Object Model**: All page interactions are encapsulated in page objects
2. **Reusable Fixtures**: Authentication is handled through reusable fixtures
3. **Environment Configuration**: All URLs and credentials are externalized to `.env`
4. **Session Persistence**: Authentication states are saved and reused across tests
5. **Wait Strategies**: Proper use of `waitForLoadState` and `waitForTimeout` for stability

## 🐛 Troubleshooting

### Authentication Issues

If authentication fails:
1. Verify `.env` file has correct credentials
2. Re-run the setup: `npx playwright test --project=setup`
3. Check that `playwright/.auth/` directory exists and contains JSON files

### Test Failures

1. Check network connectivity
2. Verify the target application is accessible
3. Review test reports: `npx playwright show-report`
4. Run tests in debug mode: `npx playwright test --debug`

## 📄 License

ISC

## 👤 Author

Project maintained for Dokan e-commerce platform automation testing.

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Add `.env` to your `.gitignore` file.

