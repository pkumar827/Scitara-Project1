const { test, expect } = require('@playwright/test');

const users = require('../test-data/users.json');
const resetDatabase = require('../utils/resetDatabase');

test.describe('User Management API - Data-Driven Testing', () => {

    test.beforeEach(() => {
        resetDatabase();
    });

    users.forEach((user, index) => {

        test(
            `POST /api/users - should create user dataset #${index + 1} (${user.name}) successfully`,
            async ({ request }) => {

                const response = await request.post(
                    '/api/users',
                    {
                        data: user
                    }
                );

                expect(response.status()).toBe(201);

                const responseBody = await response.json();

                expect(responseBody.success).toBeTruthy();

                expect(responseBody.message).toBe(
                    'User created successfully'
                );

                expect(responseBody.data.id).toBeTruthy();

                expect(responseBody.data.name).toBe(
                    user.name
                );

                expect(responseBody.data.email).toBe(
                    user.email
                );
            }
        );

    });

});