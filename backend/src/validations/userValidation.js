const Joi = require("joi");

const createUserSchema = Joi.object({
    name: Joi.string()
        .trim()
        .required(),

    email: Joi.string()
        .email()
        .required()
});

const updateUserSchema = Joi.object({
    name: Joi.string()
        .trim(),

    email: Joi.string()
        .email()
}).min(1);

module.exports = {
    createUserSchema,
    updateUserSchema
};