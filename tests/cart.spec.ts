import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';

/**
 * Flow 2: Inventory & Cart Management
 *
 * Tests that products can be added to the cart, that the cart badge
 * updates correctly, and that the cart page reflects the correct
 * item names and prices.
 */
test.describe('Cart Management', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  // The specific product we will use across tests in this suite
  const PRODUCT_NAME = 'Sauce Labs Backpack';

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Arrange: Log in and land on the inventory page
    await loginPage.goto();
    await loginPage.login();
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should increment the cart badge when an item is added', async () => {
    // Arrange: Confirm badge is not visible yet (cart is empty)
    await expect(inventoryPage.cartBadge).not.toBeVisible();

    // Act: Add one product to the cart
    await inventoryPage.addItemToCartByName(PRODUCT_NAME);

    // Assert: Badge appears and shows "1"
    await expect(inventoryPage.cartBadge).toBeVisible();
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(1);
  });

  test('should display the correct item in the cart with matching price', async () => {
    // Arrange: Capture the price shown on the inventory page
    const inventoryPrice = await inventoryPage.getItemPrice(PRODUCT_NAME);

    // Act: Add to cart and navigate to the cart page
    await inventoryPage.addItemToCartByName(PRODUCT_NAME);
    await inventoryPage.goToCart();

    // Assert: Cart page is shown, item is present, and price matches
    await cartPage.expectToBeOnCartPage();
    expect(await cartPage.hasItem(PRODUCT_NAME)).toBe(true);

    const cartPrice = await cartPage.getItemPrice(PRODUCT_NAME);
    expect(cartPrice).toBe(inventoryPrice);
  });

  test('should show correct item count when multiple items are added', async () => {
    const SECOND_PRODUCT = 'Sauce Labs Bike Light';

    // Act: Add two different products
    await inventoryPage.addItemToCartByName(PRODUCT_NAME);
    await inventoryPage.addItemToCartByName(SECOND_PRODUCT);

    // Assert: Badge shows 2
    const count = await inventoryPage.getCartCount();
    expect(count).toBe(2);

    // Navigate to cart and verify both items are present
    await inventoryPage.goToCart();
    await cartPage.expectToBeOnCartPage();
    expect(await cartPage.getItemCount()).toBe(2);
    expect(await cartPage.hasItem(PRODUCT_NAME)).toBe(true);
    expect(await cartPage.hasItem(SECOND_PRODUCT)).toBe(true);
  });
});
