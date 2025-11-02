// vendorProductPage.ts
import { expect, Locator, Page } from '@playwright/test';

export class VendorProductPage {
    readonly page: Page;

    // Navigation
    readonly productsMenu: Locator;
    readonly allProductsLink: Locator;
    readonly addProductLink: Locator;

    // Product Form Locators
    readonly productsHeading: Locator;
    readonly newProductHeading: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly categoryInput: Locator;
    readonly uploadImageButton: Locator;
    readonly insertMediaHeading: Locator;
    readonly uploadFilesButton: Locator;
    readonly addFromURLButton: Locator;
    readonly urlInput: Locator;
    readonly addMediaButton: Locator;
    readonly selectImageButton: Locator;
    readonly regularPriceInput: Locator;
    readonly salePriceInput: Locator;
    readonly shippingSelect: Locator;
    readonly weightInput: Locator;
    readonly heightInput: Locator;
    readonly widthInput: Locator;
    readonly lengthInput: Locator;
    readonly statusSelect: Locator;
    readonly brandSelect: Locator;
    readonly collectionSelect: Locator;
    readonly createProductButton: Locator;

    // Notification
    readonly successNotification: Locator;

    constructor(page: Page) {
        this.page = page;

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.allProductsLink = page.getByRole('link', { name: 'All Products' });
        this.addProductLink = page.getByRole('link', { name: 'Add Product' });

        // Product Form
        this.productsHeading = page.getByRole('heading', { name: 'Products' });
        this.newProductHeading = page.getByRole('heading', { name: 'New Product' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.descriptionInput = page.getByRole('textbox').nth(1);
        this.categoryInput = page.getByRole('textbox', { name: 'Category' });
        this.uploadImageButton = page.getByRole('button', { name: 'Upload Image' });
        this.insertMediaHeading = page.getByRole('heading', { name: 'Insert Media' });
        this.uploadFilesButton = page.getByRole('button', { name: 'Upload Files' });
        this.addFromURLButton = page.getByRole('button', { name: 'Add from URL' });
        this.urlInput = page.getByRole('textbox', { name: 'https://' });
        this.addMediaButton = page.getByRole('button', { name: 'Add media' });
        this.selectImageButton = page.getByRole('button', { name: 'Select' });
        this.regularPriceInput = page.getByRole('spinbutton', { name: 'Regular Price' });
        this.salePriceInput = page.getByRole('spinbutton', { name: 'Sale Price' });
        this.shippingSelect = page.locator('.css-hvcrzd').first();
        this.weightInput = page.getByRole('spinbutton', { name: 'Weight' });
        this.heightInput = page.getByPlaceholder('Height');
        this.widthInput = page.getByPlaceholder('Width');
        this.lengthInput = page.getByPlaceholder('Length');
        this.statusSelect = page.getByText('Draft');
        this.brandSelect = page.getByRole('combobox', { name: 'Brand' });
        this.collectionSelect = page.getByRole('combobox', { name: 'Collection' });
        this.createProductButton = page.getByRole('button', { name: 'Create Product' });

        // Notification
        this.successNotification = page.getByText('Product created successfully');
    }

    /**
     * Navigate to Products page
     */
    async navigateToProducts() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.allProductsLink.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.productsHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click Add Product button to open form
     */
    async openAddProductForm() {
        await this.addProductLink.click();
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.newProductHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Fill product name
     */
    async fillProductName(name: string) {
        await this.nameInput.click();
        await this.nameInput.fill(name);
    }

    /**
     * Fill product description
     */
    async fillProductDescription(description: string) {
        await this.descriptionInput.click();
        await this.descriptionInput.fill(description);
    }

    /**
     * Select category
     */
    async selectCategory(categoryName: string) {
        await this.categoryInput.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByText(categoryName).click();
    }

    /**
     * Upload product image from URL
     */
    async uploadProductImageFromURL(imageUrl: string) {
        // Click Upload Image button
        await this.uploadImageButton.click();
        await expect(this.insertMediaHeading).toBeVisible({ timeout: 10000 });

        // Click Upload Files button
        await this.uploadFilesButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Click Add from URL
        await this.addFromURLButton.click();
        await this.page.waitForLoadState('domcontentloaded');

        // Fill URL
        await this.urlInput.fill(imageUrl);

        // Click Add media button
        await this.addMediaButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);

        // Select the image
        await this.selectImageButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
    }

    /**
     * Fill pricing information
     */
    async fillPricing(regularPrice: string, salePrice: string) {
        await this.regularPriceInput.click();
        await this.regularPriceInput.fill(regularPrice);
        await this.salePriceInput.click();
        await this.salePriceInput.fill(salePrice);
    }

    /**
     * Select shipping option
     */
    async selectShipping(shippingOption: string) {
        await this.shippingSelect.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('option', { name: shippingOption }).click();
    }

    /**
     * Fill product dimensions
     */
    async fillDimensions(weight: string, height: string, width: string, length: string) {
        await this.weightInput.click();
        await this.weightInput.fill(weight);
        await this.heightInput.click();
        await this.heightInput.fill(height);
        await this.widthInput.click();
        await this.widthInput.fill(width);
        await this.lengthInput.click();
        await this.lengthInput.fill(length);
    }

    /**
     * Select product status
     */
    async selectStatus(status: string) {
        await this.statusSelect.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('option', { name: status }).click();
    }

    /**
     * Select brand
     */
    async selectBrand(brandName: string) {
        await this.brandSelect.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('option', { name: brandName }).click();
    }

    /**
     * Select collection
     */
    async selectCollection(collectionName: string) {
        await this.collectionSelect.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.getByRole('option', { name: collectionName }).click();
    }

    /**
     * Submit product form
     */
    async submitProductForm() {
        await this.createProductButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify product creation success via notification
     */
    async verifyProductCreatedSuccessfully() {
        await expect(this.successNotification).toBeVisible({ timeout: 10000 });
    }

    /**
     * Create product with complete information (convenience method)
     */
    async createProduct(productData: {
        name: string;
        description: string;
        category: string;
        imageUrl: string;
        regularPrice: string;
        salePrice: string;
        shipping: string;
        weight: string;
        height: string;
        width: string;
        length: string;
        status: string;
        brand: string;
        collection: string;
    }) {
        await this.navigateToProducts();
        await this.openAddProductForm();
        await this.fillProductName(productData.name);
        await this.fillProductDescription(productData.description);
        await this.selectCategory(productData.category);
        await this.uploadProductImageFromURL(productData.imageUrl);
        await this.fillPricing(productData.regularPrice, productData.salePrice);
        await this.selectShipping(productData.shipping);
        await this.fillDimensions(productData.weight, productData.height, productData.width, productData.length);
        await this.selectStatus(productData.status);
        await this.selectBrand(productData.brand);
        await this.selectCollection(productData.collection);
        await this.submitProductForm();
    }
}