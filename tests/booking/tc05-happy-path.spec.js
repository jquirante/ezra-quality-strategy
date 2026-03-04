const { test, expect } = require('@playwright/test');
const { SignInPage } = require('../../pages/SignInPage');
const { HomePage } = require('../../pages/HomePage');
const { SelectScanPage } = require('../../pages/SelectScanPage');
const { ScheduleScanPage } = require('../../pages/ScheduleScanPage');
const { ReserveAppointmentPage } = require('../../pages/ReserveAppointmentPage');
const { ConfirmationPage } = require('../../pages/ConfirmationPage');
const { getMemberCredentials } = require('../../fixtures/users');
const { PACKAGES,TEST_CARDS } = require('../../fixtures/testData');

test.describe('TC-05: Happy Path – Full Booking + Card Payment', () => {
  test('should complete booking with card payment and reach confirmation', async ({ page }) => {
    const credentials = getMemberCredentials('MEMBER_EMAIL_2', 'MEMBER_PASSWORD_2');

    // --- Arrange ---
    const signInPage = new SignInPage(page);
    const homePage = new HomePage(page); 
    const selectScanPage = new SelectScanPage(page);
    const scheduleScanPage = new ScheduleScanPage(page);
    const reserveAppointmentPage = new ReserveAppointmentPage(page);
    const confirmationPage = new ConfirmationPage(page);

    // --- Act: Login ---
    await signInPage.goto();
    await signInPage.login(credentials.email, credentials.password);

    // --- Act: Navigate to booking flow ---
    await homePage.bookAScan();

    // --- Act: Select package ---
    await selectScanPage.selectPackage(PACKAGES.MRI_SCAN_OPTION.testId);
    await selectScanPage.continue();

    // // --- Act: Select clinic + appointment day/time ---
    await scheduleScanPage.selectRecommendedClinic();
    await scheduleScanPage.selectAppointmentDay();
    await scheduleScanPage.selectAppointmentTime();
    await scheduleScanPage.continue();
    
    // // --- Act: Payment ---
    await reserveAppointmentPage.assertSummaryVisible(PACKAGES.MRI_SCAN_OPTION.displayName);
    await reserveAppointmentPage.enterCardDetails(TEST_CARDS.VISA_SUCCESS);
    const [encounterId, encounterPayload] = await reserveAppointmentPage.submitPaymentAndCaptureEncounterId()
    
    // --- Assert: Confirmation ---
    expect(encounterId).toBeTruthy();
    expect(encounterPayload.packageId).toEqual(PACKAGES.MRI_SCAN_OPTION.packageId);
    await confirmationPage.assertConfirmed();

  });
});
