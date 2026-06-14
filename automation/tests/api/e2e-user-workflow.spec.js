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

            await api.post('users', {
                data: {
                    name: 'Count Verification User',
                    email: 'count@test.com'
                }
            });

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

            await api.put(
                `users/${createdUser.data.id}`,
                {
                    data: {
                        name: 'Persistence Updated',
                        email: 'persist.updated@test.com'
                    }
                }
            );

            const getResponse = await api.get(
                `users/${createdUser.data.id}`
            );

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

            await api.delete(
                `users/${createdUser.data.id}`
            );

            const getResponse = await api.get(
                `users/${createdUser.data.id}`
            );

            expect(getResponse.status()).toBe(404);
        }
    );

    test(
        'Creating one user should not modify existing users',
        async ({ api }) => {

            const userAResponse = await api.post('users', {
                data: {
                    name: 'User A',
                    email: 'usera@test.com'
                }
            });

            const userA = await userAResponse.json();

            await api.post('users', {
                data: {
                    name: 'User B',
                    email: 'userb@test.com'
                }
            });

            const response = await api.get(
                `users/${userA.data.id}`
            );

            const userAAfter = await response.json();

            expect(userAAfter.data.name)
                .toBe('User A');

            expect(userAAfter.data.email)
                .toBe('usera@test.com');
        }
    );

    test(
        'Multiple updates should preserve the latest state',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Multi Update User',
                    email: 'multi@test.com'
                }
            });

            const user = await createResponse.json();

            await api.put(
                `users/${user.data.id}`,
                {
                    data: {
                        name: 'Version One',
                        email: 'v1@test.com'
                    }
                }
            );

            await api.put(
                `users/${user.data.id}`,
                {
                    data: {
                        name: 'Version Two',
                        email: 'v2@test.com'
                    }
                }
            );

            const response = await api.get(
                `users/${user.data.id}`
            );

            const updatedUser = await response.json();

            expect(updatedUser.data.name)
                .toBe('Version Two');

            expect(updatedUser.data.email)
                .toBe('v2@test.com');
        }
    );

    test(
        'Deleting one user should not affect other users',
        async ({ api }) => {

            const userAResponse = await api.post('users', {
                data: {
                    name: 'Delete User A',
                    email: 'deletea@test.com'
                }
            });

            const userA = await userAResponse.json();

            const userBResponse = await api.post('users', {
                data: {
                    name: 'Delete User B',
                    email: 'deleteb@test.com'
                }
            });

            const userB = await userBResponse.json();

            await api.delete(
                `users/${userA.data.id}`
            );

            const response = await api.get(
                `users/${userB.data.id}`
            );

            expect(response.status()).toBe(200);
        }
    );

    test(
        'User ID should remain unchanged after updates',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Immutable ID User',
                    email: 'immutable@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const originalId = createdUser.data.id;

            await api.put(
                `users/${originalId}`,
                {
                    data: {
                        name: 'Immutable Updated',
                        email: 'immutable.updated@test.com'
                    }
                }
            );

            const response = await api.get(
                `users/${originalId}`
            );

            const updatedUser = await response.json();

            expect(updatedUser.data.id)
                .toBe(originalId);
        }
    );

        test(
        'Scenario 13 - Verify that a newly registered user is visible in the overall user listing',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Visibility User',
                    email: 'visibility@test.com'
                }
            });

            expect(createResponse.status()).toBe(201);

            const createdUser = await createResponse.json();

            const getAllResponse = await api.get('users');

            expect(getAllResponse.status()).toBe(200);

            const users = (await getAllResponse.json()).data;

            const foundUser = users.find(
                user => user.id === createdUser.data.id
            );

            expect(foundUser).toBeTruthy();

            expect(foundUser.name)
                .toBe('Visibility User');

            expect(foundUser.email)
                .toBe('visibility@test.com');
        }
    );

    test(
        'Scenario 14 - Verify that sequential user operations maintain data consistency across multiple users',
        async ({ api }) => {

            const userAResponse = await api.post('users', {
                data: {
                    name: 'Sequential User A',
                    email: 'sequentialA@test.com'
                }
            });

            const userA = await userAResponse.json();

            const userBResponse = await api.post('users', {
                data: {
                    name: 'Sequential User B',
                    email: 'sequentialB@test.com'
                }
            });

            const userB = await userBResponse.json();

            await api.delete(
                `users/${userA.data.id}`
            );

            const remainingUserResponse = await api.get(
                `users/${userB.data.id}`
            );

            expect(remainingUserResponse.status())
                .toBe(200);

            const remainingUser =
                await remainingUserResponse.json();

            expect(remainingUser.data.name)
                .toBe('Sequential User B');
        }
    );

    test(
        'Scenario 15 - Verify that the overall user count decreases after a user is removed from the system',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Count Deletion User',
                    email: 'count.deletion@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const beforeDeleteResponse =
                await api.get('users');

            const beforeDeleteCount =
                (await beforeDeleteResponse.json())
                    .data.length;

            await api.delete(
                `users/${createdUser.data.id}`
            );

            const afterDeleteResponse =
                await api.get('users');

            const afterDeleteCount =
                (await afterDeleteResponse.json())
                    .data.length;

            expect(afterDeleteCount)
                .toBe(beforeDeleteCount - 1);
        }
    );

});