class SignInPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: 'Submit' });
    this.googleSignInButton = page.locator('TODO: Google sign-in button selector');
  }

  async goto() {
    await this.page.goto('/sign-in');
  }

  /**
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL('/');
  }
}

module.exports = { SignInPage };
