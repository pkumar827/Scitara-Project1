const { test, expect } = require('@playwright/test');
const resetDatabase = require('../utils/resetDatabase');

test.describe('User Management API - Negative Scenarios', () => {

    test.beforeEach(() => {
        resetDatabase();
    });

    test(
        'POST /api/users - should return 400 when email is missing',
        async ({ request }) => {

            const response = await request.post('/api/users', {
                data: {
                    name: 'Piyush Kumar'
                }
            });

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'GET /api/users/{id} - should return 404 when user does not exist',
        async ({ request }) => {

            const response = await request.get(
                '/api/users/non-existing-user'
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();

            expect(responseBody.message).toContain(
                'User not found'
            );
        }
    );

    test(
        'PUT /api/users/{id} - should return 404 when updating a non-existing user',
        async ({ request }) => {

            const response = await request.put(
                '/api/users/non-existing-user',
                {
                    data: {
                        name: 'Updated Name'
                    }
                }
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'DELETE /api/users/{id} - should return 404 when deleting a non-existing user',
        async ({ request }) => {

            const response = await request.delete(
                '/api/users/non-existing-user'
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

});