const fs = require("fs").promises;
const path = require("path");

const USERS_FILE = path.join(__dirname, "../../data/users.json");

async function readUsers() {
    const data = await fs.readFile(USERS_FILE, "utf8");
    return JSON.parse(data);
}

async function saveUsers(users) {
    await fs.writeFile(
        USERS_FILE,
        JSON.stringify(users, null, 2)
    );
}

async function getAllUsers() {
    return await readUsers();
}

async function getUserById(id) {
    const users = await readUsers();

    return users.find(user => user.id === id);
}

async function createUser(user) {
    const users = await readUsers();

    users.push(user);

    await saveUsers(users);

    return user;
}

async function updateUser(id, updatedUser) {
    const users = await readUsers();

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return null;
    }

    users[index] = {
        ...users[index],
        ...updatedUser
    };

    await saveUsers(users);

    return users[index];
}

async function deleteUser(id) {
    const users = await readUsers();

    const index = users.findIndex(user => user.id === id);

    if (index === -1) {
        return false;
    }

    users.splice(index, 1);

    await saveUsers(users);

    return true;
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};