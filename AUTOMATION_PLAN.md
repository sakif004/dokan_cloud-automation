# Dokan Automation — Master Plan & Task Tracker

> **Purpose:** This file tracks all automation tasks, their status, and progress.  
> **Rule:** Every time a task is completed, update the status here AND update `PROJECT_CONTEXT.md`.  
> **For new AI sessions:** Read this file + `PROJECT_CONTEXT.md` first before starting any work.

---

## 🏢 Business Context (Quick Summary)

**Dokan** is a multi-tenant SaaS e-commerce platform. Users create **Marketplaces** or **Standalone Stores** via `app.flycommerce.com`. Each store gets a unique subdomain (e.g. `storename.flycom.shop`).

**Three roles inside each marketplace:**
- **Admin** (`/admin`) — configures the marketplace (setup guide, payments, vendors, categories)
- **Vendor** (`/vendor`) — creates products, manages orders
- **Customer** (storefront `/`) — browses and purchases products

**Commission model:** Admin creates subscription plans (with commission % + limits) → Vendor purchases a plan during onboarding → commission is applied automatically on sales.

**Two applications being tested:**
1. `app.flycommerce.com` — FlyCommerce Cloud (marketplace creation + management)
2. `*.flycom.shop` — Individual marketplace subdomain (admin + vendor + customer)

---

## 📌 Current State (Apr 2026)

- Final 8-phase workflow is stable and green in GitHub Actions:
  `setupFlycommerceAuth -> marketplaceSetup -> setupMarketplaceAdminAuth -> marketplaceAdminSetupGuide -> adminSeedSetup -> setupAuth -> vendorJourney -> customerJourney`.
- `marketplaceOnboarding.spec.ts` storefront URL verification is now environment-aware (matches host from configured `CUSTOMER_URL`, not hardcoded prod domain).
- Customer journey reliability improved with locator hardening in storefront/checkout flows (semantic `main`-scoped heading/link usage and strict-mode-safe shipping heading handling).
- Structured CI logs are implemented via `utils/ciLogger.ts` across all workflow-critical projects to improve troubleshooting readability.

---

## 📁 Current Project Structure

```
pages/
├── app_store/
│   ├── flycommerceLoginPage.ts         ✅ Done  (renamed from dokanCloudLoginPage.ts)
│   └── marketplaceOnboardingPage.ts    ✅ Done
├── admin/
│   ├── adminAuthPage.ts                ✅ Done
│   ├── setupGuidePage.ts               ✅ Done
│   ├── productCategoryPage.ts          ✅ Done
│   ├── productBrandPage.ts             ✅ Done
│   ├── productCollectionPage.ts        ✅ Done
│   ├── productAttributePage.ts         ✅ Done
│   ├── productManagementPage.ts        ✅ Done
│   ├── vendorsPage.ts                  ✅ Done
│   └── customerManagementPage.ts       ✅ Done  (+ password support in createCustomer)
├── vendor/
│   ├── vendorAuthPage.ts               ✅ Done
│   └── productCreatePage.ts            ✅ Done  (+ addAttribute, weight/dim units, brand/collection React Select fix)
├── customer/                           ✅ Done — Phase 2 complete
│   ├── customerAuthPage.ts             ✅ Done
│   ├── storefrontPage.ts               ✅ Done
│   ├── productDetailPage.ts            ✅ Done
│   ├── cartPage.ts                     ✅ Done
│   └── checkoutPage.ts                 ✅ Done
└── common/
    ├── chatManager.ts                  ✅ Done
    └── mediaManager.ts                 ✅ Done

utils/
├── testData.ts                         ✅ Done  (+ SeedData.vendor/customer/product; flycommerceUrl)
└── fakerData.ts                        ✅ Done  (+ randomAttributeName, generateCheckoutData)

tests/
├── app_store/
│   └── marketplaceOnboarding.spec.ts   ✅ Done
├── admin/
│   ├── adminLogin.spec.ts              ✅ Done
│   ├── seedData.spec.ts                ✅ Done  (Brand/Category/Collection/Attribute + journey Vendor + Customer)
│   ├── categoryCreate.spec.ts          ✅ Done
│   ├── brandCreate.spec.ts             ✅ Done
│   ├── collectionCreate.spec.ts        ✅ Done
│   ├── productAttribute.spec.ts        ✅ Done  (CRUD: Create/Search/Edit/Delete — serial + faker)
│   ├── vendorCreate.spec.ts            ✅ Done
│   ├── customerManagement.spec.ts      ✅ Done
│   ├── setupGuide.spec.ts              ✅ Done
│   ├── deleteCategory.spec.ts          ✅ Done
│   ├── deleteBrand.spec.ts             ✅ Done
│   ├── deleteCollection.spec.ts        ✅ Done
│   └── deleteProduct.spec.ts           ✅ Done
├── vendor/
│   ├── vendorLogin.spec.ts             ✅ Done
│   └── productCreate.spec.ts           ✅ Done  (uses SeedData for all fixed data — brand/category/collection/attribute/product)
├── customer/                           ✅ Done — Phase 2 complete
│   ├── customerLogin.spec.ts           ✅ Done
│   ├── browseProducts.spec.ts          ✅ Done
│   ├── addToCart.spec.ts               ✅ Done
│   └── checkout.spec.ts                ✅ Done
├── e2e/
│   ├── e2eCreateMarketplace.spec.ts    ⚠️  Old codegen file (not in use)
│   └── e2eDeleteProductRelatedThings.spec.ts  ✅ Done
├── fixtures/
│   └── auth.fixtures.ts               ✅ Done
├── auth.setup.ts                      ✅ Done  (Phase 1: Admin + FlyCommerce only)
└── auth.setupUsers.ts                 ✅ Done  (Phase 3: Vendor + Customer — after adminSeedSetup)
```

---

## 🔑 Auth & Fixtures Summary

| Fixture | File | Domain | Session File | Status |
|---------|------|--------|-------------|--------|
| `adminPage` | `auth.fixtures.ts` | `*.flycom.shop/admin` | `playwright/.auth/admin.json` | ✅ |
| `vendorPage` | `auth.fixtures.ts` | `*.flycom.shop/vendor` | `playwright/.auth/vendor.json` | ✅ |
| `customerPage` | `auth.fixtures.ts` | `*.flycom.shop/` (storefront) | `playwright/.auth/customer.json` | ✅ |
| `flycommercePage` | `auth.fixtures.ts` | `app.flycommerce.com` | `playwright/.auth/flycommerce.json` | ✅ |

**Auth Setup Files:**

| File | Project | Saves |
|------|---------|-------|
| `auth.setup.ts` | `setupFlycommerceAuth` | `flycommerce.json` |
| `auth.setupAdmin.ts` | `setupMarketplaceAdminAuth` | `admin.json` |
| `auth.setupUsers.ts` | `setupAuth` | `vendor.json` + `customer.json` |

**Login locators:**
- Admin + Vendor (`/admin/login`, `/vendor/login`): same React app — role-based textboxes + **Sign In**
- Customer — **`auth.setupUsers.ts`** (saves `customer.json`): classic storefront `/login` — `#reg-email`, `#login-password`, Sign in
- Customer — **`customerAuthPage.ts`** (optional UI tests): homepage modal login flow (codegen-aligned)
- FlyCommerce app: email/password textboxes + Sign In

---

## ✅ Playwright Config Projects

**No `dependencies` set** — projects run independently using `.auth` JSON files. Run setup steps once manually, then any project can run freely.

**Final journey setup order (fresh marketplace):**
```bash
npx playwright test --project=setupFlycommerceAuth
npx playwright test --project=marketplaceSetup
npx playwright test --project=setupMarketplaceAdminAuth
npx playwright test --project=marketplaceAdminSetupGuide
npx playwright test --project=adminSeedSetup --no-deps
npx playwright test --project=setupAuth --no-deps
npx playwright test --project=vendorJourney
npx playwright test --project=customerJourney
```

| Project | Runs | Notes |
|---------|------|-------|
| `setupFlycommerceAuth` | `auth.setup.ts` | FlyCommerce app admin auth |
| `marketplaceSetup` | `marketplaceOnboarding.spec.ts` | Creates marketplace from app admin |
| `setupMarketplaceAdminAuth` | `auth.setupAdmin.ts` | Marketplace admin auth (after create) |
| `marketplaceAdminSetupGuide` | `setupGuide.spec.ts` | Setup guide completion |
| `adminSeedSetup` | `seedData.spec.ts` | Creates seed fixtures + journey accounts (run once) |
| `setupAuth` | `auth.setupUsers.ts` | Vendor + Customer auth (run after adminSeedSetup) |
| `vendorJourney` | `productCreate.spec.ts` | Uses `vendor.json` |
| `customerJourney` | `checkout.spec.ts` | Uses `customer.json` + seed product |
| `adminCRUD` | CRUD spec files | Optional, outside final journey |
| `adminVerify` | order verification | ⬜ Pending — no tests yet |
| `cleanup` | delete product + related | Uses `admin.json` |

---

---

## 📋 PHASE 1 — Stabilize & Fix Current (Immediate)

> Goal: Make sure everything works after the rebranding to `flycom.shop`

| # | Task | File(s) | Status | Notes |
|---|------|---------|--------|-------|
| 1.1 | Update `.env` with new `flycom.shop` URLs | `.env` | ✅ Done | Admin confirmed working |
| 1.2 | Re-run auth setup after URL change | `auth.setup.ts` | ✅ Done | Admin confirmed working |
| 1.3 | Update `marketplaceOnboardingPage.ts` for new UI flow | `pages/app_store/marketplaceOnboardingPage.ts` | ✅ Done | New 4-step wizard, popup handling |
| 1.4 | Fix `verifyAddressFieldsPopulated` — new `#state` locator | `pages/app_store/marketplaceOnboardingPage.ts` | ✅ Done | `divisionDropdownTrigger` + `#state` |
| 1.5 | Add "Preview Store" verification in spec | `tests/app_store/marketplaceOnboarding.spec.ts` | ✅ Done | Environment-aware host check from `CUSTOMER_URL` |
| 1.6 | Verify `setupGuide.spec.ts` locators after rebranding | `pages/admin/setupGuidePage.ts` | ✅ Done | `businessDetailsLink` → `getByRole('tab')`, `brandLink` → `getByRole('tab')`, `saveButton` → `Save Changes` |
| 1.7 | Verify all admin page locators after rebranding | `pages/admin/*.ts` | ⬜ Pending | Run `adminSeedSetup` + `adminCRUD` and fix failures |
| 1.8 | Enable `dependencies` in `playwright.config.ts` | `playwright.config.ts` | ⬜ Pending | Uncomment setup dependencies |
| 1.9 | Create `.env.example` file | `.env.example` | ⬜ Pending | Template for new team members |
| 1.10 | Clean up `e2eCreateMarketplace.spec.ts` | `tests/e2e/e2eCreateMarketplace.spec.ts` | ⬜ Pending | Old file, either remove or archive |

---

## 📋 PHASE 2 — Customer / Storefront Flow ✅ COMPLETE

> Goal: Automate the buyer journey on the storefront

### 2A — New Files Needed

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 2.1 | Create `customerAuthPage.ts` | `pages/customer/customerAuthPage.ts` | ✅ Done |
| 2.2 | Create `storefrontPage.ts` | `pages/customer/storefrontPage.ts` | ✅ Done |
| 2.3 | Create `productDetailPage.ts` | `pages/customer/productDetailPage.ts` | ✅ Done |
| 2.4 | Create `cartPage.ts` | `pages/customer/cartPage.ts` | ✅ Done |
| 2.5 | Create `checkoutPage.ts` | `pages/customer/checkoutPage.ts` | ✅ Done |

### 2B — Auth Setup

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.6 | Implement `customerPage` fixture (graceful skip + auth file check) | `tests/fixtures/auth.fixtures.ts` | ✅ Done |
| 2.7 | Add `authenticate customer` with graceful try/catch | `tests/auth.setup.ts` | ✅ Done |

### 2C — Test Specs

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 2.8 | Customer login spec (4 tests) | `tests/customer/customerLogin.spec.ts` | ✅ Done |
| 2.9 | Browse products spec (4 tests, `test.describe.serial`) | `tests/customer/browseProducts.spec.ts` | ✅ Done |
| 2.10 | Add to cart spec (**1 test** — add seed product + modal verify) | `tests/customer/addToCart.spec.ts` | ✅ Done |
| 2.11 | Checkout spec (**1 E2E** — cart → FlyCommerce wizard → COD → My Orders) | `tests/customer/checkout.spec.ts` | ✅ Done |
| 2.12 | Add `customerJourney` project (`timeout` 90s for fixture + flows) | `playwright.config.ts` | ✅ Done |

---

## 📋 PHASE 3 — Subscription Plans & Commission (After Phase 2)

> Goal: Automate plan creation by admin and vendor plan purchase

### 3A — New Files Needed

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 3.1 | Create `subscriptionPlanPage.ts` | `pages/admin/subscriptionPlanPage.ts` | ⬜ Pending |
| 3.2 | Create `vendorOnboardingPage.ts` | `pages/vendor/vendorOnboardingPage.ts` | ⬜ Pending |

### 3B — Test Specs

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 3.3 | Admin creates subscription plan | `tests/admin/subscriptionPlan.spec.ts` | ⬜ Pending |
| 3.4 | Vendor purchases plan during onboarding | `tests/vendor/vendorOnboarding.spec.ts` | ⬜ Pending |
| 3.5 | Verify commission applied on sale | `tests/e2e/e2eCommissionVerification.spec.ts` | ⬜ Pending |

---

## 📋 PHASE 4 — Standalone Store Creation (Later)

> Goal: Automate Standalone Online Store onboarding (alternative to Multivendor)

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 4.1 | Create `standaloneOnboardingPage.ts` | `pages/app_store/standaloneOnboardingPage.ts` | ⬜ Pending |
| 4.2 | Create standalone onboarding spec | `tests/app_store/standaloneOnboarding.spec.ts` | ⬜ Pending |
| 4.3 | Add to `playwright.config.ts` | `playwright.config.ts` | ⬜ Pending |

---

## 📋 PHASE 5 — Full E2E Regression Suite (Final Goal)

> Goal: One complete business scenario from marketplace creation to customer purchase

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 5.1 | Full E2E: Create Marketplace → Setup → Vendor creates Product → Customer purchases | `tests/e2e/e2eFullBusinessFlow.spec.ts` | ⬜ Pending |
| 5.2 | Full E2E: Commission verification end-to-end | `tests/e2e/e2eCommissionFlow.spec.ts` | ⬜ Pending |
| 5.3 | Enable `test.describe.serial` for E2E ordering | — | ⬜ Pending |

---

## 🔍 Known Issues / Tech Debt

| # | Issue | File | Priority |
|---|-------|------|----------|
| T1 | ~~`dependencies` in playwright.config.ts~~ — **Removed: no deps, projects run freely** | `playwright.config.ts` | ✅ Fixed |
| T2 | `e2eCreateMarketplace.spec.ts` is old codegen, not POM, not in use | `tests/e2e/` | Low |
| T3 | `countryDropdownTrigger` uses `nth(2)` — fragile if UI changes | `marketplaceOnboardingPage.ts` | Low |
| T4 | `divisionDropdownTrigger` uses `nth(5)` — fragile if UI changes | `marketplaceOnboardingPage.ts` | Low |
| T5 | ~~`setupGuide.spec.ts` wrong fixture~~ — Fixed | `utils/testData.ts` | ✅ Fixed |
| T6 | ~~Customer storefront POMs~~ — aligned to **FlyCommerce** storefront (`*.flycom.shop`), not WooCommerce table markup | `pages/customer/*.ts` | ✅ Addressed |

---

## 🗂️ Environment Variables Reference

```env
# Main Marketplace Site (admin + vendor + customer share same base URL)
ADMIN_URL=https://your-store.flycom.shop
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password

VENDOR_URL=https://your-store.flycom.shop
VENDOR_EMAIL=vendor@example.com        # Must match journey vendor account created by seedData.spec.ts
VENDOR_PASSWORD=your_password

CUSTOMER_URL=https://your-store.flycom.shop
CUSTOMER_EMAIL=customer@example.com    # Must match journey customer account created by seedData.spec.ts
CUSTOMER_PASSWORD=your_password

# FlyCommerce Cloud App (app.flycommerce.com — formerly app.dokan.co)
# Env vars kept as DOKAN_CLOUD_* for backwards compatibility
DOKAN_CLOUD_URL=https://app.flycommerce.com
DOKAN_CLOUD_EMAIL=your@email.com
DOKAN_CLOUD_PASSWORD=your_password
```

---

## 📜 How to Resume Work (For New AI Session)

1. Read `AUTOMATION_PLAN.md` (this file) — understand current status
2. Read `PROJECT_CONTEXT.md` — understand architecture, patterns, conventions
3. Check `⬜ Pending` tasks in the relevant Phase
4. Read the existing page objects in `pages/` before creating new ones
5. Follow the same POM patterns — fixtures, locators, wait strategies
6. After completing a task — update status in this file (`⬜ Pending` → `✅ Done`) AND update `PROJECT_CONTEXT.md`

---

## 📅 Update Log

| Date | What Changed |
|------|-------------|
| Apr 2025 | Initial framework setup — Admin + Vendor pages, auth fixtures |
| Apr 2025 | Rebranding to `flycom.shop` — URLs updated |
| Apr 2025 | `marketplaceOnboardingPage.ts` fully rewritten for new 4-step wizard |
| Apr 2025 | `verifyAddressFieldsPopulated` fixed — new `#state` locator |
| Apr 2025 | Preview Store popup verification added to spec |
| Apr 2025 | `AUTOMATION_PLAN.md` created |
| Apr 2025 | `setupGuidePage.ts` locators fixed after rebranding — `businessDetailsLink`, `brandLink` changed to `getByRole('tab')`, `saveButton` updated to `Save Changes` |
| Apr 2025 | `setupGuide.spec.ts` working ✅ |
| Apr 2025 | `pages/common/mediaManager.ts` created — reusable WordPress media library upload module |
| Apr 2025 | `productBrandPage`, `productCollectionPage`, `productCreatePage`, `setupGuidePage` — refactored to use `MediaManager` (removed duplicate media locators and methods) |
| Apr 2025 | `vendorsPage.ts` — `fillAddress()` fixed (marketplace pattern), `fillAddressDetails()` fixed (React Select check via `getByText`), phone locator fixed |
| Apr 2025 | `vendorCreate.spec.ts` — uses `generateVendorData()` from fakerData, Bangladesh address, `division`/`city` fallback |
| Apr 2025 | `utils/fakerData.ts` created — modular faker utility (`randomEmail`, `generateVendorData`, `generateCustomerData`, etc.) |
| Apr 2025 | `customerManagement.spec.ts` — faker added, `test.describe.serial`, `shared` state object, search by email, `test.setTimeout(90000)` |
| Apr 2025 | `customerManagementPage.ts` — `tableActionButton` locator added, `viewCustomer`/`markAsTest`/`deactivateCustomer` fixed to use it, re-navigate before deactivate in workflow |
| Apr 2025 | `pages/admin/productAttributePage.ts` created — full CRUD POM (createAttribute, editAttribute, deleteAttribute, searchAttribute, verifyAttributeInList) |
| Apr 2025 | `tests/admin/productAttribute.spec.ts` created — 4 serial CRUD tests with faker names (`randomAttributeName`) + shared state |
| Apr 2025 | `utils/fakerData.ts` — added `randomAttributeName()` (`faker.commerce.productMaterial()`) |
| Apr 2025 | `utils/testData.ts` — added `SeedData` export (fixed Brand/Category/Collection/Attribute constants for product tests) |
| Apr 2025 | `tests/admin/seedData.spec.ts` created — 4 serial tests that create permanent seed fixtures; reuses existing page objects + SeedData constants |
| Apr 2025 | `playwright.config.ts` — `seedData.spec.ts` added first in `adminPreSetup`, `productAttribute.spec.ts` added after `collectionCreate.spec.ts` |
| Apr 2025 | **Session 5 — FlyCommerce rebrand + 3-phase auth + Phase 2 customer journey** |
| Apr 2025 | `dokanCloudLoginPage.ts` → renamed to `flycommerceLoginPage.ts` |
| Apr 2025 | `utils/testData.ts` — renamed `dokanCloudUrl` → `flycommerceUrl`; added `SeedData.vendor`, `SeedData.customer`, `SeedData.product` (credentials read from `.env`) |
| Apr 2025 | `utils/fakerData.ts` — added `generateCheckoutData()` for customer checkout forms |
| Apr 2025 | `tests/auth.setup.ts` — renamed dokanCloud → flycommerce; vendor+customer auth wrapped in try/catch (graceful skip on Phase 1) |
| Apr 2025 | `tests/fixtures/auth.fixtures.ts` — `dokanCloudPage` → `flycommercePage`; `customerPage` fixture checks auth file existence; graceful skip if credentials/file missing |
| Apr 2025 | `tests/app_store/marketplaceOnboarding.spec.ts` — updated fixture reference from `dokanCloudPage` → `flycommercePage` |
| Apr 2025 | `pages/admin/customerManagementPage.ts` — `createCustomer()` accepts optional `password` field; added `verifyCustomerCreatedSuccessfully()` method |
| Apr 2025 | `tests/admin/seedData.spec.ts` — added 2 new tests: "Seed: create journey Vendor account" + "Seed: create journey Customer account" (uses SeedData.vendor/customer from .env) |
| Apr 2025 | `pages/customer/` — 5 new POMs: `customerAuthPage`, `storefrontPage`, `productDetailPage`, `cartPage`, `checkoutPage` |
| Apr 2025 | `tests/customer/` — `customerLogin`, `browseProducts`, `addToCart`, `checkout` |
| Apr 2026 | Customer storefront POMs + specs updated for **FlyCommerce** UI: cart/`h4` line titles, checkout wizard (Contact → Orders → Payment), add-to-cart modal via **Go to Cart**; `addToCart`/`checkout` slimmed to **1 test each**; `customerJourney` **90s** timeout; `customerPage` fixture uses `domcontentloaded` (no `networkidle` wait in fixture) |
| Apr 2026 | `playwright.config.ts` + workflow aligned to final phase architecture: `setupFlycommerceAuth` → `marketplaceSetup` → `setupMarketplaceAdminAuth` → `marketplaceAdminSetupGuide` → `adminSeedSetup` → `setupAuth` → `vendorJourney` → `customerJourney` |
| Apr 2026 | **Session 6 — Auth setup fixes + architecture cleanup** |
| Apr 2026 | `auth.setup.ts` — split into two files: `auth.setup.ts` (admin+flycommerce only) and `auth.setupUsers.ts` (vendor+customer only, Phase 3) |
| Apr 2026 | `auth.setup.ts` — fixed admin login locators: `#login-email` → `getByRole('textbox', { name: 'Email Address' })` etc. (matches adminAuthPage.ts, works on flycom.shop) |
| Apr 2026 | `auth.setupUsers.ts` — fixed vendor login locators: `#login-email`/`//button[@type='submit']` → role-based locators (vendor portal is same React app as admin) |
| Apr 2026 | `auth.setupUsers.ts` — simplified: switched from `browser.newContext()` pattern to simple `page` fixture (same as admin) |
| Apr 2026 | `playwright.config.ts` — removed ALL `dependencies` from projects; no forced re-runs; auth JSON files handle sessions; setup steps run manually once |
| Apr 2026 | `customerManagementPage.ts` — fixed `createPasswordInput` locator: `getByRole('textbox', { name: 'Password', exact: true })` → `getByRole('textbox', { name: '********' })` (actual placeholder); added `createConfirmPasswordInput`; `createCustomer()` now fills both password fields |
| Apr 2026 | `pages/vendor/productCreatePage.ts` — added `addAttribute()` method; `fillDimensions()` now selects weight unit + dimension unit; brand/collection use React Select fill-to-search pattern; `addProductLink` updated to `'Add Products'` (plural); `descriptionInput` updated to `nth(2)`; `createProduct()` now requires `attribute` field |
| Apr 2026 | `tests/vendor/productCreate.spec.ts` — all hardcoded data replaced with `SeedData.*` (brand, category, collection, attribute, product name/price) |

---

**Last Updated:** April 2026  
**Current Phase:** Phase 2 ✅ Complete — FlyCommerce customer journey (browse / add to cart / checkout) documented in POMs — Phase 3 next (Subscription Plans & Commission)
