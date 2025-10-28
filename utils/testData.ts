import { config as dotenvConfig } from 'dotenv';
dotenvConfig(); // Load environment variables from .env file

// import { faker } from '@faker-js/faker'; TODO: Uncomment if faker is needed in the future

// Url data
let Urls: {
    adminUrl: string;
    adminEmail: string;
    adminPassword: string;
    vendorUrl: string;
    vendorEmail: string;
    vendorPassword: string;
    customerUrl: string;
} = {
    // Main Site URL
    adminUrl: process.env.ADMIN_URL || '',
    adminEmail: process.env.ADMIN_EMAIL || '',
    adminPassword: process.env.ADMIN_PASSWORD || '',
    vendorUrl: process.env.VENDOR_URL || '',
    vendorEmail: process.env.VENDOR_EMAIL || '',
    vendorPassword: process.env.VENDOR_PASSWORD || '',
    customerUrl: process.env.CUSTOMER_URL || '',

};


/**----------------------------*/
export {
    Urls,
};