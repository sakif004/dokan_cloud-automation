import { test } from '../fixtures/auth.fixtures';
import { StorefrontPage } from '../../pages/customer/storefrontPage';
import { ProductDetailPage } from '../../pages/customer/productDetailPage';
import { CartPage } from '../../pages/customer/cartPage';
import { CheckoutPage } from '../../pages/customer/checkoutPage';
import { SeedData } from '../../utils/testData';
import { generateCheckoutData } from '../../utils/fakerData';
import { ciStep } from '../../utils/ciLogger';

/**
 * End-to-end checkout (FlyCommerce wizard: contact → shipping → orders → payment → confirmation).
 * Depends on vendorJourney + customer auth (SeedData.product, customer session).
 */
test.describe('Customer Checkout', () => {

    test('complete checkout with Cash on Delivery', async ({ customerPage }) => {
        test.setTimeout(120_000);
        ciStep('customerJourney', 'Starting checkout with COD');

        const storefront    = new StorefrontPage(customerPage.page);
        const productDetail = new ProductDetailPage(customerPage.page);
        const cart          = new CartPage(customerPage.page);
        const checkoutPage  = new CheckoutPage(customerPage.page);

        await storefront.navigateToShop();
        ciStep('customerJourney', 'Shop opened');
        await storefront.searchProduct(SeedData.product.name);
        await storefront.selectProduct(SeedData.product.name);
        ciStep('customerJourney', `Product selected: ${SeedData.product.name}`);

        await productDetail.addToCart();
        await productDetail.verifyAddedToCart();
        await productDetail.goToCartFromModal();
        ciStep('customerJourney', 'Product added and cart opened');

        await cart.verifyCartPageLoaded();
        await cart.verifyCartSummaryVisible();
        await cart.verifyProductInCart(SeedData.product.name);
        await cart.proceedToCheckout();
        ciStep('customerJourney', 'Cart validated, moved to checkout');

        const data = generateCheckoutData();

        await checkoutPage.verifyContactInformationVisible(SeedData.customer.email);
        await checkoutPage.fillShippingStep({
            firstName: data.firstName,
            lastName: data.lastName,
            countrySearch: 'bangladesh',
            countryOption: 'Bangladesh',
            addressLine: 'wedevs Academy',
            phone: data.phone,
        });

        await checkoutPage.selectShippingAndContinueToPayment();
        await checkoutPage.selectCashOnDeliveryAndPlaceOrder();
        ciStep('customerJourney', 'Order placed via COD');

        await checkoutPage.verifyOrderReceived();
        ciStep('customerJourney', 'Order confirmation detected');

        const orderId = await checkoutPage.getOrderId();
        if (orderId) {
            ciStep('customerJourney', `Order reference: ${orderId}`);
        }

        await checkoutPage.goToMyOrders();
    });

});
