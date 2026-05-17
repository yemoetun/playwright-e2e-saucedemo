import { Page, Locator, expect } from '@playwright/test';

/**
 * CheckoutPage — Page Object Model
 *
 * Covers the two-step SauceDemo checkout flow:
 *   Step 1: /checkout-step-one.html  (shipping info form)
 *   Step 2: /checkout-step-two.html  (order summary)
 *   Complete: /checkout-complete.html (confirmation)
 */
export class CheckoutPage {
  readonly page: Page;

  // --- Step 1 locators ---
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;

  // --- Step 2 locators ---
  readonly finishButton: Locator;
  readonly summaryTotal: Locator;

  // --- Complete page locators ---
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Step 1
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.zipCodeInput   = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');

    // Step 2
    this.finishButton  = page.locator('[data-test="finish"]');
    this.summaryTotal  = page.locator('.summary_total_label');

    // Complete
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText   = page.locator('.complete-text');
    this.backHomeButton     = page.locator('[data-test="back-to-products"]');
  }

  /** Verify we are on checkout step one */
  async expectToBeOnStepOne(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  /**
   * Fill out the shipping information form and continue to step 2.
   * Reads from environment variables by default.
   */
  async fillShippingInfo(
    firstName: string = process.env.CHECKOUT_FIRST_NAME ?? 'John',
    lastName:  string = process.env.CHECKOUT_LAST_NAME  ?? 'Doe',
    zipCode:   string = process.env.CHECKOUT_ZIP        ?? '10001',
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    await this.continueButton.click();
  }

  /** Verify we are on checkout step two (order summary) */
  async expectToBeOnStepTwo(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  /** Submit the final order */
  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  /** Verify the order confirmation page is displayed */
  async expectOrderConfirmed(): Promise<void> {
    await expect(this.page).toHaveURL(/checkout-complete/);
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you for your order');
  }
}
