const { expect } = require('@playwright/test');

class ReserveAppointmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.summaryContainer = page.locator('.pricing-descriptions');
    this.summaryPlanName = page.locator('.__plan');
    this.summaryTotal = page.locator('.__total .h4');
    this.continue = page.getByRole('button', { name: 'Continue' });

    // Stripe card inputs live inside an iframe — target the correct frame
    this.stripeFrame = page.frameLocator('iframe[title="Secure payment input frame"]').first();
    this.cardNumberInput = this.stripeFrame.locator('#payment-numberInput');
    this.cardExpiryInput = this.stripeFrame.locator('#payment-expiryInput');
    this.cardCvcInput = this.stripeFrame.locator('#payment-cvcInput');
    this.cardZipInput = this.stripeFrame.locator('#payment-postalCodeInput');
  }

  async assertSummaryVisible(packageName) {

    await this.summaryContainer.waitFor({ state: 'attached' });
    await expect(this.summaryPlanName).toHaveText(packageName);
    await expect(this.summaryTotal).toBeVisible();
    
  }

  /**
   * Fills Stripe card fields inside the Stripe iframe.
   * @param {{ number: string, expiry: string, cvc: string }} testCard
   */
  async enterCardDetails(testCard) {
    
    await this.cardNumberInput.waitFor({ state: 'visible' });
    await this.cardNumberInput.fill(testCard.number);
    await this.cardExpiryInput.fill(testCard.expiry);
    await this.cardCvcInput.fill(testCard.cvc);
    await this.cardZipInput.fill(testCard.zip);

  }

  /*
   * Clicks Continue to submit payment, waits for the encounter creation API call, and captures the encounterId and Payload from the Location header for use in later API calls.
   */
  async submitPaymentAndCaptureEncounterId() {
    const [encounterRes] = await Promise.all([
      this.page.waitForResponse(res =>
        res.url().includes('/packages/api/encounter/me') &&
        res.request().method() === 'POST'
      ),
      this.continue.click()
    ]);

    if (encounterRes.status() !== 201) {
      throw new Error(`Expected encounter create 201, got ${encounterRes.status()}`);
    }

    const location = encounterRes.headers()['location']; // "/<encounterId>"

    if (!location) {
      throw new Error('Missing Location header');
    }

    const encounterId = location?.replace('/', '');

    if (!encounterId) throw new Error('EncounterId missing from Location header');
    
    const postData = encounterRes.request().postData() || '{}';
    const encounterPayload = JSON.parse(postData);

    // Pending payment
    const pendingRes = await this.page.waitForResponse(res =>
      res.url().includes(`/packages/api/payments/${encounterId}/create-pending`) &&
      res.request().method() === 'POST'
    );

    if (pendingRes.status() !== 200) {
      throw new Error(`Expected create-pending 200, got ${pendingRes.status()}`);
    }

    return  [encounterId, encounterPayload];
}

  async submitAppointmentReservation() {
    
    await this.continue.click();
    await this.page.waitForURL(/\/scan-confirm/);

  }

}
module.exports = { ReserveAppointmentPage };
