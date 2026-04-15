import { config as dotenvConfig } from 'dotenv';
dotenvConfig(); // Load environment variables from .env file

// ─── URLs & Credentials (loaded from .env) ───────────────────────────────────
let Urls: {
    adminUrl: string;
    adminEmail: string;
    adminPassword: string;
    vendorUrl: string;
    vendorEmail: string;
    vendorPassword: string;
    customerUrl: string;
    customerEmail: string;
    customerPassword: string;
    flycommerceUrl: string;   // renamed from dokanCloudUrl — FlyCommerce Cloud App
    flycommerceEmail: string;
    flycommercePassword: string;
} = {
    // Main Marketplace Site
    adminUrl: process.env.ADMIN_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',

    vendorUrl: process.env.VENDOR_URL || '',
    vendorEmail: process.env.VENDOR_EMAIL || '',
    vendorPassword: process.env.VENDOR_PASSWORD || '',

    customerUrl: process.env.CUSTOMER_URL || '',
    customerEmail: process.env.CUSTOMER_EMAIL || '',
    customerPassword: process.env.CUSTOMER_PASSWORD || '',

    // FlyCommerce Cloud App (app.flycommerce.com — formerly Dokan Cloud)
    // env var name kept as DOKAN_CLOUD_* for backwards compatibility
    flycommerceUrl: process.env.DOKAN_CLOUD_URL || '',
    flycommerceEmail: process.env.DOKAN_CLOUD_EMAIL || '',
    flycommercePassword: process.env.DOKAN_CLOUD_PASSWORD || '',
};

/**
 * SeedData — Fixed entities created ONCE by seedData.spec.ts (adminSeedSetup project).
 * These are permanent fixtures — NEVER deleted by any test.
 *
 * Two-tier data strategy:
 *   Tier 1 (here)      → fixed names, permanent, used by journey tests
 *   Tier 2 (fakerData) → random names, temporary, used only in CRUD tests
 *
 * vendor.email and vendor.password read directly from .env — single source of truth.
 * The admin panel lets you set the password manually when creating a vendor/customer,
 * so auth.setup.ts (setupAuth phase) can then login with those exact credentials.
 */
export const SeedData = {
    // ─── Product Catalogue Fixtures ───────────────────────────────────────────
    brand: {
        name: 'Automation Brand',
        description: 'Fixed brand for product creation tests',
        imageUrl: 'https://www.thethrive.in/wp-content/uploads/2022/03/All-You-Need-To-Know-About-Brand-Image.jpg',
    },
    category: {
        name: 'Automation Category',
        description: 'Fixed category for product creation tests',
    },
    collection: {
        name: 'Automation Collection',
        description: 'Fixed collection for product creation tests',
        imageUrl: 'https://img.freepik.com/free-vector/new-collection-lettering-with-gradient-leaves-creative-inscription-leaves-center_1262-13804.jpg',
    },
    attribute: {
        name: 'Automation Size',
        type: 'Multiselect',
        options: ['S', 'M', 'L', 'XL'],
    },

    // ─── Journey Accounts (created by adminSeedSetup, used across journey tests) ──
    vendor: {
        firstName: 'Journey',
        lastName: 'Vendor',
        storeName: 'Journey Vendor Store',
        email: process.env.VENDOR_EMAIL ?? '',  // must match .env VENDOR_EMAIL
        password: process.env.VENDOR_PASSWORD ?? '',  // must match .env VENDOR_PASSWORD
        phone: '01700000001',
        country: 'Bangladesh',
        address: 'wedevs Academy',
        division: 'Dhaka',
        city: 'Dhaka',
        subscriptionPlan: 'Free Plan',
    },
    customer: {
        firstName: 'Journey',
        lastName: 'Customer',
        email: process.env.CUSTOMER_EMAIL ?? '',  // must match .env CUSTOMER_EMAIL
        password: process.env.CUSTOMER_PASSWORD ?? '',  // must match .env CUSTOMER_PASSWORD
        phone: '01800000001',
    },

    // ─── Seed Product (vendor creates it, customer buys it) ───────────────────
    product: {
        name: 'Automation Product',
        price: '1200',
    },
};

/**----------------------------*/
export {
    Urls,
};
