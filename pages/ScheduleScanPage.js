class ScheduleScanPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.datePicker = page.locator('.datepicker');
    this.loadingBar = page.locator('.animated-line');
    this.appointmentList= page.locator('.appointments__list');
  }

  /**
   * Selects Recommended Clinic Option
   * 
   */
  async selectRecommendedClinic(name) {
    
    await this.page.locator('.location-card')
    .filter({ hasText: 'Recommended' })
    .click();

    await this.datePicker.waitFor({state: 'visible'});
    
  }

    /**
   * Selects Appointment Day
   * 
   */
  async selectAppointmentDay(name) {
    
    await this.page.locator('.vuecal__cell:not(.vuecal__cell--disabled):not(.vuecal__cell--out-of-scope)')
    .first()
    .click();
    
    await this.appointmentList.waitFor({state: 'visible'});
  }

     /**
   * Selects Time Slots
   * 
   */
async selectAppointmentTime() {
  const availableSlots = this.page
    .locator('.appointments__individual-appointment')
    .filter({ hasNot: this.page.locator('[style*="display: none"]') });

  const total = await availableSlots.count();

  for (let i = 0; i < total; i++) {
    await availableSlots.nth(i).locator('label').click();
    if (await this.continueButton.isEnabled()) break;
  }
}

  async continue() {
    await this.continueButton.click();
    await this.page.waitForURL(/\/reserve-appointment/);
  }
}

module.exports = { ScheduleScanPage };
