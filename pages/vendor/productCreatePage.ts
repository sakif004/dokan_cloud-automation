// productCreatePage.ts
import { expect, Locator, Page } from '@playwright/test';
import { MediaManager } from '../common/mediaManager';

export class VendorProductPage {
    readonly page: Page;
    private readonly mediaManager: MediaManager;

    // Navigation
    readonly productsMenu: Locator;
    readonly allProductsLink: Locator;
    readonly addProductLink: Locator;

    // Product Form — Basic Info
    readonly productsHeading: Locator;
    readonly newProductHeading: Locator;
    readonly nameInput: Locator;
    readonly descriptionInput: Locator;
    readonly categoryInput: Locator;
    readonly uploadImageButton: Locator;

    // Product Form — Pricing
    readonly regularPriceInput: Locator;
    readonly salePriceInput: Locator;

    // Product Form — Attribute
    readonly addAttributeButton: Locator;
    readonly attributeNameInput: Locator;
    readonly attributeVisibleSwitch: Locator;
    readonly addAttributeSubmitButton: Locator;

    // Product Form — Shipping
    // React Select trigger for the shipping dropdown (scoped inside the .mt-6 shipping section)
    readonly shippingDropdownTrigger: Locator;
    readonly weightInput: Locator;
    readonly heightInput: Locator;
    readonly widthInput: Locator;
    readonly lengthInput: Locator;

    // Product Form — Status / Brand / Collection
    readonly statusSelect: Locator;
    // React Select trigger for brand (first .css-qqlcks-control block on the sidebar)
    readonly brandCombobox: Locator;
    // React Select trigger for collection (second .css-qqlcks-control block on the sidebar)
    readonly collectionCombobox: Locator;

    // Submit & Notifications
    readonly createProductButton: Locator;
    readonly successNotification: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mediaManager = new MediaManager(page);

        // Navigation
        this.productsMenu = page.locator('a').filter({ hasText: /^Products$/ });
        this.allProductsLink = page.getByRole('link', { name: 'All Products' });
        this.addProductLink = page.getByRole('link', { name: 'Add Products' }); // plural — updated in new UI

        // Basic Info
        this.productsHeading = page.getByRole('heading', { name: 'Products' });
        this.newProductHeading = page.getByRole('heading', { name: 'New Product' });
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.descriptionInput = page.getByRole('textbox').nth(2); // nth index updated in new UI
        this.categoryInput = page.getByRole('textbox', { name: 'Category' });
        this.uploadImageButton = page.getByRole('button', { name: 'Upload Image' });

        // Pricing
        this.regularPriceInput = page.getByRole('spinbutton', { name: 'Regular Price' });
        this.salePriceInput = page.getByRole('spinbutton', { name: 'Sale Price' });

        // Attribute
        this.addAttributeButton = page.getByRole('button', { name: 'Add Attribute' });
        this.attributeNameInput = page.getByRole('textbox', { name: 'Name' }); // reused for attribute name inside modal
        this.attributeVisibleSwitch = page.getByRole('switch', { name: 'Visible' });
        this.addAttributeSubmitButton = page.getByRole('button', { name: 'Add' });

        // Shipping — React Select trigger scoped to the shipping section
        this.shippingDropdownTrigger = page.locator('.mt-6 > .react-select > .css-b62m3t-container > .border-gray-200\\! > .css-hlgwow > .css-hvcrzd').first();
        this.weightInput = page.getByRole('spinbutton', { name: 'Weight' });
        this.heightInput = page.getByPlaceholder('Height');
        this.widthInput = page.getByPlaceholder('Width');
        this.lengthInput = page.getByPlaceholder('Length');

        // Status / Brand / Collection
        this.statusSelect = page.getByText('Draft');
        // Brand React Select: click trigger to open, then fill the combobox to search
        this.brandCombobox = page.getByRole('combobox', { name: 'Brand' });
        this.collectionCombobox = page.getByRole('combobox', { name: 'Collection' });

        // Submit & Notifications
        this.createProductButton = page.getByRole('button', { name: 'Create Product' });
        this.successNotification = page.getByText('Product created successfully');
    }

    /**
     * Navigate to the vendor Products list page
     */
    async navigateToProducts() {
        await this.productsMenu.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.allProductsLink.click();
        await this.page.waitForLoadState('networkidle');
        await expect(this.productsHeading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Click Add Products to open the new product form
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
     * Select category from the autocomplete dropdown
     */
    async selectCategory(categoryName: string) {
        await this.categoryInput.click();
        await this.categoryInput.fill(categoryName);
        await this.page.getByText(categoryName).click();
    }

    /**
     * Upload product image from URL via the shared MediaManager
     */
    async uploadProductImageFromURL(imageUrl: string) {
        await this.uploadImageButton.click();
        await this.mediaManager.uploadFromURL(imageUrl);
    }

    /**
     * Fill pricing — regular price and sale price
     */
    async fillPricing(regularPrice: string, salePrice: string) {
        await this.regularPriceInput.click();
        await this.regularPriceInput.fill(regularPrice);
        await this.salePriceInput.click();
        await this.salePriceInput.fill(salePrice);
    }

    /**
     * Add a product attribute by searching the existing attribute name
     * and enabling it as visible on the storefront.
     */
    async addAttribute(attributeName: string) {
        await this.addAttributeButton.click();
        await expect(this.page.getByText('Add New Attribute')).toBeVisible();

        // Type the attribute name — the input is also named 'Name' (same as product name field above)
        await this.attributeNameInput.click();
        await this.attributeNameInput.fill(attributeName);
        await this.page.getByText(attributeName).click(); // select from dropdown suggestion

        // Make attribute visible on storefront
        await this.attributeVisibleSwitch.click();

        // Confirm
        await this.addAttributeSubmitButton.click();
    }

    /**
     * Select shipping method from the React Select shipping dropdown
     */
    async selectShipping(shippingOption: string) {
        await this.shippingDropdownTrigger.click();
        await this.page.getByRole('option', { name: shippingOption }).click();
    }

    /**
     * Fill product weight, dimensions, and their units.
     * @param weightUnit - e.g. 'kg', 'g', 'lb'
     * @param dimensionUnit - e.g. 'cm', 'm', 'in'
     */
    async fillDimensions(
        weight: string,
        height: string,
        width: string,
        length: string,
        weightUnit: string = 'kg',
        dimensionUnit: string = 'cm',
    ) {
        // Weight value
        await this.weightInput.click();
        await this.weightInput.fill(weight);

        // Weight unit
        await this.page.getByText(weightUnit, { exact: true }).first().click();
        await this.page.getByRole('option', { name: weightUnit }).click();

        // Dimensions
        await this.heightInput.click();
        await this.heightInput.fill(height);
        await this.widthInput.click();
        await this.widthInput.fill(width);
        await this.lengthInput.click();
        await this.lengthInput.fill(length);

        // Dimension unit
        await this.page.getByText(dimensionUnit, { exact: true }).first().click();
        await this.page.getByRole('option', { name: dimensionUnit }).click();
    }

    /**
     * Select product status (e.g. 'Published', 'Draft')
     */
    async selectStatus(status: string) {
        await this.statusSelect.click();
        await this.page.getByRole('option', { name: status }).click();
    }

    /**
     * Select brand — opens React Select, types to search, picks option
     */
    async selectBrand(brandName: string) {
        await this.brandCombobox.fill(brandName.toLowerCase());
        await this.page.getByRole('option', { name: brandName }).click();
    }

    /**
     * Select collection — opens React Select, types to search, picks option
     */
    async selectCollection(collectionName: string) {
        await this.collectionCombobox.fill(collectionName.toLowerCase());
        await this.page.getByRole('option', { name: collectionName }).click();
    }

    /**
     * Submit the product creation form
     */
    async submitProductForm() {
        await expect(this.page.getByText('Unsaved Changes')).toBeVisible({ timeout: 5000 });
        await this.createProductButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * Verify product creation success via toast notification
     */
    async verifyProductCreatedSuccessfully() {
        await expect(this.successNotification).toBeVisible({ timeout: 10000 });
    }

    /**
     * Create a complete product end-to-end (convenience method)
     */
    async createProduct(productData: {
        name: string;
        description: string;
        category: string;
        imageUrl: string;
        regularPrice: string;
        salePrice: string;
        attribute: string;
        shipping: string;
        weight: string;
        height: string;
        width: string;
        length: string;
        weightUnit?: string;
        dimensionUnit?: string;
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
        await this.addAttribute(productData.attribute);
        await this.selectShipping(productData.shipping);
        await this.fillDimensions(
            productData.weight,
            productData.height,
            productData.width,
            productData.length,
            productData.weightUnit ?? 'kg',
            productData.dimensionUnit ?? 'cm',
        );
        await this.selectStatus(productData.status);
        await this.selectBrand(productData.brand);
        await this.selectCollection(productData.collection);
        await this.submitProductForm();
    }
}
