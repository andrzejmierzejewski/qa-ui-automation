import { test, expect } from '@playwright/test';

async function login(page) {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();
}

test('can add one product to cart', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
});

test('can add multiple products to cart', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');
});

test('can remove a product from cart', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="remove-sauce-labs-backpack"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).not.toBeVisible();
});

test('cart badge reflects correct count', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();

  await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('3');
});

test('cart page shows correct item names', async ({ page }) => {
  await login(page);
  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="shopping-cart-link"]').click();

  await expect(page).toHaveURL(/cart.html/);
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveCount(1);
  await expect(page.locator('[data-test="inventory-item-name"]')).toHaveText('Sauce Labs Backpack');
});