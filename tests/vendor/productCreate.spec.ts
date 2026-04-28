import { test } from '../fixtures/auth.fixtures';
import { VendorProductPage } from '../../pages/vendor/productCreatePage';
import { SeedData } from '../../utils/testData';
import { ciStep } from '../../utils/ciLogger';

test.describe('Vendor - Product Management', () => {

    test('Create Product', async ({ vendorPage }) => {
        ciStep('vendorJourney', 'Vendor product creation starting');
        const productPage = new VendorProductPage(vendorPage.page);

        // Use SeedData for fixed entities — these were created by adminSeedSetup (seedData.spec.ts)
        await productPage.createProduct({
            name:          SeedData.product.name,
            description:   'Automation test product for journey tests',
            category:      SeedData.category.name,
            imageUrl:      'https://st4.depositphotos.com/14431644/37827/i/450/depositphotos_378271014-stock-photo-word-writing-text-product-test.jpg',
            regularPrice:  SeedData.product.price,
            salePrice:     '1000',
            attribute:     SeedData.attribute.name,  // 'Automation Size' — created by seedData.spec.ts
            shipping:      'Free Shipping',
            weight:        '1',
            height:        '200',
            width:         '200',
            length:        '200',
            weightUnit:    'kg',
            dimensionUnit: 'cm',
            status:        'Published',
            brand:         SeedData.brand.name,
            collection:    SeedData.collection.name,
        });
        ciStep('vendorJourney', `Product created request submitted: ${SeedData.product.name}`);

        // Verify product was created successfully
        await productPage.verifyProductCreatedSuccessfully();
        ciStep('vendorJourney', 'Product creation verified');
    });

});
