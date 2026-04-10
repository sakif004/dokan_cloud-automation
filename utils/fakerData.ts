// utils/fakerData.ts
import { faker } from '@faker-js/faker';

/**
 * FakerData — Reusable random data generators for Playwright tests.
 *
 * Import only what you need:
 *   import { randomEmail, randomStoreName } from '../../utils/fakerData';
 *
 * Or use the full generators:
 *   import { generateVendorData, generateCustomerData } from '../../utils/fakerData';
 */

// ─── Primitives ───────────────────────────────────────────────────────────────

export const randomEmail = (): string =>
    faker.internet.email().toLowerCase();

export const randomPassword = (): string =>
    faker.internet.password({ length: 12, memorable: false });

export const randomFirstName = (): string =>
    faker.person.firstName();

export const randomLastName = (): string =>
    faker.person.lastName();

export const randomPhone = (): string =>
    faker.phone.number({ style: 'international' });

export const randomStoreName = (): string =>
    faker.company.name().replace(/[^a-zA-Z0-9 ]/g, '').trim() + ' Store';

export const randomProductName = (): string =>
    faker.commerce.productName();

export const randomDescription = (): string =>
    faker.commerce.productDescription();

export const randomPrice = (): string =>
    faker.commerce.price({ min: 10, max: 500, dec: 2 });

// ─── Composite Generators ─────────────────────────────────────────────────────

/**
 * Generate unique vendor creation data.
 * storeName and email are always unique to avoid marketplace conflicts.
 */
export const generateVendorData = () => ({
    firstName: randomFirstName(),
    lastName: randomLastName(),
    storeName: randomStoreName(),
    email: randomEmail(),
    phone: '01970741571',
    password: randomPassword(),
});

/**
 * Generate unique customer data.
 */
export const generateCustomerData = () => ({
    firstName: randomFirstName(),
    lastName: randomLastName(),
    email: randomEmail(),
    phone: randomPhone(),
    password: randomPassword(),
});

/**
 * Generate unique product data.
 */
export const generateProductData = () => ({
    name: randomProductName(),
    description: randomDescription(),
    regularPrice: randomPrice(),
    salePrice: faker.commerce.price({ min: 5, max: 9, dec: 2 }),
});
