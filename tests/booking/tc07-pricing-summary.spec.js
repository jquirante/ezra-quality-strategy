const { test, expect } = require('@playwright/test');
const { SignInPage } = require('../../pages/SignInPage');
const { SelectScanPage } = require('../../pages/SelectScanPage');
const { ScheduleScanPage } = require('../../pages/ScheduleScanPage');
const { ReserveAppointmentPage } = require('../../pages/ReserveAppointmentPage');
const { getMemberCredentials } = require('../../fixtures/users');
const { PACKAGES, ADDONS } = require('../../fixtures/testData');
const { parseCurrency } = require('../../utils/money');

// Note: TC-07 is scoped to UI-layer pricing only.
// Payment processor capture amount is not verified here — that requires API/webhook-level testing.

test.describe.fixme('TC-07: Pricing / Summary Integrity', () => {
  /** @type {import('@playwright/test').Page} */
  let page;
  let signInPage, selectScanPage;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    const credentials = getMemberCredentials();

    signInPage = new SignInPage(page);
    selectScanPage = new SelectScanPage(page);

    await signInPage.goto();
    await signInPage.login(credentials.email, credentials.password);

    // TODO: navigate to the booking scan type step
    // TODO: assert scan type step is visible before each test
  });

  test('displayed total increases when add-on is added', async () => {
    // --- Arrange ---
    await selectScanPage.selectPackage(PACKAGES.MRI_FULL_BODY);
    const baseTotal = await selectScanPage.getDisplayedTotal();

    // --- Act ---
    await selectScanPage.addAddon(ADDONS.HEART_CT);
    // TODO: handle eligibility questionnaire if it fires on add-on add
    const totalWithAddon = await selectScanPage.getDisplayedTotal();

    // --- Assert ---
    // TODO: expect(parseCurrency(totalWithAddon)).toBeGreaterThan(parseCurrency(baseTotal));
  });

  test('displayed total decreases when add-on is removed', async () => {
    // --- Arrange ---
    await selectScanPage.selectPackage(PACKAGES.MRI_FULL_BODY);
    await selectScanPage.addAddon(ADDONS.HEART_CT);
    // TODO: handle eligibility questionnaire if it fires
    const totalWithAddon = await selectScanPage.getDisplayedTotal();

    // --- Act ---
    await selectScanPage.removeAddon(ADDONS.HEART_CT);
    const totalAfterRemoval = await selectScanPage.getDisplayedTotal();

    // --- Assert ---
    // TODO: expect(parseCurrency(totalAfterRemoval)).toBeLessThan(parseCurrency(totalWithAddon));
    // TODO: optionally assert totalAfterRemoval matches the known base price
  });

  test('pre-payment summary total matches total shown on scan type step', async () => {
    // --- Arrange ---
    await selectScanPage.selectPackage(PACKAGES.MRI_FULL_BODY);
    await selectScanPage.addAddon(ADDONS.HEART_CT);
    // TODO: handle eligibility questionnaire if it fires
    const expectedTotal = await selectScanPage.getDisplayedTotal();
    await selectScanPage.continue();

    // --- Act: proceed through clinic + slot selection ---
    const scheduleScanPage = new ScheduleScanPage(page);
    await scheduleScanPage.selectClinicByName();
    await scheduleScanPage.selectTimeSlots(3);
    await scheduleScanPage.continue();

    // --- Assert: pre-payment summary reflects the same total ---
    const reserveAppointmentPage = new ReserveAppointmentPage(page);
    await reserveAppointmentPage.assertSummaryVisible();
    const summaryTotal = await reserveAppointmentPage.getSummaryTotalText();

    // TODO: expect(parseCurrency(summaryTotal)).toBe(parseCurrency(expectedTotal));
  });
});
