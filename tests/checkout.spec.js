import { test, expect } from '@playwright/test';
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

async function loginAndAddItem(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();
}

test('can complete checkout successfully', async ({ page }) => {
  await loginAndAddItem(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', 'Doe', '12345');
  await checkoutPage.finish();

  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

test('shows error when first name is missing', async ({ page }) => {
  await loginAndAddItem(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo(null, 'Doe', '12345');

  await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
});

test('shows error when last name is missing', async ({ page }) => {
  await loginAndAddItem(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', null, '12345');

  await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
});

test('shows error when postal code is missing', async ({ page }) => {
  await loginAndAddItem(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', 'Doe', null);

  await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
});

test('can cancel checkout and return to cart', async ({ page }) => {
  await loginAndAddItem(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.cancel();

  await expect(page).toHaveURL(/cart.html/);
});