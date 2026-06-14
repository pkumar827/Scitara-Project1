const { v4: uuidv4 } = require("uuid");

const userRepository = require("../repositories/userRepository");
const AppError = require("../utils/AppError");

async function getAllUsers() {
    return await userRepository.getAllUsers();
}

async function getUserById(id) {
    const user = await userRepository.getUserById(id);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return user;
}

async function createUser(userData) {
    const newUser = {
        id: uuidv4(),
        ...userData
    };

    return await userRepository.createUser(newUser);
}

async function updateUser(id, userData) {
    const updatedUser = await userRepository.updateUser(id, userData);

    if (!updatedUser) {
        throw new AppError("User not found", 404);
    }

    return updatedUser;
}

async function deleteUser(id) {
    const deleted = await userRepository.deleteUser(id);

    if (!deleted) {
        throw new AppError("User not found", 404);
    }

    return {
        message: "User deleted successfully"
    };
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};