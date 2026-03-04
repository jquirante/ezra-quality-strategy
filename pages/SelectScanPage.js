const { expect } = require('@playwright/test');

class SelectScanPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.mriScanOption = page.getByTestId('FB30-encounter-card');
    this.mriWithSpineOption = page.getByTestId('FB60-encounter-card');
    this.mriWithNeuroOption = page.getByTestId('BLUEPRINTNR-encounter-card');
    this.heartCtOption = page.getByTestId('GATEDCAC-encounter-card');
    this.lungsCtOption = page.getByTestId('LUNG-encounter-card');
    this.modalInputContainer = page.locator('.pre-screen-input-container');
    this.eligibilityQuestionContainer = page.locator('.pre-screen-label-container');
    this.eligibilityOptionContainer = page.locator('.options-container');
    this.ineligbilityContainer = page.locator('.pre-screen-modal__content');
    this.submitEligibilityButton = page.getByTestId('cac-prescreen-modal-submit-btn');
    this.continueWithoutHeartCtButton = page.getByRole('button', { name:  'Continue Without Heart Calcium'  });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
  }

  /**
   * Selects a package by its display name.
   * @param {string} name
   */
  async selectPackage(name) {
    await this.page.getByTestId(name).click();
  }

  /**
   * Adds an add-on by its display name.
   * Note: Heart CT eligibility questionnaire fires on Continue, not on add-on click.
   * @param {string} name
   */
  async addAddon(name) {
    await this.page.getByTestId(name).click();
  }

  /**
   * Clicks Continue to trigger the eligibility questionnaire modal, then answers
   * each question. Questions not present in the answers map default to 'No'.
   * @param {Record<string, string>} answers - Map of question label text to answer label.
   */
  async continueAndAnswerEligibilityQuestionnaire(answers) {

    await this.continueButton.click();
    await this.modalInputContainer.waitFor({ state: 'visible' });

    const count = await this.eligibilityQuestionContainer.count();
    for (let i = 0; i < count; i++) {
      const questionContainer = this.eligibilityQuestionContainer.nth(i);
      const answerContainer = this.eligibilityOptionContainer.nth(i);
      const labelText = (await questionContainer.textContent()).trim();
      const answer = answers[labelText] ?? 'No';
      await answerContainer.getByRole('button', { name: answer }).click();
    }

    await this.submitEligibilityButton.click();

  }

  /**
   * Checks texts of inelibility message for a disqualifying answer, and asserts visibility.
   * Note: this message is expected to be something like "We're sorry,this product isn't right for you."
    */
  async dismissIneligibilityMessage() {

    await expect(this.ineligbilityContainer.getByRole('heading', { name: "We're sorry, this product isn't right for you." })).toBeVisible();
    await this.continueWithoutHeartCtButton.click();
    await this.page.waitForURL(/\/schedule-scan/);

  }

  async continue() {

    await this.continueButton.click();
    await this.page.waitForURL(/\/schedule-scan/);
    
  }
}

module.exports = { SelectScanPage };
