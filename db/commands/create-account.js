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

const Database = require("better-sqlite3");

// Connecting to or creating a new SQLite database file
const db = new Database("./db/data.db");
console.log("Connected to the SQlite database.");

const dateToday = new Date().toISOString().slice(0, 23).replace('T', ' ')

db.prepare(
    `INSERT INTO accounts (id, title, currency_id, created_at) VALUES (NULL, ?, ?, ?)`
).run([...ACCOUNT_PARAMS, dateToday]);
console.log(`Created account ${ACCOUNT_PARAMS}`)

//   Close the database connection after all insertions are done
db.close();
