[![Playwright Tests](https://github.com/andrzejmierzejewski/qa-ui-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/andrzejmierzejewski/qa-ui-automation/actions/workflows/playwright.yml)
# SauceDemo UI Automation

A Playwright-based UI automation suite for [SauceDemo](https://www.saucedemo.com/), covering core e-commerce user journeys: login, cart, and checkout.

This project is the UI counterpart to my [API automation project](https://github.com/andrzejmierzejewski/qa-api-automation), together covering both browser-based and API-level test automation.

## Tech stack

- **Playwright** - browser automation and test runner
- **JavaScript** - test implementation
- **Page Object Model** - encapsulation of locators and page actions
- **Playwright fixtures** - reusable test setup
- **GitHub Actions** - CI pipeline
## Test coverage

14 test cases, executed across Chromium, Firefox, and WebKit (42 test runs per full suite execution).

**Login - 3 tests**
- Successful login with valid credentials
- Error handling for invalid credentials
- Error handling for a locked-out user

**Cart - 6 tests**
- Add a single product to the cart
- Add multiple products to the cart
- Remove a product from the cart
- Verify the cart badge count
- Verify a single product displayed in the cart
- Verify multiple selected products displayed in the cart

**Checkout - 5 tests**
- Complete a checkout successfully
- Validate missing first name
- Validate missing last name
- Validate missing postal code
- Cancel checkout and return to the cart

## Test architecture

Each application page has its own Page Object class, keeping locators and actions in one place and test scenarios focused on user behavior rather than raw selectors:

- `LoginPage`- login fields, login action, and login error handling
- `InventoryPage`- adding/removing products and navigating to the cart
- `CartPage`- cart contents and checkout navigation
- `CheckoutPage`- checkout form, validation, completion, and cancellation

For example, a test works with:

```javascript
await inventoryPage.addToCart('sauce-labs-backpack');
await inventoryPage.goToCart();
```

instead of embedding selectors directly in the test.

**Reusable authentication fixture:** cart and checkout tests use a custom `loggedInPage` fixture that handles login once as part of setup, so tests start directly from the inventory page:

```javascript
test('can add one product to cart', async ({ loggedInPage: page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.addToCart('sauce-labs-backpack');

  await expect(inventoryPage.cartBadge).toHaveText('1');
});
```

## Project structure

```
qa-ui-automation/
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI workflow
├── pages/                       # Page Object Model classes
│   ├── LoginPage.js
│   ├── InventoryPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── fixtures/
│   └── test-fixtures.js         # Custom loggedInPage fixture
├── tests/
│   ├── login.spec.js
│   ├── cart.spec.js
│   └── checkout.spec.js
├── playwright.config.js
└── package.json
```

## Cross-browser testing

Tests run against Chromium, Firefox, and WebKit. Locally they run in parallel; CI uses a single worker for more predictable execution, with up to 2 retries on failure.

## Debugging and test artifacts

On failure, the suite automatically captures:
- **Screenshots** - on failure
- **Video** - retained on failure
- **Trace** - captured on first retry
- **HTML report** - generated for every run

Traces can be inspected step-by-step with Playwright's trace viewer.

## Running locally

```bash
# install dependencies
npm install

# install Playwright browsers
npx playwright install

# run the full suite
npx playwright test

# run a specific file
npx playwright test tests/login.spec.js

# run in a specific browser (chromium / firefox / webkit)
npx playwright test --project=chromium

# view the HTML report after a run
npx playwright show-report
```

## CI

Tests run automatically on every push and pull request to `main` via GitHub Actions. The workflow checks out the repo, installs dependencies with `npm ci`, installs Playwright's browsers and system dependencies, runs the full suite, and uploads the HTML report as a downloadable artifact (retained 30 days) - even on failure.

See the repo's [Actions tab](../../actions) for recent runs and reports.
