import { Page, Locator, expect } from '@playwright/test';

/**
 * CartPage — Page Object Model
 *
 * Encapsulates selectors and actions for the shopping cart page (/cart.html).
 */
export class CartPage {
  readonly page: Page;

  // --- Locators ---
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle              = page.locator('.title');
    this.cartItems              = page.locator('.cart_item');
    this.checkoutButton         = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  /** Verify we are on the cart page */
  async expectToBeOnCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  /**
   * Returns true if an item with the given name is present in the cart.
   */
  async hasItem(itemName: string): Promise<boolean> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    return await item.isVisible();
  }

  /**
   * Returns the displayed price of an item in the cart by name.
   */
  async getItemPrice(itemName: string): Promise<string> {
    const item = this.page.locator('.cart_item', { hasText: itemName });
    const price = await item.locator('.inventory_item_price').textContent();
    return price?.trim() ?? '';
  }

  /**
   * Returns the count of distinct items in the cart.
   */
  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  /** Proceed to checkout */
  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
