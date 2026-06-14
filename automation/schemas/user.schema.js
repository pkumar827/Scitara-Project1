module.exports = {
    type: 'object',

    properties: {
        success: {
            type: 'boolean'
        },

        message: {
            type: 'string'
        },

        data: {
            type: 'object',

            properties: {
                id: {
                    type: 'string'
                },

                name: {
                    type: 'string'
                },

                email: {
                    type: 'string'
                }
            },

            required: [
                'id',
                'name',
                'email'
            ],

            additionalProperties: false
        }
    },

    required: [
        'success',
        'message',
        'data'
    ],

    additionalProperties: false
};