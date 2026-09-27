import { expect } from '@playwright/test';
const { test } = require('../fixtures/test-fixtures');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

async function addItemAndGoToCart(page) {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();
}

test('can complete checkout successfully', async ({ loggedInPage: page }) => {
  await addItemAndGoToCart(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', 'Doe', '12345');
  await checkoutPage.finish();

  await expect(page).toHaveURL(/checkout-complete.html/);
  await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
});

test('shows error when first name is missing', async ({ loggedInPage: page }) => {
  await addItemAndGoToCart(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo(null, 'Doe', '12345');

  await expect(checkoutPage.errorMessage).toHaveText('Error: First Name is required');
});

test('shows error when last name is missing', async ({ loggedInPage: page }) => {
  await addItemAndGoToCart(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', null, '12345');

  await expect(checkoutPage.errorMessage).toHaveText('Error: Last Name is required');
});

test('shows error when postal code is missing', async ({ loggedInPage: page }) => {
  await addItemAndGoToCart(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillInfo('John', 'Doe', null);

  await expect(checkoutPage.errorMessage).toHaveText('Error: Postal Code is required');
});

test('can cancel checkout and return to cart', async ({ loggedInPage: page }) => {
  await addItemAndGoToCart(page);
  const cartPage = new CartPage(page);
  await cartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.cancel();

  await expect(page).toHaveURL(/cart.html/);
});