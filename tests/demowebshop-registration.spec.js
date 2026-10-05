// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Demo Web Shop - New User Registration
 * Site: https://demowebshop.tricentis.com
 *
 * Run:  npx playwright test tests/demowebshop-registration.spec.js --headed
 */

// Generate unique test data so the test can be re-run without "email already exists" errors
const timestamp = Date.now();
const user = {
  gender: 'male',
  firstName: 'Prashanth',
  lastName: 'Tester',
  email: `prashanth.test${timestamp}@example.com`,
  password: 'Test@12345',
};

test.describe('Demo Web Shop - Registration', () => {
  test('should register a new user successfully', async ({ page }) => {
    // 1. Open the Demo Web Shop home page
    await page.goto('https://demowebshop.tricentis.com/');
    await expect(page).toHaveTitle(/Demo Web Shop/);

    // 2. Click the "Register" link in the header
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('.page-title h1')).toHaveText('Register');

    // 3. Fill in personal details
    if (user.gender === 'male') {
      await page.locator('#gender-male').check();
    } else {
      await page.locator('#gender-female').check();
    }
    await page.locator('#FirstName').fill(user.firstName);
    await page.locator('#LastName').fill(user.lastName);
    await page.locator('#Email').fill(user.email);

    // 4. Fill in password details
    await page.locator('#Password').fill(user.password);
    await page.locator('#ConfirmPassword').fill(user.password);

    // 5. Submit the registration form
    await page.locator('#register-button').click();

    // 6. Verify the registration success message
    await expect(page.locator('.result')).toHaveText('Your registration completed');

    // 7. Verify the logged-in user's email is shown in the header
    await expect(page.locator('.header-links a.account')).toHaveText(user.email);

    // 8. Click "Continue" and verify we return to the home page
    await page.locator('input.register-continue-button').click();
    await expect(page).toHaveURL('https://demowebshop.tricentis.com/');

    // 9. Log out
    await page.getByRole('link', { name: 'Log out' }).click();
    await expect(page.getByRole('link', { name: 'Log in' })).toBeVisible();

    console.log(`Registered user: ${user.email} / ${user.password}`);
  });

  test('should show validation errors when required fields are empty', async ({ page }) => {
    await page.goto('https://demowebshop.tricentis.com/register');

    // Submit without filling anything
    await page.locator('#register-button').click();

    await expect(page.locator('span[for="FirstName"]')).toHaveText('First name is required.');
    await expect(page.locator('span[for="LastName"]')).toHaveText('Last name is required.');
    await expect(page.locator('span[for="Email"]')).toHaveText('Email is required.');
    await expect(page.locator('span[for="Password"]')).toHaveText('Password is required.');
    await expect(page.locator('span[for="ConfirmPassword"]')).toHaveText('Password is required.');
  });
});
