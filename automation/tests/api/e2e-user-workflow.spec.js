const { test, expect } = require('../../utils/fixtures');
const resetDatabase = require('../../utils/resetDatabase');

let createdUserId;

test.describe('User Management API - End-to-End Workflow', () => {

    test.beforeAll(() => {
        resetDatabase();
    });

    test(
        'POST /api/users - should create a new user when valid user details are provided',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {
                    name: 'Playwright User',
                    email: 'playwright@test.com'
                }
            });

            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.message)
                .toBe('User created successfully');

            createdUserId = responseBody.data.id;

            expect(responseBody.data.name)
                .toBe('Playwright User');

            expect(responseBody.data.email)
                .toBe('playwright@test.com');
        }
    );

    test(
        'GET /api/users - should return all available users',
        async ({ api }) => {

            const response = await api.get('users');

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(Array.isArray(responseBody.data))
                .toBeTruthy();

            expect(responseBody.data.length)
                .toBeGreaterThan(0);
        }
    );

    test(
        'GET /api/users/{id} - should return user details for a valid user ID',
        async ({ api }) => {

            const response = await api.get(
                `users/${createdUserId}`
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.data.id)
                .toBe(createdUserId);

            expect(responseBody.data.name)
                .toBe('Playwright User');

            expect(responseBody.data.email)
                .toBe('playwright@test.com');
        }
    );

    test(
        'PUT /api/users/{id} - should update the user details for an existing user',
        async ({ api }) => {

            const response = await api.put(
                `users/${createdUserId}`,
                {
                    data: {
                        name: 'Updated User',
                        email: 'updated@test.com'
                    }
                }
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.message)
                .toBe('User updated successfully');

            expect(responseBody.data.name)
                .toBe('Updated User');

            expect(responseBody.data.email)
                .toBe('updated@test.com');
        }
    );

    test(
        'DELETE /api/users/{id} - should delete an existing user successfully',
        async ({ api }) => {

            const response = await api.delete(
                `users/${createdUserId}`
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success).toBeTruthy();

            expect(responseBody.message)
                .toBe('User deleted successfully');
        }
    );

    test(
        'POST /api/users - should increase total user count by one after user creation',
        async ({ api }) => {

            const initialResponse = await api.get('users');
            const initialBody = await initialResponse.json();

            const initialCount = initialBody.data.length;

            const createResponse = await api.post('users', {
                data: {
                    name: 'Count Verification User',
                    email: 'count@test.com'
                }
            });

            expect(createResponse.status()).toBe(201);

            const finalResponse = await api.get('users');
            const finalBody = await finalResponse.json();

            expect(finalBody.data.length)
                .toBe(initialCount + 1);
        }
    );

    test(
        'PUT /api/users/{id} - should persist updated user details across subsequent retrievals',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Persistence User',
                    email: 'persist@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const userId = createdUser.data.id;

            await api.put(
                `users/${userId}`,
                {
                    data: {
                        name: 'Persistence Updated',
                        email: 'persist.updated@test.com'
                    }
                }
            );

            const getResponse = await api.get(
                `users/${userId}`
            );

            expect(getResponse.status()).toBe(200);

            const userDetails = await getResponse.json();

            expect(userDetails.data.name)
                .toBe('Persistence Updated');

            expect(userDetails.data.email)
                .toBe('persist.updated@test.com');
        }
    );

    test(
        'DELETE /api/users/{id} - should prevent retrieval of a deleted user',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Delete Validation User',
                    email: 'delete.validation@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const userId = createdUser.data.id;

            const deleteResponse = await api.delete(
                `users/${userId}`
            );

            expect(deleteResponse.status()).toBe(200);

            const getResponse = await api.get(
                `users/${userId}`
            );

            expect(getResponse.status()).toBe(404);

            const errorBody = await getResponse.json();

            expect(errorBody.success)
                .toBeFalsy();

            expect(errorBody.message)
                .toBe('User not found');
        }
    );

});