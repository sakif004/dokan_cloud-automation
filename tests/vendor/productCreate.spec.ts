import { test } from '../fixtures/auth.fixtures';
import { VendorProductPage } from '../../pages/vendor/productCreatePage';
test.describe('Vendor - Product Management', () => {
    test('Create Product with Brand and Collection', async ({vendorPage}) => {
        const productData = {
            name: 'Test Product',
            description: 'Test Product Description',
            category: 'Test Category',
            imageUrl: 'https://st4.depositphotos.com/14431644/37827/i/450/depositphotos_378271014-stock-photo-word-writing-text-product-test.jpg',
            regularPrice: '1200',
            salePrice: '1000',
            shipping: 'Free Shipping',
            weight: '1',
            height: '200',
            width: '200',
            length: '200',
            status: 'Published',
            brand: 'Test Brand',
            collection: 'Test Collection'
        };

        // Initialize VendorProductPage
        const productPage = new VendorProductPage(vendorPage.page);

        // Create product
        await productPage.createProduct(productData);

        // Verify product was created successfully
        await productPage.verifyProductCreatedSuccessfully();
    });
});