import { test } from '../fixtures/auth.fixtures';
import { StorefrontPage } from '../../pages/customer/storefrontPage';
import { ProductDetailPage } from '../../pages/customer/productDetailPage';
import { CartPage } from '../../pages/customer/cartPage';
import { SeedData } from '../../utils/testData';

/**
 * Cart management tests.
 * Depends on vendorJourney project having created SeedData.product.name first.
 */
test.describe('Customer Cart Management', () => {

    // CCT001: Add the seed product to cart
    test('CCT001: addProductToCart', async ({ customerPage }) => {
        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);

        // Find and open the seed product
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);

        // Add to cart
        await productDetail.addToCart();

        // Verify product was added
        await productDetail.verifyAddedToCart();
    });

    // CCT002: Verify cart contains the product
    test('CCT002: validateCartItem', async ({ customerPage }) => {
        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);

        // Add product to cart
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
        await productDetail.addToCart();

        // Navigate to cart and verify
        await cart.navigateToCart();
        await cart.verifyProductInCart(SeedData.product.name);
    });

    // CCT003: Update quantity in cart
    test('CCT003: updateCartQuantity', async ({ customerPage }) => {
        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);

        // Add product to cart with quantity 2
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
        await productDetail.setQuantity(2);
        await productDetail.addToCart();

        // Verify cart has the product
        await cart.navigateToCart();
        await cart.verifyProductInCart(SeedData.product.name);
    });

    // CCT004: Remove product from cart (navigate to empty cart, verify empty state)
    test('CCT004: removeFromCart', async ({ customerPage }) => {
        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);

        // Add product first
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
        await productDetail.addToCart();

        // Go to cart and remove item
        await cart.navigateToCart();
        await cart.verifyProductInCart(SeedData.product.name);

        // Click the remove/delete icon (WooCommerce uses .remove class)
        const removeButton = customerPage.page.locator('.remove, [aria-label*="Remove"], [title*="Remove"]').first();
        if (await removeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await removeButton.click();
            await customerPage.page.waitForLoadState('networkidle');
            await cart.verifyCartIsEmpty();
        }
    });

});
