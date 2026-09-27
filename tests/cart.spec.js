import { expect } from '@playwright/test';
const { test } = require('../fixtures/test-fixtures');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');

test('can add one product to cart', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');

  await expect(inventoryPage.cartBadge).toHaveText('1');
});

test('can add multiple products to cart', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');

  await expect(inventoryPage.cartBadge).toHaveText('2');
});

test('can remove a product from cart', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.removeFromCart('sauce-labs-backpack');

  await expect(inventoryPage.cartBadge).not.toBeVisible();
});

test('cart badge reflects correct count', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');
  await inventoryPage.addToCart('sauce-labs-bolt-t-shirt');

  await expect(inventoryPage.cartBadge).toHaveText('3');
});

test('cart page shows correct item names', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.goToCart();

  const cartPage = new CartPage(page);
  await expect(page).toHaveURL(/cart.html/);
  await expect(cartPage.itemNames).toHaveCount(1);
  await expect(cartPage.itemNames).toHaveText('Sauce Labs Backpack');
});

test('cart page shows multiple selected products', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');
  await inventoryPage.addToCart('sauce-labs-bike-light');
  await inventoryPage.goToCart();

  const cartPage = new CartPage(page);
  await expect(cartPage.itemNames).toHaveCount(2);
  await expect(cartPage.itemNames).toContainText([
    'Sauce Labs Backpack',
    'Sauce Labs Bike Light',
  ]);
});