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

    webServer: {
        command: 'node src/server.js',
        cwd: '../backend',
        url: 'http://localhost:3000/api/users',
        reuseExistingServer: true,
        timeout: 120000
    }

});