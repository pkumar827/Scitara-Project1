const userService = require("../services/userService");
const {
    createUserSchema,
    updateUserSchema
} = require("../validations/userValidation");

const AppError = require("../utils/AppError");

async function getAllUsers(req, res, next) {
    try {
        const users = await userService.getAllUsers();

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        next(error);
    }
}

async function getUserById(req, res, next) {
    try {
        const user = await userService.getUserById(req.params.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const { error } = createUserSchema.validate(req.body);

        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        const user = await userService.createUser(req.body);

        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const { error } = updateUserSchema.validate(req.body);

        if (error) {
            throw new AppError(error.details[0].message, 400);
        }

        const user = await userService.updateUser(
            req.params.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const result = await userService.deleteUser(
            req.params.id
        );

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};