import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

/**
 * Flow 1: User Authentication
 *
 * Tests that users can log in with valid credentials and are redirected
 * to the inventory page, and that invalid credentials are correctly rejected.
 */
test.describe('User Authentication', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Arrange: Navigate to the login page before each test
    await loginPage.goto();
  });

  test('should log in successfully with valid credentials', async ({ page }) => {
    // Act: Log in using env-var credentials
    await loginPage.login();

    // Assert: URL changes to inventory and "Products" heading is visible
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should show an error message with invalid credentials', async () => {
    // Act: Attempt login with wrong password
    await loginPage.login('standard_user', 'wrong_password');

    // Assert: Error banner is shown with the correct message
    await loginPage.expectError('Username and password do not match');
  });

  test('should show an error when username is left blank', async () => {
    // Act: Submit with empty username
    await loginPage.login('', 'secret_sauce');

    // Assert: Validation message prompts for username
    await loginPage.expectError('Username is required');
  });

  test('should log out successfully', async ({ page }) => {
    // Arrange: Log in first
    await loginPage.login();
    await inventoryPage.expectToBeOnInventoryPage();

    // Act: Log out via burger menu
    await inventoryPage.logout();

    // Assert: Redirected back to the login page
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
