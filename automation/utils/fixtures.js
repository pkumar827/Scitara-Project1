const base = require('@playwright/test');

exports.test = base.test.extend({

    api: async ({ playwright }, use) => {

        const api = await playwright.request.newContext({
            baseURL: 'http://localhost:3000/api/'
        });

        await use(api);

        await api.dispose();
    }

});

exports.expect = base.expect;