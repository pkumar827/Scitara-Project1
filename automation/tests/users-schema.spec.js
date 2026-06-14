const { test, expect } = require('@playwright/test');
const Ajv = require('ajv');

const userSchema = require('../schemas/user.schema');
const resetDatabase = require('../utils/resetDatabase');

const ajv = new Ajv();

test.describe('User Management API - Schema Validation', () => {

    test.beforeEach(() => {
        resetDatabase();
    });

    test(
        'POST /api/users - should validate the response schema for user creation',
        async ({ request }) => {

            const response = await request.post('/api/users', {
                data: {
                    name: 'Schema Validation User',
                    email: 'schema@test.com'
                }
            });

            expect(response.status()).toBe(201);

            const responseBody = await response.json();

            const validate = ajv.compile(userSchema);

            validate(responseBody);

            expect(
                validate.errors,
                JSON.stringify(validate.errors)
            ).toBeNull();
        }
    );

});