// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Sauce Labs demo site - login with valid credentials
 * Site: https://www.saucedemo.com
 * Credentials are the public demo credentials shown on the login page.
 */
const BASE_URL = 'https://www.saucedemo.com/';
const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Sauce Demo - Login', () => {
  test('should log in successfully with valid credentials', async ({ page }) => {
    // 1. Open the login page
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();

    // 2. Enter valid username and password
    await page.locator('[data-test="username"]').fill(USERNAME);
    await page.locator('[data-test="password"]').fill(PASSWORD);

    // 3. Click Login
    await page.locator('[data-test="login-button"]').click();

    // 4. Verify user lands on the Products (inventory) page
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');

    // 5. Verify products are displayed
    const items = page.locator('[data-test="inventory-item"]');
    await expect(items.first()).toBeVisible();
    expect(await items.count()).toBeGreaterThan(0);

    // 6. Verify the shopping cart icon is visible
    await expect(page.locator('[data-test="shopping-cart-link"]')).toBeVisible();

    // 7. Log out via the side menu
    await page.getByRole('button', { name: 'Open Menu' }).click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    // 8. Verify user is back on the login page
    await expect(page).toHaveURL(BASE_URL);
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
  });
});
