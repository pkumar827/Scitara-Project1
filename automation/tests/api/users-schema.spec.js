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

            await api.post('users', {
                data: {
                    name: 'List Schema User',
                    email: 'list.schema@test.com'
                }
            });

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
        'GET /api/users/{id} - should validate response schema for retrieving a user',
        async ({ api }) => {

            const createResponse = await api.post('users', {
                data: {
                    name: 'Get Schema User',
                    email: 'get.schema@test.com'
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
                    name: 'Update Schema User',
                    email: 'update.schema@test.com'
                }
            });

            const createdUser = await createResponse.json();

            const response = await api.put(
                `users/${createdUser.data.id}`,
                {
                    data: {
                        name: 'Updated Schema User',
                        email: 'updated.schema@test.com'
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
                .toBe('Updated Schema User');

            expect(responseBody.data.email)
                .toBe('updated.schema@test.com');
        }
    );

});