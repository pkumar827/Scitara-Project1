const { test, expect } = require('@playwright/test');
const WebSocket = require('ws');

test.describe('User Management WebSocket Events', () => {

    test(
        'POST /api/users should emit USER_CREATED WebSocket event',
        async ({ request }) => {

            const messagePromise = new Promise((resolve) => {

                const ws = new WebSocket(
                    'ws://localhost:3001'
                );

                ws.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    ws.close();
                });
            });

            const response = await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'WebSocket User',
                        email: 'websocket@test.com'
                    }
                }
            );

            expect(response.status()).toBe(201);

            const event = await messagePromise;

            expect(event.event)
                .toBe('USER_CREATED');

            expect(event.user.name)
                .toBe('WebSocket User');

            expect(event.user.email)
                .toBe('websocket@test.com');

            expect(event.user.id)
                .toBeTruthy();
        }
    );

    test(
        'WebSocket event payload should match REST response payload',
        async ({ request }) => {

            const messagePromise = new Promise((resolve) => {

                const ws = new WebSocket(
                    'ws://localhost:3001'
                );

                ws.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    ws.close();
                });
            });

            const response = await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'Payload Match User',
                        email: 'payload@test.com'
                    }
                }
            );

            const responseBody = await response.json();

            const event = await messagePromise;

            expect(event.user.id)
                .toBe(responseBody.data.id);

            expect(event.user.name)
                .toBe(responseBody.data.name);

            expect(event.user.email)
                .toBe(responseBody.data.email);
        }
    );

    test(
        'Multiple user creations should emit multiple USER_CREATED events',
        async ({ request }) => {

            const events = [];

            const ws = new WebSocket(
                'ws://localhost:3001'
            );

            ws.on('message', (data) => {

                events.push(
                    JSON.parse(data.toString())
                );
            });

            await new Promise((r) => setTimeout(r, 500));

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'User One',
                        email: 'user1@test.com'
                    }
                }
            );

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'User Two',
                        email: 'user2@test.com'
                    }
                }
            );

            await new Promise((r) => setTimeout(r, 1000));

            ws.close();

            expect(events.length)
                .toBeGreaterThanOrEqual(2);

            expect(events[0].event)
                .toBe('USER_CREATED');

            expect(events[1].event)
                .toBe('USER_CREATED');
        }
    );

    test(
        'All connected clients should receive identical USER_CREATED events',
        async ({ request }) => {

            const client1Promise = new Promise((resolve) => {

                const ws = new WebSocket(
                    'ws://localhost:3001'
                );

                ws.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    ws.close();
                });
            });

            const client2Promise = new Promise((resolve) => {

                const ws = new WebSocket(
                    'ws://localhost:3001'
                );

                ws.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    ws.close();
                });
            });

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'Broadcast User',
                        email: 'broadcast@test.com'
                    }
                }
            );

            const client1Event =
                await client1Promise;

            const client2Event =
                await client2Promise;

            expect(client1Event)
                .toEqual(client2Event);
        }
    );

});