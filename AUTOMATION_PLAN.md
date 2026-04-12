# Dokan Automation — Master Plan & Task Tracker

> **Purpose:** This file tracks all automation tasks, their status, and progress.  
> **Rule:** Every time a task is completed, update the status here AND update `PROJECT_CONTEXT.md`.  
> **For new AI sessions:** Read this file + `PROJECT_CONTEXT.md` first before starting any work.

---

## 🏢 Business Context (Quick Summary)

**Dokan** is a multi-tenant SaaS e-commerce platform. Users create **Marketplaces** or **Standalone Stores** via `app.dokan.co`. Each store gets a unique subdomain (e.g. `storename.flycom.shop`).

**Three roles inside each marketplace:**
- **Admin** (`/admin`) — configures the marketplace (setup guide, payments, vendors, categories)
- **Vendor** (`/vendor`) — creates products, manages orders
- **Customer** (storefront `/`) — browses and purchases products

**Commission model:** Admin creates subscription plans (with commission % + limits) → Vendor purchases a plan during onboarding → commission is applied automatically on sales.

**Two applications being tested:**
1. `app.dokan.co` — Dokan Cloud (marketplace creation + management)
2. `*.flycom.shop` — Individual marketplace subdomain (admin + vendor + customer)

---

## 📁 Current Project Structure

```
pages/
├── app_store/
│   ├── dokanCloudLoginPage.ts          ✅ Done
│   └── marketplaceOnboardingPage.ts    ✅ Done
├── admin/
│   ├── adminAuthPage.ts                ✅ Done
│   ├── setupGuidePage.ts               ✅ Done
│   ├── productCategoryPage.ts          ✅ Done
│   ├── productBrandPage.ts             ✅ Done
│   ├── productCollectionPage.ts        ✅ Done
│   ├── productManagementPage.ts        ✅ Done
│   ├── vendorsPage.ts                  ✅ Done
│   └── customerManagementPage.ts       ✅ Done
├── vendor/
│   ├── vendorAuthPage.ts               ✅ Done
│   └── productCreatePage.ts            ✅ Done
├── customer/                           ⬜ Empty — Phase 2
└── common/
    ├── chatManager.ts                  ✅ Done
    └── mediaManager.ts                 ✅ Done

utils/
├── testData.ts                         ✅ Done
└── fakerData.ts                        ✅ Done

tests/
├── app_store/
│   └── marketplaceOnboarding.spec.ts   ✅ Done
├── admin/
│   ├── adminLogin.spec.ts              ✅ Done
│   ├── categoryCreate.spec.ts          ✅ Done
│   ├── brandCreate.spec.ts             ✅ Done
│   ├── collectionCreate.spec.ts        ✅ Done
│   ├── vendorCreate.spec.ts            ✅ Done
│   ├── customerManagement.spec.ts      ✅ Done
│   ├── setupGuide.spec.ts              ✅ Done
│   ├── deleteCategory.spec.ts          ✅ Done
│   ├── deleteBrand.spec.ts             ✅ Done
│   ├── deleteCollection.spec.ts        ✅ Done
│   └── deleteProduct.spec.ts           ✅ Done
├── vendor/
│   ├── vendorLogin.spec.ts             ✅ Done
│   └── productCreate.spec.ts           ✅ Done
├── customer/                           ⬜ Empty — Phase 2
├── e2e/
│   ├── e2eCreateMarketplace.spec.ts    ⚠️  Old codegen file (not in use)
│   └── e2eDeleteProductRelatedThings.spec.ts  ✅ Done
├── fixtures/
│   └── auth.fixtures.ts               ✅ Done
└── auth.setup.ts                      ✅ Done
```

---

## 🔑 Auth & Fixtures Summary

| Fixture | File | Domain | Session File | Status |
|---------|------|--------|-------------|--------|
| `adminPage` | `auth.fixtures.ts` | `*.flycom.shop/admin` | `playwright/.auth/admin.json` | ✅ |
| `vendorPage` | `auth.fixtures.ts` | `*.flycom.shop/vendor` | `playwright/.auth/vendor.json` | ✅ |
| `customerPage` | `auth.fixtures.ts` | `*.flycom.shop/` (storefront) | `playwright/.auth/customer.json` | ⚠️ Placeholder |
| `dokanCloudPage` | `auth.fixtures.ts` | `app.dokan.co` | `playwright/.auth/dokanCloud.json` | ✅ |

---

## ✅ Playwright Config Projects

| Project | Runs | Dependencies | Status |
|---------|------|-------------|--------|
| `setup` | `auth.setup.ts` | — | ✅ Working |
| `marketplaceSetup` | `tests/app_store/marketplaceOnboarding.spec.ts` | `setup` (commented out) | ✅ Working |
| `adminPreSetup` | vendor/category/brand/collection/setupGuide/customer | `setup` (commented out) | ✅ Working |
| `vendorProductCreation` | `productCreate.spec.ts` + e2e delete | `setup` (commented out) | ✅ Working |
| `cleanup` | (empty) | — | ⬜ Not implemented |

> **Known issue:** `dependencies` are commented out in all projects. Manual order required: run `setup` first.

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
| 1.5 | Add "Preview Store" verification in spec | `tests/app_store/marketplaceOnboarding.spec.ts` | ✅ Done | `.flycom.shop` URL pattern check |
| 1.6 | Verify `setupGuide.spec.ts` locators after rebranding | `pages/admin/setupGuidePage.ts` | ✅ Done | `businessDetailsLink` → `getByRole('tab')`, `brandLink` → `getByRole('tab')`, `saveButton` → `Save Changes` |
| 1.7 | Verify all admin page locators after rebranding | `pages/admin/*.ts` | ⬜ Pending | Run `adminPreSetup` project and fix failures |
| 1.8 | Enable `dependencies` in `playwright.config.ts` | `playwright.config.ts` | ⬜ Pending | Uncomment setup dependencies |
| 1.9 | Create `.env.example` file | `.env.example` | ⬜ Pending | Template for new team members |
| 1.10 | Clean up `e2eCreateMarketplace.spec.ts` | `tests/e2e/e2eCreateMarketplace.spec.ts` | ⬜ Pending | Old file, either remove or archive |

---

## 📋 PHASE 2 — Customer / Storefront Flow (Next Priority)

> Goal: Automate the buyer journey on the storefront

### 2A — New Files Needed

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 2.1 | Create `customerAuthPage.ts` | `pages/customer/customerAuthPage.ts` | ⬜ Pending |
| 2.2 | Create `storefrontPage.ts` | `pages/customer/storefrontPage.ts` | ⬜ Pending |
| 2.3 | Create `productDetailPage.ts` | `pages/customer/productDetailPage.ts` | ⬜ Pending |
| 2.4 | Create `cartPage.ts` | `pages/customer/cartPage.ts` | ⬜ Pending |
| 2.5 | Create `checkoutPage.ts` | `pages/customer/checkoutPage.ts` | ⬜ Pending |

### 2B — Auth Setup

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 2.6 | Implement `customerPage` fixture properly | `tests/fixtures/auth.fixtures.ts` | ⬜ Pending |
| 2.7 | Add `authenticate customer` in auth setup | `tests/auth.setup.ts` | ⬜ Pending |

### 2C — Test Specs

| # | Task | File to Create | Status |
|---|------|---------------|--------|
| 2.8 | Customer login spec | `tests/customer/customerLogin.spec.ts` | ⬜ Pending |
| 2.9 | Browse products spec | `tests/customer/browseProducts.spec.ts` | ⬜ Pending |
| 2.10 | Add to cart spec | `tests/customer/addToCart.spec.ts` | ⬜ Pending |
| 2.11 | Checkout flow spec | `tests/customer/checkout.spec.ts` | ⬜ Pending |
| 2.12 | Add `customerTests` project to `playwright.config.ts` | `playwright.config.ts` | ⬜ Pending |

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
| T1 | `dependencies` commented out in all config projects — manual order needed | `playwright.config.ts` | Medium |
| T2 | `e2eCreateMarketplace.spec.ts` is old codegen, not POM, not in use | `tests/e2e/` | Low |
| T3 | `countryDropdownTrigger` uses `nth(2)` — fragile if UI changes | `marketplaceOnboardingPage.ts` | Low |
| T4 | `divisionDropdownTrigger` uses `nth(5)` — fragile if UI changes | `marketplaceOnboardingPage.ts` | Low |
| T5 | ~~`setupGuide.spec.ts` uses `adminPage` fixture but navigates to marketplace subdomain~~ — Fixed: same credentials, just update `ADMIN_URL` in `.env` to new marketplace URL + re-run setup | `utils/testData.ts`, `tests/admin/setupGuide.spec.ts` | ✅ Fixed |

---

## 🗂️ Environment Variables Reference

```env
# Required — Main Marketplace Site
ADMIN_URL=https://your-store.flycom.shop
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password

VENDOR_URL=https://your-store.flycom.shop
VENDOR_EMAIL=vendor@example.com
VENDOR_PASSWORD=your_password

# Optional — Customer (Storefront)
CUSTOMER_URL=https://your-store.flycom.shop
CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=your_password

# Optional — Dokan Cloud (app.dokan.co)
DOKAN_CLOUD_URL=https://app.dokan.co
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

---

**Last Updated:** April 2025 (Session 3)  
**Current Phase:** Phase 1 (Stabilize) — moving to Phase 2 (Customer Flow)
