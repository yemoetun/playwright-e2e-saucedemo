# Playwright E2E Test Suite — SauceDemo

![CI](https://github.com/<yemoetun>/playwright-e2e-saucedemo/actions/workflows/playwright.yml/badge.svg)

An automated End-to-End (E2E) test suite built with **Playwright** and **TypeScript**, targeting [SauceDemo](https://www.saucedemo.com) — an industry-standard mock e-commerce site used for QA practice.

Built as a portfolio project to demonstrate junior QA engineering skills including framework architecture, CI/CD integration, and professional test design patterns.

---

## What This Tests

| Flow | Description |
|---|---|
| **Authentication** | Login with valid/invalid credentials, logout |
| **Cart Management** | Add items, verify badge count, confirm item name & price in cart |
| **Checkout Process** | Full happy path from cart → shipping info → order summary → confirmation |

---

## Architecture: Page Object Model (POM)

This project uses the **Page Object Model** pattern — a widely adopted industry standard for UI test frameworks.

**Why POM?**

Instead of scattering `page.locator(...)` calls across every test file, each web page gets its own TypeScript class that owns its selectors and actions. Tests become short, readable "stories" that call page methods:

```
// Without POM — brittle and repetitive
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="login-button"]').click();

// With POM — clean and maintainable
await loginPage.login();
```

If SauceDemo ever changes a selector, you fix it in **one file** (`LoginPage.ts`) instead of hunting through every test.

```
project root
├── pages/
│   ├── LoginPage.ts       ← Selectors & actions for the login page
│   ├── InventoryPage.ts   ← Selectors & actions for the product listing
│   ├── CartPage.ts        ← Selectors & actions for the cart
│   └── CheckoutPage.ts    ← Selectors & actions for both checkout steps
├── tests/
│   ├── auth.spec.ts       ← Flow 1: Authentication tests
│   ├── cart.spec.ts       ← Flow 2: Cart management tests
│   └── checkout.spec.ts   ← Flow 3: Full checkout tests
├── .github/
│   └── workflows/
│       └── playwright.yml ← GitHub Actions CI/CD pipeline
├── .env                   ← Local credentials (never committed)
├── playwright.config.ts   ← Playwright configuration
└── tsconfig.json
```

---

## Tech Stack

- **[Playwright](https://playwright.dev/)** — cross-browser E2E test framework
- **TypeScript** — type safety catches errors before runtime
- **GitHub Actions** — CI/CD pipeline that runs tests on every push/PR
- **dotenv** — environment variable management (no hard-coded secrets)

---

## Adapting This Suite to Other Websites

The framework and CI pipeline are fully reusable — only the selectors and URLs are SauceDemo-specific.

**What's reusable for any site:**
- Project structure and Page Object Model pattern
- `playwright.config.ts` configuration
- GitHub Actions CI/CD workflow
- `.env` approach for credentials
- Arrange-Act-Assert test pattern

**What needs updating for a new site:**
- Locators inside the Page Object classes (e.g. `[data-test="login-button"]` is SauceDemo-specific)
- Base URL in `.env`
- Test data (usernames, product names, form fields)
- Assertions to match the new site's confirmation messages

Think of this project as a **template** — adapting it to a new site is mostly swapping selectors and URLs, which gets faster with practice.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<YOUR_USERNAME>/playwright-e2e-saucedemo.git
cd playwright-e2e-saucedemo
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browser binaries

```bash
npx playwright install
```

### 4. Configure environment variables

Copy the example file and fill in your values (SauceDemo's public credentials are already set as defaults):

```bash
cp .env.example .env
```

The `.env` file is git-ignored — credentials never leave your machine.

### 5. Run the tests

```bash
# Run all tests headlessly across Chromium, Firefox, and WebKit
npm test

# Run with a visible browser window (useful for debugging)
npm run test:headed

# Open the interactive HTML report after a test run
npm run test:report

# Step through a test with Playwright Inspector
npm run test:debug
```

---

## CI/CD Pipeline

Every `push` to `main` and every pull request automatically triggers the GitHub Actions workflow (`.github/workflows/playwright.yml`), which:

1. Spins up a clean Ubuntu runner
2. Installs Node 20 and project dependencies
3. Installs Playwright browser binaries
4. Runs the full test suite in headless mode
5. Uploads the HTML test report as a downloadable artifact (retained for 30 days)

**Credentials in CI** are stored as GitHub Actions Secrets — navigate to `Settings → Secrets and variables → Actions` in your repository to add them.

---

## Viewing Test Reports

After a run (locally or in CI):

- **Locally:** `npm run test:report` opens the HTML report in your browser
- **CI:** Go to the Actions tab → select a run → download the `playwright-report` artifact

The report includes failure screenshots, recorded videos, and full Playwright traces so you can replay exactly what happened step by step.
