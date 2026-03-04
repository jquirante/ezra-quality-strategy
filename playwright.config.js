// @ts-check
require('dotenv').config();
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',

  // Global test timeout
  timeout: 60_000,

  // Assertion timeout
  expect: { timeout: 5_000 },

  // Run tests in a single worker to avoid booking state conflicts in staging
  fullyParallel: false,
  workers: 1,

  // No retries locally — uncomment below to enable in CI for flake tolerance
  retries: 0,
  // retries: process.env.CI ? 2 : 0,

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://staging.PLACEHOLDER.com',

    headless: true,

    // Capture on failure only — keeps CI artifacts lean
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
