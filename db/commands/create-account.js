const parseArgs = require('minimist')
const argv = parseArgs(process.argv, opts={
    string: ['n'],
    alias: {
        'currencyId': 'c',
        'name': 'n',
    }
})

const accountName = argv['n']
if (!accountName) {
    console.error('Account name required after "-n" or "--name" key')
    return
}

const currencyId = argv['currencyId']
if (!currencyId) {
    console.error('Currency id required after "-c" or "--currencyId" key')
    return
}

const ACCOUNT_PARAMS = [accountName, currencyId]

const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
    "./db/data.db",
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log("Connected to the SQlite database.");
    }
);

const dateToday = new Date().toISOString().slice(0, 23).replace('T', ' ')

db.run(
    `INSERT INTO accounts (id, title, currency_id, created_at) VALUES (NULL, ?, ?, ?)`,
    [...ACCOUNT_PARAMS, dateToday],
    (err) => {
        if (err) {
            return console.error(err.message);
        }
        const id = this.lastID; // get the id of the last inserted row
        console.log(`Rows inserted, ID ${id}`);
    }
)

//   Close the database connection after all insertions are done
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log("Closed the database connection.");
});
