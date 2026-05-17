import { Page, Locator, expect } from '@playwright/test';

/**
 * LoginPage — Page Object Model
 *
 * Encapsulates all selectors and actions for the SauceDemo login page.
 * Keeping UI details here means tests stay clean: if a selector changes,
 * we update it in one place rather than hunting through every test file.
 */
export class LoginPage {
  readonly page: Page;

  // --- Locators ---
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton   = page.locator('[data-test="login-button"]');
    this.errorMessage  = page.locator('[data-test="error"]');
  }

  /** Navigate directly to the login page */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Log in with the provided credentials.
   * Reads from environment variables by default so no credentials
   * are ever hard-coded in the test files.
   */
  async login(
    username: string = process.env.TEST_USERNAME ?? 'standard_user',
    password: string = process.env.TEST_PASSWORD ?? 'secret_sauce',
  ): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /** Assert that the error banner contains the expected text */
  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }
}
