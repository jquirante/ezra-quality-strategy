class HomePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.bookAScanButton = page.getByRole('button',{'name': 'Book a scan'});
  }

  async bookAScan() {
    await this.bookAScanButton.click();
    await this.page.waitForURL(/\/select-plan/);
  }
}

module.exports = { HomePage };
