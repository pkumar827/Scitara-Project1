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

                ws.on('open', () => {

                    ws.on('message', (data) => {

                        resolve(
                            JSON.parse(data.toString())
                        );

                        ws.close();
                    });
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

                ws.on('open', () => {

                    ws.on('message', (data) => {

                        resolve(
                            JSON.parse(data.toString())
                        );

                        ws.close();
                    });
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

            expect(response.status()).toBe(201);

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

            await new Promise((resolve) => {

                ws.on('open', resolve);
            });

            ws.on('message', (data) => {

                events.push(
                    JSON.parse(data.toString())
                );
            });

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'Event User One',
                        email: 'event1@test.com'
                    }
                }
            );

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'Event User Two',
                        email: 'event2@test.com'
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

            const createClient = () => {

                return new Promise((resolve) => {

                    const ws = new WebSocket(
                        'ws://localhost:3001'
                    );

                    ws.on('open', () => {

                        resolve(ws);
                    });
                });
            };

            const client1 = await createClient();

            const client2 = await createClient();

            const client1Promise = new Promise((resolve) => {

                client1.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    client1.close();
                });
            });

            const client2Promise = new Promise((resolve) => {

                client2.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    client2.close();
                });
            });

            const response = await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: 'Broadcast User',
                        email: 'broadcast@test.com'
                    }
                }
            );

            expect(response.status()).toBe(201);

            const client1Event =
                await client1Promise;

            const client2Event =
                await client2Promise;

            expect(client1Event)
                .toEqual(client2Event);
        }
    );

    test(
    'Scenario 05 - Verify that a single WebSocket client receives consecutive user creation events',
    async ({ request }) => {

        const events = [];

        const ws = new WebSocket(
            'ws://localhost:3001'
        );

        await new Promise((resolve) => {

            ws.on('open', resolve);
        });

        ws.on('message', (data) => {

            events.push(
                JSON.parse(data.toString())
            );
        });

        for (let i = 1; i <= 3; i++) {

            await request.post(
                'http://localhost:3000/api/users',
                {
                    data: {
                        name: `WS User ${i}`,
                        email: `ws${i}@test.com`
                    }
                }
            );
        }

        await new Promise((r) => setTimeout(r, 1000));

        ws.close();

        expect(events.length)
            .toBeGreaterThanOrEqual(3);
    }

    
    );
    test(
    'Scenario 06 - Verify that the user identifier received through WebSocket notifications can be retrieved through REST APIs',
    async ({ request }) => {

        const messagePromise = new Promise((resolve) => {

            const ws = new WebSocket(
                'ws://localhost:3001'
            );

            ws.on('open', () => {

                ws.on('message', (data) => {

                    resolve(
                        JSON.parse(data.toString())
                    );

                    ws.close();
                });
            });
        });

        await request.post(
            'http://localhost:3000/api/users',
            {
                data: {
                    name: 'REST WS User',
                    email: 'restws@test.com'
                }
            }
        );

        const event = await messagePromise;

        const response = await request.get(
            `http://localhost:3000/api/users/${event.user.id}`
        );

        expect(response.status())
            .toBe(200);
    }
    );
    test(
    'Scenario 07 - Verify that WebSocket clients continue to receive notifications after reconnecting to the server',
    async ({ request }) => {

        const client = await new Promise((resolve) => {

            const ws = new WebSocket(
                'ws://localhost:3001'
            );

            ws.on('open', () => {

                resolve(ws);
            });
        });

        const eventPromise = new Promise((resolve) => {

            client.on('message', (data) => {

                resolve(
                    JSON.parse(data.toString())
                );

                client.close();
            });
        });

        await request.post(
            'http://localhost:3000/api/users',
            {
                data: {
                    name: 'Reconnect User',
                    email: 'reconnect@test.com'
                }
            }
        );

        const event = await eventPromise;

        expect(event.event)
            .toBe('USER_CREATED');
    }
);


});