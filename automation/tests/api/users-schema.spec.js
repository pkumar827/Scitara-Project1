const { test, expect } = require('../../utils/fixtures');
const Ajv = require('ajv');

const userSchema = require('../../schemas/user.schema');

const ajv = new Ajv();

test.describe('User Management API - Schema Validation', () => {

    test(
        'POST /api/users - should validate response schema for user creation',
        async ({ api }) => {

            const response = await api.post('users', {
                data: {
                    name: 'Schema User',
                    email: 'schema@test.com'
                }
            });

            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            const validate = ajv.compile(userSchema);

            expect(validate(responseBody))
                .toBeTruthy();
        }
    );

    test(
        'GET /api/users - should validate response schema for retrieving all users',
        async ({ api }) => {

            const response = await api.get('users');

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success)
                .toBeTruthy();

            expect(Array.isArray(responseBody.data))
                .toBeTruthy();

            responseBody.data.forEach((user) => {

                expect(user.id).toBeTruthy();

                expect(typeof user.name)
                    .toBe('string');

                expect(typeof user.email)
                    .toBe('string');
            });
        }
    );

    test(
        'GET /api/users/{id} - should validate response schema for retrieving a single user',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Schema GET User',
                    email: 'schema.get@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const response = await api.get(
                `users/${createdUser.data.id}`
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success)
                .toBeTruthy();

            expect(responseBody.data.id)
                .toBeTruthy();

            expect(typeof responseBody.data.name)
                .toBe('string');

            expect(typeof responseBody.data.email)
                .toBe('string');
        }
    );

    test(
        'PUT /api/users/{id} - should validate response schema after update',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Schema PUT User',
                    email: 'schema.put@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const response = await api.put(
                `users/${createdUser.data.id}`,
                {
                    data: {
                        name: 'Schema PUT Updated',
                        email: 'schema.updated@test.com'
                    }
                }
            );

            expect(response.status()).toBe(200);

            const responseBody = await response.json();

            expect(responseBody.success)
                .toBeTruthy();

            expect(responseBody.data.id)
                .toBeTruthy();

            expect(responseBody.data.name)
                .toBe('Schema PUT Updated');

            expect(responseBody.data.email)
                .toBe('schema.updated@test.com');
        }
    );

    test(
    'Scenario 05 - Verify that the delete user response adheres to the expected response contract',
    async ({ api }) => {

        const createResponse = await api.post('users', {
            data: {
                name: 'Delete Schema User',
                email: 'delete.schema@test.com'
            }
        });

        expect(createResponse.status()).toBe(201);

        const createdUser = await createResponse.json();

        const deleteResponse = await api.delete(
            `users/${createdUser.data.id}`
        );

        expect(deleteResponse.status()).toBe(200);

        const responseBody = await deleteResponse.json();

        expect(responseBody.success)
            .toBeTruthy();

        expect(responseBody.message)
            .toBe('User deleted successfully');
    }
);

test(
    'Scenario 06 - Verify that error responses conform to the expected contract structure',
    async ({ api }) => {

        const response = await api.get(
            'users/non-existing-user'
        );

        expect(response.status()).toBe(404);

        const responseBody = await response.json();

        expect(responseBody.success)
            .toBeFalsy();

        expect(typeof responseBody.message)
            .toBe('string');
    }
);

});