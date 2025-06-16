const { defineConfig } = require("cypress");
const { getBaseUrl } = require("./services/baseUrl");

const envType = process.env.ENV || "test";

export default defineConfig({
  e2e: {
    baseUrl: getBaseUrl(envType),
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,ts}",
    supportFile: "cypress/support/e2e.js",
    fixturesFolder: "cypress/fixtures",
    reporter: "mocha-allure-reporter",
    reporterOptions: {
      reportDir: "cypress/reports/allure-results",
      screenshotDir: "cypress/reports/screenshot",
      videoDir: "cypress/reports/video",
      overwrite: true,
      charts: true,
      embeddedScreenshots: true,
      html: true,
      record: true,
      json: true,
    },
    viewportHeight: 1920,
    viewportWidth: 1080,

    setupNodeEvents(on, config) {
      // Pode configurar plugins e listeners aqui
    },
  },
});
