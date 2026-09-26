import fs from 'fs';
const { defineConfig } = require("cypress");
const env = JSON.parse(
  fs.readFileSync('cypress.env.json', 'utf8')
)

module.exports = defineConfig({
  reporter: require.resolve('mochawesome'), // Explicit path
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: false,
    html: true,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    timestamp: 'mmddyyyy_HHMMss'
  },
  expose: {
      standard_user: env.standard_user,
      visual_user: env.visual_user,
      password: env.password,
      baseUrl: env.baseUrl,
      invalidUsername: env.invalidUsername,
      invalidPassword: env.invalidPassword
    },
  e2e: {
    testIsolation: false,
    defaultCommandTimeout: 25000,
    viewportWidth: 1440,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      //require('cypress-mochawesome-reporter/plugin')(on);

      return config;
    }
  }
});