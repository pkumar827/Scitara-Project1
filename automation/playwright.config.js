// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 30000,

    fullyParallel: false,

    workers: 1,

    reporter: [
        ['html']
    ],

    use: {
        baseURL: 'http://localhost:3000/api'
    },

    webServer: {
        command: 'npm start',
        cwd: '../backend',
        port: 3000,
        reuseExistingServer: true,
        timeout: 120000
    }

});