const { expect } = require('@playwright/test');

class ConfirmationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.locationValue = page.locator('.scan-details__row').filter({ hasText: 'Location' }).locator('p:not(.scan-details__row__title)').first();
    this.beginQuestionnaireButton = page.getByRole('button', { name: 'Begin Medical Questionnaire' });

    // Note: the confirmation screen does NOT display a payment total per observed staging behavior.
    // Total verification must be done at the pre-payment summary step (PaymentPage).
  }

  async assertConfirmed() {
    
    await expect(this.beginQuestionnaireButton).toBeVisible();
    await expect(this.locationValue).toBeVisible();
  }

}

module.exports = { ConfirmationPage };
