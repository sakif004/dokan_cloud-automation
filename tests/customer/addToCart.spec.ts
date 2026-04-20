import { test } from '../fixtures/auth.fixtures';
import { StorefrontPage } from '../../pages/customer/storefrontPage';
import { ProductDetailPage } from '../../pages/customer/productDetailPage';
import { SeedData } from '../../utils/testData';

/**
 * Add to cart — seed product only.
 * Depends on vendorJourney having created SeedData.product.name first.
 */
test.describe('Customer Add to Cart', () => {

    test('add product to cart', async ({ customerPage }) => {
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);

        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);

        await productDetail.addToCart();
        await productDetail.verifyAddedToCart();
    });

});
