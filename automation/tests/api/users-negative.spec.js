const { test, expect } = require('../../utils/fixtures');

test.describe('User Management API - Negative Scenarios', () => {

    test(
        'POST /api/users - should return 400 when email is missing',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {
                    name: 'Negative User'
                }
            });

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'GET /api/users/{id} - should return 404 when user does not exist',
        async ({ api }) => {

            const response = await api.get(
                'users/non-existing-user'
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();

            expect(responseBody.message)
                .toBe('User not found');
        }
    );

    test(
        'PUT /api/users/{id} - should return 404 when updating a non-existing user',
        async ({ api }) => {

            const response = await api.put(
                'users/non-existing-user',
                {
                    data: {
                        name: 'Updated User',
                        email: 'updated@test.com'
                    }
                }
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();

            expect(responseBody.message)
                .toBe('User not found');
        }
    );

    test(
        'DELETE /api/users/{id} - should return 404 when deleting a non-existing user',
        async ({ api }) => {

            const response = await api.delete(
                'users/non-existing-user'
            );

            expect(response.status()).toBe(404);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();

            expect(responseBody.message)
                .toBe('User not found');
        }
    );

    test(
        'POST /api/users - should return 400 when request body is empty',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {}
            });

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'POST /api/users - should return 400 when email format is invalid',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {
                    name: 'Invalid Email User',
                    email: 'invalid-email'
                }
            });

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'POST /api/users - should return 400 when user name is empty',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {
                    name: '',
                    email: 'empty@test.com'
                }
            });

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'PUT /api/users/{id} - should return 400 when update payload is empty',
        async ({ api }) => {

            const response = await api.put(
                'users/non-existing-user',
                {
                    data: {}
                }
            );

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'PUT /api/users/{id} - should return 400 when email format is invalid',
        async ({ api }) => {

            const response = await api.put(
                'users/non-existing-user',
                {
                    data: {
                        email: 'invalid-email'
                    }
                }
            );

            expect(response.status()).toBe(400);

            const responseBody = await response.json();

            expect(responseBody.success).toBeFalsy();
        }
    );

    test(
        'DELETE /api/users/{id} - should return 404 when deleting an already deleted user',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Delete Twice User',
                    email: 'delete.twice@test.com'
                }
            });

            expect(createResponse.status()).toBe(201);

            const createdUser = await createResponse.json();

            const userId = createdUser.data.id;

            const firstDelete = await api.delete(
                `users/${userId}`
            );

            expect(firstDelete.status()).toBe(200);

            const secondDelete = await api.delete(
                `users/${userId}`
            );

            expect(secondDelete.status()).toBe(404);

            const responseBody = await secondDelete.json();

            expect(responseBody.success).toBeFalsy();

            expect(responseBody.message)
                .toBe('User not found');
        }
    );

});