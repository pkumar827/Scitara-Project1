const fs = require('fs');
const path = require('path');

function resetDatabase() {

    const databasePath = path.join(
        __dirname,
        '../../backend/data/users.json'
    );

    fs.writeFileSync(
        databasePath,
        JSON.stringify([], null, 2)
    );
}

module.exports = resetDatabase;