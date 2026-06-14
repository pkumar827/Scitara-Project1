const { test, expect } = require('@playwright/test');
const resetDatabase = require('../utils/resetDatabase');

let createdUserId;

test.describe('User Management API - End-to-End Workflow', () => {

    test.beforeAll(() => {
        resetDatabase();
    });

    test(
        'POST /api/users - should create a new user when valid user details are provided',
        async ({ request }) => {

            const response = await request.post('/api/users', {
                data: {
                    name: 'Playwright User',
                    email: 'playwright@test.com'
                }
            });

            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.message).toBe(
                'User created successfully'
            );

            expect(responseBody.data.id).toBeTruthy();

            expect(responseBody.data.name).toBe(
                'Playwright User'
            );

            expect(responseBody.data.email).toBe(
                'playwright@test.com'
            );

            createdUserId = responseBody.data.id;
        }
    );

    test(
        'GET /api/users - should return all available users',
        async ({ request }) => {

            const response = await request.get('/api/users');

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(Array.isArray(responseBody.data)).toBeTruthy();

            expect(responseBody.data.length).toBeGreaterThan(0);
        }
    );

    test(
        'GET /api/users/{id} - should return user details for a valid user ID',
        async ({ request }) => {

            const response = await request.get(
                `/api/users/${createdUserId}`
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.data.id).toBe(createdUserId);

            expect(responseBody.data.name).toBe(
                'Playwright User'
            );

            expect(responseBody.data.email).toBe(
                'playwright@test.com'
            );
        }
    );

    test(
        'PUT /api/users/{id} - should update the user details for an existing user',
        async ({ request }) => {

            const response = await request.put(
                `/api/users/${createdUserId}`,
                {
                    data: {
                        name: 'Updated Playwright User'
                    }
                }
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.data.id).toBe(createdUserId);

            expect(responseBody.data.name).toBe(
                'Updated Playwright User'
            );

            expect(responseBody.data.email).toBe(
                'playwright@test.com'
            );
        }
    );

    test(
        'DELETE /api/users/{id} - should delete an existing user successfully',
        async ({ request }) => {

            const response = await request.delete(
                `/api/users/${createdUserId}`
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.message).toBe(
                'User deleted successfully'
            );
        }
    );

});