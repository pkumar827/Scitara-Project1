const { test, expect } = require('../../utils/fixtures');
const users = require('../../test-data/users.json');

test.describe('User Management API - Data-Driven Testing', () => {

    users.forEach((user, index) => {

        test(
            `POST /api/users - should create user dataset #${index + 1} (${user.name}) successfully`,
            async ({ api }) => {

                const response = await api.post('users', {
                    data: user
                });

                expect(response.status()).toBe(201);

                const responseBody = await response.json();

                expect(responseBody.success)
                    .toBeTruthy();
            }
        );

    });

});