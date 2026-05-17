import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

/**
 * Flow 3: The Full Checkout Process
 *
 * Tests the critical happy path from adding a product all the way through
 * to receiving an order confirmation. Also tests form validation on the
 * shipping info step.
 */
test.describe('Checkout Process', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;

  const PRODUCT_NAME = 'Sauce Labs Fleece Jacket';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);

    // Arrange: Log in, add a product, and go to the cart
    await loginPage.goto();
    await loginPage.login();
    await inventoryPage.expectToBeOnInventoryPage();
    await inventoryPage.addItemToCartByName(PRODUCT_NAME);
    await inventoryPage.goToCart();
    await cartPage.expectToBeOnCartPage();
  });

  test('should complete the full checkout flow and show an order confirmation', async ({ page }) => {
    // Act Step 1: Proceed from cart to checkout info form
    await cartPage.proceedToCheckout();
    await checkoutPage.expectToBeOnStepOne();

    // Act Step 2: Fill shipping information (reads from .env)
    await checkoutPage.fillShippingInfo();
    await checkoutPage.expectToBeOnStepTwo();

    // Act Step 3: Review summary and confirm the order
    await checkoutPage.finishOrder();

    // Assert: Order confirmation screen is shown
    await checkoutPage.expectOrderConfirmed();

    // Assert: Cart badge is gone (cart is now empty)
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should show a validation error if shipping info is incomplete', async ({ page }) => {
    // Act: Navigate to step one
    await cartPage.proceedToCheckout();
    await checkoutPage.expectToBeOnStepOne();

    // Act: Try to continue with all fields blank
    await checkoutPage.continueButton.click();

    // Assert: Validation error for missing first name is shown
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('First Name is required');
  });

  test('should allow user to return to cart from checkout step one', async ({ page }) => {
    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.expectToBeOnStepOne();

    // Act: Click the cancel button
    await page.locator('[data-test="cancel"]').click();

    // Assert: Returned to cart
    await cartPage.expectToBeOnCartPage();
    expect(await cartPage.hasItem(PRODUCT_NAME)).toBe(true);
  });
});
