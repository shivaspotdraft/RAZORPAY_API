# Razorpay API Tests

Comprehensive **API test automation suite** for the Razorpay REST APIs, built with [Playwright Test](https://playwright.dev/) and TypeScript. The suite covers the **Customers**, **Orders**, and **Payments** resources against Razorpay's public sandbox (`https://api.razorpay.com`) and is wired up with **Allure** for rich HTML reports and **GitHub Actions** for CI.

---

## Table of contents

1. [Highlights](#highlights)
2. [Project structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Setup](#setup)
5. [Running the tests](#running-the-tests)
6. [Reports](#reports)
7. [Test coverage](#test-coverage)
8. [How it works](#how-it-works)
9. [Adding a new test](#adding-a-new-test)
10. [Continuous integration](#continuous-integration)
11. [Troubleshooting](#troubleshooting)

---

## Highlights

- **Pure API tests** — no browser automation; fast and deterministic.
- **TypeScript-first** with Playwright's typed `APIRequestContext`.
- **Custom fixture** that injects an authenticated request context into every test (`apictx`).
- **Centralised test data and error strings** in `test-data/testData.ts` — change a value once, every test that depends on it stays in sync.
- **Centralised helpers** for repeated setup (creating customers / orders).
- **Two reporters out of the box**: the default Playwright HTML report and Allure.
- **CI pipeline** runs the full suite on every push/PR via GitHub Actions.

---

## Project structure

```
razorpay_api/
├── .env                  # Local secrets (Test_Key_ID, Test_Key_Secret, Base_URL)
├── .github/workflows/
│   └── playwright.yml    # CI pipeline
├── checkout.html         # Local-only Razorpay Checkout page (gitignored)
├── fixtures/
│   └── context.ts        # Custom Playwright fixture: authenticated `apictx`
├── helper/
│   ├── createCustomer.ts # POST /v1/customers helper
│   └── createorder.ts    # POST /v1/orders helper
├── test-data/
│   └── testData.ts       # All static payloads, expected values, error strings
├── tests/
│   ├── customer/
│   │   ├── customers.spec.ts
│   │   ├── editCustomerDetails.spec.ts
│   │   └── fetchCustomers.spec.ts
│   ├── orders/
│   │   ├── createOrder.spec.ts
│   │   ├── fetchOrder.spec.ts
│   │   └── updateOrder.spec.ts
│   └── payments/
│       ├── fetchAllPayments.spec.ts
│       ├── fetchPaymentWithOrderId.spec.ts
│       ├── fetchPaymentWithPaymentId.spec.ts
│       └── updatePayments.spec.ts
├── playwright.config.ts  # Playwright configuration
└── package.json
```

### Folder responsibilities

| Folder        | Purpose                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------ |
| `fixtures/`   | Reusable Playwright fixtures. The `apictx` fixture builds a Basic-auth'd `APIRequestContext`.    |
| `helper/`     | Thin wrappers over commonly used endpoints (e.g. creating a customer, creating an order).        |
| `test-data/`  | Single source of truth for request payloads, expected values, and error message strings.         |
| `tests/`      | Spec files grouped by API resource (`customer`, `orders`, `payments`).                           |

---

## Prerequisites

- **Node.js** 18+ (any LTS works; CI uses `lts/*`).
- **npm** 9+ (ships with Node).
- A **Razorpay Test Mode** account — sign up at <https://dashboard.razorpay.com> and grab a **Key ID** and **Key Secret** from *Account & Settings → API Keys*.
- (Optional) **Allure CLI** if you want to view Allure reports locally:
  - `brew install allure` on macOS, or
  - `npm i -g allure-commandline`.

---

## Setup

```bash
git clone <this-repo-url> razorpay_api
cd razorpay_api

npm ci                          # install dependencies (clean install)
npx playwright install          # install browser binaries (chromium is enough)
```

Create a `.env` file at the repo root (already gitignored):

```ini
Test_Key_ID=rzp_test_xxxxxxxxxxxxxx
Test_Key_Secret=xxxxxxxxxxxxxxxxxxxxxxxx
Base_URL=https://api.razorpay.com
```

> **Never commit `.env`.** It's listed in `.gitignore`. If you accidentally commit a key, rotate it from the Razorpay dashboard immediately.

---

## Running the tests

```bash
npm test                                       # run the whole suite
npx playwright test tests/customer             # only customer specs
npx playwright test tests/orders/createOrder   # one file
npx playwright test -g "should fetch all"      # filter by test title
npx playwright test --headed                   # not relevant here (API tests), but supported
npx playwright test --debug                    # step through with the inspector
```

Useful flags:

- `--workers=1` — disable parallelism (handy when debugging shared state).
- `--retries=2` — retry flaky network calls locally.
- `--project=chromium` — only the chromium project (the default and only project today).

---

## Reports

### Playwright HTML report

The HTML reporter is enabled by default and writes to `playwright-report/`.

```bash
npx playwright show-report
```

### Allure report

`allure-playwright` writes raw results to `allure-results/` on every run. Generate and open the report with:

```bash
npm run report
```

This runs:

```bash
allure generate allure-results --clean && allure open
```

> **Heads up:** `npm run report` requires the `allure` CLI on `PATH`. If you'd rather use the local binary bundled by `allure-commandline`, change the script to `npx allure generate allure-results --clean -o allure-report && npx allure open allure-report`.

Both `allure-results/`, `allure-report/`, `playwright-report/`, `test-results/`, and `blob-report/` are gitignored.

---

## Test coverage

### Customers (`tests/customer/`)

| Spec                          | Scenarios                                                                                                            |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `customers.spec.ts`           | Create with valid data, create with invalid email, create duplicate with `fail_existing: '1'` and with `'0'`.        |
| `fetchCustomers.spec.ts`      | Fetch all, fetch with `count`, fetch with negative count (400), fetch by ID.                                         |
| `editCustomerDetails.spec.ts` | Update an existing customer's name and email via `PUT /v1/customers/:id`.                                            |

### Orders (`tests/orders/`)

| Spec                  | Scenarios                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `createOrder.spec.ts` | Create valid order, amount above max USD, missing amount, INR amount below the minimum.                |
| `fetchOrder.spec.ts`  | Fetch all with valid count, count below min, count above max, fetch by ID, fetch by invalid ID (400).  |
| `updateOrder.spec.ts` | Update notes via `PATCH`, reject disallowed extra fields.                                              |

### Payments (`tests/payments/`)

| Spec                                | Scenarios                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| `fetchAllPayments.spec.ts`          | Fetch all, fetch with valid `count`, fetch with `count: 0` (400).                    |
| `fetchPaymentWithOrderId.spec.ts`   | Fetch payments by valid order ID, fetch by invalid order ID (404).                   |
| `fetchPaymentWithPaymentId.spec.ts` | Fetch payment by valid payment ID, fetch by invalid payment ID (400).                |
| `updatePayments.spec.ts`            | Update payment notes via `PATCH`, reject disallowed extra fields.                    |

Total: **29 tests across 10 spec files**.

---

## How it works

### The `apictx` fixture

`fixtures/context.ts` extends Playwright's `test` with an `apictx` fixture that provides a pre-authenticated `APIRequestContext`:

```ts
import { test, expect } from '../../fixtures/context'

test('example', async ({ apictx }) => {
  const res = await apictx.get('/v1/customers')
  expect(res).toBeOK()
})
```

Internally it:

1. Reads `Test_Key_ID`, `Test_Key_Secret`, and `Base_URL` from `.env` (loaded by `dotenv`).
2. Base64-encodes the credentials for HTTP Basic auth.
3. Creates a fresh `APIRequestContext` per test with the `Authorization` and `Content-Type` headers preset and a `baseURL` of `process.env.Base_URL`.
4. Disposes the context after the test.

### Helpers

`helper/createCustomer.ts` and `helper/createorder.ts` are thin POST wrappers used by tests that need to set up an entity first (e.g. "fetch customer by ID" needs a customer to exist).

### Centralised test data

`test-data/testData.ts` exports:

- **Payloads** (`customerDetails`, `orderDetails`, `paymentData`, `updateOrderNotes`, …)
- **Boundary values** (`fetchCustomersData`, `fetchOrdersData`, `orderAmountLimits`, …)
- **Expected error contracts** (`customerErrors`, `orderErrors`, `paymentErrors` — codes, descriptions, reasons, fields)

Specs assert against these constants instead of inline magic strings, so when Razorpay changes a wording or limit the change is one-line.

### Naming convention

- **Test titles** follow `should <expected behaviour> when <condition>` for readability in reports (e.g. `'should return 400 when fetching orders with count below the minimum'`).
- **Variables** describe the entity, not the step number — `createdCustomer`, `errorBody`, `fetchOrderResponse`, etc., instead of `res1`, `res2`.

---

## Adding a new test

1. **Pick the right folder** — `tests/<resource>/`.
2. **Reuse `apictx`** by importing `test` and `expect` from `fixtures/context`:

   ```ts
   import { test, expect } from '../../fixtures/context'
   ```
3. **Pull static data and error strings from `test-data/testData.ts`.** If you need a new value, add it there first.
4. **Use helpers** (`createCustomer`, `createOrder`) when a test needs setup data — don't duplicate POST calls.
5. **Name the test** using `should <behaviour> when <condition>`.
6. **Use descriptive variable names** for responses and parsed bodies (e.g. `createOrderResponse`, `createdOrder`, `errorBody`).

Skeleton:

```ts
import { test, expect } from '../../fixtures/context'
import { customerDetails, customerErrors } from '../../test-data/testData'

test('should ... when ...', async ({ apictx }) => {
  const response = await apictx.get('/v1/...')
  expect(response).toBeOK()
  const body = await response.json()
  expect(body.someField).toBe(customerDetails.someField)
})
```

---

## Continuous integration

`.github/workflows/playwright.yml` runs on every push and pull request to `main`/`master`:

1. Checkout code (`actions/checkout@v4`).
2. Set up Node (`actions/setup-node@v4`, `lts/*`).
3. `npm ci`.
4. `npx playwright install --with-deps`.
5. `npx playwright test`.
6. Upload `playwright-report/` as an artifact (retained for 30 days).

> **CI note:** the workflow does **not** currently set the `Test_Key_ID` / `Test_Key_Secret` / `Base_URL` env vars. Before enabling CI for a real run, add these as **GitHub repository secrets** and inject them in the workflow:
>
> ```yaml
>     - name: Run Playwright tests
>       env:
>         Test_Key_ID:    ${{ secrets.RAZORPAY_TEST_KEY_ID }}
>         Test_Key_Secret: ${{ secrets.RAZORPAY_TEST_KEY_SECRET }}
>         Base_URL:        https://api.razorpay.com
>       run: npx playwright test
> ```

---

## Troubleshooting

| Symptom                                                       | Likely cause / fix                                                                                                                                            |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Base_URL is not defined in the .env file`                    | Create / edit `.env` and add `Base_URL=https://api.razorpay.com`.                                                                                             |
| `401 Unauthorized` on every request                           | `Test_Key_ID` / `Test_Key_Secret` are missing or wrong. Regenerate from the Razorpay dashboard.                                                               |
| Duplicate-customer test returns a different existing customer | The sandbox already has multiple customers with that email/contact pair. The duplicate test now generates unique values per run; if you copied the older logic, do the same. |
| `allure: command not found` from `npm run report`             | Install Allure (`brew install allure`) or switch the script to use `npx allure ...` (see the Allure section).                                                 |
| Playwright complains about missing browsers                   | Run `npx playwright install` (or `npx playwright install --with-deps` on Linux/CI).                                                                           |

---

## License

ISC — see `package.json`.
