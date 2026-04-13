import { test, expect } from '../fixtures/auth.fixtures';
import { StorefrontPage } from '../../pages/customer/storefrontPage';
import { ProductDetailPage } from '../../pages/customer/productDetailPage';
import { CartPage } from '../../pages/customer/cartPage';
import { CheckoutPage } from '../../pages/customer/checkoutPage';
import { SeedData } from '../../utils/testData';
import { generateCheckoutData } from '../../utils/fakerData';

/**
 * Checkout flow — serial because each step builds on the previous.
 * Depends on vendorJourney having created SeedData.product first.
 * Uses generateCheckoutData() for random (but valid) billing address.
 */

const shared: { orderId: string } = { orderId: '' };

test.describe.serial('Customer Checkout Flow', () => {

    // CCO001: Add seed product and proceed to checkout
    test('CCO001: addProductAndGoToCheckout', async ({ customerPage }) => {
        // Extended timeout — network waits across multiple page loads
        test.setTimeout(60000);

        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);

        // Find and open the seed product (created by vendor journey)
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);

        // Add to cart
        await productDetail.addToCart();
        await productDetail.verifyAddedToCart();

        // Navigate to cart and verify
        await cart.navigateToCart();
        await cart.verifyProductInCart(SeedData.product.name);

        // Proceed to checkout
        await cart.proceedToCheckout();
    });

    // CCO002: Fill contact and shipping info with random data
    test('CCO002: fillContactAndShippingInfo', async ({ customerPage }) => {
        // Initialize checkout page
        const checkoutPage = new CheckoutPage(customerPage.page);

        // Navigate to checkout directly (serial — we may still be here)
        await checkoutPage.navigateToCheckout();

        // Generate random billing data for this test run
        const data = generateCheckoutData();

        // Fill billing address
        await checkoutPage.fillShippingAddress({
            firstName: data.firstName,
            lastName:  data.lastName,
            address:   data.address,
            city:      data.city,
        });

        // Fill contact info
        await checkoutPage.fillContactInfo({
            email: SeedData.customer.email,
            phone: data.phone,
        });
    });

    // CCO003: Select Cash on Delivery payment method
    test('CCO003: selectPaymentMethod', async ({ customerPage }) => {
        // Initialize checkout page
        const checkoutPage = new CheckoutPage(customerPage.page);

        // Navigate to checkout
        await checkoutPage.navigateToCheckout();

        // Select Cash on Delivery (configured during setupGuide)
        await checkoutPage.selectPaymentMethod('cod');
    });

    // CCO004 + CCO005: Place order and verify confirmation
    test('CCO004: placeOrderAndVerifyConfirmation', async ({ customerPage }) => {
        // Extended timeout — payment processing + redirect
        test.setTimeout(60000);

        // Initialize page objects
        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);
        const checkoutPage  = new CheckoutPage(customerPage.page);

        // Full flow: add → cart → checkout → fill → pay → confirm
        await storefront.navigateToShop();
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
        await productDetail.addToCart();
        await productDetail.verifyAddedToCart();

        await cart.navigateToCart();
        await cart.verifyProductInCart(SeedData.product.name);
        await cart.proceedToCheckout();

        // Fill billing details with random but valid data
        const data = generateCheckoutData();
        await checkoutPage.fillShippingAddress({
            firstName: data.firstName,
            lastName:  data.lastName,
            address:   data.address,
            city:      data.city,
        });
        await checkoutPage.fillContactInfo({
            email: SeedData.customer.email,
            phone: data.phone,
        });

        // Select payment and place order
        await checkoutPage.selectPaymentMethod('cod');
        await checkoutPage.placeOrder();

        // Verify confirmation page
        await checkoutPage.verifyOrderConfirmation();

        // Capture order ID for downstream tests (adminVerify project)
        shared.orderId = await checkoutPage.getOrderId();
        console.log(`✅ Order placed. Order ID: ${shared.orderId}`);
    });

});
