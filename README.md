# ezra-quality-strategy

Risk-based quality strategy and automation design for Ezra's booking and member data flows.

---

## Setup

**Prerequisites:** Node.js 18 or later. If you use nvm, run `nvm use` in the project root and it will switch automatically. Otherwise install Node 18+ from [nodejs.org](https://nodejs.org).

**1. Install dependencies**
```bash
npm install
```

**2. Install the Playwright browser**
```bash
npx playwright install chromium
```

**3. Set up environment variables**

Copy the example file and fill in your values:
```bash
cp .env.example .env
```

Then open `.env` in any text editor and fill in each value:

| Variable            | Required | Description                               |
|---------------------|----------|-------------------------------------------|
| `BASE_URL`          | Yes      | Staging base URL                          |
| `MEMBER_EMAIL`      | Yes      | Staging member account email (TC-03)      |
| `MEMBER_PASSWORD`   | Yes      | Staging member account password (TC-03)   |
| `MEMBER_EMAIL_2`    | Yes      | Staging member account 2 email (TC-05)    |
| `MEMBER_PASSWORD_2` | Yes      | Staging member account 2 password (TC-05) |

---

## Running Tests

```bash
# Headless (default)
npx playwright test

# Headed (visible browser)
npx playwright test --headed

# Playwright UI mode
npx playwright test --ui

# Single spec
npx playwright test tests/booking/tc05-happy-path.spec.js

# View HTML report after run
npx playwright show-report
```

---

## Why These Tests Were Automated

- **TC-03 (Heart CT Eligibility Gating)** — This is the only test in the set with a clinical safety dimension. The eligibility gate, add-on removal, and pricing recalculation on disqualification involve multiple UI state transitions that are high-risk to regress silently. Automation catches this class of regression faster than manual checks.

- **TC-05 (Happy Path)** — The primary booking + card payment flow is the highest-frequency user path and the baseline for all other tests. Regression on this path blocks revenue directly. It is the most valuable smoke test in CI.

- **TC-07 (Pricing Summary)** is present but not complete due to time. Labeled fixme.
---

## Assumptions

- All tests run against the staging environment. Production parity is not guaranteed
- Promo codes for staging are unknown
- Sandbox payment provider behavior may differ in production
- Limited system-of-record visibility. Admin portal confirms booking exists, but payment amount/processor capture not visible
- Tests use standard sign in instead of google sign in

---

## Tradeoffs

- TC-01 and TC-02 (payment/booking state mismatch) were not automated — these states require backend fault injection and cannot be reached through the UI.


---

## Future Improvements / Scalability

- Build out a stable smoke test suite
- Add in helper functions for booking flows that are common
- Add in server side validation to help bolster test case confidence
- Organize test suite by related services
- Add tests for Admin portal - Verify bookings appear in portal