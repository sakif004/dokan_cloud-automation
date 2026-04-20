import { test } from '../fixtures/auth.fixtures';
import { StorefrontPage } from '../../pages/customer/storefrontPage';
import { ProductDetailPage } from '../../pages/customer/productDetailPage';
import { SeedData } from '../../utils/testData';

/**
 * Browse & Search tests — serial so cases run in order (CBR001 → CBR004).
 * Depends on vendorJourney having created SeedData.product.name first.
 */
test.describe.serial('Customer Browse & Search', () => {

    // CBR001: Navigate to shop and search for the seed product
    test('CBR001: searchProduct', async ({ customerPage }) => {
        // Initialize page object
        const storefront = new StorefrontPage(customerPage.page);

        // Navigate to shop
        await storefront.navigateToShop();

        // Search for the vendor-created seed product
        await storefront.searchProduct(SeedData.product.name);
    });

    // CBR002: Verify search results contain the seed product
    test('CBR002: validateSearchResults', async ({ customerPage }) => {
        // Initialize page object
        const storefront = new StorefrontPage(customerPage.page);

        // Navigate to shop and search
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);

        // Verify product appears in results
        await storefront.verifyProductVisible(SeedData.product.name);
    });

    // CBR003: Click through to product detail page
    test('CBR003: viewProductDetail', async ({ customerPage }) => {
        // Initialize page object
        const storefront = new StorefrontPage(customerPage.page);

        // Search and select product
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
    });

    // CBR004: Verify product detail page content
    test('CBR004: validateProductDetailPage', async ({ customerPage }) => {
        // Initialize page object
        const storefront   = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);

        // Navigate to product detail
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);

        // Verify product title on detail page
        await productDetail.verifyProductTitle(SeedData.product.name);
    });

});
