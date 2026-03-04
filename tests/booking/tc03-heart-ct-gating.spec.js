const { test, expect } = require('@playwright/test');
const { SignInPage } = require('../../pages/SignInPage');
const { SelectScanPage } = require('../../pages/SelectScanPage');
const { ScheduleScanPage } = require('../../pages/ScheduleScanPage');
const { ReserveAppointmentPage } = require('../../pages/ReserveAppointmentPage');
const { ConfirmationPage } = require('../../pages/ConfirmationPage');
const { HomePage } = require('../../pages/HomePage');
const { getMemberCredentials } = require('../../fixtures/users');
const { PACKAGES, TEST_CARDS, ADDONS, HEART_CT_ELIGIBILITY } = require('../../fixtures/testData');

test.describe('TC-03: Heart CT Eligibility Gating', () => {
  /** @type {import('@playwright/test').Page} */
  let page;
  let signInPage, homePage, selectScanPage, scheduleScanPage, reserveAppointmentPage, confirmationPage;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    const credentials = getMemberCredentials('MEMBER_EMAIL', 'MEMBER_PASSWORD');

    signInPage = new SignInPage(page);
    homePage = new HomePage(page);
    selectScanPage = new SelectScanPage(page);
    scheduleScanPage = new ScheduleScanPage(page);
    reserveAppointmentPage = new ReserveAppointmentPage(page);
    confirmationPage = new ConfirmationPage(page);

    await signInPage.goto();
    await signInPage.login(credentials.email, credentials.password);
  });

  test('disqualifying answer as add-on removes Heart CT and allows continuation - add-on is removed on payment', async () => {

    // --- Act I: Select Book a Scan ---
    await homePage.bookAScan();

    // --- Act II: Select MRI Scan + Heart CT add-on, trigger eligibility questionnaire ---
    await selectScanPage.selectPackage(PACKAGES.MRI_SCAN_OPTION.testId);
    await selectScanPage.addAddon(ADDONS.HEART_CT);
    await selectScanPage.continueAndAnswerEligibilityQuestionnaire(HEART_CT_ELIGIBILITY.DISQUALIFYING_ANSWERS);
    await selectScanPage.dismissIneligibilityMessage();
  
    // --- Act III: Select clinic + appointment day/time ---
    await scheduleScanPage.selectRecommendedClinic();
    await scheduleScanPage.selectAppointmentDay();
    await scheduleScanPage.selectAppointmentTime();
    await scheduleScanPage.continue();
    
    // --- Act: Payment ---
    await reserveAppointmentPage.assertSummaryVisible(PACKAGES.MRI_SCAN_OPTION.displayName);
    await reserveAppointmentPage.enterCardDetails(TEST_CARDS.VISA_SUCCESS);
    const [encounterId, encounterPayload] = await reserveAppointmentPage.submitPaymentAndCaptureEncounterId()
    
    // --- Assert: Confirmation ---
    expect(encounterId).toBeTruthy();
    expect(encounterPayload.packageId).toEqual(PACKAGES.MRI_SCAN_OPTION.packageId);

    // Addon should be empty in payload
    expect(encounterPayload.selectedAddons.length).toEqual(0);

    await confirmationPage.assertConfirmed();
    
  });

  // Not finished due to time constraints.
  // test('disqualifying answer blocks standalone Heart CT booking', async () => {
  //   // --- Arrange ---
  //   // TODO: navigate to the Heart CT standalone booking path

  //   // --- Act ---
  //   // TODO: trigger the Heart CT eligibility questionnaire
  //   // TODO: answer with a disqualifying response from HEART_CT_ELIGIBILITY.DISQUALIFYING_ANSWERS

  //   // --- Assert ---
  //   // TODO: assert that a blocking message is displayed
  //   // TODO: assert that the user cannot proceed past this step
  //   // TODO: assert that no clinic selection or payment step is reachable
  // });

  // Not finished due to time constraints.
  // test('qualifying answers allow Heart CT booking to proceed', async () => {
  //   // --- Arrange ---
  //   // TODO: navigate to Heart CT standalone booking path, or add as add-on

  //   // --- Act ---
  //   // TODO: trigger the Heart CT eligibility questionnaire
  //   // TODO: answer all questions with qualifying responses from HEART_CT_ELIGIBILITY.QUALIFYING_ANSWERS

  //   // --- Assert ---
  //   // TODO: assert no blocking message is shown
  //   // TODO: assert user can proceed to clinic selection step
  // });
});
