import { Page, Locator, expect } from '@playwright/test';

/**
 * InventoryPage — Page Object Model
 *
 * Covers the main product listing page (/inventory.html) that a user
 * lands on after a successful login.
 */
export class InventoryPage {
  readonly page: Page;

  // --- Locators ---
  readonly pageTitle: Locator;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle    = page.locator('.title');
    this.cartBadge    = page.locator('.shopping_cart_badge');
    this.cartIcon     = page.locator('.shopping_cart_link');
    this.menuButton   = page.locator('#react-burger-menu-btn');
    this.logoutLink   = page.locator('#logout_sidebar_link');
    this.productItems = page.locator('.inventory_item');
  }

  /** Verify we are on the inventory page */
  async expectToBeOnInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  /**
   * Add a product to the cart by its visible name.
   * Finds the specific inventory item container, then clicks its Add to Cart button.
   */
  async addItemToCartByName(itemName: string): Promise<void> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    await item.locator('button').click();
  }

  /**
   * Returns the current numeric value of the cart badge.
   * Throws if the badge is not visible (cart is empty).
   */
  async getCartCount(): Promise<number> {
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10);
  }

  /** Navigate to the cart page */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /** Log out via the burger menu */
  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.logoutLink.click();
  }

  /**
   * Get the displayed price of a product by name (as a string, e.g. "$29.99").
   */
  async getItemPrice(itemName: string): Promise<string> {
    const item = this.page.locator('.inventory_item', { hasText: itemName });
    const priceText = await item.locator('.inventory_item_price').textContent();
    return priceText?.trim() ?? '';
  }
}
