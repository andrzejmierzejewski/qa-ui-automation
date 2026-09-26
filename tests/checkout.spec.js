import { test, expect } from '@playwright/test';

async function loginAndAddItem(page) {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();
}

test('can complete checkout successfully', async ({ page }) => {
  await loginAndAddItem(page);
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await page.locator('[data-test="finish"]').click();

  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
});

test('shows error when first name is missing', async ({ page }) => {
  await loginAndAddItem(page);
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
});

test('shows error when last name is missing', async ({ page }) => {
  await loginAndAddItem(page);
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="postalCode"]').fill('12345');
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');
});

test('shows error when postal code is missing', async ({ page }) => {
  await loginAndAddItem(page);
  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="continue"]').click();

  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
});

test('can cancel checkout and return to cart', async ({ page }) => {
  await loginAndAddItem(page);
  await page.locator('[data-test="checkout"]').click();
  await page.locator('[data-test="cancel"]').click();

  await expect(page).toHaveURL(/cart.html/);
});